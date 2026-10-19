import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAIProvider } from "@/lib/ai/provider";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { resumeId, jobDescription, jobTitle, jobUrl } = body;

    if (!resumeId || !jobDescription) {
      return NextResponse.json(
        { success: false, error: "Resume ID and job description are required" },
        { status: 400 }
      );
    }

    if (jobDescription.length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: "Job description must be at least 50 characters",
        },
        { status: 400 }
      );
    }

    // Get resume
    const resume = await db.resume.findFirst({
      where: { id: resumeId, userId: session.user.id },
    });

    if (!resume) {
      return NextResponse.json(
        { success: false, error: "Resume not found" },
        { status: 404 }
      );
    }

    if (!resume.rawText) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume text could not be extracted. Please re-upload.",
        },
        { status: 400 }
      );
    }

    // Check usage limits for free tier
    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    });

    const rawPlan = subscription?.plan || "FREE";
    const status = subscription?.status || "ACTIVE";
    const isExpired = subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) < new Date() : false;
    const isActivePaid =
      (rawPlan === "PRO" || rawPlan === "BUSINESS") &&
      (status === "ACTIVE" || status === "TRIALING") &&
      !isExpired;

    if (!isActivePaid) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const usageCount = await db.usageLog.count({
        where: {
          userId: session.user.id,
          action: "resume_check",
          createdAt: { gte: startOfMonth },
        },
      });

      if (usageCount >= 3) {
        return NextResponse.json(
          {
            success: false,
            error:
              "You've reached your monthly limit of 3 free checks. Upgrade to Pro for unlimited checks.",
          },
          { status: 403 }
        );
      }
    }

    // Create report record (status: PROCESSING)
    const report = await db.report.create({
      data: {
        userId: session.user.id,
        resumeId,
        name: jobTitle || `Analysis - ${new Date().toLocaleDateString()}`,
        jobTitle: jobTitle || null,
        jobDescription,
        jobUrl: jobUrl || null,
        status: "PROCESSING",
      },
    });

    // Run ATS Engine analysis
    const startTime = Date.now();
    try {
      const { runATSAnalysis, formatAsFullAnalysisResult } = await import("@/lib/ats");
      const atsReport = await runATSAnalysis(resume.rawText, jobDescription, {
        analysisId: report.id,
        jobTitle,
      });

      const fullResult = formatAsFullAnalysisResult(atsReport);
      const processingTime = Date.now() - startTime;

      // Update report with results
      await db.report.update({
        where: { id: report.id },
        data: {
          overallScore: atsReport.overallScore,
          analysisResult: JSON.parse(JSON.stringify(fullResult)),
          status: "COMPLETED",
          processingTime,
        },
      });

      // Log usage after successful analysis
      await db.usageLog.create({
        data: {
          userId: session.user.id,
          action: "resume_check",
          metadata: { reportId: report.id },
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          reportId: report.id,
          status: "completed",
          overallScore: atsReport.overallScore,
        },
      });
    } catch (aiError) {
      console.error("AI analysis failed:", aiError);

      // Mark report as failed
      await db.report.update({
        where: { id: report.id },
        data: { status: "FAILED" },
      });

      const errorMessage = aiError instanceof Error ? aiError.message : "AI analysis failed. Please try again.";
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          reportId: report.id,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze resume",
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { runATSAnalysis } from "@/lib/ats";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
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
    const { resumeId, jobDescription, jobTitle } = body;

    if (!resumeId || !jobDescription) {
      return NextResponse.json(
        { success: false, error: "resumeId and jobDescription are required" },
        { status: 400 }
      );
    }

    if (jobDescription.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: "Job description must be at least 50 characters" },
        { status: 400 }
      );
    }

    const resume = await db.resume.findFirst({
      where: { id: resumeId, userId: session.user.id },
    });

    if (!resume || !resume.rawText) {
      return NextResponse.json(
        { success: false, error: "Resume not found or text could not be extracted" },
        { status: 404 }
      );
    }

    // Check usage limits for free tier
    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    });
    const rawPlan = subscription?.plan || "FREE";
    const status = subscription?.status || "ACTIVE";
    const isExpired = subscription?.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd) < new Date()
      : false;
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
            error: "You've reached your monthly limit of 3 free checks. Upgrade to Pro for unlimited checks.",
          },
          { status: 403 }
        );
      }
    }

    // Create report placeholder
    const report = await db.report.create({
      data: {
        userId: session.user.id,
        resumeId,
        name: jobTitle || `Analysis - ${new Date().toLocaleDateString()}`,
        jobTitle: jobTitle || null,
        jobDescription,
        status: "PROCESSING",
      },
    });

    // Run ATS Engine
    const atsReport = await runATSAnalysis(resume.rawText, jobDescription, {
      analysisId: report.id,
      jobTitle,
    });

    // Save report to database
    await db.report.update({
      where: { id: report.id },
      data: {
        overallScore: atsReport.overallScore,
        analysisResult: JSON.parse(JSON.stringify(atsReport)),
        status: "COMPLETED",
        processingTime: atsReport.metadata.processingTimeMs,
      },
    });

    // Log usage
    await db.usageLog.create({
      data: {
        userId: session.user.id,
        action: "resume_check",
        metadata: { reportId: report.id },
      },
    });

    return NextResponse.json({
      success: true,
      data: atsReport,
    });
  } catch (error) {
    console.error("ATS Analyze Route Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to analyze resume",
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getMultipleJobTemplatesForDesignation } from "@/data/job-templates";
import type { JobPostingInput } from "@/lib/ats";

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
    const {
      resumeId,
      jobDescription,
      jobDescriptions,
      jobTitle,
      jobUrl,
      multiJobBenchmark = false,
      benchmarkCount = 5,
    } = body;

    if (!resumeId) {
      return NextResponse.json(
        { success: false, error: "Resume ID is required" },
        { status: 400 }
      );
    }

    // Resolve list of job postings (Multi-Job vs Single Job)
    let resolvedJobs: JobPostingInput[] = [];

    // Case 1: Explicit array of job descriptions passed
    if (Array.isArray(jobDescriptions) && jobDescriptions.length > 0) {
      resolvedJobs = jobDescriptions
        .filter((j) => j && typeof j.description === "string" && j.description.trim().length >= 40)
        .map((j, idx) => ({
          id: j.id || `custom-job-${idx + 1}`,
          title: j.title || `Target Job #${idx + 1}`,
          company: j.company || `Company #${idx + 1}`,
          description: j.description.trim(),
          url: j.url,
          experienceLevel: j.experienceLevel,
        }));
    }
    // Case 2: Multi-job benchmark mode requested with a role title
    else if (multiJobBenchmark && (jobTitle || jobDescription)) {
      const queryTerm = jobTitle || jobDescription.slice(0, 40);
      const templates = getMultipleJobTemplatesForDesignation(queryTerm, benchmarkCount);
      resolvedJobs = templates.map((t, idx) => ({
        id: t.id,
        title: t.title,
        company: `Industry Standard #${idx + 1}`,
        description: t.description,
        experienceLevel: t.experienceLevel,
      }));
    }
    // Case 3: Single job description string passed
    else if (jobDescription && typeof jobDescription === "string" && jobDescription.trim().length >= 50) {
      resolvedJobs = [
        {
          id: "primary-job",
          title: jobTitle || "Target Role",
          company: "Target Employer",
          description: jobDescription.trim(),
          url: jobUrl,
        },
      ];
    }

    if (resolvedJobs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one job description (min 50 characters) or a target designation is required.",
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

    // Combined text representation for the database
    const primaryTitle = jobTitle || resolvedJobs[0].title;
    const reportName = resolvedJobs.length > 1
      ? `${primaryTitle} (Market Benchmark - ${resolvedJobs.length} Jobs)`
      : primaryTitle || `Analysis - ${new Date().toLocaleDateString()}`;

    const combinedJobDescription = resolvedJobs.length > 1
      ? resolvedJobs
          .map(
            (j, i) =>
              `## Job Posting #${i + 1}: ${j.title} (${j.company || "Industry Standard"})\n\n${j.description}`
          )
          .join("\n\n---\n\n")
      : resolvedJobs[0].description;

    // Create report record (status: PROCESSING)
    const report = await db.report.create({
      data: {
        userId: session.user.id,
        resumeId,
        name: reportName,
        jobTitle: primaryTitle || null,
        jobDescription: combinedJobDescription,
        jobUrl: jobUrl || null,
        status: "PROCESSING",
      },
    });

    // Run ATS Engine analysis (Multi-Job or Single Job)
    const startTime = Date.now();
    try {
      const { runMultiJobATSAnalysis, formatAsFullAnalysisResult } = await import("@/lib/ats");

      const { compositeReport, multiJobSummary } = await runMultiJobATSAnalysis(
        resume.rawText,
        resolvedJobs,
        {
          analysisId: report.id,
          jobTitle: primaryTitle,
        }
      );

      const fullResult = formatAsFullAnalysisResult(compositeReport);
      const processingTime = Date.now() - startTime;

      // Update report with results
      await db.report.update({
        where: { id: report.id },
        data: {
          overallScore: compositeReport.overallScore,
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
          metadata: {
            reportId: report.id,
            totalJobsAnalyzed: resolvedJobs.length,
            isMultiJob: resolvedJobs.length > 1,
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          reportId: report.id,
          status: "completed",
          overallScore: compositeReport.overallScore,
          totalJobsAnalyzed: resolvedJobs.length,
          multiJobSummary: resolvedJobs.length > 1 ? multiJobSummary : undefined,
        },
      });
    } catch (aiError) {
      console.error("ATS analysis failed:", aiError);

      // Mark report as failed
      await db.report.update({
        where: { id: report.id },
        data: { status: "FAILED" },
      });

      const errorMessage = aiError instanceof Error ? aiError.message : "ATS analysis failed. Please try again.";
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

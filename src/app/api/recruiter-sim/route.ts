import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getAIProvider } from "@/lib/ai/provider";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, jobDescription } = await req.json();

    if (!resumeId || !jobDescription) {
      return NextResponse.json(
        { success: false, error: "Resume ID and job description are required" },
        { status: 400 }
      );
    }

    const resume = await db.resume.findFirst({
      where: { id: resumeId, userId: session.user.id },
    });

    if (!resume || !resume.rawText) {
      return NextResponse.json({ success: false, error: "Resume not found" }, { status: 404 });
    }

    const aiProvider = getAIProvider();
    const simResult = await aiProvider.simulateRecruiterReview(resume.rawText, jobDescription);

    const record = await db.recruiterSimulation.create({
      data: {
        userId: session.user.id,
        resumeId: resume.id,
        impressionScore: simResult.impressionScore,
        hiringConfidence: simResult.hiringConfidence,
        interviewChance: simResult.interviewChance,
        strengths: JSON.parse(JSON.stringify(simResult.strengths)),
        weaknesses: JSON.parse(JSON.stringify(simResult.weaknesses)),
        missingInfo: JSON.parse(JSON.stringify(simResult.missingInfo)),
        overallImpression: simResult.overallImpression,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: record.id,
        ...simResult,
      },
    });
  } catch (error) {
    console.error("Recruiter sim error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to simulate recruiter review" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getAIProvider } from "@/lib/ai/provider";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { resumeId, jobDescription, targetRole, targetCompany, jobId } = body;

    if (!resumeId || !jobDescription) {
      return NextResponse.json(
        { success: false, error: "Resume ID and job description are required" },
        { status: 400 }
      );
    }

    // Get original resume
    const resume = await db.resume.findFirst({
      where: { id: resumeId, userId: session.user.id },
    });

    if (!resume || !resume.rawText) {
      return NextResponse.json(
        { success: false, error: "Resume text content not found" },
        { status: 404 }
      );
    }

    // Call AI provider with strict zero-hallucination prompt
    const aiProvider = getAIProvider();
    const tailoredData = await aiProvider.tailorResume(
      resume.rawText,
      jobDescription,
      targetRole,
      targetCompany
    );

    // Save tailored resume version to database
    const versionName = targetCompany
      ? `${targetCompany} - ${targetRole || "Tailored"}`
      : `${targetRole || "Tailored"} Resume`;

    const tailoredRecord = await db.tailoredResume.create({
      data: {
        userId: session.user.id,
        resumeId: resume.id,
        jobId: jobId || null,
        versionName,
        targetRole: targetRole || "Tailored Role",
        targetCompany: targetCompany || null,
        content: JSON.parse(JSON.stringify(tailoredData)),
        diffHighlights: JSON.parse(JSON.stringify(tailoredData.diffHighlights)),
        atsScore: 88, // Estimated score
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        tailoredId: tailoredRecord.id,
        versionName: tailoredRecord.versionName,
        content: tailoredData,
      },
    });
  } catch (error) {
    console.error("Tailor resume error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate tailored resume" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const tailoredResumes = await db.tailoredResume.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        resume: { select: { fileName: true } },
      },
    });

    return NextResponse.json({ success: true, data: tailoredResumes });
  } catch (error) {
    console.error("Fetch tailored resumes error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tailored resumes" },
      { status: 500 }
    );
  }
}

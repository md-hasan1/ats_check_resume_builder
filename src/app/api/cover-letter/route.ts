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

    const { resumeId, jobDescription, targetCompany, targetRole, tone, length } = await req.json();

    if (!resumeId || !jobDescription || !targetCompany || !targetRole) {
      return NextResponse.json(
        { success: false, error: "Resume ID, job description, target company, and target role are required" },
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
    const coverLetterText = await aiProvider.generateCoverLetter(
      resume.rawText,
      jobDescription,
      targetCompany,
      targetRole,
      tone,
      length
    );

    const record = await db.coverLetter.create({
      data: {
        userId: session.user.id,
        resumeId: resume.id,
        targetCompany,
        targetRole,
        tone: tone || "professional",
        length: length || "standard",
        content: coverLetterText,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: record.id,
        content: coverLetterText,
      },
    });
  } catch (error) {
    console.error("Cover letter error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}

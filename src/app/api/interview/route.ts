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

    const { targetRole, company, jobDescription, resumeText } = await req.json();

    if (!targetRole) {
      return NextResponse.json({ success: false, error: "Target role is required" }, { status: 400 });
    }

    const aiProvider = getAIProvider();
    const result = await aiProvider.generateInterviewQuestions(
      targetRole,
      company,
      jobDescription,
      resumeText
    );

    const record = await db.interviewPrep.create({
      data: {
        userId: session.user.id,
        targetRole,
        company: company || null,
        questions: JSON.parse(JSON.stringify(result)),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: record.id,
        ...result,
      },
    });
  } catch (error) {
    console.error("Interview generator error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate interview questions" },
      { status: 500 }
    );
  }
}

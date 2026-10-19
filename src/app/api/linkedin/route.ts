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

    const { profileContent, profileUrl } = await req.json();

    if (!profileContent || profileContent.length < 30) {
      return NextResponse.json(
        { success: false, error: "Please paste your LinkedIn headline, about section, or full profile text." },
        { status: 400 }
      );
    }

    const aiProvider = getAIProvider();
    const result = await aiProvider.analyzeLinkedIn(profileContent);

    const record = await db.linkedInAnalysis.create({
      data: {
        userId: session.user.id,
        profileUrl: profileUrl || null,
        profileContent,
        recruiterScore: result.recruiterScore,
        currentHeadline: result.currentHeadline || null,
        suggestedHeadline: result.suggestedHeadline,
        currentAbout: result.currentAbout || null,
        suggestedAbout: result.suggestedAbout,
        missingKeywords: JSON.parse(JSON.stringify(result.missingKeywords)),
        networkingTips: JSON.parse(JSON.stringify(result.networkingTips)),
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
    console.error("LinkedIn analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze LinkedIn profile" },
      { status: 500 }
    );
  }
}

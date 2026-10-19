import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const jobs = await db.jobDescription.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    console.error("Fetch jobs error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, company, sourceUrl, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    const job = await db.jobDescription.create({
      data: {
        userId: session.user.id,
        title,
        company: company || null,
        sourceUrl: sourceUrl || null,
        content,
      },
    });

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ success: false, error: "Failed to save job description" }, { status: 500 });
  }
}

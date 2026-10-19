import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
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

    const reports = await db.report.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        resume: {
          select: {
            fileName: true,
            fileType: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    const history = reports.map((r) => ({
      id: r.id,
      name: r.name,
      jobTitle: r.jobTitle || "General Role",
      overallScore: r.overallScore,
      status: r.status,
      createdAt: r.createdAt,
      processingTime: r.processingTime,
      fileName: r.resume?.fileName || "resume.pdf",
    }));

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("GET ATS History Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ATS history" },
      { status: 500 }
    );
  }
}

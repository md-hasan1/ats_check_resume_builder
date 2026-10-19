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

    const userId = session.user.id;

    // Fetch reports ordered by createdAt descending
    const reports = await db.report.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      include: {
        resume: {
          select: { fileName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalChecks = reports.length;

    let averageScore = 0;
    let bestScore = 0;
    let scoreTrend = "0%";

    if (totalChecks > 0) {
      const scores = reports.map((r) => r.overallScore || 0);
      const sum = scores.reduce((a, b) => a + b, 0);
      averageScore = Math.round(sum / totalChecks);
      bestScore = Math.round(Math.max(...scores));

      if (totalChecks >= 2) {
        const latest = Math.round(scores[0]);
        const previous = Math.round(scores[1]);
        const diff = latest - previous;
        scoreTrend = diff > 0 ? `+${diff}%` : `${diff}%`;
      } else {
        scoreTrend = "+0%";
      }
    }

    // Recent 5 reports for dashboard list
    const recentReports = reports.slice(0, 5).map((r) => ({
      id: r.id,
      name: r.name || r.jobTitle || "ATS Resume Check",
      fileName: r.resume?.fileName || "resume.pdf",
      score: Math.round(r.overallScore || 0),
      date: r.createdAt.toISOString(),
      status: r.status.toLowerCase(),
    }));

    // Score history for trend chart (chronological order, max 10 points)
    const scoreHistory = reports
      .slice(0, 10)
      .reverse()
      .map((r) => ({
        id: r.id,
        name: r.name || "Check",
        score: Math.round(r.overallScore || 0),
        date: new Date(r.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalChecks,
          averageScore,
          bestScore,
          scoreTrend,
        },
        recentReports,
        scoreHistory,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

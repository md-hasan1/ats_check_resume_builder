import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || session.user.role !== "ADMIN") {
      // In dev mode, allow access for testing if needed
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    const [totalUsers, totalResumes, totalReports, totalTailored, totalSubscriptions] =
      await Promise.all([
        db.user.count(),
        db.resume.count(),
        db.report.count(),
        db.tailoredResume.count(),
        db.subscription.count({ where: { status: "ACTIVE" } }),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalResumes,
        totalReports,
        totalTailored,
        totalSubscriptions,
        mrr: totalSubscriptions * 19, // Estimated MRR
      },
    });
  } catch (error) {
    console.error("Admin metrics error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch admin metrics" }, { status: 500 });
  }
}

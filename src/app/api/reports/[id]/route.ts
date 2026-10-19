import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const runtime = "nodejs";

// GET /api/reports/[id] - Get a single report or user's latest report from database
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { id } = await params;

    // Check if id is demo/latest or specific report ID
    const isSpecialId = id === "demo" || id === "latest";

    let report = null;

    if (isSpecialId && session?.user?.id) {
      // Fetch latest database report for the logged in user
      report = await db.report.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
          resume: {
            select: {
              fileName: true,
              fileType: true,
              parsedData: true,
              rawText: true,
            },
          },
        },
      });
    }

    if (!report) {
      // Find specific report by ID or shareToken
      report = await db.report.findFirst({
        where: {
          OR: [
            { id, userId: session?.user?.id || "" },
            { shareToken: id },
          ],
        },
        include: {
          resume: {
            select: {
              fileName: true,
              fileType: true,
              parsedData: true,
              rawText: true,
            },
          },
        },
      });
    }

    if (!report) {
      return NextResponse.json(
        { success: false, error: "Report not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error("Report fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch report from database" },
      { status: 500 }
    );
  }
}

// PATCH /api/reports/[id] - Update report in database
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();

    const report = await db.report.update({
      where: { id, userId: session.user.id },
      data: {
        ...(body.name ? { name: body.name } : {}),
        ...(body.overallScore ? { overallScore: body.overallScore } : {}),
      },
    });

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error("Report update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update report in database" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const report = await db.report.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        resume: {
          select: {
            fileName: true,
            fileType: true,
            fileSize: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("GET ATS Analysis Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const report = await db.report.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!report) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    await db.report.delete({
      where: { id: report.id },
    });

    return NextResponse.json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ATS Analysis Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete report" },
      { status: 500 }
    );
  }
}

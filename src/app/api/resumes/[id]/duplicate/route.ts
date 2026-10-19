import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const existing = await db.resume.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Resume not found" }, { status: 404 });
    }

    const cloned = await db.resume.create({
      data: {
        userId: session.user.id,
        fileName: `${existing.fileName} (Copy)`,
        fileUrl: existing.fileUrl,
        fileType: existing.fileType,
        fileSize: existing.fileSize,
        rawText: existing.rawText,
        parsedData: existing.parsedData as any,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: cloned.id,
        title: cloned.fileName,
      },
    });
  } catch (error) {
    console.error("POST /api/resumes/[id]/duplicate error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to duplicate resume" },
      { status: 500 }
    );
  }
}

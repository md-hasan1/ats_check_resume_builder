import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DEFAULT_RESUME_DATA, DEFAULT_CUSTOMIZATION } from "@/lib/builder/default-data";

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
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const resume = await db.resume.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!resume) {
      return NextResponse.json({ success: false, error: "Resume not found" }, { status: 404 });
    }

    const parsed = (resume.parsedData as any) || {};

    return NextResponse.json({
      success: true,
      data: {
        id: resume.id,
        title: resume.fileName,
        templateId: parsed.templateId || "ats-optimized_1",
        customization: parsed.customization || DEFAULT_CUSTOMIZATION,
        data: parsed.data || DEFAULT_RESUME_DATA,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET /api/resumes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const body = await request.json().catch(() => ({}));
    const { title, templateId, customization, data } = body;

    const existing = await db.resume.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Resume not found" }, { status: 404 });
    }

    // Compile plain text for ATS checking defensively
    let rawText = existing.rawText;
    if (data) {
      const expText = Array.isArray(data.experience)
        ? data.experience
            .filter(Boolean)
            .map((e: any) => `${e.jobTitle || ""} at ${e.company || ""} (${e.startDate || ""} - ${e.endDate || ""}): ${e.description || ""}`.trim())
            .filter(Boolean)
            .join("\n")
        : "";

      const eduText = Array.isArray(data.education)
        ? data.education
            .filter(Boolean)
            .map((e: any) => `${e.degree || ""} from ${e.institution || ""}`.trim())
            .filter(Boolean)
            .join("\n")
        : "";

      const sklText = Array.isArray(data.skills)
        ? data.skills
            .filter(Boolean)
            .map((s: any) => (typeof s === "string" ? s : s?.name || "").trim())
            .filter(Boolean)
            .join(", ")
        : "";

      rawText = [
        data.personal?.fullName || "",
        data.personal?.jobTitle || "",
        [data.personal?.email, data.personal?.phone, data.personal?.location].filter(Boolean).join(" | "),
        data.summary ? `Summary:\n${data.summary}` : "",
        expText ? `Experience:\n${expText}` : "",
        eduText ? `Education:\n${eduText}` : "",
        sklText ? `Skills:\n${sklText}` : "",
      ].filter(Boolean).join("\n\n").trim();
    }

    const updated = await db.resume.update({
      where: { id: existing.id },
      data: {
        fileName: title || existing.fileName,
        rawText,
        fileSize: data ? JSON.stringify(data).length : existing.fileSize,
        parsedData: {
          templateId: templateId || (existing.parsedData as any)?.templateId || "ats-optimized_1",
          customization: customization || (existing.parsedData as any)?.customization || DEFAULT_CUSTOMIZATION,
          data: data || (existing.parsedData as any)?.data || DEFAULT_RESUME_DATA,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        title: updated.fileName,
        templateId: (updated.parsedData as any)?.templateId,
        customization: (updated.parsedData as any)?.customization,
        data: (updated.parsedData as any)?.data,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    console.error("PUT /api/resumes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update resume" },
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

    await db.resume.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/resumes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}

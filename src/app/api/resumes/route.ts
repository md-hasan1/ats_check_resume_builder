import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DEFAULT_RESUME_DATA, DEFAULT_CUSTOMIZATION } from "@/lib/builder/default-data";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const resumes = await db.resume.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const builderResumes = resumes.map((r) => {
      const parsed = (r.parsedData as any) || {};
      return {
        id: r.id,
        title: r.fileName,
        templateId: parsed.templateId || "ats-optimized_1",
        customization: parsed.customization || DEFAULT_CUSTOMIZATION,
        data: parsed.data || DEFAULT_RESUME_DATA,
        fileType: r.fileType,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: builderResumes,
    });
  } catch (error) {
    console.error("GET /api/resumes error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const templateId = body.templateId || "ats-optimized_1";
    const title = body.title || `${session.user.name || "Professional"} Resume`;
    const data = body.data || {
      ...DEFAULT_RESUME_DATA,
      personal: {
        ...DEFAULT_RESUME_DATA.personal,
        fullName: session.user.name || DEFAULT_RESUME_DATA.personal.fullName,
        email: session.user.email || DEFAULT_RESUME_DATA.personal.email,
      },
    };
    const customization = body.customization || DEFAULT_CUSTOMIZATION;

    // Plain text representation for ATS compatibility with defensive array handling
    const expText = Array.isArray(data?.experience)
      ? data.experience
          .filter(Boolean)
          .map((e: any) => `${e.jobTitle || ""} at ${e.company || ""} (${e.startDate || ""} - ${e.endDate || ""}): ${e.description || ""}`.trim())
          .filter(Boolean)
          .join("\n")
      : "";

    const eduText = Array.isArray(data?.education)
      ? data.education
          .filter(Boolean)
          .map((e: any) => `${e.degree || ""} from ${e.institution || ""}`.trim())
          .filter(Boolean)
          .join("\n")
      : "";

    const sklText = Array.isArray(data?.skills)
      ? data.skills
          .filter(Boolean)
          .map((s: any) => (typeof s === "string" ? s : s?.name || "").trim())
          .filter(Boolean)
          .join(", ")
      : "";

    const rawText = [
      data?.personal?.fullName || "",
      data?.personal?.jobTitle || "",
      [data?.personal?.email, data?.personal?.phone, data?.personal?.location].filter(Boolean).join(" | "),
      data?.summary ? `Summary:\n${data.summary}` : "",
      expText ? `Experience:\n${expText}` : "",
      eduText ? `Education:\n${eduText}` : "",
      sklText ? `Skills:\n${sklText}` : "",
    ].filter(Boolean).join("\n\n").trim();

    const resume = await db.resume.create({
      data: {
        userId: session.user.id,
        fileName: title,
        fileUrl: `/resume-builder/${templateId}`,
        fileType: "builder",
        fileSize: JSON.stringify(data).length,
        rawText,
        parsedData: {
          templateId,
          customization,
          data,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: resume.id,
        title: resume.fileName,
        templateId,
        customization,
        data,
      },
    });
  } catch (error) {
    console.error("POST /api/resumes error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create resume" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { generateDocxBuffer } from "@/lib/export/docx-exporter";
import { generateMarkdownResume, generatePlainTextResume } from "@/lib/export/text-exporter";
import type { TailoredResumeData } from "@/lib/ai/schemas/tailored-resume";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MIME_DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function sanitizeBaseFilename(rawName?: string): string {
  const clean = (rawName || "Resume")
    .trim()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s+/g, "_");
  return clean || "Resume";
}

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
    }

    const { data, format } = body || {};

    if (!data || !format) {
      return NextResponse.json(
        { success: false, error: "Both 'data' and 'format' fields are required" },
        { status: 400 }
      );
    }

    const tailoredData = data as TailoredResumeData;
    const baseName = sanitizeBaseFilename(tailoredData.contactInfo?.fullName);
    const fileName = `${baseName}_Resume`;

    switch (format.toLowerCase()) {
      case "docx": {
        const buffer = await generateDocxBuffer(tailoredData);
        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            "Content-Type": MIME_DOCX,
            "Content-Disposition": `attachment; filename="${fileName}.docx"; filename*=UTF-8''${encodeURIComponent(fileName)}.docx`,
            "Content-Length": String(buffer.length),
            "Cache-Control": "private, no-cache, no-store, must-revalidate",
            "X-Content-Type-Options": "nosniff",
          },
        });
      }

      case "md": {
        const mdText = generateMarkdownResume(tailoredData);
        return new NextResponse(mdText, {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Content-Disposition": `attachment; filename="${fileName}.md"; filename*=UTF-8''${encodeURIComponent(fileName)}.md`,
            "Cache-Control": "private, no-cache, no-store, must-revalidate",
          },
        });
      }

      case "txt": {
        const plainText = generatePlainTextResume(tailoredData);
        return new NextResponse(plainText, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Content-Disposition": `attachment; filename="${fileName}.txt"; filename*=UTF-8''${encodeURIComponent(fileName)}.txt`,
            "Cache-Control": "private, no-cache, no-store, must-revalidate",
          },
        });
      }

      case "json": {
        return new NextResponse(JSON.stringify(tailoredData, null, 2), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Content-Disposition": `attachment; filename="${fileName}.json"; filename*=UTF-8''${encodeURIComponent(fileName)}.json`,
            "Cache-Control": "private, no-cache, no-store, must-revalidate",
          },
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unsupported export format: '${format}'. Supported: 'docx', 'md', 'txt', 'json'`,
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("[Export API Error]:", error?.message || error);
    return NextResponse.json(
      { success: false, error: "Failed to generate document export" },
      { status: 500 }
    );
  }
}

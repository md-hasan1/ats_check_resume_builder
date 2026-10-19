import { NextRequest, NextResponse } from "next/server";
import { generateResumeBuilderDocxBuffer } from "@/lib/export/docx-exporter";
import type { ResumeData } from "@/types/resume-builder";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MIME_DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MAX_FILENAME_LENGTH = 100;
const WINDOWS_RESERVED_NAMES = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;

/**
 * Sanitizes and formats a safe filename for cross-platform file systems (Windows, macOS, Linux).
 * Strictly complies with RFC 5987 / RFC 6266 for content disposition.
 */
function sanitizeFilename(rawCandidateName: string, requestedFilename?: string): string {
  let baseName = (requestedFilename || "").trim();

  if (!baseName) {
    const cleanName = rawCandidateName
      .trim()
      .replace(/[^\p{L}\p{N}\s_-]/gu, "")
      .replace(/\s+/g, "_");
    baseName = `${cleanName || "Resume"}_Resume.docx`;
  }

  // Strip path traversal and illegal filesystem characters: \ / : * ? " < > |
  let sanitized = baseName.replace(/[/\\?%*:|"<>]/g, "_").trim();

  // Prevent Windows reserved device names
  if (WINDOWS_RESERVED_NAMES.test(sanitized)) {
    sanitized = `Resume_${sanitized}`;
  }

  // Ensure .docx extension
  if (!sanitized.toLowerCase().endsWith(".docx")) {
    sanitized = `${sanitized}.docx`;
  }

  // Truncate to maximum allowed length while preserving extension
  if (sanitized.length > MAX_FILENAME_LENGTH) {
    const ext = ".docx";
    sanitized = `${sanitized.slice(0, MAX_FILENAME_LENGTH - ext.length)}${ext}`;
  }

  return sanitized;
}

/**
 * Validates whether the incoming payload minimally resembles a valid ResumeData object.
 */
function isValidResumePayload(data: unknown): data is ResumeData {
  if (!data || typeof data !== "object") return false;
  const candidate = data as Partial<ResumeData>;
  // Must have at least a personal object or array sections
  return (
    typeof candidate.personal === "object" ||
    Array.isArray(candidate.experience) ||
    Array.isArray(candidate.skills) ||
    Array.isArray(candidate.education)
  );
}

/**
 * POST /api/export/docx
 * Production-ready streaming endpoint for Microsoft Word (.docx) export.
 * Engineered with defensive input validation, RFC-compliant headers, and high-performance streaming.
 */
export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request payload" },
        { status: 400 }
      );
    }

    const { data, filename } = body || {};

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Missing resume data payload" },
        { status: 400 }
      );
    }

    if (!isValidResumePayload(data)) {
      return NextResponse.json(
        { success: false, error: "Malformed resume data payload structure" },
        { status: 422 }
      );
    }

    const candidateName = data.personal?.fullName?.trim() || "Candidate";
    const finalFilename = sanitizeFilename(candidateName, filename);
    const asciiFallback = finalFilename.replace(/[^\x20-\x7E]/g, "_");
    const rfc5987Encoded = encodeURIComponent(finalFilename);

    // Generate Word (.docx) document binary buffer
    const buffer = await generateResumeBuilderDocxBuffer(data);

    if (!buffer || buffer.length === 0) {
      throw new Error("Generated DOCX buffer was empty");
    }

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": MIME_DOCX,
        "Content-Disposition": `attachment; filename="${asciiFallback}"; filename*=UTF-8''${rfc5987Encoded}`,
        "Content-Length": String(buffer.length),
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error: any) {
    console.error("[Export DOCX Error]:", {
      message: error?.message || "Unknown error",
      stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate Word document export. Please check the resume data and try again.",
      },
      { status: 500 }
    );
  }
}

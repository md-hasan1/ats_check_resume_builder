import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { storage } from "@/lib/storage";
import { extractResumeText } from "@/lib/parsers/resume-extractor";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ["pdf", "docx", "doc"];

function getFileType(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

export async function POST(request: Request) {
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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const ext = getFileType(file.name);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { success: false, error: "Only PDF, DOCX, and DOC files are accepted" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, error: "Uploaded file is empty" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to local / cloud storage
    const { url } = await storage.upload(buffer, file.name, file.type);

    // Extract text
    let rawText = "";
    try {
      rawText = await extractResumeText(buffer, ext);
    } catch (parseErr) {
      console.error("Resume parsing error:", parseErr);
    }

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not extract sufficient text from the resume. Please ensure it is not a scanned image.",
        },
        { status: 400 }
      );
    }

    const resume = await db.resume.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileUrl: url,
        fileType: ext,
        fileSize: file.size,
        rawText,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: resume.id,
        fileName: resume.fileName,
        fileType: resume.fileType,
        fileSize: resume.fileSize,
        textLength: rawText.length,
      },
    });
  } catch (error) {
    console.error("ATS Resume Upload Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload resume",
      },
      { status: 500 }
    );
  }
}

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

function validateResumeFile(
  fileName: string,
  fileSize: number
): { valid: boolean; error?: string } {
  const ext = getFileType(fileName);
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: "Only PDF, DOCX, and DOC files are accepted",
    };
  }
  if (fileSize > MAX_FILE_SIZE) {
    return { valid: false, error: "File size must be less than 10MB" };
  }
  return { valid: true };
}

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateResumeFile(file.name, file.size);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Read file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileType = getFileType(file.name);

    // Upload to storage
    const { url } = await storage.upload(buffer, file.name, file.type);

    // Parse resume text
    let rawText = "";
    try {
      rawText = await extractResumeText(buffer, fileType);
    } catch (error) {
      console.error("Text extraction failed:", error);
    }

    if (!rawText || rawText.length < 50) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not extract text from the file. Please try a different format.",
        },
        { status: 400 }
      );
    }

    // Save to database
    const resume = await db.resume.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileUrl: url,
        fileType,
        fileSize: file.size,
        rawText,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        resumeId: resume.id,
        fileName: resume.fileName,
        fileUrl: resume.fileUrl,
        fileType: resume.fileType,
        fileSize: resume.fileSize,
        textLength: rawText.length,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload resume",
      },
      { status: 500 }
    );
  }
}

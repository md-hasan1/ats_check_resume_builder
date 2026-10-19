import officeparser from "officeparser";

/**
 * Extract text content from a resume file buffer.
 * Supports PDF, DOCX, and DOC formats.
 */
export async function parseResumeFile(
  buffer: Buffer,
  fileType: string
): Promise<string> {
  try {
    const text = (await officeparser.parseOffice(buffer)) as unknown as string;

    if (!text || text.trim().length === 0) {
      throw new Error("No text content found in the document");
    }

    // Clean up extracted text
    return cleanResumeText(text);
  } catch (error) {
    console.error("Resume parsing error:", error);
    throw new Error(
      `Failed to parse ${fileType.toUpperCase()} file. Please ensure the file is not corrupted or password-protected.`
    );
  }
}

/**
 * Clean up extracted text from resume files.
 * Removes excessive whitespace, normalizes line breaks, etc.
 */
function cleanResumeText(text: string): string {
  return text
    // Normalize line breaks
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Remove excessive blank lines (more than 2)
    .replace(/\n{3,}/g, "\n\n")
    // Remove leading/trailing whitespace on each line
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    // Remove excessive spaces
    .replace(/ {2,}/g, " ")
    // Trim overall
    .trim();
}

/**
 * Validate that a file is a supported resume format.
 */
export function validateResumeFile(
  fileName: string,
  fileSize: number,
  maxSize: number = 10 * 1024 * 1024
): { valid: boolean; error?: string } {
  const ext = fileName.split(".").pop()?.toLowerCase();

  if (!ext || !["pdf", "docx", "doc"].includes(ext)) {
    return {
      valid: false,
      error: "Unsupported file format. Please upload PDF, DOCX, or DOC.",
    };
  }

  if (fileSize > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`,
    };
  }

  if (fileSize === 0) {
    return { valid: false, error: "File is empty." };
  }

  return { valid: true };
}

/**
 * Get the file type from filename.
 */
export function getFileType(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() || "unknown";
}

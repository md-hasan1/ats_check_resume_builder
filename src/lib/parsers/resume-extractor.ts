import { parsePDF } from "./pdf-parser";
import { parseDOCX } from "./docx-parser";

/**
 * Unified resume text extraction from file buffer.
 * Determines parser based on file type and returns raw text.
 */
export async function extractResumeText(
  buffer: Buffer,
  fileType: string
): Promise<string> {
  const normalizedType = fileType.toLowerCase();

  if (
    normalizedType === "application/pdf" ||
    normalizedType === "pdf" ||
    normalizedType.endsWith(".pdf")
  ) {
    return parsePDF(buffer);
  }

  if (
    normalizedType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    normalizedType === "application/msword" ||
    normalizedType === "docx" ||
    normalizedType === "doc" ||
    normalizedType.endsWith(".docx") ||
    normalizedType.endsWith(".doc")
  ) {
    return parseDOCX(buffer);
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}

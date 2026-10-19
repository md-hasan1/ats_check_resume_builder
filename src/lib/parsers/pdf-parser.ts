/**
 * PDF text extraction using unpdf.
 * Falls back to basic text extraction if unpdf is not available.
 */
export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const { extractText } = await import("unpdf");
    const result = await extractText(new Uint8Array(buffer));
    const pages = result.text;
    if (Array.isArray(pages)) {
      return pages.join("\n");
    }
    return String(pages || "");
  } catch {
    // Fallback: attempt to read raw text from PDF buffer
    const text = buffer
      .toString("utf-8")
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text;
  }
}

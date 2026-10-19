import officeparser from "officeparser";

/**
 * DOCX/DOC text extraction using officeparser.
 */
export async function parseDOCX(buffer: Buffer): Promise<string> {
  try {
    const text = await officeparser.parseOffice(buffer);
    return typeof text === "string" ? text : "";
  } catch (error) {
    throw new Error(
      `Failed to parse DOCX: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

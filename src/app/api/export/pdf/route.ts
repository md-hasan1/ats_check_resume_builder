import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Streams a generated PDF document with explicit HTTP Content-Disposition headers.
 * This guarantees the file downloads with the exact candidate filename and .pdf extension
 * on all browsers (Chrome, Edge, Firefox, Safari) and Windows file systems,
 * bypassing Chrome's client-side blob UUID renaming behavior.
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let base64Data = "";
    let filename = "Resume.pdf";

    if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      const formData = await req.formData();
      base64Data = (formData.get("pdfBase64") as string) || "";
      filename = (formData.get("filename") as string) || "Resume.pdf";
    } else {
      const json = await req.json();
      base64Data = json.pdfBase64 || json.data || "";
      filename = json.filename || "Resume.pdf";
    }

    if (!base64Data) {
      return NextResponse.json({ error: "No PDF data provided" }, { status: 400 });
    }

    // Strip any data URI prefix if present (handles data:application/pdf...;base64,)
    const cleanBase64 = base64Data
      .replace(/^data:[^,]+,/, "")
      .replace(/\s/g, "");

    const pdfBuffer = Buffer.from(cleanBase64, "base64");

    const safeFilename = filename.trim().replace(/[/\\?%*:|"<>]/g, "_") || "Resume";
    const finalFilename = safeFilename.toLowerCase().endsWith(".pdf")
      ? safeFilename
      : `${safeFilename}.pdf`;

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${finalFilename}"; filename*=UTF-8''${encodeURIComponent(
          finalFilename
        )}`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("PDF download streaming error:", error);
    return NextResponse.json(
      { error: "Failed to download PDF document" },
      { status: 500 }
    );
  }
}

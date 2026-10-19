import type { ResumeData } from "@/types/resume-builder";

interface ExportDocxOptions {
  data: ResumeData;
  filename?: string;
}

/**
 * Exports and downloads the resume as an authentic Microsoft Word (.docx) file.
 * Uses ticket-based top-level browser download to guarantee authentic .docx extension
 * and proper file association in Windows.
 */
export async function exportResumeToDocx({
  data,
  filename = "Resume.docx",
}: ExportDocxOptions): Promise<void> {
  const cleanFilename = filename.trim().replace(/[/\\?%*:|"<>]/g, "_") || "Resume";
  const finalFilename = cleanFilename.toLowerCase().endsWith(".docx")
    ? cleanFilename
    : `${cleanFilename}.docx`;

  // 1. Generate DOCX from server
  const res = await fetch("/api/export/docx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, filename: finalFilename }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate Word document export");
  }

  const blob = await res.blob();
  const buffer = await blob.arrayBuffer();

  // Convert array buffer to base64
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  // 2. Obtain download ticket for top-level native browser download
  let downloaded = false;
  try {
    const ticketRes = await fetch("/api/export/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: base64,
        filename: finalFilename,
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
    });

    if (ticketRes.ok) {
      const ticketJson = await ticketRes.json();
      if (ticketJson.downloadUrl) {
        window.location.assign(ticketJson.downloadUrl);
        downloaded = true;
      }
    }
  } catch (err) {
    console.warn("Ticket DOCX download failed, falling back to direct blob:", err);
  }

  // 3. Fallback: direct blob download
  if (!downloaded) {
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = finalFilename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
    }, 120000);
  }
}

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory cache for temporary download tickets (TTL: 5 minutes)
// Key: ticket ID, Value: { buffer, filename, mimeType, expiresAt }
interface TicketItem {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  expiresAt: number;
}

const downloadTickets = new Map<string, TicketItem>();

function cleanupExpired() {
  const now = Date.now();
  for (const [ticket, data] of downloadTickets.entries()) {
    if (data.expiresAt < now) {
      downloadTickets.delete(ticket);
    }
  }
}

/**
 * POST /api/export/download
 * Receives file data (base64), filename, and mimeType.
 * Returns a short-lived download URL that can be navigated top-level in the browser.
 */
export async function POST(req: NextRequest) {
  try {
    cleanupExpired();
    const { data, filename = "Resume.pdf", mimeType = "application/pdf" } = await req.json();

    if (!data) {
      return NextResponse.json({ error: "Missing data payload" }, { status: 400 });
    }

    // Strip any data URI prefix if present
    const cleanBase64 = data.replace(/^data:[^,]+,/, "").replace(/\s/g, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    const safeFilename = filename.trim().replace(/[/\\?%*:|"<>]/g, "_") || "Resume";
    const ticket = crypto.randomUUID();

    downloadTickets.set(ticket, {
      buffer,
      filename: safeFilename,
      mimeType,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    return NextResponse.json({
      success: true,
      ticket,
      downloadUrl: `/api/export/download?ticket=${ticket}&filename=${encodeURIComponent(safeFilename)}`,
      filename: safeFilename,
    });
  } catch (err) {
    console.error("Failed to generate download ticket:", err);
    return NextResponse.json({ error: "Failed to generate download ticket" }, { status: 500 });
  }
}

/**
 * GET /api/export/download?ticket=...
 * Streams the file directly as an attachment for top-level browser download.
 * Because the browser navigates to this URL directly, Chrome/Edge ALWAYS preserves
 * the exact filename and file extension without falling back to UUIDs.
 */
export async function GET(req: NextRequest) {
  cleanupExpired();
  const ticket = req.nextUrl.searchParams.get("ticket");

  if (!ticket || !downloadTickets.has(ticket)) {
    return new Response(
      "Download ticket expired or invalid. Please click the Download button again.",
      {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }
    );
  }

  const item = downloadTickets.get(ticket)!;
  // Keep the ticket for a short grace period (30 seconds) in case of browser retries
  setTimeout(() => {
    downloadTickets.delete(ticket);
  }, 30000);

  return new Response(new Uint8Array(item.buffer), {
    status: 200,
    headers: {
      "Content-Type": item.mimeType,
      "Content-Disposition": `attachment; filename="${item.filename}"; filename*=UTF-8''${encodeURIComponent(
        item.filename
      )}`,
      "Content-Length": String(item.buffer.length),
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

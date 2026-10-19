import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url || !url.startsWith("http")) {
      return NextResponse.json(
        { success: false, error: "A valid HTTP or HTTPS URL is required" },
        { status: 400 }
      );
    }

    // Fetch the URL content
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch page (${response.status})` },
        { status: 400 }
      );
    }

    const html = await response.text();

    // Clean HTML to extract text content
    const cleanedText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const snippet = cleanedText.slice(0, 8000);

    return NextResponse.json({
      success: true,
      data: {
        url,
        extractedText: snippet,
      },
    });
  } catch (error) {
    console.error("Job URL import error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to import job description from URL" },
      { status: 500 }
    );
  }
}

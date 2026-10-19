import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAIProvider } from "@/lib/ai/provider";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { action, text, keyword, section, prompt: userPrompt, jobDescription, targetRole } = body;

    if (!action || (!text && action !== "insert_keyword")) {
      return NextResponse.json({ success: false, error: "Action and target text are required" }, { status: 400 });
    }

    const aiProvider = getAIProvider();

    switch (action) {
      case "insert_keyword": {
        // Intelligently insert keyword into bullet / text
        const prompt = `Insert the target ATS keyword "${keyword}" into the following resume content naturally.
Target Job Description Context: "${jobDescription || ""}"
Target Role: "${targetRole || ""}"
Current Content:
"${text || "Software Developer responsible for core features."}"

Rules:
1. Do NOT keyword stuff. Rewrite the text naturally and professionally.
2. Highlight the newly added capability clearly using strong action verbs.
3. Do NOT invent fake companies or degrees.
4. Return ONLY the single updated string with no JSON formatting or quotes.`;

        // We can call analyze / cover letter generator pattern or helper call
        const response = await aiProvider.generateCoverLetter(
          text || "",
          jobDescription || "",
          targetRole || "Software Engineer",
          prompt
        );
        
        // Clean up response if needed
        const cleanText = response.replace(/^["']|["']$/g, "").trim();
        return NextResponse.json({ success: true, result: cleanText });
      }

      case "inline_ai": {
        const optionPrompts: Record<string, string> = {
          improve: "Improve the writing style, clarity, and professionalism of this resume text.",
          professional: "Rewrite to sound highly professional, executive, and recruiter-friendly.",
          metrics: "Add realistic quantifiable metric placeholders like '[XX%]' or '[XX+]' to demonstrate impact. Do NOT invent fake company facts.",
          shorten: "Make this concise and punchy without losing key technical achievements.",
          expand: "Expand slightly to elaborate on technical responsibilities and business value.",
          grammar: "Fix all grammar, spelling, and sentence flow issues.",
          ats: "Optimize this text for Applicant Tracking Systems by adding clear technical terms and active language.",
          action_verbs: "Replace weak verbs (like 'worked on', 'helped with') with strong action verbs (like 'spearheaded', 'engineered', 'architected').",
          impact: "Rephrase to focus heavily on results, business value, and engineering excellence.",
        };

        const instruction = optionPrompts[userPrompt] || "Optimize and enhance this resume content.";
        const prompt = `${instruction}
Content: "${text}"
Return ONLY the single updated string.`;

        const response = await aiProvider.generateCoverLetter(
          text,
          jobDescription || "",
          targetRole || "",
          prompt
        );

        const cleanText = response.replace(/^["']|["']$/g, "").trim();
        return NextResponse.json({ success: true, result: cleanText });
      }

      case "rewrite_section": {
        const prompt = `Rewrite the following ${section || "resume"} section to be ATS-friendly, highly professional, and impactful:
"${text}"
Return ONLY the optimized section text.`;

        const response = await aiProvider.generateCoverLetter(
          text,
          jobDescription || "",
          targetRole || "",
          prompt
        );

        const cleanText = response.replace(/^["']|["']$/g, "").trim();
        return NextResponse.json({ success: true, result: cleanText });
      }

      default:
        return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
    }
  } catch (error) {
    console.error("Optimize API error:", error);
    return NextResponse.json(
      { error: "Failed to optimize content" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateTailoredResume } from "@/lib/builder/ai-generator";
import { runATSAnalysis } from "@/lib/ats";
import { DEFAULT_RESUME_DATA, DEFAULT_CUSTOMIZATION } from "@/lib/builder/default-data";
import type { ResumeData } from "@/types/resume-builder";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { templateId = "ats-optimized_1", jobDescription, sourceResumeId, resumeData } = body;

    if (!jobDescription || jobDescription.trim().length < 30) {
      return NextResponse.json(
        { success: false, error: "Please provide a complete job description (at least 30 characters)." },
        { status: 400 }
      );
    }

    // 1. Resolve candidate source data
    let candidateData: ResumeData = {
      ...DEFAULT_RESUME_DATA,
      personal: {
        ...DEFAULT_RESUME_DATA.personal,
        fullName: session.user.name || DEFAULT_RESUME_DATA.personal.fullName,
        email: session.user.email || DEFAULT_RESUME_DATA.personal.email,
      },
    };

    if (resumeData && typeof resumeData === "object" && resumeData.personal) {
      candidateData = resumeData;
    } else if (sourceResumeId) {
      const existing = await db.resume.findFirst({
        where: { id: sourceResumeId, userId: session.user.id },
      });
      if (existing) {
        const parsed = (existing.parsedData as any) || {};
        if (parsed.data) {
          candidateData = parsed.data;
        }
      }
    } else {
      // Find the user's latest resume if available
      const latest = await db.resume.findFirst({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
      });
      if (latest) {
        const parsed = (latest.parsedData as any) || {};
        if (parsed.data) {
          candidateData = parsed.data;
        }
      }
    }

    // 2. Generate Tailored Resume
    const result = await generateTailoredResume(candidateData, jobDescription);
    const tailored = result.tailoredData;

    // 3. Compile plain text for ATS scoring
    const rawText = `
${tailored.personal.fullName}
${tailored.personal.jobTitle || ""}
${tailored.personal.email} | ${tailored.personal.phone || ""} | ${tailored.personal.location || ""}
Summary:
${tailored.summary || ""}
Experience:
${tailored.experience.map((e) => `${e.jobTitle} at ${e.company} (${e.startDate} - ${e.endDate}): ${e.description} ${e.achievements?.join(" ")}`).join("\n")}
Education:
${tailored.education.map((e) => `${e.degree} from ${e.institution}`).join("\n")}
Skills:
${tailored.skills.map((s) => s.name).join(", ")}
    `.trim();

    // 4. Calculate ATS Score against the provided Job Description
    let atsScore = 85;
    try {
      const atsReport = await runATSAnalysis(rawText, jobDescription, {
        jobTitle: result.targetRole,
      });
      atsScore = atsReport.overallScore;
    } catch (atsErr) {
      console.warn("ATS scoring during generation failed, using baseline:", atsErr);
    }

    // 5. Save tailored resume to database
    const title = `${result.targetRole} Resume`;
    const saved = await db.resume.create({
      data: {
        userId: session.user.id,
        fileName: title,
        fileUrl: `/resume-builder/${templateId}`,
        fileType: "builder",
        fileSize: JSON.stringify(tailored).length,
        rawText,
        parsedData: {
          templateId,
          jobDescription,
          targetRole: result.targetRole,
          customization: DEFAULT_CUSTOMIZATION,
          data: tailored,
          atsScore,
        } as any,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        resumeId: saved.id,
        title,
        templateId,
        targetRole: result.targetRole,
        data: tailored,
        atsScore,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
        reasoning: result.reasoning,
      },
    });
  } catch (error) {
    console.error("POST /api/resumes/generate error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate tailored resume",
      },
      { status: 500 }
    );
  }
}

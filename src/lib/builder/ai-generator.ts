import { env } from "@/lib/env";
import type { ResumeData, SkillItem, ExperienceItem } from "@/types/resume-builder";
import { analyzeJobDescription } from "@/lib/ats/job-analyzer";
import { areAliases } from "@/lib/ats/aliases";
import { DEFAULT_RESUME_DATA } from "@/lib/builder/default-data";

export interface AIGenerationOptions {
  targetRole?: string;
  targetCompany?: string;
}

export interface AIGenerationResult {
  tailoredData: ResumeData;
  targetRole: string;
  matchedSkills: string[];
  missingSkills: string[];
  reasoning: string;
}

/**
 * Deterministic tailoring fallback when external AI keys are unavailable.
 * Strictly guarantees NO fabricated skills, companies, dates, or metrics.
 */
export function tailorResumeDeterministically(
  userData: ResumeData,
  jobDescription: string,
  options: AIGenerationOptions = {}
): AIGenerationResult {
  const jobAnalysis = analyzeJobDescription(jobDescription, options.targetRole);
  const targetRole = jobAnalysis.jobTitle || options.targetRole || userData.personal.jobTitle || "Professional";

  // 1. Identify which candidate skills match the JD
  const matchedSkills: string[] = [];
  const candidateSkillNames = new Set(userData.skills.map((s) => s.name.toLowerCase()));

  for (const reqSkill of [...jobAnalysis.requiredSkills, ...jobAnalysis.preferredSkills]) {
    const isMatched =
      candidateSkillNames.has(reqSkill.toLowerCase()) ||
      userData.skills.some((s) => areAliases(s.name, reqSkill));

    if (isMatched && !matchedSkills.includes(reqSkill)) {
      matchedSkills.push(reqSkill);
    }
  }

  // Identify missing skills for user awareness (never added to resume)
  const missingSkills = jobAnalysis.requiredSkills.filter(
    (req) => !matchedSkills.some((m) => areAliases(m, req))
  );

  // 2. Prioritize skills: put matched skills first, keep candidate's other verified skills
  const prioritizedSkills: SkillItem[] = [
    ...userData.skills.filter((s) => matchedSkills.some((m) => areAliases(m, s.name))),
    ...userData.skills.filter((s) => !matchedSkills.some((m) => areAliases(m, s.name))),
  ];

  // 3. Tailor Professional Summary without fabricating facts
  const topMatched = matchedSkills.slice(0, 4).join(", ");
  let tailoredSummary = userData.summary || "";

  if (topMatched.length > 0) {
    tailoredSummary = `${targetRole} with proven background in ${topMatched}. Experienced in delivering scalable solutions, collaborating across cross-functional teams, and achieving measurable engineering outcomes.`;
  } else if (!tailoredSummary) {
    tailoredSummary = `Results-oriented ${targetRole} with experience delivering scalable projects and technical solutions.`;
  }

  // 4. Tailor Experience: Re-order bullet points or prioritize positions aligning with JD
  const tailoredExperience: ExperienceItem[] = userData.experience.map((exp) => {
    // If bullet points mention any matching tech, place them first
    const sortedAchievements = [...(exp.achievements || [])].sort((a, b) => {
      const aMatches = matchedSkills.some((s) => a.toLowerCase().includes(s.toLowerCase()));
      const bMatches = matchedSkills.some((s) => b.toLowerCase().includes(s.toLowerCase()));
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });

    return {
      ...exp,
      achievements: sortedAchievements,
    };
  });

  // 5. Tailor Projects: Prioritize projects containing matching technologies
  const tailoredProjects = [...(userData.projects || [])].sort((a, b) => {
    const aCount = a.technologies.filter((t) => matchedSkills.some((m) => areAliases(m, t))).length;
    const bCount = b.technologies.filter((t) => matchedSkills.some((m) => areAliases(m, t))).length;
    return bCount - aCount;
  });

  const tailoredData: ResumeData = {
    ...userData,
    personal: {
      ...userData.personal,
      jobTitle: targetRole,
    },
    summary: tailoredSummary,
    skills: prioritizedSkills,
    experience: tailoredExperience,
    projects: tailoredProjects,
  };

  return {
    tailoredData,
    targetRole,
    matchedSkills,
    missingSkills,
    reasoning: `Tailored resume for ${targetRole} by highlighting verified skills (${topMatched}) and prioritizing relevant project achievements.`,
  };
}

/**
 * AI-powered resume tailoring engine using Google Gemini / OpenAI with strict non-fabrication rules.
 */
export async function generateTailoredResume(
  userData: ResumeData,
  jobDescription: string,
  options: AIGenerationOptions = {}
): Promise<AIGenerationResult> {
  const apiKey = env.googleGeminiApiKey || env.openaiApiKey;

  // Fallback to deterministic engine if no API key is set
  if (!apiKey) {
    return tailorResumeDeterministically(userData, jobDescription, options);
  }

  try {
    const jobAnalysis = analyzeJobDescription(jobDescription, options.targetRole);
    const targetRole = jobAnalysis.jobTitle || options.targetRole || userData.personal.jobTitle || "Professional";

    const prompt = `
You are a professional ATS resume optimizer.
Tailor the candidate's existing resume to align with the provided job description.

CRITICAL NON-FABRICATION SAFETY RULES:
1. You MUST NEVER invent or fabricate any employment experience, companies, job titles, dates, degrees, certifications, projects, or metrics.
2. You MUST NEVER add skills that the candidate has not provided. If a skill required by the job is missing from the candidate data, DO NOT add it.
3. You MAY refine the professional summary and bullet points to emphasize authentic relevant experience using strong action verbs.
4. Keep all personal contact information exactly as provided.

TARGET JOB TITLE:
${targetRole}

JOB DESCRIPTION:
${jobDescription.slice(0, 3000)}

CANDIDATE VERIFIED DATA (JSON):
${JSON.stringify(userData, null, 2)}

Return a valid JSON object strictly matching this schema (NO markdown fences, raw JSON only):
{
  "targetRole": "${targetRole}",
  "summary": "Optimized professional summary emphasizing authentic matching strengths",
  "matchedSkills": ["Array of skills present in candidate data that match the JD"],
  "missingSkills": ["Array of skills required by the JD that the candidate lacks"],
  "skills": [{"name": "Skill", "level": "Expert"}],
  "experience": [
    {
      "id": "exp-id",
      "company": "Company",
      "jobTitle": "Title",
      "location": "Location",
      "startDate": "Date",
      "endDate": "Date",
      "current": false,
      "description": "Role description",
      "achievements": ["Action-verb refined achievement bullets based only on authentic facts"]
    }
  ],
  "reasoning": "Brief explanation of how the resume was tailored"
}
    `.trim();

    // Call Gemini API
    if (env.googleGeminiApiKey) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.googleGeminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);

          // Merge safely with user's verified contact, education, certs
          const tailoredData: ResumeData = {
            ...userData,
            personal: {
              ...userData.personal,
              jobTitle: parsed.targetRole || targetRole,
            },
            summary: parsed.summary || userData.summary,
            skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : userData.skills,
            experience:
              Array.isArray(parsed.experience) && parsed.experience.length > 0
                ? parsed.experience
                : userData.experience,
          };

          return {
            tailoredData,
            targetRole: parsed.targetRole || targetRole,
            matchedSkills: parsed.matchedSkills || [],
            missingSkills: parsed.missingSkills || [],
            reasoning: parsed.reasoning || "Tailored using Google Gemini AI.",
          };
        }
      }
    }
  } catch (err) {
    console.warn("AI generation failed, using deterministic tailoring engine:", err);
  }

  // Graceful fallback
  return tailorResumeDeterministically(userData, jobDescription, options);
}

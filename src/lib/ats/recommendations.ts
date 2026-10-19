import type {
  ATSRecommendation,
  FormattingSummary,
  KeywordMatchItem,
  SkillMatchSummary,
  ExperienceMatchSummary,
  ParsedResumeData,
} from "./types";

/**
 * Generates transparent, actionable, and evidence-based ATS recommendations.
 */
export function generateRecommendations(
  skills: SkillMatchSummary,
  missingKeywords: KeywordMatchItem[],
  formatting: FormattingSummary,
  experience: ExperienceMatchSummary,
  resume: ParsedResumeData
): ATSRecommendation[] {
  const recommendations: ATSRecommendation[] = [];
  let idCounter = 1;

  // 1. Missing Required Skills
  const missingReqSkills = skills.missing.filter((s) => s.importance === "required");
  if (missingReqSkills.length > 0) {
    const topMissing = missingReqSkills.slice(0, 3).map((s) => s.skill).join(", ");
    recommendations.push({
      id: `rec-${idCounter++}`,
      category: "skill",
      importance: "high",
      title: "Add Essential Required Skills",
      message: `The job posting marks ${topMissing} as critical requirements, but they were not found in your resume.`,
      actionableStep: `If you have practical experience with ${topMissing}, consider highlighting them in your Skills or Experience bullet points with concrete context.`,
    });
  }

  // 2. Missing Keywords (Non-redundant with skills)
  const nonSkillMissingKeywords = missingKeywords
    .filter((k) => !missingReqSkills.some((s) => s.skill.toLowerCase() === k.keyword.toLowerCase()))
    .slice(0, 4);

  if (nonSkillMissingKeywords.length > 0) {
    const kwList = nonSkillMissingKeywords.map((k) => k.keyword).join(", ");
    recommendations.push({
      id: `rec-${idCounter++}`,
      category: "keyword",
      importance: "medium",
      title: "Incorporate Relevant Industry Keywords",
      message: `Key terms (${kwList}) frequently appear in the job description.`,
      actionableStep: `Review if your past accomplishments involve ${kwList}. If applicable, include them naturally in your project descriptions to boost ATS search relevance.`,
    });
  }

  // 3. Experience & Tenure alignment
  if (experience.requiredYears && experience.candidateTotalYears < experience.requiredYears) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      category: "experience",
      importance: "high",
      title: "Clarify Career Timeline & Total Experience",
      message: `The role specifies ${experience.requiredYears}+ years of experience, while your resume indicates approximately ${experience.candidateTotalYears} years.`,
      actionableStep:
        "Ensure all employment date ranges (Month/Year) are clearly noted. Emphasize senior-level impact and measurable leadership outcomes to demonstrate depth.",
    });
  }

  // 4. Formatting issues
  for (const issue of formatting.issues) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      category: "formatting",
      importance: issue.severity === "error" ? "high" : "medium",
      title: `ATS Formatting: Fix ${capitalize(issue.type)} Issues`,
      message: issue.message,
      actionableStep: issue.suggestion || "Use standard single-column text layout and clear section headings.",
    });
  }

  // 5. Contact information checks
  if (!resume.contact.linkedin && !resume.contact.github) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      category: "general",
      importance: "low",
      title: "Include Professional Portfolio or Profiles",
      message: "No LinkedIn or GitHub profile link was identified in your contact header.",
      actionableStep: "Add direct links to your professional LinkedIn profile or code repository at the top of your resume.",
    });
  }

  return recommendations;
}

function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

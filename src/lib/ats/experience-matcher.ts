import type {
  ExperienceMatchSummary,
  ExperienceRequirement,
  WorkExperienceItem,
} from "./types";

/**
 * Calculates approximate total years of experience from experience items and date strings.
 */
export function estimateCandidateExperienceYears(experiences: WorkExperienceItem[]): number {
  if (!experiences || experiences.length === 0) {
    return 0;
  }

  let totalYears = 0;
  const currentYear = new Date().getFullYear();

  for (const item of experiences) {
    const startMatch = item.startDate?.match(/\b(19\d{2}|20\d{2})\b/);
    const endMatch = item.endDate?.match(/\b(19\d{2}|20\d{2})\b/);
    const isPresent = /present|current|now/i.test(item.endDate || "");

    if (startMatch) {
      const startYear = parseInt(startMatch[1], 10);
      const endYear = isPresent ? currentYear : endMatch ? parseInt(endMatch[1], 10) : startYear + 1;
      const duration = Math.max(0.5, endYear - startYear);
      totalYears += duration;
    } else {
      // Conservative estimate if date is unparsed: 1 year per experience entry
      totalYears += 1;
    }
  }

  // Cap at 30 to prevent anomalies
  return Math.min(30, Math.round(totalYears * 10) / 10);
}

/**
 * Matches candidate's experience against job description requirements.
 */
export function matchExperience(
  experiences: WorkExperienceItem[],
  requiredYears: number | undefined,
  jobResponsibilities: string[],
  resumeText: string
): ExperienceMatchSummary {
  const candidateYears = estimateCandidateExperienceYears(experiences);
  const requirements: ExperienceRequirement[] = [];

  // 1. Years requirement check
  if (requiredYears !== undefined && requiredYears > 0) {
    const passed = candidateYears >= requiredYears;
    requirements.push({
      requirement: `Minimum ${requiredYears} years of professional experience`,
      requiredYears,
      candidateYears,
      matched: passed,
      evidence: experiences.length > 0
        ? `Detected approximately ${candidateYears} years across ${experiences.length} positions.`
        : "No verifiable timeline or work history dates found in resume.",
    });
  } else {
    requirements.push({
      requirement: "General professional work experience",
      matched: experiences.length > 0,
      evidence: experiences.length > 0
        ? `Detected ${experiences.length} career positions.`
        : "No work experience section identified.",
    });
  }

  // 2. Check responsibilities alignment
  let matchedRespCount = 0;
  for (const resp of jobResponsibilities.slice(0, 5)) {
    // Extract key action verbs and nouns
    const words = resp.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
    const hasOverlap = words.some((w) => resumeText.toLowerCase().includes(w));

    requirements.push({
      requirement: resp.length > 80 ? resp.slice(0, 80) + "..." : resp,
      matched: hasOverlap ? true : "unknown",
      evidence: hasOverlap
        ? "Found related action phrases and responsibilities in resume."
        : "Limited specific evidence found for this duty.",
    });

    if (hasOverlap) matchedRespCount++;
  }

  // 3. Compute experience match score
  let score = 80; // default baseline

  if (requiredYears !== undefined && requiredYears > 0) {
    if (candidateYears >= requiredYears) {
      score = 95;
    } else if (candidateYears >= requiredYears * 0.7) {
      score = 75;
    } else if (candidateYears > 0) {
      score = 55;
    } else {
      score = 35;
    }
  } else {
    // Score based on detected experience entries & responsibility overlap
    if (experiences.length >= 3) score = 90;
    else if (experiences.length >= 1) score = 75;
    else score = 40;
  }

  // Fine-tune by responsibility overlap
  if (jobResponsibilities.length > 0) {
    const respRatio = matchedRespCount / Math.min(5, jobResponsibilities.length);
    score = Math.round(score * 0.7 + respRatio * 100 * 0.3);
  }

  return {
    matchScore: Math.max(10, Math.min(100, score)),
    candidateTotalYears: candidateYears,
    requiredYears,
    requirements,
    roleAlignment: score >= 80 ? "Strong alignment" : score >= 60 ? "Moderate alignment" : "Low alignment",
  };
}

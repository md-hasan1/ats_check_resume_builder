import type { JobAnalysisResult } from "./types";
import { getCanonicalSkill, ALIAS_TO_CANONICAL, simplifyAlias } from "./aliases";
import { normalizeText, isStopword, simplifyTechTerm } from "./normalizer";

const SOFT_SKILLS = [
  "communication",
  "collaboration",
  "problem solving",
  "teamwork",
  "leadership",
  "adaptability",
  "time management",
  "critical thinking",
  "mentorship",
  "cross-functional",
  "analytical skills",
  "presentation skills",
];

const PREFERRED_REGEX = /\b(?:preferred|nice to have|bonus|plus|good to have|desirable|ideal candidate|optional)\b/i;
const REQUIRED_REGEX = /\b(?:required|must have|requirements|qualifications|minimum|essential|core requirements|you will bring)\b/i;
const EXP_YEARS_REGEX = /(?:at least\s+)?(\d+)(?:\+|\s*to\s*\d+)?\s*(?:years?|yrs?)\b(?:\s+of)?\s+(?:experience|exp)/i;
const DEGREE_REGEX = /\b(?:bachelor|master|degree|computer science|engineering|diploma|b\.s|m\.s|ph\.?d)\b/i;

/**
 * Extracts skills from a line of text using fast O(1) n-gram token lookups.
 * Avoids all dynamic RegExp compilations.
 */
function extractSkillsFromLine(line: string): string[] {
  const words = line.match(/[A-Za-z0-9+#]+(?:[\.\-_/][A-Za-z0-9+#]+)*/g) || [];
  if (words.length === 0) return [];

  const detected: string[] = [];
  const maxNgram = 4;
  const wordCount = words.length;

  for (let i = 0; i < wordCount; i++) {
    let simplifiedPhrase = "";

    for (let n = 1; n <= maxNgram && i + n - 1 < wordCount; n++) {
      const word = words[i + n - 1];
      simplifiedPhrase += simplifyAlias(word);

      const canonical = ALIAS_TO_CANONICAL.get(simplifiedPhrase);
      if (canonical) {
        detected.push(canonical);
      }
    }
  }

  return detected;
}

/**
 * Parses and analyzes a job description to extract structured requirements.
 * Optimized for maximum efficiency and zero regex re-compilation.
 */
export function analyzeJobDescription(jobText: string, providedTitle?: string): JobAnalysisResult {
  const normalized = normalizeText(jobText);
  const lines = jobText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // 1. Identify Job Title if not provided
  let jobTitle = providedTitle;
  if (!jobTitle && lines.length > 0) {
    const candidateLine = lines[0];
    if (candidateLine.length <= 60 && !candidateLine.includes(".") && !candidateLine.toLowerCase().startsWith("about")) {
      jobTitle = candidateLine;
    }
  }

  // 2. Extract experience years requirement (e.g. "3+ years", "at least 5 years")
  let experienceYears: number | undefined;
  const expMatch = normalized.match(EXP_YEARS_REGEX);
  if (expMatch && expMatch[1]) {
    experienceYears = parseInt(expMatch[1], 10);
  }

  // 3. Scan for tech skills and classify into required vs preferred
  const requiredSkills = new Set<string>();
  const preferredSkills = new Set<string>();
  const allDetectedTech = new Set<string>();

  let currentSectionMode: "required" | "preferred" | "general" = "general";

  for (const line of lines) {
    const hasPrefHeading = PREFERRED_REGEX.test(line);
    const hasReqHeading = REQUIRED_REGEX.test(line);

    if (hasPrefHeading && !hasReqHeading) {
      currentSectionMode = "preferred";
    } else if (hasReqHeading) {
      currentSectionMode = "required";
    }

    const lineSkills = extractSkillsFromLine(line);
    if (lineSkills.length === 0) continue;

    const lineTargetMode = hasPrefHeading && !hasReqHeading
      ? "preferred"
      : hasReqHeading
        ? "required"
        : currentSectionMode;

    for (const skill of lineSkills) {
      allDetectedTech.add(skill);
      if (lineTargetMode === "preferred") {
        preferredSkills.add(skill);
      } else {
        requiredSkills.add(skill);
      }
    }
  }

  // If a skill was classified in both, prioritize as required
  for (const skill of requiredSkills) {
    preferredSkills.delete(skill);
  }

  // If no required skills were separated, consider all detected as required
  if (requiredSkills.size === 0 && allDetectedTech.size > 0) {
    for (const skill of allDetectedTech) {
      requiredSkills.add(skill);
    }
  }

  // 4. Soft skills detection
  const softSkillsFound: string[] = [];
  const lowerJob = normalized.toLowerCase();
  for (const soft of SOFT_SKILLS) {
    if (lowerJob.includes(soft)) {
      softSkillsFound.push(soft);
    }
  }

  // 5. Responsibilities & Qualifications extraction
  const responsibilities: string[] = [];
  const qualifications: string[] = [];
  const educationRequirements: string[] = [];

  for (const line of lines) {
    if (DEGREE_REGEX.test(line)) {
      educationRequirements.push(line.replace(/^[•\-\*\s]+/, ""));
    } else if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
      const clean = line.replace(/^[•\-\*\s]+/, "");
      if (clean.length > 20) {
        if (currentSectionMode === "required" || /requirement|qualification/i.test(line)) {
          qualifications.push(clean);
        } else {
          responsibilities.push(clean);
        }
      }
    }
  }

  // 6. Meaningful Keywords extraction with frequency and stop-word filtering
  const tokenMatches = normalized.match(/[A-Za-z0-9+#]+(?:\.[A-Za-z0-9+#]+)*/g) || [];
  const tokenFreq = new Map<string, number>();

  for (const token of tokenMatches) {
    if (token.length < 2 || isStopword(token)) continue;
    const canon = getCanonicalSkill(token) || token;
    tokenFreq.set(canon, (tokenFreq.get(canon) || 0) + 1);
  }

  // Top keywords prioritized by presence in tech list and frequency
  const keywords = Array.from(tokenFreq.entries())
    .sort((a, b) => {
      const aIsTech = allDetectedTech.has(a[0]) ? 1 : 0;
      const bIsTech = allDetectedTech.has(b[0]) ? 1 : 0;
      if (aIsTech !== bIsTech) return bIsTech - aIsTech;
      return b[1] - a[1];
    })
    .slice(0, 30)
    .map(([word]) => word);

  return {
    jobTitle,
    requiredSkills: Array.from(requiredSkills),
    preferredSkills: Array.from(preferredSkills),
    technologies: Array.from(allDetectedTech),
    responsibilities: responsibilities.slice(0, 10),
    qualifications: qualifications.slice(0, 10),
    educationRequirements: educationRequirements.slice(0, 5),
    experienceYears,
    certifications: [],
    softSkills: softSkillsFound,
    keywords,
  };
}

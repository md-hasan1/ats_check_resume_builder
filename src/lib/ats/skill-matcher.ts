import type { SkillMatchItem, SkillMatchSummary } from "./types";
import { AtsDocumentIndex, createAtsDocumentIndex } from "./document-indexer";

/**
 * Evaluates required and preferred technical skills against the resume text
 * using fast O(1) indexed lookups.
 */
export function matchSkills(
  requiredSkills: string[],
  preferredSkills: string[],
  resumeSource: string | AtsDocumentIndex
): SkillMatchSummary {
  const matched: SkillMatchItem[] = [];
  const missing: SkillMatchItem[] = [];
  const preferredMatches: SkillMatchItem[] = [];

  const index = typeof resumeSource === "string" ? createAtsDocumentIndex(resumeSource) : resumeSource;

  let requiredMatchedCount = 0;
  let preferredMatchedCount = 0;

  // 1. Process Required Skills
  for (const skill of requiredSkills) {
    const result = index.matchTerm(skill);
    const item: SkillMatchItem = {
      skill,
      matched: result.matched,
      matchType: result.matchType,
      importance: "required",
      evidence: result.context
        ? `Found in ${result.primarySection || "resume"}: "${result.context}"`
        : undefined,
    };

    if (result.matched) {
      requiredMatchedCount++;
      matched.push(item);
    } else {
      missing.push(item);
    }
  }

  // 2. Process Preferred Skills
  for (const skill of preferredSkills) {
    const result = index.matchTerm(skill);
    const item: SkillMatchItem = {
      skill,
      matched: result.matched,
      matchType: result.matchType,
      importance: "preferred",
      evidence: result.context
        ? `Found in ${result.primarySection || "resume"}: "${result.context}"`
        : undefined,
    };

    preferredMatches.push(item);
    if (result.matched) {
      preferredMatchedCount++;
      matched.push(item);
    }
  }

  // Calculate Scores
  const reqTotal = requiredSkills.length;
  const prefTotal = preferredSkills.length;

  const requiredScore = reqTotal > 0 ? Math.round((requiredMatchedCount / reqTotal) * 100) : 100;
  const preferredScore = prefTotal > 0 ? Math.round((preferredMatchedCount / prefTotal) * 100) : 100;

  // Required skills carry 75% weight, preferred skills carry 25% weight
  let overallScore = 100;
  if (reqTotal > 0 && prefTotal > 0) {
    overallScore = Math.round(requiredScore * 0.75 + preferredScore * 0.25);
  } else if (reqTotal > 0) {
    overallScore = requiredScore;
  } else if (prefTotal > 0) {
    overallScore = preferredScore;
  }

  return {
    requiredScore,
    preferredScore,
    overallScore,
    matched,
    missing,
    preferred: preferredMatches,
  };
}

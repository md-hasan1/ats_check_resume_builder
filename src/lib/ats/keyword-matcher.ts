import type { KeywordMatchItem, MatchType } from "./types";
import { isStopword } from "./normalizer";
import { AtsDocumentIndex, createAtsDocumentIndex } from "./document-indexer";

/**
 * Checks if a specific keyword from the job description appears in the resume text
 * and determines the highest matching tier: exact, normalized, alias, or missing.
 * Supports passing either raw text or a pre-computed AtsDocumentIndex.
 */
export function matchKeywordAgainstText(
  keyword: string,
  resumeSource: string | AtsDocumentIndex
): { matched: boolean; matchType: MatchType; context?: string } {
  if (!keyword || isStopword(keyword)) {
    return { matched: false, matchType: "missing" };
  }

  const index = typeof resumeSource === "string" ? createAtsDocumentIndex(resumeSource) : resumeSource;
  const match = index.matchTerm(keyword);

  return {
    matched: match.matched,
    matchType: match.matchType,
    context: match.context,
  };
}

/**
 * Matches an array of job keywords against the resume text using fast O(1) indexed lookups.
 * Multi-word phrases, casing variations, punctuation, and aliases are handled accurately.
 */
export function matchKeywords(
  jobKeywords: string[],
  resumeSource: string | AtsDocumentIndex
): {
  matchedKeywords: KeywordMatchItem[];
  missingKeywords: KeywordMatchItem[];
  matchScore: number;
} {
  const matchedKeywords: KeywordMatchItem[] = [];
  const missingKeywords: KeywordMatchItem[] = [];

  const index = typeof resumeSource === "string" ? createAtsDocumentIndex(resumeSource) : resumeSource;
  const seen = new Set<string>();

  for (const kw of jobKeywords) {
    const cleanKw = kw.trim();
    if (!cleanKw || isStopword(cleanKw)) continue;

    const lower = cleanKw.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);

    const result = index.matchTerm(cleanKw);

    if (result.matched) {
      matchedKeywords.push({
        keyword: cleanKw,
        status: "matched",
        matchType: result.matchType,
        importance: "high",
        foundInContext: result.context,
        category: result.primarySection,
      });
    } else {
      missingKeywords.push({
        keyword: cleanKw,
        status: "missing",
        matchType: "missing",
        importance: "high",
      });
    }
  }

  const total = matchedKeywords.length + missingKeywords.length;
  // Calculate weighted score with bonus for exact/normalized matches
  let matchScore = 100;
  if (total > 0) {
    const rawRatio = matchedKeywords.length / total;
    matchScore = Math.round(rawRatio * 100);
  }

  return { matchedKeywords, missingKeywords, matchScore };
}

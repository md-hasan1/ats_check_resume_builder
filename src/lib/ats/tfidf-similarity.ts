import { extractCleanTokens } from "./normalizer";
import type { AtsDocumentIndex } from "./document-indexer";

/**
 * Computes term frequencies directly as counts and length.
 */
function computeTermCounts(tokens: string[]): { counts: Map<string, number>; total: number } {
  const counts = new Map<string, number>();
  for (let i = 0; i < tokens.length; i++) {
    const term = tokens[i];
    counts.set(term, (counts.get(term) || 0) + 1);
  }
  return { counts, total: tokens.length };
}

/**
 * Pure TypeScript TF-IDF and Cosine Similarity Calculator.
 * Evaluates the lexical similarity between Resume text and Job Description text.
 * Optimized with single-pass vector magnitude computation and zero intermediate maps.
 *
 * Returns a score between 0 and 100.
 */
export function calculateTFIDFSimilarity(
  resumeSource: string | AtsDocumentIndex | string[],
  jobSource: string | AtsDocumentIndex | string[]
): number {
  const resumeTokens = Array.isArray(resumeSource)
    ? resumeSource
    : typeof resumeSource === "string"
      ? extractCleanTokens(resumeSource)
      : resumeSource.getCleanTokens();

  const jobTokens = Array.isArray(jobSource)
    ? jobSource
    : typeof jobSource === "string"
      ? extractCleanTokens(jobSource)
      : jobSource.getCleanTokens();

  if (resumeTokens.length === 0 || jobTokens.length === 0) {
    return 0;
  }

  const res = computeTermCounts(resumeTokens);
  const jb = computeTermCounts(jobTokens);

  const lenA = res.total;
  const lenB = jb.total;
  const countsA = res.counts;
  const countsB = jb.counts;

  // With docCount = 2:
  // - If term in both docs: idf = ln(3/3) + 1 = 1.0
  // - If term in only 1 doc: idf = ln(3/2) + 1 = 1.405465108
  const IDF_SHARED = 1.0;
  const IDF_SOLO = 1.4054651081081644;
  const IDF_SOLO_SQ = IDF_SOLO * IDF_SOLO;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  // Process all terms in doc A
  for (const [term, countA] of countsA.entries()) {
    const tfA = countA / lenA;
    const countB = countsB.get(term);

    if (countB !== undefined) {
      // Term is in BOTH documents
      const tfB = countB / lenB;
      const tfidfA = tfA * IDF_SHARED;
      const tfidfB = tfB * IDF_SHARED;

      dotProduct += tfidfA * tfidfB;
      normA += tfidfA * tfidfA;
      normB += tfidfB * tfidfB;
    } else {
      // Term only in doc A
      const tfidfA = tfA * IDF_SOLO;
      normA += tfidfA * tfidfA;
    }
  }

  // Add norm contribution for terms only in doc B
  for (const [term, countB] of countsB.entries()) {
    if (!countsA.has(term)) {
      const tfB = countB / lenB;
      const tfidfB = tfB * IDF_SOLO;
      normB += tfidfB * tfidfB;
    }
  }

  if (normA === 0 || normB === 0) return 0;

  const rawCosine = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));

  // Cosine between resume and job description typically ranges 0.15 - 0.70.
  // Calibrate curve to a human-intuitive 0-100 scale.
  const calibrated = Math.min(100, Math.round(Math.pow(rawCosine, 0.65) * 125));
  return Math.max(0, Math.min(100, calibrated));
}

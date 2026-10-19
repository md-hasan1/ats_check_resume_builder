import type { ScoreBreakdown } from "./types";

export interface ScoringWeights {
  keywordWeight: number;      // 0.30
  semanticWeight: number;     // 0.25
  skillWeight: number;        // 0.20
  experienceWeight: number;   // 0.15
  formattingWeight: number;   // 0.10
}

export const DEFAULT_ATS_WEIGHTS: ScoringWeights = {
  keywordWeight: 0.30,
  semanticWeight: 0.25,
  skillWeight: 0.20,
  experienceWeight: 0.15,
  formattingWeight: 0.10,
};

/**
 * Calculates the final ATS compatibility score and individual breakdowns
 * according to the weighted ATS methodology.
 */
export function calculateATSScore(
  keywordScore: number,
  semanticScore: number,
  skillScore: number,
  experienceScore: number,
  formattingScore: number,
  weights: ScoringWeights = DEFAULT_ATS_WEIGHTS
): {
  overallScore: number;
  breakdown: ScoreBreakdown;
  methodologyNotice: string;
} {
  // Clamp all individual sub-scores to [0, 100]
  const clamp = (val: number) => Math.max(0, Math.min(100, Math.round(val)));

  const k = clamp(keywordScore);
  const s = clamp(semanticScore);
  const sk = clamp(skillScore);
  const e = clamp(experienceScore);
  const f = clamp(formattingScore);

  const rawFinal =
    k * weights.keywordWeight +
    s * weights.semanticWeight +
    sk * weights.skillWeight +
    e * weights.experienceWeight +
    f * weights.formattingWeight;

  const overallScore = clamp(rawFinal);

  return {
    overallScore,
    breakdown: {
      keywordMatch: k,
      semanticSimilarity: s,
      skillMatch: sk,
      experienceMatch: e,
      formatting: f,
    },
    methodologyNotice:
      "This score represents our transparent ATS compatibility methodology based on keyword density, vector semantic similarity, core skill verification, experience tenure alignment, and deterministic ATS formatting checks.",
  };
}

import { getCanonicalSkill, areAliases } from "./aliases";
import { STOP_WORDS } from "@/lib/ai/skills-dictionary";

/**
 * Normalizes raw text:
 * - Decodes entities & trims
 * - Collapses repeated whitespace
 * - Standardizes punctuation
 */
export function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[\t\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Simplifies a technical term for comparison by removing dots, hyphens, and spaces
 * while keeping characters like +, #, and alphanumeric.
 * Example:
 * "Node.js" -> "nodejs"
 * "Node JS" -> "nodejs"
 * "C++" -> "c++"
 * "C#" -> "c#"
 */
export function simplifyTechTerm(term: string): string {
  if (!term) return "";
  return term
    .toLowerCase()
    .replace(/[\s\.\-_]/g, "")
    .trim();
}

/**
 * Checks if a token is a generic stopword that should not be scored as a meaningful skill/keyword.
 */
export function isStopword(token: string): boolean {
  const norm = token.toLowerCase().trim();
  if (norm.length < 2) return true;
  if (STOP_WORDS.has(norm)) return true;

  const genericJargon = new Set([
    "team", "teams", "player", "work", "works", "working",
    "good", "ability", "responsible", "company", "candidate",
    "required", "preferred", "years", "experience", "strong",
    "knowledge", "understanding", "skills", "proficient",
    "hands-on", "proven", "track", "record", "fast-paced",
    "environment", "plus", "bonus", "opportunity", "role",
    "responsibilities", "requirements", "qualifications",
  ]);

  return genericJargon.has(norm);
}

/**
 * Tokenizes text into meaningful words/phrases, filtering out stopwords.
 */
export function extractCleanTokens(text: string): string[] {
  const cleaned = normalizeText(text);
  // Match technical tokens (allows letters, numbers, +, #, and dots inside terms like Node.js)
  const matches = cleaned.match(/\b[A-Za-z0-9+#]+(?:\.[A-Za-z0-9+#]+)*\b/g) || [];

  return matches
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !isStopword(token));
}

export { getCanonicalSkill, areAliases };

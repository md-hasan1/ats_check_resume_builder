import { normalizeText, simplifyTechTerm, isStopword } from "./normalizer";
import { getCanonicalSkill, ALIAS_TO_CANONICAL } from "./aliases";
import { detectResumeSections, type CanonicalSectionName } from "./section-detector";

export interface TokenOccurrence {
  text: string;
  normalized: string;
  simplified: string;
  start: number;
  end: number;
  lineIndex: number;
  section: CanonicalSectionName;
}

export interface TermOccurrence {
  matchedTerm: string;
  rawTextExcerpt: string;
  start: number;
  end: number;
  section: CanonicalSectionName;
  lineIndex: number;
}

export interface AtsTermMatch {
  matched: boolean;
  matchType: "exact" | "normalized" | "alias" | "missing";
  count: number;
  primarySection?: CanonicalSectionName;
  context?: string;
  canonical?: string;
}

/**
 * Fast in-memory indexed representation of a resume or job description document.
 * Eliminates repeated regex compilation, substring search, and whitespace splitting.
 */
export class AtsDocumentIndex {
  readonly rawText: string;
  readonly normalizedText: string;
  readonly lines: string[];
  readonly lineOffsets: number[];
  readonly tokens: TokenOccurrence[] = [];
  readonly tokenCount: number;

  // O(1) Lookup indices
  private exactNgrams = new Map<string, TermOccurrence[]>();
  private simplifiedNgrams = new Map<string, TermOccurrence[]>();
  private stemmedNgrams = new Map<string, TermOccurrence[]>();
  private canonicalSkills = new Map<string, TermOccurrence[]>();
  private sectionTokenCounts: Record<CanonicalSectionName, number> = {
    contact: 0,
    summary: 0,
    skills: 0,
    experience: 0,
    education: 0,
    projects: 0,
    certifications: 0,
    awards: 0,
    languages: 0,
    other: 0,
  };

  constructor(rawText: string) {
    this.rawText = rawText || "";
    this.normalizedText = normalizeText(this.rawText);

    // Compute line offsets for fast line/context lookups
    this.lines = this.rawText.split(/\r?\n/);
    this.lineOffsets = new Array(this.lines.length);
    let offset = 0;
    for (let i = 0; i < this.lines.length; i++) {
      this.lineOffsets[i] = offset;
      offset += this.lines[i].length + 1; // +1 for newline character
    }

    // Detect section boundaries
    const { sections } = detectResumeSections(this.rawText);

    // Build line-to-section map
    const lineSectionMap = new Array<CanonicalSectionName>(this.lines.length).fill("other");
    if (sections.length > 0) {
      // section.startIndex and section.endIndex are line indices
      for (const section of sections) {
        const startLine = Math.max(0, section.startIndex);
        const endLine = Math.min(this.lines.length - 1, section.endIndex);
        for (let l = startLine; l <= endLine; l++) {
          lineSectionMap[l] = section.name;
        }
      }
    }

    // Tokenize text while capturing exact start and end offsets
    this.tokenizeAndIndex(lineSectionMap);
    this.tokenCount = this.tokens.length;

    // Build n-grams (1-gram to 4-gram) for multi-word technology and skill matching
    this.buildNgrams();
  }

  private findLineIndex(charOffset: number): number {
    let low = 0;
    let high = this.lineOffsets.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (this.lineOffsets[mid] <= charOffset) {
        if (mid === this.lineOffsets.length - 1 || this.lineOffsets[mid + 1] > charOffset) {
          return mid;
        }
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return 0;
  }

  /**
   * Single-pass regex token scanner capturing positions and section context.
   */
  private tokenizeAndIndex(lineSectionMap: CanonicalSectionName[]) {
    // Regex allows technical terms like C++, C#, .NET, Node.js, Next.js, CI/CD, React.js
    const tokenRegex = /[A-Za-z0-9+#]+(?:[\.\-_/][A-Za-z0-9+#]+)*/g;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(this.rawText)) !== null) {
      const text = match[0];
      const start = match.index;
      const end = start + text.length;
      const lineIndex = this.findLineIndex(start);
      const section = lineSectionMap[lineIndex] || "other";

      const normalized = text.toLowerCase();
      const simplified = simplifyTechTerm(text);

      this.tokens.push({
        text,
        normalized,
        simplified,
        start,
        end,
        lineIndex,
        section,
      });

      this.sectionTokenCounts[section] = (this.sectionTokenCounts[section] || 0) + 1;
    }
  }

  /**
   * Builds unigram, bigram, trigram, and 4-gram lookup sets.
   * Enables O(1) detection of multi-word skills like "Amazon Web Services",
   * "Machine Learning", "Continuous Integration", and "Spring Boot".
   */
  private buildNgrams() {
    const maxNgram = 4;
    const len = this.tokens.length;

    for (let i = 0; i < len; i++) {
      let phraseWords: string[] = [];
      let simplifiedConcat = "";

      for (let n = 1; n <= maxNgram && i + n - 1 < len; n++) {
        const currentToken = this.tokens[i + n - 1];

        // Break phrase if cross-line gap is too large
        if (n > 1) {
          const prevToken = this.tokens[i + n - 2];
          if (currentToken.start - prevToken.end > 25 || currentToken.lineIndex - prevToken.lineIndex > 1) {
            break;
          }
        }

        phraseWords.push(currentToken.normalized);
        simplifiedConcat += currentToken.simplified;

        const phrase = phraseWords.join(" ");
        const firstToken = this.tokens[i];
        const lastToken = currentToken;
        const start = firstToken.start;
        const end = lastToken.end;
        const section = firstToken.section;
        const lineIndex = firstToken.lineIndex;

        const occurrence: TermOccurrence = {
          matchedTerm: phrase,
          rawTextExcerpt: this.rawText.substring(start, end),
          start,
          end,
          section,
          lineIndex,
        };

        // 1. Exact / normalized n-gram
        this.addOccurrence(this.exactNgrams, phrase, occurrence);

        // 2. Simplified n-gram
        if (simplifiedConcat) {
          this.addOccurrence(this.simplifiedNgrams, simplifiedConcat, occurrence);
        }

        // 3. Stemmed unigram (strip trailing 's' or 'es')
        if (n === 1 && phrase.length > 3) {
          const stem = phrase.endsWith("es") ? phrase.slice(0, -2) : phrase.endsWith("s") ? phrase.slice(0, -1) : null;
          if (stem) {
            this.addOccurrence(this.stemmedNgrams, stem, occurrence);
          }
        }

        // 4. Canonical tech skill mapping
        const canonical = ALIAS_TO_CANONICAL.get(simplifiedConcat);
        if (canonical) {
          this.addOccurrence(this.canonicalSkills, canonical, occurrence);
        }
      }
    }
  }

  private addOccurrence(map: Map<string, TermOccurrence[]>, key: string, occ: TermOccurrence) {
    let list = map.get(key);
    if (!list) {
      list = [];
      map.set(key, list);
    }
    list.push(occ);
  }

  /**
   * Fast O(1) keyword matching against the entire document index.
   * Evaluates exact, normalized, stem, and alias levels.
   */
  matchTerm(term: string): AtsTermMatch {
    const clean = term.trim();
    if (!clean || isStopword(clean)) {
      return { matched: false, matchType: "missing", count: 0 };
    }

    const lower = clean.toLowerCase();
    const simplified = simplifyTechTerm(clean);

    // 1. Exact phrase match
    const exactOccurrences = this.exactNgrams.get(lower);
    if (exactOccurrences && exactOccurrences.length > 0) {
      const primary = this.selectBestOccurrence(exactOccurrences);
      return {
        matched: true,
        matchType: "exact",
        count: exactOccurrences.length,
        primarySection: primary.section,
        context: this.extractSnippet(primary.start, primary.end),
      };
    }

    // 2. Normalized / Simplified match (handles punctuation, spacing differences like Node.js vs NodeJS)
    const simpOccurrences = this.simplifiedNgrams.get(simplified);
    if (simpOccurrences && simpOccurrences.length > 0) {
      const primary = this.selectBestOccurrence(simpOccurrences);
      return {
        matched: true,
        matchType: "normalized",
        count: simpOccurrences.length,
        primarySection: primary.section,
        context: this.extractSnippet(primary.start, primary.end),
      };
    }

    // 3. Stemmed match (singular vs plural e.g. "Microservices" -> "Microservice")
    if (lower.length > 3) {
      const stem = lower.endsWith("es") ? lower.slice(0, -2) : lower.endsWith("s") ? lower.slice(0, -1) : null;
      if (stem) {
        const stemOccurrences = this.stemmedNgrams.get(stem) || this.exactNgrams.get(stem);
        if (stemOccurrences && stemOccurrences.length > 0) {
          const primary = this.selectBestOccurrence(stemOccurrences);
          return {
            matched: true,
            matchType: "normalized",
            count: stemOccurrences.length,
            primarySection: primary.section,
            context: this.extractSnippet(primary.start, primary.end),
          };
        }
      }
    }

    // 4. Canonical Alias match (e.g. Postgres -> PostgreSQL, Golang -> Go)
    const canonical = getCanonicalSkill(clean);
    if (canonical) {
      const canonOccurrences = this.canonicalSkills.get(canonical);
      if (canonOccurrences && canonOccurrences.length > 0) {
        const primary = this.selectBestOccurrence(canonOccurrences);
        return {
          matched: true,
          matchType: "alias",
          count: canonOccurrences.length,
          primarySection: primary.section,
          context: this.extractSnippet(primary.start, primary.end),
          canonical,
        };
      }
    }

    return { matched: false, matchType: "missing", count: 0 };
  }

  /**
   * Prioritize occurrences found in high-value ATS sections (experience > skills > summary > education > other).
   */
  private selectBestOccurrence(occurrences: TermOccurrence[]): TermOccurrence {
    const priority: Record<CanonicalSectionName, number> = {
      experience: 5,
      skills: 4,
      summary: 3,
      projects: 3,
      certifications: 2,
      education: 2,
      awards: 1,
      languages: 1,
      contact: 1,
      other: 0,
    };

    let best = occurrences[0];
    let bestScore = priority[best.section] ?? 0;

    for (let i = 1; i < occurrences.length; i++) {
      const occ = occurrences[i];
      const score = priority[occ.section] ?? 0;
      if (score > bestScore) {
        best = occ;
        bestScore = score;
      }
    }

    return best;
  }

  /**
   * Generates clean contextual excerpt around character offset without string searching.
   */
  extractSnippet(start: number, end: number, radius = 35): string {
    const snippetStart = Math.max(0, start - radius);
    const snippetEnd = Math.min(this.rawText.length, end + radius);
    return this.rawText.substring(snippetStart, snippetEnd).replace(/\s+/g, " ").trim();
  }

  /**
   * Returns all canonical tech skills found in the document.
   */
  getDetectedSkills(): string[] {
    return Array.from(this.canonicalSkills.keys());
  }

  /**
   * Returns occurrences for a detected canonical skill.
   */
  getCanonicalSkillOccurrences(canonicalName: string): TermOccurrence[] {
    return this.canonicalSkills.get(canonicalName) || [];
  }

  /**
   * Returns clean tokens suitable for TF-IDF or vector operations.
   */
  getCleanTokens(): string[] {
    return this.tokens
      .filter((t) => t.normalized.length >= 2 && !isStopword(t.normalized))
      .map((t) => t.normalized);
  }

  /**
   * Gets token count for a given resume section.
   */
  getSectionTokenCount(section: CanonicalSectionName): number {
    return this.sectionTokenCounts[section] || 0;
  }
}

/**
 * Creates or retrieves an AtsDocumentIndex.
 */
export function createAtsDocumentIndex(text: string): AtsDocumentIndex {
  return new AtsDocumentIndex(text);
}

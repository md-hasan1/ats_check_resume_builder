import { env } from "@/lib/env";
import { calculateTFIDFSimilarity } from "./tfidf-similarity";
import { extractCleanTokens } from "./normalizer";

export interface EmbeddingProvider {
  name: string;
  getEmbedding(text: string): Promise<number[]>;
  computeSimilarity(textA: string, textB: string, precomputedTfidf?: number): Promise<number>;
}

/**
 * Calculates vector cosine similarity between two float arrays.
 */
export function vectorCosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    const valA = a[i];
    const valB = b[i];
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// In-memory LRU-like cache for deterministic vectors
const VECTOR_CACHE = new Map<string, number[]>();
const MAX_CACHE_SIZE = 500;

function getCachedVector(key: string): number[] | undefined {
  return VECTOR_CACHE.get(key);
}

function setCachedVector(key: string, vec: number[]) {
  if (VECTOR_CACHE.size >= MAX_CACHE_SIZE) {
    const firstKey = VECTOR_CACHE.keys().next().value;
    if (firstKey) VECTOR_CACHE.delete(firstKey);
  }
  VECTOR_CACHE.set(key, vec);
}

/**
 * Deterministic Fast Embedding Provider based on character & token n-gram vectors.
 * Guaranteed to operate at lightning speed (<1ms) without external network requests or API keys.
 */
export class DeterministicNgramEmbeddingProvider implements EmbeddingProvider {
  name = "deterministic-ngram";

  async getEmbedding(text: string): Promise<number[]> {
    const cacheKey = text.length <= 1000 ? text : text.slice(0, 500) + "_" + text.length + "_" + text.slice(-500);
    const cached = getCachedVector(cacheKey);
    if (cached) return cached;

    // 256-dimensional hashed n-gram feature vector
    const dim = 256;
    const vec = new Float64Array(dim);
    const tokens = extractCleanTokens(text);

    for (let t = 0; t < tokens.length; t++) {
      const lower = tokens[t].toLowerCase();
      const len = lower.length;

      // Hash whole unigram
      let hash = 0;
      for (let i = 0; i < len; i++) {
        hash = (hash * 31 + lower.charCodeAt(i)) & 0x7fffffff;
      }
      vec[hash % dim] += 1.0;

      // Hash character bigrams
      for (let i = 0; i < len - 1; i++) {
        const biHash = ((lower.charCodeAt(i) * 31 + lower.charCodeAt(i + 1)) & 0x7fffffff) % dim;
        vec[biHash] += 0.5;
      }

      // Hash character trigrams for terms >= 3 chars
      for (let i = 0; i < len - 2; i++) {
        const triHash = (((lower.charCodeAt(i) * 31 + lower.charCodeAt(i + 1)) * 31 + lower.charCodeAt(i + 2)) & 0x7fffffff) % dim;
        vec[triHash] += 0.35;
      }
    }

    // Normalize vector
    let sumSq = 0;
    for (let i = 0; i < dim; i++) {
      sumSq += vec[i] * vec[i];
    }
    const norm = Math.sqrt(sumSq);
    const result = new Array<number>(dim);
    if (norm > 0) {
      for (let i = 0; i < dim; i++) {
        result[i] = vec[i] / norm;
      }
    } else {
      result.fill(0);
    }

    setCachedVector(cacheKey, result);
    return result;
  }

  async computeSimilarity(textA: string, textB: string, precomputedTfidf?: number): Promise<number> {
    const [vecA, vecB] = await Promise.all([this.getEmbedding(textA), this.getEmbedding(textB)]);
    const cosine = vectorCosineSimilarity(vecA, vecB);
    const tfidf = precomputedTfidf !== undefined ? precomputedTfidf : calculateTFIDFSimilarity(textA, textB);

    // Blended semantic + lexical score
    const blended = Math.round(cosine * 100 * 0.4 + tfidf * 0.6);
    return Math.max(0, Math.min(100, blended));
  }
}

/**
 * Google Gemini Embedding Provider using gemini-embedding models with strict timeout and fallback
 */
export class GeminiEmbeddingProvider implements EmbeddingProvider {
  name = "gemini";
  private fallback = new DeterministicNgramEmbeddingProvider();

  async getEmbedding(text: string): Promise<number[]> {
    const apiKey = env.googleGeminiApiKey;
    if (!apiKey) {
      return this.fallback.getEmbedding(text);
    }

    const cacheKey = "gemini_" + (text.length <= 800 ? text : text.slice(0, 400) + text.length);
    const cached = getCachedVector(cacheKey);
    if (cached) return cached;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "models/text-embedding-004",
            content: { parts: [{ text: text.slice(0, 2048) }] },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        return this.fallback.getEmbedding(text);
      }

      const data = await response.json();
      const values = data?.embedding?.values;
      if (Array.isArray(values) && values.length > 0) {
        setCachedVector(cacheKey, values);
        return values;
      }
      return this.fallback.getEmbedding(text);
    } catch {
      return this.fallback.getEmbedding(text);
    }
  }

  async computeSimilarity(textA: string, textB: string, precomputedTfidf?: number): Promise<number> {
    try {
      const [embA, embB] = await Promise.all([this.getEmbedding(textA), this.getEmbedding(textB)]);
      const cosine = vectorCosineSimilarity(embA, embB);
      if (cosine > 0) {
        // Calibration for text-embedding-004
        const calibrated = Math.round(Math.max(0, Math.min(1, (cosine - 0.35) / 0.55)) * 100);
        return calibrated;
      }
    } catch (e) {
      console.warn("Gemini embedding failed, using fallback:", e);
    }
    return this.fallback.computeSimilarity(textA, textB, precomputedTfidf);
  }
}

/**
 * Returns the configured embedding provider.
 */
export function getEmbeddingProvider(): EmbeddingProvider {
  if (env.googleGeminiApiKey) {
    return new GeminiEmbeddingProvider();
  }
  return new DeterministicNgramEmbeddingProvider();
}

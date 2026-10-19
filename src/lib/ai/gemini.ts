import type {
  AIProvider,
  RecruiterSimResult,
  LinkedInAnalysisResult,
  InterviewPrepResult,
  SalaryInsightResult,
} from "./provider";
import type { AnalysisResult } from "@/types/analysis";
import type { ParsedResume } from "@/types/resume";
import type { TailoredResumeData } from "./schemas/tailored-resume";
import { buildAnalysisPrompt } from "./prompts/ats-analysis";
import { buildResumeParserPrompt } from "./prompts/resume-parser";
import { buildResumeTailorPrompt } from "./prompts/resume-tailor";
import { buildCoverLetterPrompt } from "./prompts/cover-letter";
import { buildRecruiterSimPrompt } from "./prompts/recruiter-sim";
import { buildLinkedInAnalyzerPrompt } from "./prompts/linkedin-analyzer";
import { buildInterviewGeneratorPrompt } from "./prompts/interview-generator";
import { buildSalaryInsightsPrompt } from "./prompts/salary-insights";

import { env } from "@/lib/env";
import { HeuristicAIProvider } from "./heuristic";

export class GeminiProvider implements AIProvider {
  private apiKey: string;
  private primaryModel: string;
  private fallbackModels: string[];

  constructor() {
    this.apiKey = env.googleGeminiApiKey;
    this.primaryModel = "gemini-2.5-flash";
    this.fallbackModels = [
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-2.5-pro",
      "gemini-1.5-flash-8b",
      "gemini-2.0-flash-exp",
    ];
  }

  private fallbackProvider = new HeuristicAIProvider();

  async analyze(
    resumeText: string,
    jobDescription: string
  ): Promise<AnalysisResult> {
    try {
      const prompt = buildAnalysisPrompt(resumeText, jobDescription);
      const response = await this.callAPI(prompt);
      return JSON.parse(response) as AnalysisResult;
    } catch (err) {
      console.warn("Gemini API call failed, using intelligent heuristic fallback:", err);
      return this.fallbackProvider.analyze(resumeText, jobDescription);
    }
  }

  async extractFields(resumeText: string): Promise<ParsedResume> {
    try {
      const prompt = buildResumeParserPrompt(resumeText);
      const response = await this.callAPI(prompt);
      return JSON.parse(response) as ParsedResume;
    } catch (err) {
      console.warn("Gemini API call failed, using intelligent heuristic fallback:", err);
      return this.fallbackProvider.extractFields(resumeText);
    }
  }

  async tailorResume(
    resumeText: string,
    jobDescription: string,
    targetRole?: string,
    targetCompany?: string
  ): Promise<TailoredResumeData> {
    try {
      const prompt = buildResumeTailorPrompt(
        resumeText,
        jobDescription,
        targetRole,
        targetCompany
      );
      const response = await this.callAPI(prompt);
      return JSON.parse(response) as TailoredResumeData;
    } catch (err) {
      console.warn("Gemini API call failed, using intelligent heuristic fallback:", err);
      return this.fallbackProvider.tailorResume(
        resumeText,
        jobDescription,
        targetRole,
        targetCompany
      );
    }
  }

  async generateCoverLetter(
    resumeText: string,
    jobDescription: string,
    targetCompany: string,
    targetRole: string,
    tone?: string,
    length?: string
  ): Promise<string> {
    try {
      const prompt = buildCoverLetterPrompt(
        resumeText,
        jobDescription,
        targetCompany,
        targetRole,
        tone,
        length
      );
      return await this.callAPI(prompt, false);
    } catch (err) {
      console.warn("Gemini API call failed, using intelligent heuristic fallback:", err);
      return this.fallbackProvider.generateCoverLetter(
        resumeText,
        jobDescription,
        targetCompany,
        targetRole,
        tone,
        length
      );
    }
  }

  async simulateRecruiterReview(
    resumeText: string,
    jobDescription: string
  ): Promise<RecruiterSimResult> {
    try {
      const prompt = buildRecruiterSimPrompt(resumeText, jobDescription);
      const response = await this.callAPI(prompt);
      return JSON.parse(response) as RecruiterSimResult;
    } catch (err) {
      console.warn("Gemini API call failed, using intelligent heuristic fallback:", err);
      return this.fallbackProvider.simulateRecruiterReview(resumeText, jobDescription);
    }
  }

  async analyzeLinkedIn(profileContent: string): Promise<LinkedInAnalysisResult> {
    try {
      const prompt = buildLinkedInAnalyzerPrompt(profileContent);
      const response = await this.callAPI(prompt);
      return JSON.parse(response) as LinkedInAnalysisResult;
    } catch (err) {
      console.warn("Gemini API call failed, using intelligent heuristic fallback:", err);
      return this.fallbackProvider.analyzeLinkedIn(profileContent);
    }
  }

  async generateInterviewQuestions(
    targetRole: string,
    company?: string,
    jobDescription?: string,
    resumeText?: string
  ): Promise<InterviewPrepResult> {
    try {
      const prompt = buildInterviewGeneratorPrompt(targetRole, company, jobDescription, resumeText);
      const response = await this.callAPI(prompt);
      return JSON.parse(response) as InterviewPrepResult;
    } catch (err) {
      console.warn("Gemini API call failed, using intelligent heuristic fallback:", err);
      return this.fallbackProvider.generateInterviewQuestions(
        targetRole,
        company,
        jobDescription,
        resumeText
      );
    }
  }

  async getSalaryInsights(
    role: string,
    location: string,
    experience: string
  ): Promise<SalaryInsightResult> {
    try {
      const prompt = buildSalaryInsightsPrompt(role, location, experience);
      const response = await this.callAPI(prompt);
      return JSON.parse(response) as SalaryInsightResult;
    } catch (err) {
      console.warn("Gemini API call failed, using intelligent heuristic fallback:", err);
      return this.fallbackProvider.getSalaryInsights(role, location, experience);
    }
  }

  private async callAPI(prompt: string, jsonMode: boolean = true): Promise<string> {
    if (!this.apiKey || this.apiKey.trim() === "") {
      throw new Error(
        "Google Gemini API key is missing. Please set GOOGLE_GEMINI_API_KEY in your .env file."
      );
    }

    const modelsToTry = [this.primaryModel, ...this.fallbackModels];
    let lastError: Error | null = null;
    let hitRateLimit = false;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 8000,
              ...(jsonMode ? { responseMimeType: "application/json" } : {}),
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`Gemini API error for model ${model}: ${response.status} - ${errorText}`);

          if (response.status === 429 || errorText.includes("429") || errorText.includes("RESOURCE_EXHAUSTED")) {
            hitRateLimit = true;
          }

          lastError = new Error(`Gemini API error (${model}): ${response.status} - ${errorText}`);
          continue;
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!content) {
          throw new Error(`Empty response content from Gemini API (${model})`);
        }
        return content;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    if (hitRateLimit) {
      throw new Error(
        "Gemini AI free tier quota limit reached (429 Resource Exhausted). Please wait a few moments and try again."
      );
    }

    throw lastError || new Error("Failed to generate content with Gemini API");
  }
}

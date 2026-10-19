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

export class OpenAIProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = env.openaiApiKey;
    this.model = "gpt-4o";
  }

  async analyze(
    resumeText: string,
    jobDescription: string
  ): Promise<AnalysisResult> {
    const prompt = buildAnalysisPrompt(resumeText, jobDescription);
    const response = await this.callAPI(prompt);
    return JSON.parse(response) as AnalysisResult;
  }

  async extractFields(resumeText: string): Promise<ParsedResume> {
    const prompt = buildResumeParserPrompt(resumeText);
    const response = await this.callAPI(prompt);
    return JSON.parse(response) as ParsedResume;
  }

  async tailorResume(
    resumeText: string,
    jobDescription: string,
    targetRole?: string,
    targetCompany?: string
  ): Promise<TailoredResumeData> {
    const prompt = buildResumeTailorPrompt(
      resumeText,
      jobDescription,
      targetRole,
      targetCompany
    );
    const response = await this.callAPI(prompt);
    return JSON.parse(response) as TailoredResumeData;
  }

  async generateCoverLetter(
    resumeText: string,
    jobDescription: string,
    targetCompany: string,
    targetRole: string,
    tone?: string,
    length?: string
  ): Promise<string> {
    const prompt = buildCoverLetterPrompt(
      resumeText,
      jobDescription,
      targetCompany,
      targetRole,
      tone,
      length
    );
    return this.callAPI(prompt, false);
  }

  async simulateRecruiterReview(
    resumeText: string,
    jobDescription: string
  ): Promise<RecruiterSimResult> {
    const prompt = buildRecruiterSimPrompt(resumeText, jobDescription);
    const response = await this.callAPI(prompt);
    return JSON.parse(response) as RecruiterSimResult;
  }

  async analyzeLinkedIn(profileContent: string): Promise<LinkedInAnalysisResult> {
    const prompt = buildLinkedInAnalyzerPrompt(profileContent);
    const response = await this.callAPI(prompt);
    return JSON.parse(response) as LinkedInAnalysisResult;
  }

  async generateInterviewQuestions(
    targetRole: string,
    company?: string,
    jobDescription?: string,
    resumeText?: string
  ): Promise<InterviewPrepResult> {
    const prompt = buildInterviewGeneratorPrompt(targetRole, company, jobDescription, resumeText);
    const response = await this.callAPI(prompt);
    return JSON.parse(response) as InterviewPrepResult;
  }

  async getSalaryInsights(
    role: string,
    location: string,
    experience: string
  ): Promise<SalaryInsightResult> {
    const prompt = buildSalaryInsightsPrompt(role, location, experience);
    const response = await this.callAPI(prompt);
    return JSON.parse(response) as SalaryInsightResult;
  }

  private async callAPI(prompt: string, jsonMode: boolean = true): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "system",
            content: jsonMode
              ? "You are an expert AI Career Copilot. Return only valid JSON with no markdown formatting or code fences."
              : "You are an expert executive career coach.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 8000,
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

import type { AnalysisResult } from "@/types/analysis";
import type { ParsedResume } from "@/types/resume";
import type { TailoredResumeData } from "./schemas/tailored-resume";
import { env } from "@/lib/env";
import { GeminiProvider } from "./gemini";
import { OpenAIProvider } from "./openai";

export interface RecruiterSimResult {
  impressionScore: number;
  hiringConfidence: number;
  interviewChance: number;
  strengths: string[];
  weaknesses: string[];
  missingInfo: string[];
  overallImpression: string;
}

export interface LinkedInAnalysisResult {
  recruiterScore: number;
  currentHeadline?: string;
  suggestedHeadline: string;
  currentAbout?: string;
  suggestedAbout: string;
  missingKeywords: string[];
  networkingTips: string[];
}

export interface InterviewQuestionItem {
  question: string;
  category: string;
  difficulty: string;
  answerGuidance: string;
  keyPoints: string[];
}

export interface InterviewPrepResult {
  technical: InterviewQuestionItem[];
  behavioral: InterviewQuestionItem[];
  systemDesign: InterviewQuestionItem[];
}

export interface SalaryInsightResult {
  role: string;
  location: string;
  experience: string;
  averageSalary: number;
  medianSalary: number;
  top10Percent: number;
  marketDemand: string;
  growthPotential: string;
  topPayingSkills: string[];
  benefitsSummary: string;
}

export interface AIProvider {
  analyze(resume: string, jobDescription: string): Promise<AnalysisResult>;
  extractFields(resumeText: string): Promise<ParsedResume>;
  tailorResume(
    resumeText: string,
    jobDescription: string,
    targetRole?: string,
    targetCompany?: string
  ): Promise<TailoredResumeData>;
  generateCoverLetter(
    resumeText: string,
    jobDescription: string,
    targetCompany: string,
    targetRole: string,
    tone?: string,
    length?: string
  ): Promise<string>;
  simulateRecruiterReview(
    resumeText: string,
    jobDescription: string
  ): Promise<RecruiterSimResult>;
  analyzeLinkedIn(profileContent: string): Promise<LinkedInAnalysisResult>;
  generateInterviewQuestions(
    targetRole: string,
    company?: string,
    jobDescription?: string,
    resumeText?: string
  ): Promise<InterviewPrepResult>;
  getSalaryInsights(
    role: string,
    location: string,
    experience: string
  ): Promise<SalaryInsightResult>;
}

export type AIProviderType = "openai" | "gemini";

export function getAIProvider(): AIProvider {
  const provider = (env.aiProvider || "gemini") as AIProviderType;

  switch (provider) {
    case "gemini": {
      return new GeminiProvider();
    }
    case "openai":
    default: {
      return new OpenAIProvider();
    }
  }
}

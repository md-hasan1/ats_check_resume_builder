export type MatchType = "exact" | "normalized" | "alias" | "semantic" | "missing";

export interface KeywordMatchItem {
  keyword: string;
  status: "matched" | "missing";
  matchType: MatchType;
  category?: string;
  importance?: "high" | "medium" | "low";
  foundInContext?: string;
}

export interface SkillMatchItem {
  skill: string;
  matched: boolean;
  matchType: MatchType;
  importance: "required" | "preferred" | "optional";
  evidence?: string;
}

export interface SkillMatchSummary {
  requiredScore: number;
  preferredScore: number;
  overallScore: number;
  matched: SkillMatchItem[];
  missing: SkillMatchItem[];
  preferred: SkillMatchItem[];
}

export interface ExperienceRequirement {
  requirement: string;
  requiredYears?: number;
  candidateYears?: number;
  matched: boolean | "unknown";
  evidence?: string;
}

export interface ExperienceMatchSummary {
  matchScore: number;
  candidateTotalYears: number;
  requiredYears?: number;
  requirements: ExperienceRequirement[];
  roleAlignment: string;
}

export interface FormattingIssue {
  type: "table" | "image" | "columns" | "length" | "headings" | "contact" | "symbols" | "readability";
  severity: "error" | "warning" | "info";
  message: string;
  suggestion?: string;
}

export interface FormattingSummary {
  score: number;
  issues: FormattingIssue[];
  positiveSignals: string[];
}

export interface ScoreBreakdown {
  keywordMatch: number;      // 30%
  semanticSimilarity: number;// 25%
  skillMatch: number;        // 20%
  experienceMatch: number;   // 15%
  formatting: number;        // 10%
}

export interface ATSRecommendation {
  id: string;
  category: "skill" | "keyword" | "experience" | "formatting" | "general";
  importance: "high" | "medium" | "low";
  title: string;
  message: string;
  actionableStep: string;
}

export interface ParsedContact {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface WorkExperienceItem {
  company?: string;
  jobTitle?: string;
  startDate?: string;
  endDate?: string;
  durationMonths?: number;
  description: string;
  technologies: string[];
  responsibilities: string[];
  achievements: string[];
}

export interface EducationItem {
  institution?: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
}

export interface ParsedResumeData {
  contact: ParsedContact;
  summary: string;
  skills: string[];
  experience: WorkExperienceItem[];
  education: EducationItem[];
  projects: { name: string; description: string; technologies: string[] }[];
  certifications: string[];
  sections: { name: string; present: boolean; rawLength: number }[];
}

export interface JobAnalysisResult {
  jobTitle?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  technologies: string[];
  responsibilities: string[];
  qualifications: string[];
  educationRequirements: string[];
  experienceYears?: number;
  certifications: string[];
  softSkills: string[];
  keywords: string[];
}

export interface ATSReport {
  analysisId: string;
  overallScore: number;
  methodologyNotice: string;
  breakdown: ScoreBreakdown;
  matchedKeywords: KeywordMatchItem[];
  missingKeywords: KeywordMatchItem[];
  skills: SkillMatchSummary;
  experience: ExperienceMatchSummary;
  formatting: FormattingSummary;
  recommendations: ATSRecommendation[];
  resume: ParsedResumeData;
  job: {
    title?: string;
    experienceYears?: number;
    requiredSkillsCount: number;
    preferredSkillsCount: number;
  };
  metadata: {
    createdAt: string;
    processingTimeMs: number;
    engineVersion: string;
  };
}

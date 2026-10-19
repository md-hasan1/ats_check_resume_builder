// ============================================================
// Analysis Result Types
// ============================================================

export interface AnalysisResult {
  overallScore: number;
  categories: ScoreCategory[];
  keywordAnalysis: KeywordAnalysis;
  skillsAnalysis: SkillsAnalysis;
  experienceAnalysis: ExperienceAnalysis;
  educationAnalysis: EducationAnalysis;
  formattingAnalysis: FormattingAnalysis;
  grammarAnalysis: GrammarAnalysis;
  readabilityAnalysis: ReadabilityAnalysis;
  atsCompatibility: ATSCompatibility;
  sectionDetection: SectionDetection;
  aiSuggestions: AISuggestion[];
  actionVerbSuggestions: ActionVerbSuggestion[];
  matchPercentages: MatchPercentages;
  summary: string;
}

export interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  description: string;
  icon: string;
}

export interface KeywordAnalysis {
  score: number;
  totalKeywords: number;
  matchedKeywords: KeywordItem[];
  missingKeywords: KeywordItem[];
  keywordDensity: number;
  keywordPlacement: KeywordPlacement[];
}

export interface KeywordItem {
  keyword: string;
  count: number;
  importance: "high" | "medium" | "low";
  category: string;
}

export interface KeywordPlacement {
  keyword: string;
  locations: string[]; // e.g. ["summary", "experience"]
}

export interface SkillsAnalysis {
  score: number;
  hardSkills: SkillMatch[];
  softSkills: SkillMatch[];
  technicalSkills: SkillMatch[];
  tools: SkillMatch[];
  frameworks: SkillMatch[];
  languages: SkillMatch[];
  missingSkills: string[];
  recommendedSkills: string[];
}

export interface SkillMatch {
  skill: string;
  matched: boolean;
  proficiency?: string;
}

export interface ExperienceAnalysis {
  score: number;
  yearsOfExperience: number;
  relevantExperience: string;
  industryMatch: string;
  leadershipIndicators: string[];
  projects: string[];
  responsibilities: string[];
  achievements: string[];
  impactStatements: ImpactStatement[];
}

export interface ImpactStatement {
  original: string;
  hasMetrics: boolean;
  suggestion?: string;
}

export interface EducationAnalysis {
  score: number;
  degree: string;
  certifications: string[];
  relevantCoursework: string[];
  educationMatch: string;
}

export interface FormattingAnalysis {
  score: number;
  issues: FormattingIssue[];
  fonts: string;
  margins: string;
  alignment: string;
  hasTables: boolean;
  hasColumns: boolean;
  hasImages: boolean;
  hasIcons: boolean;
  hasHeaders: boolean;
  hasFooters: boolean;
  pageCount: number;
  spacing: string;
  bulletPoints: string;
}

export interface FormattingIssue {
  type: string;
  severity: "error" | "warning" | "info";
  message: string;
  suggestion: string;
}

export interface GrammarAnalysis {
  score: number;
  grammarMistakes: GrammarIssue[];
  spellingErrors: GrammarIssue[];
  repeatedWords: string[];
  passiveVoiceInstances: string[];
  weakVerbs: string[];
  longSentences: string[];
}

export interface GrammarIssue {
  text: string;
  suggestion: string;
  context: string;
}

export interface ReadabilityAnalysis {
  score: number;
  readingLevel: string;
  averageSentenceLength: number;
  averageParagraphLength: number;
  wordCount: number;
  sectionBalance: string;
}

export interface ATSCompatibility {
  score: number;
  checks: ATSCheck[];
}

export interface ATSCheck {
  name: string;
  passed: boolean;
  message: string;
  severity: "error" | "warning" | "info";
}

export interface SectionDetection {
  detected: DetectedSection[];
  missing: MissingSection[];
}

export interface DetectedSection {
  name: string;
  present: boolean;
  quality: "good" | "needs-improvement" | "poor";
}

export interface MissingSection {
  name: string;
  importance: "required" | "recommended" | "optional";
  reason: string;
}

export interface AISuggestion {
  type: "bullet" | "summary" | "skills" | "experience" | "formatting" | "general";
  original: string;
  improved: string;
  reason: string;
}

export interface ActionVerbSuggestion {
  weakVerb: string;
  strongVerbs: string[];
  context: string;
}

export interface MatchPercentages {
  overall: number;
  technical: number;
  softSkills: number;
  experience: number;
  education: number;
  keywords: number;
}

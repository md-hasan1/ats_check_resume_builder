import { z } from "zod";

export const CategoryScoreSchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  maxScore: z.number(),
  weight: z.number(),
  description: z.string(),
  icon: z.string(),
});

export const KeywordMatchSchema = z.object({
  keyword: z.string(),
  count: z.number(),
  importance: z.enum(["high", "medium", "low"]),
  category: z.string(),
});

export const MissingKeywordSchema = z.object({
  keyword: z.string(),
  importance: z.enum(["high", "medium", "low"]),
  category: z.string(),
});

export const KeywordAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  totalKeywords: z.number(),
  matchedKeywords: z.array(KeywordMatchSchema),
  missingKeywords: z.array(MissingKeywordSchema),
  keywordDensity: z.number(),
  keywordPlacement: z.array(
    z.object({
      keyword: z.string(),
      locations: z.array(z.string()),
    })
  ),
});

export const SkillMatchSchema = z.object({
  skill: z.string(),
  matched: z.boolean(),
});

export const SkillsAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  hardSkills: z.array(SkillMatchSchema),
  softSkills: z.array(SkillMatchSchema),
  technicalSkills: z.array(SkillMatchSchema),
  tools: z.array(SkillMatchSchema),
  frameworks: z.array(SkillMatchSchema),
  languages: z.array(SkillMatchSchema),
  missingSkills: z.array(z.string()),
  recommendedSkills: z.array(z.string()),
});

export const ImpactStatementSchema = z.object({
  original: z.string(),
  hasMetrics: z.boolean(),
  suggestion: z.string().optional(),
});

export const ExperienceAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  yearsOfExperience: z.number(),
  relevantExperience: z.string(),
  industryMatch: z.string(),
  leadershipIndicators: z.array(z.string()),
  projects: z.array(z.string()),
  responsibilities: z.array(z.string()),
  achievements: z.array(z.string()),
  impactStatements: z.array(ImpactStatementSchema),
});

export const EducationAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  degree: z.string(),
  certifications: z.array(z.string()),
  relevantCoursework: z.array(z.string()),
  educationMatch: z.string(),
});

export const FormattingIssueSchema = z.object({
  type: z.string(),
  severity: z.enum(["error", "warning", "info"]),
  message: z.string(),
  suggestion: z.string(),
});

export const FormattingAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  issues: z.array(FormattingIssueSchema),
  fonts: z.string(),
  margins: z.string(),
  alignment: z.string(),
  hasTables: z.boolean(),
  hasColumns: z.boolean(),
  hasImages: z.boolean(),
  hasIcons: z.boolean(),
  hasHeaders: z.boolean(),
  hasFooters: z.boolean(),
  pageCount: z.number(),
  spacing: z.string(),
  bulletPoints: z.string(),
});

export const GrammarMistakeSchema = z.object({
  text: z.string(),
  suggestion: z.string(),
  context: z.string(),
});

export const GrammarAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  grammarMistakes: z.array(GrammarMistakeSchema),
  spellingErrors: z.array(z.string()),
  repeatedWords: z.array(z.string()),
  passiveVoiceInstances: z.array(z.string()),
  weakVerbs: z.array(z.string()),
  longSentences: z.array(z.string()),
});

export const ReadabilityAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  readingLevel: z.string(),
  averageSentenceLength: z.number(),
  averageParagraphLength: z.number(),
  wordCount: z.number(),
  sectionBalance: z.string(),
});

export const ATSCheckSchema = z.object({
  name: z.string(),
  passed: z.boolean(),
  message: z.string(),
  severity: z.enum(["error", "warning", "info"]),
});

export const ATSCompatibilitySchema = z.object({
  score: z.number().min(0).max(100),
  checks: z.array(ATSCheckSchema),
});

export const DetectedSectionSchema = z.object({
  name: z.string(),
  present: z.boolean(),
  quality: z.enum(["good", "needs-improvement", "poor"]),
});

export const MissingSectionSchema = z.object({
  name: z.string(),
  importance: z.enum(["required", "recommended", "optional"]),
  reason: z.string(),
});

export const SectionDetectionSchema = z.object({
  detected: z.array(DetectedSectionSchema),
  missing: z.array(MissingSectionSchema),
});

export const AISuggestionSchema = z.object({
  type: z.enum(["bullet", "summary", "skills", "experience", "formatting"]),
  original: z.string(),
  improved: z.string(),
  reason: z.string(),
});

export const ActionVerbSuggestionSchema = z.object({
  weakVerb: z.string(),
  strongVerbs: z.array(z.string()),
  context: z.string(),
});

export const AnalysisResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  summary: z.string(),
  categories: z.array(CategoryScoreSchema),
  keywordAnalysis: KeywordAnalysisSchema,
  skillsAnalysis: SkillsAnalysisSchema,
  experienceAnalysis: ExperienceAnalysisSchema,
  educationAnalysis: EducationAnalysisSchema,
  formattingAnalysis: FormattingAnalysisSchema,
  grammarAnalysis: GrammarAnalysisSchema,
  readabilityAnalysis: ReadabilityAnalysisSchema,
  atsCompatibility: ATSCompatibilitySchema,
  sectionDetection: SectionDetectionSchema,
  aiSuggestions: z.array(AISuggestionSchema),
  actionVerbSuggestions: z.array(ActionVerbSuggestionSchema),
  matchPercentages: z.object({
    overall: z.number(),
    technical: z.number(),
    softSkills: z.number(),
    experience: z.number(),
    education: z.number(),
    keywords: z.number(),
  }),
});

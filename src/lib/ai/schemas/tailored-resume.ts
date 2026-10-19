import { z } from "zod";

export const TailoredBulletSchema = z.object({
  original: z.string(),
  tailored: z.string(),
  keywordsAdded: z.array(z.string()).default([]),
  reason: z.string(),
});

export const TailoredExperienceSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  dates: z.string().optional(),
  bullets: z.array(TailoredBulletSchema),
});

export const TailoredResumeSchema = z.object({
  versionName: z.string(),
  targetRole: z.string(),
  targetCompany: z.string().optional(),
  contactInfo: z.object({
    fullName: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
  }),
  summary: z.object({
    original: z.string().optional(),
    tailored: z.string(),
    reasoning: z.string(),
  }),
  skills: z.object({
    matchedSkills: z.array(z.string()),
    highlightedSkills: z.array(z.string()),
    recommendedMissingSkills: z.array(z.string()),
  }),
  experience: z.array(TailoredExperienceSchema),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      dates: z.string().optional(),
      details: z.string().optional(),
    })
  ),
  certifications: z.array(z.string()).default([]),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      impact: z.string().optional(),
    })
  ).default([]),
  diffHighlights: z.object({
    addedKeywordsCount: z.number(),
    improvedBulletsCount: z.number(),
    estimatedScoreIncrease: z.number(),
  }),
});

export type TailoredResumeData = z.infer<typeof TailoredResumeSchema>;

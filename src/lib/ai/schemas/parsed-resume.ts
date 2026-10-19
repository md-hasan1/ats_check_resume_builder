import { z } from "zod";

export const ContactInfoSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  website: z.string().optional(),
});

export const WorkExperienceSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
  description: z.string().optional(),
  bulletPoints: z.array(z.string()).default([]),
});

export const EducationSchema = z.object({
  degree: z.string(),
  fieldOfStudy: z.string().optional(),
  institution: z.string(),
  location: z.string().optional(),
  graduationDate: z.string().optional(),
  gpa: z.string().optional(),
});

export const ParsedResumeSchema = z.object({
  contactInfo: ContactInfoSchema,
  summary: z.string().optional(),
  skills: z.array(z.string()).default([]),
  experience: z.array(WorkExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  certifications: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
});

import { z } from "zod";

export const uploadFileSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024,
    "File size must be less than 10MB"
  ).refine(
    (file) =>
      [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ].includes(file.type),
    "Only PDF, DOCX, and DOC files are accepted"
  ),
});

export const analyzeSchema = z.object({
  resumeId: z.string().min(1, "Resume ID is required"),
  jobDescription: z.string().min(50, "Job description must be at least 50 characters"),
  jobTitle: z.string().optional(),
  jobUrl: z.string().url().optional().or(z.literal("")),
});

export type UploadFileInput = z.infer<typeof uploadFileSchema>;
export type AnalyzeInput = z.infer<typeof analyzeSchema>;

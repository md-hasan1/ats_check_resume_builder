import { z } from "zod";

export const uploadSchema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File, "Please select a file")
    .refine(
      (file) => file instanceof File && file.size <= 10 * 1024 * 1024,
      "File must be less than 10MB"
    )
    .refine(
      (file) =>
        file instanceof File &&
        ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"].includes(file.type),
      "Only PDF, DOCX, and DOC files are supported"
    ),
});

export const analyzeSchema = z.object({
  resumeId: z.string().min(1, "Resume ID is required"),
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters")
    .max(50000, "Job description is too long"),
  jobTitle: z.string().max(200).optional(),
  jobUrl: z.string().url().optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const settingsSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  notifications: z.boolean().optional(),
  language: z.string().max(10).optional(),
});

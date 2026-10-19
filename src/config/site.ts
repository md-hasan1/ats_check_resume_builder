import { getBaseUrl } from "@/lib/env";

export const siteConfig = {
  name: "ResumeAI",
  description:
    "Beat every ATS before you apply. Upload your resume, compare it with any job description, and receive an AI-powered ATS score with actionable improvements.",
  url: getBaseUrl(),
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/resumeai",
    github: "https://github.com/resumeai",
  },
  creator: "ResumeAI",
  keywords: [
    "ATS resume checker",
    "resume scanner",
    "ATS score",
    "resume optimizer",
    "job application",
    "keyword matching",
    "resume analysis",
    "AI resume review",
  ],
};

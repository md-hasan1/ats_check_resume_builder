// ============================================================
// Parsed Resume Types
// ============================================================

export interface ParsedResume {
  contactInfo: ContactInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillsSection;
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  achievements: string[];
  volunteer: VolunteerEntry[];
  interests: string[];
  references: string[];
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ExperienceEntry {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bullets: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  coursework: string[];
}

export interface SkillsSection {
  technical: string[];
  soft: string[];
  tools: string[];
  frameworks: string[];
  languages: string[];
  other: string[];
}

export interface ProjectEntry {
  name: string;
  description: string;
  technologies: string[];
  url: string;
  bullets: string[];
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface LanguageEntry {
  language: string;
  proficiency: string;
}

export interface VolunteerEntry {
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

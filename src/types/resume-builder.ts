export interface PersonalInfo {
  fullName: string;
  jobTitle?: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  profileImage?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  jobTitle: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description: string;
  achievements?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  gpa?: string;
  description?: string;
}

export interface SkillItem {
  name: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  organization: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface LanguageItem {
  language: string;
  proficiency: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  content: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  summary?: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  awards?: AwardItem[];
  customSections?: CustomSectionItem[];
}

export interface ResumeCustomization {
  primaryColor: string;
  fontFamily: string;
  fontSize: "sm" | "base" | "lg";
  lineSpacing: "tight" | "normal" | "relaxed";
  marginSize: "compact" | "normal" | "spacious";
  showIcons: boolean;
  sectionOrder?: string[];
}

export interface BuilderTemplateMeta {
  id: string;
  name: string;
  category: string[];
  description: string;
  layout:
    | "single-column"
    | "left-sidebar-dark"
    | "right-sidebar"
    | "top-hero-banner"
    | "compact-grid"
    | "serif-academic-classic"
    | "executive-gold-frame"
    | "creative-pill-modern"
    | "minimal-linear-ats"
    | "timeline-modern";
  primaryColor: string;
  isPremium: boolean;
  atsFriendly: boolean;
  pages: "one-page" | "two-page";
  tags: string[];
}

export interface StoredBuilderResume {
  id: string;
  title: string;
  templateId: string;
  customization: ResumeCustomization;
  data: ResumeData;
  updatedAt: string;
  createdAt: string;
}

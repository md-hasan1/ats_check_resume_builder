import type {
  ParsedContact,
  WorkExperienceItem,
  EducationItem,
  ParsedResumeData,
} from "./types";
import { detectResumeSections, type DetectedSectionsMap } from "./section-detector";
import { ALIAS_TO_CANONICAL, simplifyAlias } from "./aliases";
import { normalizeText } from "./normalizer";
import { AtsDocumentIndex, createAtsDocumentIndex } from "./document-indexer";

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)\/?/i;
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)\/?/i;

const DEGREE_REGEX = /\b(?:Bachelor(?:'s)?|Master(?:'s)?|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|Ph\.?D\.?|Associate(?:'s)?|Diploma)\b[^\n,.]*/i;
const DATE_RANGE_REGEX = /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\b\d{4})\s*[-–—to]+\s*(?:Present|Current|Now|\b\d{4}|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4})/i;

/**
 * Extracts technologies from a text paragraph using O(1) n-gram token lookups.
 * Eliminates repeated regex creation across paragraphs.
 */
function extractTechFromParagraph(text: string): string[] {
  const words = text.match(/[A-Za-z0-9+#]+(?:[\.\-_/][A-Za-z0-9+#]+)*/g) || [];
  if (words.length === 0) return [];

  const found = new Set<string>();
  const maxNgram = 4;
  const len = words.length;

  for (let i = 0; i < len; i++) {
    let simplifiedPhrase = "";
    for (let n = 1; n <= maxNgram && i + n - 1 < len; n++) {
      simplifiedPhrase += simplifyAlias(words[i + n - 1]);
      const canonical = ALIAS_TO_CANONICAL.get(simplifiedPhrase);
      if (canonical) {
        found.add(canonical);
      }
    }
  }

  return Array.from(found);
}

/**
 * Extracts contact information from header or full text.
 */
export function extractContactInfo(headerText: string, fullText: string): ParsedContact {
  const searchArea = (headerText ? headerText + "\n" : "") + fullText.slice(0, 1500);

  const emailMatch = searchArea.match(EMAIL_REGEX);
  const phoneMatch = searchArea.match(PHONE_REGEX);
  const linkedinMatch = searchArea.match(LINKEDIN_REGEX);
  const githubMatch = searchArea.match(GITHUB_REGEX);

  // Extract name (usually first non-empty line of the resume before email/phone)
  let name: string | undefined;
  const lines = (headerText || fullText).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    if (
      line.length >= 2 &&
      line.length <= 40 &&
      !line.includes("@") &&
      !line.match(PHONE_REGEX) &&
      !line.toLowerCase().includes("curriculum") &&
      !line.toLowerCase().includes("resume") &&
      !line.toLowerCase().includes("http")
    ) {
      name = line;
      break;
    }
  }

  // Location heuristics
  let location: string | undefined;
  const locationMatch = searchArea.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}\b|[A-Z][a-zA-Z\s]+,\s*[A-Za-z\s]+(?:USA|Canada|UK|Germany|India|Bangladesh|Remote))/);
  if (locationMatch) {
    location = locationMatch[0].trim();
  }

  return {
    name,
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
    github: githubMatch ? githubMatch[0] : undefined,
    location,
  };
}

/**
 * Extracts skills mentioned anywhere in the resume or specifically in the skills section.
 */
export function extractSkillsFromSections(
  sectionMap: DetectedSectionsMap,
  rawText: string,
  index?: AtsDocumentIndex
): string[] {
  const foundSkills = new Set<string>();

  // 1. Get canonical skills discovered by index if available
  if (index) {
    for (const skill of index.getDetectedSkills()) {
      foundSkills.add(skill);
    }
  } else {
    for (const skill of extractTechFromParagraph(rawText)) {
      foundSkills.add(skill);
    }
  }

  // 2. If skills section is defined, also extract comma or bullet separated items
  if (sectionMap.skills) {
    const lines = sectionMap.skills.split(/\r?\n/);
    for (const line of lines) {
      const parts = line.replace(/^[•\-\*\d\.\s]+/, "").split(/[,|•/]/);
      for (const part of parts) {
        const item = part.trim();
        if (item.length >= 2 && item.length <= 35 && !item.includes(".")) {
          foundSkills.add(item);
        }
      }
    }
  }

  return Array.from(foundSkills);
}

/**
 * Extracts work experience entries with bullet points, technologies, and achievements.
 */
export function extractExperienceEntries(experienceText: string): WorkExperienceItem[] {
  if (!experienceText || experienceText.trim().length === 0) {
    return [];
  }

  const entries: WorkExperienceItem[] = [];
  const paragraphs = experienceText.split(/\n\s*\n+/);

  for (const para of paragraphs) {
    const lines = para.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const firstLine = lines[0];
    const dateMatch = para.match(DATE_RANGE_REGEX);

    let jobTitle = firstLine;
    let company: string | undefined;

    if (firstLine.includes(" - ") || firstLine.includes(" at ")) {
      const parts = firstLine.split(/\s+[-–—]\s+|\s+at\s+/i);
      jobTitle = parts[0]?.trim();
      company = parts[1]?.trim();
    } else if (lines.length > 1 && !lines[1].startsWith("•") && !lines[1].startsWith("-") && !lines[1].startsWith("*")) {
      company = lines[1];
    }

    const bullets = lines
      .filter((l) => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"))
      .map((l) => l.replace(/^[•\-\*\s]+/, "").trim());

    // Extract technologies mentioned in this paragraph without dynamic RegExp compilation
    const technologies = extractTechFromParagraph(para);

    entries.push({
      jobTitle,
      company,
      startDate: dateMatch ? dateMatch[0].split(/[-–—to]+/)[0]?.trim() : undefined,
      endDate: dateMatch ? dateMatch[0].split(/[-–—to]+/)[1]?.trim() : undefined,
      description: lines.join(" "),
      responsibilities: bullets.length > 0 ? bullets : lines.slice(1),
      technologies,
      achievements: bullets.filter((b) => /\d+%|\$\d+|\bincreased\b|\bdecreased\b|\breduced\b|\bscaled\b/i.test(b)),
    });
  }

  return entries;
}

/**
 * Extracts education entries.
 */
export function extractEducationEntries(educationText: string): EducationItem[] {
  if (!educationText || educationText.trim().length === 0) {
    return [];
  }

  const entries: EducationItem[] = [];
  const lines = educationText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const degreeMatch = line.match(DEGREE_REGEX);

    if (degreeMatch) {
      const institution = lines[i + 1] && !lines[i + 1].match(DEGREE_REGEX) ? lines[i + 1] : undefined;
      const dateMatch = line.match(/\b(19\d{2}|20\d{2})\b/);

      entries.push({
        degree: degreeMatch[0].trim(),
        institution,
        endDate: dateMatch ? dateMatch[0] : undefined,
      });
    }
  }

  if (entries.length === 0 && lines.length > 0) {
    entries.push({
      degree: lines[0],
      institution: lines[1] || undefined,
    });
  }

  return entries;
}

/**
 * Main parser combining all resume information extraction steps.
 * Accepts optional pre-computed document index to avoid duplicate parsing.
 */
export function extractResumeInformation(
  rawText: string,
  existingIndex?: AtsDocumentIndex
): ParsedResumeData {
  const index = existingIndex || createAtsDocumentIndex(rawText);
  const { sections, sectionMap } = detectResumeSections(rawText);
  const contact = extractContactInfo(sectionMap.contact, rawText);
  const skills = extractSkillsFromSections(sectionMap, rawText, index);
  const experience = extractExperienceEntries(sectionMap.experience);
  const education = extractEducationEntries(sectionMap.education);

  return {
    contact,
    summary: sectionMap.summary || "",
    skills,
    experience,
    education,
    projects: [],
    certifications: sectionMap.certifications
      ? sectionMap.certifications.split(/\r?\n/).map((l) => l.replace(/^[•\-\*\s]+/, "").trim()).filter(Boolean)
      : [],
    sections: sections.map((s) => ({
      name: s.name,
      present: s.content.trim().length > 0,
      rawLength: s.content.length,
    })),
  };
}

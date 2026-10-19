export type CanonicalSectionName =
  | "contact"
  | "summary"
  | "skills"
  | "experience"
  | "education"
  | "projects"
  | "certifications"
  | "awards"
  | "languages"
  | "other";

export interface DetectedSectionBoundary {
  name: CanonicalSectionName;
  originalHeading: string;
  startIndex: number;
  endIndex: number;
  content: string;
}

export interface DetectedSectionsMap {
  contact: string;
  summary: string;
  skills: string;
  experience: string;
  education: string;
  projects: string;
  certifications: string;
  awards: string;
  languages: string;
  other: string;
}

const SECTION_PATTERNS: { name: CanonicalSectionName; regex: RegExp }[] = [
  {
    name: "summary",
    regex: /^(?:professional\s+summary|summary|profile|about\s+me|career\s+objective|objective|executive\s+summary)$/i,
  },
  {
    name: "skills",
    regex: /^(?:technical\s+skills|core\s+competencies|skills\s*(?:&|and)\s*abilities|skills|technologies|tech\s+stack|tools\s*(?:&|and)\s*technologies|areas\s+of\s+expertise)$/i,
  },
  {
    name: "experience",
    regex: /^(?:work\s+experience|professional\s+experience|employment\s+history|experience|work\s+history|career\s+history|relevant\s+experience)$/i,
  },
  {
    name: "education",
    regex: /^(?:education|academic\s+background|academic\s+history|degrees|educational\s+background)$/i,
  },
  {
    name: "projects",
    regex: /^(?:projects|key\s+projects|personal\s+projects|technical\s+projects|academic\s+projects)$/i,
  },
  {
    name: "certifications",
    regex: /^(?:certifications|certificates|licenses\s*(?:&|and)\s*certifications|professional\s+certifications)$/i,
  },
  {
    name: "awards",
    regex: /^(?:awards|achievements|honors\s*(?:&|and)\s*awards|accomplishments)$/i,
  },
  {
    name: "languages",
    regex: /^(?:languages|language\s+proficiency)$/i,
  },
];

/**
 * Parses raw resume text, discovers sections using deterministic heading patterns,
 * and splits text into structured section blocks.
 */
export function detectResumeSections(rawText: string): {
  sections: DetectedSectionBoundary[];
  sectionMap: DetectedSectionsMap;
} {
  const lines = rawText.split(/\r?\n/);
  const headings: { lineIndex: number; name: CanonicalSectionName; original: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    // Headings are typically short lines without sentence-ending punctuation
    if (rawLine.length >= 3 && rawLine.length <= 45 && !rawLine.endsWith(".")) {
      const cleanLine = rawLine.replace(/^[\#\*\-\s]+/, "").replace(/[:]+$/, "").trim();

      for (const pattern of SECTION_PATTERNS) {
        if (pattern.regex.test(cleanLine)) {
          headings.push({
            lineIndex: i,
            name: pattern.name,
            original: rawLine,
          });
          break;
        }
      }
    }
  }

  const sectionMap: DetectedSectionsMap = {
    contact: "",
    summary: "",
    skills: "",
    experience: "",
    education: "",
    projects: "",
    certifications: "",
    awards: "",
    languages: "",
    other: "",
  };

  const sections: DetectedSectionBoundary[] = [];

  // Content before the first detected section heading is usually contact/header info
  const firstHeadingLine = headings.length > 0 ? headings[0].lineIndex : lines.length;
  const headerLines = lines.slice(0, firstHeadingLine).join("\n").trim();
  if (headerLines) {
    sectionMap.contact = headerLines;
    sections.push({
      name: "contact",
      originalHeading: "Contact Information",
      startIndex: 0,
      endIndex: firstHeadingLine,
      content: headerLines,
    });
  }

  // Iterate over detected headings to slice section contents
  for (let i = 0; i < headings.length; i++) {
    const current = headings[i];
    const nextLineIndex = i + 1 < headings.length ? headings[i + 1].lineIndex : lines.length;
    const content = lines.slice(current.lineIndex + 1, nextLineIndex).join("\n").trim();

    sections.push({
      name: current.name,
      originalHeading: current.original,
      startIndex: current.lineIndex,
      endIndex: nextLineIndex,
      content,
    });

    // If section appears multiple times, append content
    if (sectionMap[current.name]) {
      sectionMap[current.name] += "\n\n" + content;
    } else {
      sectionMap[current.name] = content;
    }
  }

  // If no sections could be identified by headings, put all text into other
  if (headings.length === 0) {
    sectionMap.other = rawText;
  }

  return { sections, sectionMap };
}

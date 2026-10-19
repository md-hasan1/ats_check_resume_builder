import type { FormattingIssue, FormattingSummary, ParsedResumeData } from "./types";

/**
 * Deterministic ATS formatting analyzer.
 * Evaluates document layout cues, headings, contact availability, and potential parsing hazards.
 */
export function checkResumeFormatting(
  rawText: string,
  resumeData: ParsedResumeData
): FormattingSummary {
  const issues: FormattingIssue[] = [];
  const positiveSignals: string[] = [];
  let score = 100;

  // 1. Contact Information Checks
  if (resumeData.contact.email) {
    positiveSignals.push("Valid email address detected");
  } else {
    score -= 15;
    issues.push({
      type: "contact",
      severity: "error",
      message: "No email address found in the contact section.",
      suggestion: "Place your professional email clearly at the top of the resume.",
    });
  }

  if (resumeData.contact.phone) {
    positiveSignals.push("Phone number detected");
  } else {
    score -= 10;
    issues.push({
      type: "contact",
      severity: "warning",
      message: "No phone number was clearly identified.",
      suggestion: "Include a standard formatted phone number for recruiter contact.",
    });
  }

  // 2. Standard Resume Sections
  const detectedSections = resumeData.sections.filter((s) => s.present);
  const sectionNames = new Set(detectedSections.map((s) => s.name));

  if (sectionNames.has("experience")) {
    positiveSignals.push("Standard Work Experience section identified");
  } else {
    score -= 15;
    issues.push({
      type: "headings",
      severity: "error",
      message: "No clear Work Experience heading detected.",
      suggestion: "Use standard headings such as 'Work Experience' or 'Professional Experience'.",
    });
  }

  if (sectionNames.has("skills")) {
    positiveSignals.push("Standard Skills section identified");
  } else {
    score -= 10;
    issues.push({
      type: "headings",
      severity: "warning",
      message: "No dedicated Skills section identified.",
      suggestion: "Add a clear 'Skills' or 'Technical Skills' section so ATS scanners can parse competencies.",
    });
  }

  if (sectionNames.has("education")) {
    positiveSignals.push("Education section identified");
  } else {
    score -= 5;
    issues.push({
      type: "headings",
      severity: "info",
      message: "No clear Education heading detected.",
      suggestion: "Add an 'Education' section with your degree and institution.",
    });
  }

  // 3. Document Length & Word Count
  const words = rawText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 150) {
    score -= 20;
    issues.push({
      type: "length",
      severity: "error",
      message: `Resume content is unusually brief (${wordCount} words).`,
      suggestion: "Provide sufficient detail on your project outcomes, technologies, and achievements.",
    });
  } else if (wordCount > 1800) {
    score -= 8;
    issues.push({
      type: "length",
      severity: "warning",
      message: `Resume is lengthy (${wordCount} words, likely 3+ pages).`,
      suggestion: "Aim for a concise 1-2 page resume focused on relevant qualifications.",
    });
  } else {
    positiveSignals.push(`Optimal word count (${wordCount} words)`);
  }

  // 4. Tables / Multi-column indicators in raw text
  const linesWithPipes = rawText.split(/\r?\n/).filter((l) => (l.match(/\|/g) || []).length >= 2);
  const hasPipeTables = linesWithPipes.length >= 2;
  const hasAsciiBorders = /\+[-=]{2,}\+/.test(rawText);

  if (hasPipeTables || hasAsciiBorders) {
    score -= 10;
    issues.push({
      type: "table",
      severity: "warning",
      message: "Tables or multi-column grids detected. Some ATS parsers may scramble horizontal cell text.",
      suggestion: "Consider using simple single-column text formatting with standard bullet points.",
    });
  } else {
    positiveSignals.push("Single-column friendly layout structure");
  }

  // 5. Special symbols and unusual characters
  const unusualChars = rawText.match(/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/g);
  if (unusualChars && unusualChars.length > 5) {
    score -= 10;
    issues.push({
      type: "symbols",
      severity: "warning",
      message: "Unusual or corrupted special symbols detected in the document text.",
      suggestion: "Stick to standard UTF-8 characters and standard bullet points (•, -).",
    });
  }

  // 6. Section readability
  if (detectedSections.length >= 4) {
    positiveSignals.push("Well-structured document with multiple distinct sections");
  }

  return {
    score: Math.max(20, Math.min(100, score)),
    issues,
    positiveSignals,
  };
}

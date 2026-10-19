import type { TailoredResumeData } from "@/lib/ai/schemas/tailored-resume";

export function generateMarkdownResume(data: TailoredResumeData): string {
  return `# ${data.contactInfo.fullName}
${[data.contactInfo.email, data.contactInfo.phone, data.contactInfo.location, data.contactInfo.linkedin, data.contactInfo.github].filter(Boolean).join(" | ")}

## Professional Summary
${data.summary.tailored}

## Skills
${data.skills.highlightedSkills.map((s) => `- ${s}`).join("\n")}

## Work Experience
${data.experience
  .map(
    (exp) => `### ${exp.jobTitle} - ${exp.company} ${exp.dates ? `(${exp.dates})` : ""}
${exp.bullets.map((b) => `- ${b.tailored}`).join("\n")}`
  )
  .join("\n\n")}

## Education
${data.education
  .map((edu) => `- **${edu.degree}**, ${edu.institution} ${edu.dates ? `(${edu.dates})` : ""}`)
  .join("\n")}
`;
}

export function generatePlainTextResume(data: TailoredResumeData): string {
  return `${data.contactInfo.fullName.toUpperCase()}
${[data.contactInfo.email, data.contactInfo.phone, data.contactInfo.location].filter(Boolean).join(" | ")}

PROFESSIONAL SUMMARY
--------------------
${data.summary.tailored}

SKILLS
------
${data.skills.highlightedSkills.join(", ")}

WORK EXPERIENCE
---------------
${data.experience
  .map(
    (exp) => `${exp.jobTitle.toUpperCase()} - ${exp.company} ${exp.dates ? `(${exp.dates})` : ""}
${exp.bullets.map((b) => `• ${b.tailored}`).join("\n")}`
  )
  .join("\n\n")}

EDUCATION
---------
${data.education
  .map((edu) => `• ${edu.degree}, ${edu.institution} ${edu.dates ? `(${edu.dates})` : ""}`)
  .join("\n")}
`;
}

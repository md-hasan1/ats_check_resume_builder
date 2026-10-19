import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ExternalHyperlink,
} from "docx";
import type { TailoredResumeData } from "@/lib/ai/schemas/tailored-resume";
import type { ResumeData } from "@/types/resume-builder";

/**
 * Typography & Layout Design Tokens for Executive DOCX Resumes
 * Measured in half-points (e.g. 24 = 12pt, 36 = 18pt) and twips (1/20th of a point).
 */
const DOCX_TOKENS = {
  font: "Calibri",
  colors: {
    primaryText: "1A1A1A",
    secondaryText: "555555",
    accent: "1E40AF", // Deep executive navy
    hyperlink: "0066CC",
    divider: "CCCCCC",
  },
  sizes: {
    name: 36, // 18pt
    title: 24, // 12pt
    heading: 24, // 12pt
    body: 21, // 10.5pt
    caption: 19, // 9.5pt
  },
  margins: {
    // Standard 1-inch margins (1440 twips)
    top: 1440,
    right: 1440,
    bottom: 1440,
    left: 1440,
  },
};

/**
 * Parses markdown hyperlinks `[Label](url)` and raw URLs into an array of docx TextRun and ExternalHyperlink elements.
 */
export function parseTextWithHyperlinksForDocx(
  text: string,
  options: {
    size?: number;
    color?: string;
    bold?: boolean;
    italics?: boolean;
    font?: string;
  } = {}
): (TextRun | ExternalHyperlink)[] {
  if (!text) return [];

  const linkRegex =
    /\[([^\]]+)\]\(((?:https?:\/\/|mailto:|tel:|\/)[^\s)]+)\)|((?:https?:\/\/|www\.)[^\s]+)/g;

  const runs: (TextRun | ExternalHyperlink)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const font = options.font || DOCX_TOKENS.font;
  const size = options.size || DOCX_TOKENS.sizes.body;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(
        new TextRun({
          text: text.substring(lastIndex, match.index),
          font,
          size,
          ...options,
        })
      );
    }

    if (match[1] && match[2]) {
      // Markdown link format: [label](url)
      const label = match[1];
      const rawUrl = match[2];
      const url =
        rawUrl.startsWith("http://") ||
        rawUrl.startsWith("https://") ||
        rawUrl.startsWith("mailto:") ||
        rawUrl.startsWith("tel:")
          ? rawUrl
          : `https://${rawUrl}`;

      runs.push(
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: label,
              style: "Hyperlink",
              font,
              size,
              color: DOCX_TOKENS.colors.hyperlink,
              underline: {},
              bold: options.bold,
            }),
          ],
          link: url,
        })
      );
    } else if (match[3]) {
      // Bare URL format
      const rawUrl = match[3];
      const url = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

      runs.push(
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: rawUrl,
              style: "Hyperlink",
              font,
              size,
              color: DOCX_TOKENS.colors.hyperlink,
              underline: {},
              bold: options.bold,
            }),
          ],
          link: url,
        })
      );
    }

    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    runs.push(
      new TextRun({
        text: text.substring(lastIndex),
        font,
        size,
        ...options,
      })
    );
  }

  return runs.length > 0
    ? runs
    : [new TextRun({ text, font, size, ...options })];
}

/**
 * Creates an executive-styled section heading with top and bottom spacing.
 */
function createSectionHeading(title: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        size: DOCX_TOKENS.sizes.heading,
        color: DOCX_TOKENS.colors.primaryText,
        font: DOCX_TOKENS.font,
      }),
    ],
  });
}

/**
 * Generates an authentic Microsoft Word (.docx) buffer from TailoredResumeData (Optimizer Engine).
 */
export async function generateDocxBuffer(data: TailoredResumeData): Promise<Buffer> {
  const children: Paragraph[] = [];
  const contact = data.contactInfo || ({} as any);

  // 1. Header: Full Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [
        new TextRun({
          text: contact.fullName || "Resume",
          bold: true,
          size: DOCX_TOKENS.sizes.name,
          font: DOCX_TOKENS.font,
          color: DOCX_TOKENS.colors.primaryText,
        }),
      ],
    })
  );

  // 2. Target Role (if specified)
  if (data.targetRole) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [
          new TextRun({
            text: data.targetRole,
            bold: true,
            size: DOCX_TOKENS.sizes.title,
            font: DOCX_TOKENS.font,
            color: DOCX_TOKENS.colors.accent,
          }),
        ],
      })
    );
  }

  // 3. Contact Details Row
  const contactParts = [
    contact.email,
    contact.phone,
    contact.location,
    contact.linkedin,
    contact.github,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [
          new TextRun({
            text: contactParts.join(" | "),
            size: DOCX_TOKENS.sizes.caption,
            font: DOCX_TOKENS.font,
            color: DOCX_TOKENS.colors.secondaryText,
          }),
        ],
      })
    );
  }

  // 4. Summary
  const summaryText = data.summary?.tailored || data.summary?.original;
  if (summaryText && summaryText.trim()) {
    children.push(createSectionHeading("Professional Summary"));
    children.push(
      new Paragraph({
        spacing: { before: 40, after: 120 },
        children: parseTextWithHyperlinksForDocx(summaryText.trim(), {
          size: DOCX_TOKENS.sizes.body,
        }),
      })
    );
  }

  // 5. Skills
  const skillsList = data.skills?.highlightedSkills || data.skills?.matchedSkills || [];
  if (skillsList.length > 0) {
    children.push(createSectionHeading("Technical Skills & Core Competencies"));
    children.push(
      new Paragraph({
        spacing: { before: 40, after: 120 },
        children: [
          new TextRun({
            text: skillsList.join("  •  "),
            size: DOCX_TOKENS.sizes.body,
            font: DOCX_TOKENS.font,
          }),
        ],
      })
    );
  }

  // 6. Experience
  const experiences = data.experience || [];
  if (experiences.length > 0) {
    children.push(createSectionHeading("Professional Experience"));

    for (const exp of experiences) {
      children.push(
        new Paragraph({
          spacing: { before: 160, after: 40 },
          children: [
            new TextRun({
              text: exp.jobTitle || "Role",
              bold: true,
              size: DOCX_TOKENS.sizes.body,
              font: DOCX_TOKENS.font,
            }),
            new TextRun({
              text: exp.company ? ` — ${exp.company}` : "",
              bold: true,
              size: DOCX_TOKENS.sizes.body,
              font: DOCX_TOKENS.font,
              color: DOCX_TOKENS.colors.accent,
            }),
            new TextRun({
              text: exp.dates ? ` (${exp.dates})` : "",
              italics: true,
              size: DOCX_TOKENS.sizes.caption,
              font: DOCX_TOKENS.font,
              color: DOCX_TOKENS.colors.secondaryText,
            }),
          ],
        })
      );

      for (const bullet of exp.bullets || []) {
        const text = bullet.tailored || bullet.original;
        if (text) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 40, after: 40 },
              children: parseTextWithHyperlinksForDocx(text, {
                size: DOCX_TOKENS.sizes.body,
              }),
            })
          );
        }
      }
    }
  }

  // 7. Education
  const educations = data.education || [];
  if (educations.length > 0) {
    children.push(createSectionHeading("Education"));

    for (const edu of educations) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: edu.degree || "Degree",
              bold: true,
              size: DOCX_TOKENS.sizes.body,
              font: DOCX_TOKENS.font,
            }),
            new TextRun({
              text: edu.institution ? `, ${edu.institution}` : "",
              size: DOCX_TOKENS.sizes.body,
              font: DOCX_TOKENS.font,
            }),
            new TextRun({
              text: edu.dates ? ` (${edu.dates})` : "",
              italics: true,
              size: DOCX_TOKENS.sizes.caption,
              font: DOCX_TOKENS.font,
              color: DOCX_TOKENS.colors.secondaryText,
            }),
          ],
        })
      );
    }
  }

  // 8. Projects
  const projects = data.projects || [];
  if (projects.length > 0) {
    children.push(createSectionHeading("Key Projects"));

    for (const proj of projects) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: proj.name || "Project",
              bold: true,
              size: DOCX_TOKENS.sizes.body,
              font: DOCX_TOKENS.font,
            }),
            new TextRun({
              text:
                proj.technologies && proj.technologies.length > 0
                  ? ` [${proj.technologies.join(", ")}]`
                  : "",
              italics: true,
              size: DOCX_TOKENS.sizes.caption,
              font: DOCX_TOKENS.font,
              color: DOCX_TOKENS.colors.secondaryText,
            }),
          ],
        })
      );

      if (proj.description) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 40, after: 40 },
            children: parseTextWithHyperlinksForDocx(proj.description, {
              size: DOCX_TOKENS.sizes.body,
            }),
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: DOCX_TOKENS.margins,
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

/**
 * Generates an authentic Microsoft Word (.docx) buffer from ResumeData (Resume Builder).
 */
export async function generateResumeBuilderDocxBuffer(data: ResumeData): Promise<Buffer> {
  const children: Paragraph[] = [];
  const personal = data.personal || ({} as any);

  // 1. Candidate Full Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: personal.fullName?.trim() || "Resume",
          bold: true,
          size: DOCX_TOKENS.sizes.name,
          font: DOCX_TOKENS.font,
          color: DOCX_TOKENS.colors.primaryText,
        }),
      ],
    })
  );

  // 2. Professional Headline / Title
  if (personal.jobTitle?.trim()) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [
          new TextRun({
            text: personal.jobTitle.trim(),
            size: DOCX_TOKENS.sizes.title,
            bold: true,
            font: DOCX_TOKENS.font,
            color: DOCX_TOKENS.colors.accent,
          }),
        ],
      })
    );
  }

  // 3. Contact Row
  const contactParts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.github,
    personal.website,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [
          new TextRun({
            text: contactParts.join("  |  "),
            size: DOCX_TOKENS.sizes.caption,
            font: DOCX_TOKENS.font,
            color: DOCX_TOKENS.colors.secondaryText,
          }),
        ],
      })
    );
  }

  // 4. Professional Summary
  if (data.summary && data.summary.trim()) {
    children.push(createSectionHeading("Professional Summary"));
    children.push(
      new Paragraph({
        spacing: { before: 40, after: 120 },
        children: parseTextWithHyperlinksForDocx(data.summary.trim(), {
          size: DOCX_TOKENS.sizes.body,
        }),
      })
    );
  }

  // 5. Technical Skills
  const skills = (data.skills || []).map((s) => s.name).filter(Boolean);
  if (skills.length > 0) {
    children.push(createSectionHeading("Technical Skills"));
    children.push(
      new Paragraph({
        spacing: { before: 40, after: 120 },
        children: [
          new TextRun({
            text: skills.join("  •  "),
            size: DOCX_TOKENS.sizes.body,
            font: DOCX_TOKENS.font,
          }),
        ],
      })
    );
  }

  // 6. Professional Experience
  const experiences = data.experience || [];
  if (experiences.length > 0) {
    children.push(createSectionHeading("Work Experience"));

    for (const exp of experiences) {
      const dateStr = [exp.startDate, exp.current ? "Present" : exp.endDate]
        .filter(Boolean)
        .join(" — ");

      children.push(
        new Paragraph({
          spacing: { before: 160, after: 40 },
          children: [
            new TextRun({
              text: exp.jobTitle || "Position",
              bold: true,
              size: DOCX_TOKENS.sizes.body,
              font: DOCX_TOKENS.font,
            }),
            new TextRun({
              text: exp.company ? ` — ${exp.company}` : "",
              bold: true,
              size: DOCX_TOKENS.sizes.body,
              font: DOCX_TOKENS.font,
              color: DOCX_TOKENS.colors.accent,
            }),
            new TextRun({
              text: dateStr ? ` (${dateStr})` : "",
              italics: true,
              size: DOCX_TOKENS.sizes.caption,
              font: DOCX_TOKENS.font,
              color: DOCX_TOKENS.colors.secondaryText,
            }),
            exp.location
              ? new TextRun({
                  text: ` • ${exp.location}`,
                  italics: true,
                  size: DOCX_TOKENS.sizes.caption,
                  font: DOCX_TOKENS.font,
                  color: DOCX_TOKENS.colors.secondaryText,
                })
              : new TextRun({ text: "" }),
          ],
        })
      );

      // Bullet points
      if (exp.description) {
        const lines = exp.description
          .split("\n")
          .map((l) => l.trim().replace(/^[•\-\*]\s*/, ""))
          .filter(Boolean);

        for (const line of lines) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 30, after: 30 },
              children: parseTextWithHyperlinksForDocx(line, {
                size: DOCX_TOKENS.sizes.body,
              }),
            })
          );
        }
      }

      // Achievements
      if (exp.achievements && exp.achievements.length > 0) {
        for (const ach of exp.achievements) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 30, after: 30 },
              children: parseTextWithHyperlinksForDocx(ach, {
                size: DOCX_TOKENS.sizes.body,
              }),
            })
          );
        }
      }
    }
  }

  // 7. Education
  const educations = data.education || [];
  if (educations.length > 0) {
    children.push(createSectionHeading("Education"));

    for (const edu of educations) {
      const dateStr = [edu.startDate, edu.current ? "Present" : edu.endDate]
        .filter(Boolean)
        .join(" — ");

      const degreeText = edu.field ? `${edu.degree} in ${edu.field}` : edu.degree;

      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: degreeText || "Degree",
              bold: true,
              size: DOCX_TOKENS.sizes.body,
              font: DOCX_TOKENS.font,
            }),
            new TextRun({
              text: edu.institution ? `, ${edu.institution}` : "",
              size: DOCX_TOKENS.sizes.body,
              font: DOCX_TOKENS.font,
            }),
            new TextRun({
              text: dateStr ? ` (${dateStr})` : "",
              italics: true,
              size: DOCX_TOKENS.sizes.caption,
              font: DOCX_TOKENS.font,
              color: DOCX_TOKENS.colors.secondaryText,
            }),
            edu.gpa
              ? new TextRun({
                  text: ` — GPA: ${edu.gpa}`,
                  italics: true,
                  size: DOCX_TOKENS.sizes.caption,
                  font: DOCX_TOKENS.font,
                  color: DOCX_TOKENS.colors.secondaryText,
                })
              : new TextRun({ text: "" }),
          ],
        })
      );

      if (edu.description) {
        children.push(
          new Paragraph({
            spacing: { before: 20, after: 40 },
            children: [
              new TextRun({
                text: `   ${edu.description}`,
                size: DOCX_TOKENS.sizes.caption,
                italics: true,
                font: DOCX_TOKENS.font,
              }),
            ],
          })
        );
      }
    }
  }

  // 8. Projects
  const projects = data.projects || [];
  if (projects.length > 0) {
    children.push(createSectionHeading("Projects"));

    for (const proj of projects) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: proj.name || "Project",
              bold: true,
              size: DOCX_TOKENS.sizes.body,
              font: DOCX_TOKENS.font,
            }),
            new TextRun({
              text:
                proj.technologies && proj.technologies.length > 0
                  ? ` (${proj.technologies.join(", ")})`
                  : "",
              italics: true,
              size: DOCX_TOKENS.sizes.caption,
              font: DOCX_TOKENS.font,
              color: DOCX_TOKENS.colors.secondaryText,
            }),
          ],
        })
      );

      if (proj.description) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 30, after: 30 },
            children: parseTextWithHyperlinksForDocx(proj.description, {
              size: DOCX_TOKENS.sizes.body,
            }),
          })
        );
      }
    }
  }

  // 9. Certifications
  const certifications = data.certifications || [];
  if (certifications.length > 0) {
    children.push(createSectionHeading("Certifications"));

    for (const cert of certifications) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({
              text: cert.name || "Certification",
              bold: true,
              size: DOCX_TOKENS.sizes.body,
              font: DOCX_TOKENS.font,
            }),
            new TextRun({
              text: cert.organization ? ` — ${cert.organization}` : "",
              size: DOCX_TOKENS.sizes.body,
              font: DOCX_TOKENS.font,
            }),
            cert.issueDate
              ? new TextRun({
                  text: ` (${cert.issueDate})`,
                  italics: true,
                  size: DOCX_TOKENS.sizes.caption,
                  font: DOCX_TOKENS.font,
                  color: DOCX_TOKENS.colors.secondaryText,
                })
              : new TextRun({ text: "" }),
          ],
        })
      );
    }
  }

  // 10. Languages
  const languages = data.languages || [];
  if (languages.length > 0) {
    children.push(createSectionHeading("Languages"));

    children.push(
      new Paragraph({
        spacing: { before: 40, after: 80 },
        children: [
          new TextRun({
            text: languages
              .map((l) => `${l.language} (${l.proficiency})`)
              .join("  •  "),
            size: DOCX_TOKENS.sizes.body,
            font: DOCX_TOKENS.font,
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: DOCX_TOKENS.margins,
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

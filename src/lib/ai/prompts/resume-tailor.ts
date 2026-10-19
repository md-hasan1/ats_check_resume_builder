export function buildResumeTailorPrompt(
  resumeText: string,
  jobDescription: string,
  targetRole?: string,
  targetCompany?: string
): string {
  return `You are an expert ATS Resume Optimization Engine and Career Coach.

CRITICAL SAFETY & FACTUAL INTEGRITY INSTRUCTIONS:
1. You MUST NEVER fabricate or hallucinate any user qualification, employment history, company name, job title, date, degree, certificate, award, or project.
2. You MUST NEVER add skills to the user's resume that they do not possess. If a skill required by the job description is missing from the resume, place it in "recommendedMissingSkills" — DO NOT add it to matched/highlighted skills.
3. You MAY rewrite bullet points to be more impactful and action-oriented, using strong action verbs and professional phrasing.
4. DO NOT invent metrics or fake numbers. If the original bullet point does not contain numbers, improve clarity and relevance without making up fake percentages or statistics.

TASK:
Tailor the candidate's resume for the target job description:
- Target Role: ${targetRole || "Extracted from Job Description"}
- Target Company: ${targetCompany || "Not Specified"}

JOB DESCRIPTION:
${jobDescription}

RESUME TEXT:
${resumeText}

Return a valid JSON object strictly matching this format (no markdown formatting, no code fences):
{
  "versionName": "Tailored for ${targetRole || "Target Role"}",
  "targetRole": "${targetRole || "Target Role"}",
  "targetCompany": "${targetCompany || ""}",
  "contactInfo": {
    "fullName": "Candidate Name",
    "email": "candidate@email.com",
    "phone": "Phone Number",
    "location": "City, State",
    "linkedin": "linkedin.com/in/...",
    "github": "github.com/...",
    "website": "portfolio.com"
  },
  "summary": {
    "original": "Original summary text if present",
    "tailored": "Optimized professional summary tailored to the job description without fabricating claims",
    "reasoning": "Why this summary was tailored this way"
  },
  "skills": {
    "matchedSkills": ["Skill 1", "Skill 2"],
    "highlightedSkills": ["Skill 1 (reordered by relevance)"],
    "recommendedMissingSkills": ["Required skill from JD that candidate lacks"]
  },
  "experience": [
    {
      "jobTitle": "Job Title",
      "company": "Company Name",
      "dates": "Dates",
      "bullets": [
        {
          "original": "Original bullet text",
          "tailored": "Optimized bullet point using action verbs and job keywords",
          "keywordsAdded": ["Keyword1", "Keyword2"],
          "reason": "Explanation of optimization"
        }
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "Institution Name",
      "dates": "Graduation Date",
      "details": "Relevant Coursework or details"
    }
  ],
  "certifications": ["Cert 1"],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project Description",
      "technologies": ["Tech 1", "Tech 2"],
      "impact": "Factual impact statement"
    }
  ],
  "diffHighlights": {
    "addedKeywordsCount": 12,
    "improvedBulletsCount": 8,
    "estimatedScoreIncrease": 18
  }
}`;
}

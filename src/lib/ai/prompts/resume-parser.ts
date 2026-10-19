export const RESUME_PARSER_PROMPT = `You are an expert resume parser. Extract structured data from the following resume text and return it as JSON.

## Instructions
1. Extract all identifiable fields from the resume text.
2. Categorize skills into technical, soft, tools, frameworks, and programming languages.
3. Parse dates as strings in "YYYY-MM" or "YYYY" format. Use "Present" for current roles.
4. Be thorough — capture all sections including projects, certifications, volunteer work, and interests.
5. Return ONLY valid JSON (no markdown, no code fences).

## Required JSON Output Structure

{
  "contactInfo": {
    "name": "<string>",
    "email": "<string>",
    "phone": "<string>",
    "location": "<string>",
    "linkedin": "<string>",
    "github": "<string>",
    "portfolio": "<string>"
  },
  "summary": "<string — professional summary or objective>",
  "experience": [
    {
      "title": "<string>",
      "company": "<string>",
      "location": "<string>",
      "startDate": "<string>",
      "endDate": "<string>",
      "current": <boolean>,
      "description": "<string>",
      "bullets": ["<string>"]
    }
  ],
  "education": [
    {
      "degree": "<string>",
      "institution": "<string>",
      "location": "<string>",
      "startDate": "<string>",
      "endDate": "<string>",
      "gpa": "<string>",
      "coursework": ["<string>"]
    }
  ],
  "skills": {
    "technical": ["<string>"],
    "soft": ["<string>"],
    "tools": ["<string>"],
    "frameworks": ["<string>"],
    "languages": ["<string>"],
    "other": ["<string>"]
  },
  "projects": [
    {
      "name": "<string>",
      "description": "<string>",
      "technologies": ["<string>"],
      "url": "<string>",
      "bullets": ["<string>"]
    }
  ],
  "certifications": [
    {
      "name": "<string>",
      "issuer": "<string>",
      "date": "<string>",
      "url": "<string>"
    }
  ],
  "languages": [
    {
      "language": "<string>",
      "proficiency": "<string>"
    }
  ],
  "achievements": ["<string>"],
  "volunteer": [
    {
      "role": "<string>",
      "organization": "<string>",
      "startDate": "<string>",
      "endDate": "<string>",
      "description": "<string>"
    }
  ],
  "interests": ["<string>"],
  "references": ["<string>"]
}

## Resume Text
{RESUME_TEXT}
`;

export function buildResumeParserPrompt(resumeText: string): string {
  return RESUME_PARSER_PROMPT.replace("{RESUME_TEXT}", resumeText);
}

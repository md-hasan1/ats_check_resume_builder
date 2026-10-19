export function buildCoverLetterPrompt(
  resumeText: string,
  jobDescription: string,
  targetCompany: string,
  targetRole: string,
  tone: string = "professional",
  length: string = "standard"
): string {
  return `You are an expert Executive Career Coach and Resume Specialist.

TASK: Write a highly targeted, compelling cover letter for a candidate applying to a role.

RULES:
1. Base all accomplishments strictly on the factual details provided in the candidate's resume. Do NOT fabricate experience, awards, degrees, or positions.
2. Tone: ${tone} (e.g. professional, persuasive, creative, or concise).
3. Target Length: ${length} (e.g. short ~200 words, standard ~350 words, detailed ~500 words).
4. Clearly state interest in ${targetCompany} for the ${targetRole} position.
5. Highlight 2-3 key achievements from the resume that align directly with the job requirements.

COMPANY: ${targetCompany}
ROLE: ${targetRole}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeText}

Return only the text of the complete cover letter ready to send. Do not include markdown code blocks or conversational prefixes.`;
}

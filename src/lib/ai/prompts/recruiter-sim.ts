export function buildRecruiterSimPrompt(
  resumeText: string,
  jobDescription: string
): string {
  return `You are a Senior Technical Recruiter at a top tech company with 15+ years of experience scanning thousands of resumes.

Simulate a realistic 10-second initial scan of this resume against the provided job description.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Return a valid JSON object strictly matching this format (no markdown formatting, no code fences):
{
  "impressionScore": 82, // 0 to 100
  "hiringConfidence": 78, // 0 to 100
  "interviewChance": 85, // 0 to 100
  "strengths": [
    "Clear technical stack alignment with React and Node.js",
    "Quantified achievement in load time optimization"
  ],
  "weaknesses": [
    "Resume is 3 pages long — hard to scan in 10 seconds",
    "Missing explicit mention of CI/CD pipelines"
  ],
  "missingInfo": [
    "No link to active GitHub profile"
  ],
  "overallImpression": "Strong technical candidate with solid core experience. Would invite for initial phone screen if formatting is condensed."
}`;
}

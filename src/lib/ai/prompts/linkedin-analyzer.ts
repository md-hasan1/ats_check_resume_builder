export function buildLinkedInAnalyzerPrompt(profileContent: string): string {
  return `You are a Senior Executive Recruiter and LinkedIn Optimization Specialist.

TASK: Analyze the provided LinkedIn profile content and generate high-impact, professional optimizations.

PROFILE CONTENT:
${profileContent}

RULES:
1. Do NOT fabricate experience, past companies, degrees, or certifications.
2. Optimize headline for high recruiter visibility (include key title, stack/skills, value proposition).
3. Rewrite the "About" section in first person to be engaging, keyword-rich, and achievement-driven.
4. Output specific missing industry keywords and actionable networking tips.

Return a valid JSON object strictly matching this format (no markdown formatting, no code fences):
{
  "recruiterScore": 85, // 0 to 100
  "currentHeadline": "Original or extracted headline",
  "suggestedHeadline": "Senior Full-Stack Engineer | React, Node.js, TypeScript | Building Scalable Enterprise Web Apps",
  "currentAbout": "Original about text if present",
  "suggestedAbout": "I am a passionate Senior Full-Stack Engineer with 6+ years of experience engineering scalable web applications. Specializing in modern JavaScript/TypeScript ecosystems...",
  "missingKeywords": ["GraphQL", "CI/CD", "System Architecture", "Microservices"],
  "networkingTips": [
    "Connect with engineering managers in your target industry",
    "Publish weekly short posts about performance optimization insights",
    "Ask former colleagues for targeted recommendations"
  ]
}`;
}

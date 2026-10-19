export function buildSalaryInsightsPrompt(
  role: string,
  location: string,
  experience: string
): string {
  return `You are a Compensation & Benefits Analyst specializing in global tech compensation.

TASK: Provide estimated salary benchmarks and market demand indicators.

ROLE: ${role}
LOCATION: ${location}
EXPERIENCE: ${experience}

Return a valid JSON object strictly matching this format (no markdown formatting, no code fences):
{
  "role": "${role}",
  "location": "${location}",
  "experience": "${experience}",
  "averageSalary": 145000,
  "medianSalary": 140000,
  "top10Percent": 185000,
  "marketDemand": "High", // "Very High", "High", "Moderate"
  "growthPotential": "Strong (15% YoY projection)",
  "topPayingSkills": ["System Design", "GraphQL", "AWS", "Kubernetes"],
  "benefitsSummary": "Standard tech package includes stock options (RSUs), 401(k) match, health coverage, and remote flexibility."
}`;
}

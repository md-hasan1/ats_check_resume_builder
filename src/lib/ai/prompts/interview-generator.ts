export function buildInterviewGeneratorPrompt(
  targetRole: string,
  company?: string,
  jobDescription?: string,
  resumeText?: string
): string {
  return `You are an Executive Technical Interviewer and Hiring Manager for top tech companies.

TASK: Generate a targeted set of interview questions and model answer strategies for candidate preparation.

TARGET ROLE: ${targetRole}
COMPANY: ${company || "Top Tech Company"}
${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}\n` : ""}
${resumeText ? `RESUME:\n${resumeText}\n` : ""}

Return a valid JSON object strictly matching this format (no markdown formatting, no code fences):
{
  "technical": [
    {
      "question": "How do you handle state management in large-scale React applications?",
      "category": "Frontend Architecture",
      "difficulty": "Hard",
      "answerGuidance": "Discuss Zustand or Redux for global state vs React Query/TanStack Query for server state. Mention performance considerations like re-render prevention.",
      "keyPoints": ["Server state vs Client state", "Immutability", "Selectors"]
    }
  ],
  "behavioral": [
    {
      "question": "Tell me about a time you had to deal with tight deadlines and shifting priorities.",
      "category": "Adaptability & STAR Method",
      "difficulty": "Medium",
      "answerGuidance": "Structure answer using Situation, Task, Action, Result. Emphasize communication with stakeholders and scope prioritization.",
      "keyPoints": ["STAR Framework", "Prioritization", "Stakeholder management"]
    }
  ],
  "systemDesign": [
    {
      "question": "Design a real-time notifications system that supports millions of concurrent users.",
      "category": "System Design",
      "difficulty": "Hard",
      "answerGuidance": "Cover WebSockets vs SSE, message queues (Kafka/RabbitMQ), horizontal scaling, and push notification services (FCM).",
      "keyPoints": ["WebSockets", "Pub/Sub Architecture", "Scalability"]
    }
  ]
}`;
}

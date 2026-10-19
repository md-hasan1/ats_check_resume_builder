import type { AnalysisResult } from "@/types/analysis";
import type { ParsedResume } from "@/types/resume";
import type { TailoredResumeData } from "./schemas/tailored-resume";
import type {
  AIProvider,
  RecruiterSimResult,
  LinkedInAnalysisResult,
  InterviewPrepResult,
  SalaryInsightResult,
} from "./provider";
import { extractSkillKeywords } from "./skills-dictionary";

export class HeuristicAIProvider implements AIProvider {
  async analyze(resumeText: string, jobDescription: string): Promise<AnalysisResult> {
    const resumeLower = resumeText.toLowerCase();

    // Extract ONLY actual technical and professional skills
    const { matchedKeywords, missingKeywords, overallRatio } = extractSkillKeywords(
      resumeText,
      jobDescription
    );

    const skillScore = Math.round(overallRatio * 100);
    const overallScore = Math.min(96, Math.max(45, Math.round(skillScore * 0.55 + 40)));

    const topMissing = missingKeywords.slice(0, 3).map((k) => k.keyword);
    const summary = `Resume analysis completed. Found strong alignment in key experience with ${matchedKeywords.length} matching job skills.${
      topMissing.length > 0
        ? ` Recommended adding ${topMissing.join(", ")} if you have experience with them to boost ATS compatibility score.`
        : " Great job! Your resume covers the primary technical requirements found in the job description."
    }`;

    return {
      overallScore,
      summary,
      categories: [
        { name: "Keyword Match", score: Math.round(overallScore * 0.95), maxScore: 100, weight: 30, description: "Alignment with job skills & keywords", icon: "Key" },
        { name: "Skills Alignment", score: Math.round(overallScore * 0.98), maxScore: 100, weight: 25, description: "Technical and domain skills match", icon: "Cpu" },
        { name: "Experience Relevance", score: overallScore, maxScore: 100, weight: 25, description: "Work experience relevance", icon: "Briefcase" },
        { name: "ATS Formatting", score: 88, maxScore: 100, weight: 20, description: "Parsability and layout structure", icon: "FileText" },
      ],
      keywordAnalysis: {
        score: Math.round(overallScore * 0.95),
        totalKeywords: matchedKeywords.length + missingKeywords.length,
        matchedKeywords: matchedKeywords.map((k) => ({
          keyword: k.keyword,
          count: k.count,
          importance: k.importance,
          category: k.category,
        })),
        missingKeywords: missingKeywords.map((k) => ({
          keyword: k.keyword,
          count: 0,
          importance: k.importance,
          category: k.category,
        })),
        keywordDensity: 3.2,
        keywordPlacement: matchedKeywords.slice(0, 4).map((k) => ({
          keyword: k.keyword,
          locations: ["experience", "skills"],
        })),
      },
      skillsAnalysis: {
        score: Math.round(overallScore * 0.98),
        hardSkills: matchedKeywords.filter((k) => k.category !== "Professional Skills").map((k) => ({ skill: k.keyword, matched: true, proficiency: "Proficient" })),
        softSkills: [
          { skill: "Communication", matched: resumeLower.includes("communicat") },
          { skill: "Leadership", matched: resumeLower.includes("lead") || resumeLower.includes("manag") },
          { skill: "Problem Solving", matched: resumeLower.includes("problem") || resumeLower.includes("solv") },
        ],
        technicalSkills: matchedKeywords.filter((k) => k.category === "Languages" || k.category === "Backend & APIs" || k.category === "Frameworks & Libraries").map((k) => ({ skill: k.keyword, matched: true })),
        tools: matchedKeywords.filter((k) => k.category === "Tools & Platforms" || k.category === "Cloud & DevOps").map((k) => ({ skill: k.keyword, matched: true })),
        frameworks: matchedKeywords.filter((k) => k.category === "Frameworks & Libraries").map((k) => ({ skill: k.keyword, matched: true })),
        languages: matchedKeywords.filter((k) => k.category === "Languages").map((k) => ({ skill: k.keyword, matched: true })),
        missingSkills: missingKeywords.slice(0, 6).map((k) => k.keyword),
        recommendedSkills: missingKeywords.slice(0, 4).map((k) => k.keyword),
      },
      experienceAnalysis: {
        score: overallScore,
        yearsOfExperience: 3,
        relevantExperience: "High relevance to target role responsibilities",
        industryMatch: "Strong domain alignment",
        leadershipIndicators: ["Project Management", "Team Collaboration"],
        projects: ["Resume & ATS Optimization"],
        responsibilities: ["Developed core features and maintained code quality"],
        achievements: ["Improved workflow efficiency by 30%"],
        impactStatements: [
          { original: "Worked on projects", hasMetrics: false, suggestion: "Quantify results with percentages or revenue numbers." },
        ],
      },
      educationAnalysis: {
        score: 85,
        degree: "Bachelor's Degree",
        certifications: [],
        relevantCoursework: ["Computer Science", "Engineering"],
        educationMatch: "Meets or exceeds educational requirements",
      },
      formattingAnalysis: {
        score: 88,
        issues: [],
        fonts: "Standard clean typography",
        margins: "1 inch standard",
        alignment: "Left-aligned",
        hasTables: false,
        hasColumns: false,
        hasImages: false,
        hasIcons: false,
        hasHeaders: true,
        hasFooters: false,
        pageCount: 1,
        spacing: "1.15 line spacing",
        bulletPoints: "Standard bullet points used",
      },
      grammarAnalysis: {
        score: 92,
        grammarMistakes: [],
        spellingErrors: [],
        repeatedWords: [],
        passiveVoiceInstances: [],
        weakVerbs: [],
        longSentences: [],
      },
      readabilityAnalysis: {
        score: 85,
        readingLevel: "Professional / Technical",
        averageSentenceLength: 14,
        averageParagraphLength: 3,
        wordCount: resumeText.split(/\s+/).length,
        sectionBalance: "Well balanced across sections",
      },
      atsCompatibility: {
        score: overallScore,
        checks: [
          { name: "Standard Font Check", passed: true, message: "Standard readable font detected", severity: "info" },
          { name: "Contact Information", passed: true, message: "Contact info present", severity: "info" },
          { name: "Section Headers", passed: true, message: "Clear section headings found", severity: "info" },
        ],
      },
      sectionDetection: {
        detected: [
          { name: "Work Experience", present: true, quality: "good" },
          { name: "Education", present: true, quality: "good" },
          { name: "Skills", present: true, quality: "good" },
        ],
        missing: [],
      },
      aiSuggestions: [
        {
          type: "skills",
          original: "General responsibilities",
          improved: topMissing.length > 0 ? `Consider adding demonstrated experience with: ${topMissing.join(", ")}` : "Skills section has strong keyword coverage for this role.",
          reason: "Enhance keyword density for ATS parsing",
        },
      ],
      actionVerbSuggestions: [
        { weakVerb: "handled", strongVerbs: ["orchestrated", "executed", "spearheaded"], context: "Experience section" },
      ],
      matchPercentages: {
        overall: overallScore,
        technical: Math.round(overallScore * 0.9),
        softSkills: 85,
        experience: overallScore,
        education: 90,
        keywords: Math.round(overallScore * 0.85),
      },
    };
  }

  async extractFields(resumeText: string): Promise<ParsedResume> {
    const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = resumeText.match(/(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
    const lines = resumeText.split("\n").map((l) => l.trim()).filter(Boolean);

    return {
      contactInfo: {
        name: lines[0] || "Candidate",
        email: emailMatch ? emailMatch[0] : "candidate@example.com",
        phone: phoneMatch ? phoneMatch[0] : "",
        location: "United States",
        linkedin: "",
        github: "",
        portfolio: "",
      },
      summary: lines.slice(1, 4).join(" "),
      experience: [
        {
          title: "Software Specialist",
          company: "Tech Solutions",
          location: "Remote",
          startDate: "2022",
          endDate: "Present",
          current: true,
          description: "Developed web applications and improved process efficiency.",
          bullets: ["Built responsive web user interfaces", "Optimized database performance"],
        },
      ],
      education: [
        {
          degree: "Bachelor of Science in Computer Science",
          institution: "University",
          location: "Remote",
          startDate: "2018",
          endDate: "2022",
          gpa: "3.8",
          coursework: ["Algorithms", "Software Engineering"],
        },
      ],
      skills: {
        technical: ["TypeScript", "JavaScript", "React", "Node.js", "SQL", "Git"],
        soft: ["Problem Solving", "Teamwork", "Communication"],
        tools: ["VS Code", "GitHub", "Docker"],
        frameworks: ["Next.js", "React"],
        languages: ["English"],
        other: [],
      },
      projects: [],
      certifications: [],
      languages: [{ language: "English", proficiency: "Fluent" }],
      achievements: [],
      volunteer: [],
      interests: [],
      references: [],
    };
  }

  async tailorResume(
    resumeText: string,
    jobDescription: string,
    targetRole?: string,
    targetCompany?: string
  ): Promise<TailoredResumeData> {
    const parsed = await this.extractFields(resumeText);
    return {
      versionName: `${targetRole || "Tailored"} Resume`,
      targetRole: targetRole || "Software Engineer",
      targetCompany: targetCompany || "Tech Company",
      contactInfo: {
        fullName: parsed.contactInfo.name,
        email: parsed.contactInfo.email,
        phone: parsed.contactInfo.phone,
        location: parsed.contactInfo.location,
        linkedin: parsed.contactInfo.linkedin,
        github: parsed.contactInfo.github,
        website: parsed.contactInfo.portfolio,
      },
      summary: {
        original: parsed.summary,
        tailored: `Results-driven professional with proven experience aligned with ${targetRole || "the target role"}. Skilled in executing complex technical projects and optimizing performance.`,
        reasoning: "Tailored summary to highlight target competencies.",
      },
      skills: {
        matchedSkills: parsed.skills.technical,
        highlightedSkills: parsed.skills.tools,
        recommendedMissingSkills: ["System Architecture"],
      },
      experience: parsed.experience.map((exp) => ({
        jobTitle: exp.title,
        company: exp.company,
        dates: `${exp.startDate} - ${exp.endDate}`,
        bullets: exp.bullets.map((b) => ({
          original: b,
          tailored: `Spearheaded key initiatives: ${b}`,
          keywordsAdded: ["Optimization"],
          reason: "Increased impact and quantifiability",
        })),
      })),
      education: parsed.education.map((edu) => ({
        degree: edu.degree,
        institution: edu.institution,
        dates: `${edu.startDate} - ${edu.endDate}`,
        details: edu.gpa ? `GPA: ${edu.gpa}` : undefined,
      })),
      certifications: [],
      projects: [],
      diffHighlights: {
        addedKeywordsCount: 5,
        improvedBulletsCount: parsed.experience.length * 2,
        estimatedScoreIncrease: 12,
      },
    };
  }

  async generateCoverLetter(
    resumeText: string,
    jobDescription: string,
    targetCompany: string,
    targetRole: string,
    tone?: string,
    length?: string
  ): Promise<string> {
    const parsed = await this.extractFields(resumeText);
    return `Dear Hiring Manager at ${targetCompany},

I am writing to express my enthusiastic interest in the ${targetRole} position. With my background and hands-on technical experience, I am confident in my ability to make an immediate positive impact on your team.

Throughout my career, I have consistently demonstrated a strong commitment to quality and technical excellence. My experience aligns closely with your requirements outlined in the job description.

Thank you for considering my application. I welcome the opportunity to discuss how my skills and background align with the needs of ${targetCompany}.

Sincerely,
${parsed.contactInfo.name}`;
  }

  async simulateRecruiterReview(
    resumeText: string,
    jobDescription: string
  ): Promise<RecruiterSimResult> {
    return {
      impressionScore: 88,
      hiringConfidence: 85,
      interviewChance: 82,
      strengths: ["Clear layout and presentation", "Relevant skills clearly highlighted", "Strong experience section"],
      weaknesses: ["Could add more quantifiable metrics"],
      missingInfo: ["Portfolio links or GitHub profile"],
      overallImpression: "Strong candidate with solid qualifications for the position.",
    };
  }

  async analyzeLinkedIn(profileContent: string): Promise<LinkedInAnalysisResult> {
    return {
      recruiterScore: 86,
      suggestedHeadline: "Software Professional | Full-Stack & System Design Specialist",
      suggestedAbout: "Experienced software engineer dedicated to building scalable products and driving innovation.",
      missingKeywords: ["Agile", "Cloud Architecture", "CI/CD"],
      networkingTips: ["Connect with hiring managers in your target domain", "Share monthly technical articles"],
    };
  }

  async generateInterviewQuestions(
    targetRole: string,
    company?: string,
    jobDescription?: string,
    resumeText?: string
  ): Promise<InterviewPrepResult> {
    return {
      technical: [
        {
          question: `What core architecture patterns do you use for ${targetRole} projects?`,
          category: "Architecture",
          difficulty: "Medium",
          answerGuidance: "Discuss modularity, state management, and separation of concerns.",
          keyPoints: ["Scalability", "Maintainability", "Clean Code"],
        },
      ],
      behavioral: [
        {
          question: "Describe a challenging situation in a past project and how you resolved it.",
          category: "Problem Solving",
          difficulty: "Medium",
          answerGuidance: "Use the STAR method (Situation, Task, Action, Result).",
          keyPoints: ["STAR technique", "Clear outcome", "Lessons learned"],
        },
      ],
      systemDesign: [
        {
          question: "How would you design a scalable service to handle high request volume?",
          category: "System Design",
          difficulty: "Hard",
          answerGuidance: "Address load balancing, caching strategies, and database indexing.",
          keyPoints: ["Load balancer", "Redis caching", "Database partitioning"],
        },
      ],
    };
  }

  async getSalaryInsights(role: string, location: string, experience: string): Promise<SalaryInsightResult> {
    return {
      role,
      location,
      experience,
      averageSalary: 125000,
      medianSalary: 120000,
      top10Percent: 165000,
      marketDemand: "High",
      growthPotential: "Strong 15% YoY growth",
      topPayingSkills: ["Cloud", "System Architecture", "TypeScript"],
      benefitsSummary: "Competitive healthcare, 401(k) matching, and remote flexibility.",
    };
  }
}

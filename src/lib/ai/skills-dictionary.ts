/**
 * Curated ATS Skill Taxonomy & Boilerplate Filter
 * Prevents non-skill boilerplate words (e.g. "Job", "Description", "Company", "Join", "Our", "And")
 * from ever being counted as ATS keywords.
 */

export interface KnownSkill {
  name: string; // Canonical display name
  match: RegExp; // Regex to match in text
  category: "Languages" | "Frameworks & Libraries" | "Backend & APIs" | "Databases" | "Cloud & DevOps" | "Testing & QA" | "Data & AI" | "Tools & Platforms" | "Methodologies" | "Professional Skills";
  importance: "high" | "medium" | "low";
}

// Master Skill Catalog
export const KNOWN_SKILLS: KnownSkill[] = [
  // --- Programming Languages ---
  { name: "JavaScript", match: /\b(javascript|js|es6|es2015|ecmascript)\b/i, category: "Languages", importance: "high" },
  { name: "TypeScript", match: /\b(typescript|ts)\b/i, category: "Languages", importance: "high" },
  { name: "Python", match: /\b(python|python3|py)\b/i, category: "Languages", importance: "high" },
  { name: "Java", match: /\bjava\b(?!script)/i, category: "Languages", importance: "high" },
  { name: "C++", match: /\bc\+\+\b/i, category: "Languages", importance: "high" },
  { name: "C#", match: /\bc#|\bcsharp\b/i, category: "Languages", importance: "high" },
  { name: "Go", match: /\b(golang|go\s+language)\b|\bgo\b(?=\s+developer|\s+engineer|\s+backend)/i, category: "Languages", importance: "high" },
  { name: "Rust", match: /\brust\b/i, category: "Languages", importance: "high" },
  { name: "Ruby", match: /\bruby\b/i, category: "Languages", importance: "medium" },
  { name: "PHP", match: /\bphp\b/i, category: "Languages", importance: "medium" },
  { name: "Swift", match: /\bswift\b/i, category: "Languages", importance: "high" },
  { name: "Kotlin", match: /\bkotlin\b/i, category: "Languages", importance: "high" },
  { name: "SQL", match: /\bsql\b/i, category: "Languages", importance: "high" },
  { name: "HTML5", match: /\b(html|html5)\b/i, category: "Languages", importance: "medium" },
  { name: "CSS3", match: /\b(css|css3)\b/i, category: "Languages", importance: "medium" },
  { name: "Sass", match: /\b(sass|scss)\b/i, category: "Languages", importance: "medium" },
  { name: "Bash / Shell", match: /\b(bash|shell\s+scripting|powershell)\b/i, category: "Languages", importance: "medium" },
  { name: "R", match: /\br\s+programming|\br\s+language\b/i, category: "Languages", importance: "medium" },

  // --- Frontend & UI ---
  { name: "React", match: /\breact(\.js|js)?\b/i, category: "Frameworks & Libraries", importance: "high" },
  { name: "Next.js", match: /\bnext(\.js|js)?\b/i, category: "Frameworks & Libraries", importance: "high" },
  { name: "Vue.js", match: /\bvue(\.js|js)?\b/i, category: "Frameworks & Libraries", importance: "high" },
  { name: "Nuxt.js", match: /\bnuxt(\.js|js)?\b/i, category: "Frameworks & Libraries", importance: "medium" },
  { name: "Angular", match: /\bangular(\.js|js)?\b/i, category: "Frameworks & Libraries", importance: "high" },
  { name: "Svelte", match: /\bsvelte(kit)?\b/i, category: "Frameworks & Libraries", importance: "medium" },
  { name: "Tailwind CSS", match: /\btailwind(\s*css)?\b/i, category: "Frameworks & Libraries", importance: "high" },
  { name: "Bootstrap", match: /\bbootstrap\b/i, category: "Frameworks & Libraries", importance: "medium" },
  { name: "Redux", match: /\bredux(\s*toolkit)?\b/i, category: "Frameworks & Libraries", importance: "medium" },
  { name: "Zustand", match: /\bzustand\b/i, category: "Frameworks & Libraries", importance: "medium" },
  { name: "React Query", match: /\b(react\s*query|tanstack\s*query)\b/i, category: "Frameworks & Libraries", importance: "medium" },
  { name: "Webpack", match: /\bwebpack\b/i, category: "Frameworks & Libraries", importance: "medium" },
  { name: "Vite", match: /\bvite(\.js)?\b/i, category: "Frameworks & Libraries", importance: "medium" },
  { name: "Responsive Design", match: /\b(responsive\s+design|mobile-first)\b/i, category: "Frameworks & Libraries", importance: "medium" },

  // --- Backend & APIs ---
  { name: "Node.js", match: /\bnode(\.js|js)?\b/i, category: "Backend & APIs", importance: "high" },
  { name: "Express.js", match: /\bexpress(\.js|js)?\b/i, category: "Backend & APIs", importance: "high" },
  { name: "NestJS", match: /\bnest(\.js|js)?\b/i, category: "Backend & APIs", importance: "high" },
  { name: "Django", match: /\bdjango\b/i, category: "Backend & APIs", importance: "high" },
  { name: "FastAPI", match: /\bfastapi\b/i, category: "Backend & APIs", importance: "high" },
  { name: "Flask", match: /\bflask\b/i, category: "Backend & APIs", importance: "medium" },
  { name: "Spring Boot", match: /\bspring(\s*boot)?\b/i, category: "Backend & APIs", importance: "high" },
  { name: "Ruby on Rails", match: /\b(rails|ruby\s+on\s+rails)\b/i, category: "Backend & APIs", importance: "medium" },
  { name: "ASP.NET", match: /\basp\.net(\s*core)?\b/i, category: "Backend & APIs", importance: "high" },
  { name: "GraphQL", match: /\bgraphql\b/i, category: "Backend & APIs", importance: "high" },
  { name: "REST APIs", match: /\b(rest(\s*api|\s*apis|\s*ful)?)\b/i, category: "Backend & APIs", importance: "high" },
  { name: "gRPC", match: /\bgrpc\b/i, category: "Backend & APIs", importance: "medium" },
  { name: "Microservices", match: /\bmicroservices?\b/i, category: "Backend & APIs", importance: "high" },
  { name: "WebSockets", match: /\bwebsockets?\b/i, category: "Backend & APIs", importance: "medium" },

  // --- Databases & ORM ---
  { name: "PostgreSQL", match: /\b(postgres|postgresql)\b/i, category: "Databases", importance: "high" },
  { name: "MySQL", match: /\bmysql\b/i, category: "Databases", importance: "high" },
  { name: "MongoDB", match: /\bmongo(db)?\b/i, category: "Databases", importance: "high" },
  { name: "Redis", match: /\bredis\b/i, category: "Databases", importance: "high" },
  { name: "SQLite", match: /\bsqlite\b/i, category: "Databases", importance: "medium" },
  { name: "Prisma", match: /\bprisma(\s*orm)?\b/i, category: "Databases", importance: "medium" },
  { name: "TypeORM", match: /\btypeorm\b/i, category: "Databases", importance: "medium" },
  { name: "DynamoDB", match: /\bdynamodb\b/i, category: "Databases", importance: "high" },
  { name: "Elasticsearch", match: /\belasticsearch\b/i, category: "Databases", importance: "medium" },
  { name: "Firebase", match: /\bfirebase(\s*firestore)?\b/i, category: "Databases", importance: "medium" },
  { name: "Supabase", match: /\bsupabase\b/i, category: "Databases", importance: "medium" },

  // --- Cloud & DevOps ---
  { name: "AWS", match: /\b(aws|amazon\s+web\s+services)\b/i, category: "Cloud & DevOps", importance: "high" },
  { name: "Azure", match: /\b(azure|microsoft\s+azure)\b/i, category: "Cloud & DevOps", importance: "high" },
  { name: "Google Cloud (GCP)", match: /\b(gcp|google\s+cloud(\s+platform)?)\b/i, category: "Cloud & DevOps", importance: "high" },
  { name: "Docker", match: /\bdocker(\s*compose)?\b/i, category: "Cloud & DevOps", importance: "high" },
  { name: "Kubernetes", match: /\b(kubernetes|k8s)\b/i, category: "Cloud & DevOps", importance: "high" },
  { name: "Terraform", match: /\bterraform\b/i, category: "Cloud & DevOps", importance: "high" },
  { name: "CI/CD", match: /\b(ci\/cd|continuous\s+integration|continuous\s+deployment)\b/i, category: "Cloud & DevOps", importance: "high" },
  { name: "GitHub Actions", match: /\bgithub\s*actions\b/i, category: "Cloud & DevOps", importance: "high" },
  { name: "Jenkins", match: /\bjenkins\b/i, category: "Cloud & DevOps", importance: "medium" },
  { name: "Linux", match: /\blinux\b/i, category: "Cloud & DevOps", importance: "medium" },
  { name: "Nginx", match: /\bnginx\b/i, category: "Cloud & DevOps", importance: "medium" },
  { name: "Serverless", match: /\bserverless\b/i, category: "Cloud & DevOps", importance: "medium" },
  { name: "Cloudflare", match: /\bcloudflare\b/i, category: "Cloud & DevOps", importance: "low" },

  // --- Testing & Quality ---
  { name: "Jest", match: /\bjest\b/i, category: "Testing & QA", importance: "medium" },
  { name: "Cypress", match: /\bcypress\b/i, category: "Testing & QA", importance: "medium" },
  { name: "Playwright", match: /\bplaywright\b/i, category: "Testing & QA", importance: "medium" },
  { name: "Unit Testing", match: /\bunit\s+testing\b/i, category: "Testing & QA", importance: "high" },
  { name: "TDD", match: /\b(tdd|test-driven\s+development)\b/i, category: "Testing & QA", importance: "medium" },
  { name: "Integration Testing", match: /\bintegration\s+testing\b/i, category: "Testing & QA", importance: "medium" },

  // --- Data, AI & ML ---
  { name: "Machine Learning", match: /\b(machine\s+learning|ml)\b/i, category: "Data & AI", importance: "high" },
  { name: "Deep Learning", match: /\bdeep\s+learning\b/i, category: "Data & AI", importance: "high" },
  { name: "Artificial Intelligence", match: /\b(artificial\s+intelligence|ai)\b/i, category: "Data & AI", importance: "high" },
  { name: "PyTorch", match: /\bpytorch\b/i, category: "Data & AI", importance: "high" },
  { name: "TensorFlow", match: /\btensorflow\b/i, category: "Data & AI", importance: "high" },
  { name: "Pandas", match: /\bpandas\b/i, category: "Data & AI", importance: "medium" },
  { name: "NumPy", match: /\bnumpy\b/i, category: "Data & AI", importance: "medium" },
  { name: "LLMs", match: /\b(llm|llms|large\s+language\s+models?)\b/i, category: "Data & AI", importance: "high" },
  { name: "NLP", match: /\b(nlp|natural\s+language\s+processing)\b/i, category: "Data & AI", importance: "medium" },
  { name: "Apache Spark", match: /\b(spark|apache\s+spark)\b/i, category: "Data & AI", importance: "medium" },
  { name: "Kafka", match: /\b(kafka|apache\s+kafka)\b/i, category: "Data & AI", importance: "high" },

  // --- Architecture & Methodologies ---
  { name: "System Design", match: /\bsystem\s+design\b/i, category: "Methodologies", importance: "high" },
  { name: "Agile", match: /\bagile\b/i, category: "Methodologies", importance: "high" },
  { name: "Scrum", match: /\bscrum\b/i, category: "Methodologies", importance: "medium" },
  { name: "Code Review", match: /\bcode\s+reviews?\b/i, category: "Methodologies", importance: "medium" },
  { name: "Clean Code", match: /\bclean\s+code\b/i, category: "Methodologies", importance: "medium" },
  { name: "OAuth / JWT", match: /\b(oauth|oauth2|jwt|authentication)\b/i, category: "Methodologies", importance: "high" },

  // --- Tools & Platforms ---
  { name: "Git", match: /\bgit\b/i, category: "Tools & Platforms", importance: "high" },
  { name: "GitHub", match: /\bgithub\b/i, category: "Tools & Platforms", importance: "medium" },
  { name: "GitLab", match: /\bgitlab\b/i, category: "Tools & Platforms", importance: "medium" },
  { name: "Jira", match: /\bjira\b/i, category: "Tools & Platforms", importance: "medium" },
  { name: "Postman", match: /\bpostman\b/i, category: "Tools & Platforms", importance: "medium" },
  { name: "Figma", match: /\bfigma\b/i, category: "Tools & Platforms", importance: "medium" },

  // --- Core Soft & Professional Skills ---
  { name: "Leadership", match: /\b(leadership|lead|managed|mentorship|mentored)\b/i, category: "Professional Skills", importance: "medium" },
  { name: "Problem Solving", match: /\bproblem\s+solving\b/i, category: "Professional Skills", importance: "medium" },
  { name: "Cross-functional Collaboration", match: /\b(cross-functional|collaboration|collaborative)\b/i, category: "Professional Skills", importance: "medium" },
  { name: "Project Management", match: /\bproject\s+management\b/i, category: "Professional Skills", importance: "medium" },
];

/**
 * Strict Stopwords & Boilerplate words that must NEVER be extracted as skills.
 */
export const STOP_WORDS = new Set([
  "job", "description", "requirements", "qualification", "qualifications",
  "responsibilities", "responsibility", "company", "about", "overview",
  "looking", "join", "our", "build", "team", "teams", "work", "working",
  "role", "roles", "candidate", "candidates", "applicant", "applicants",
  "hiring", "apply", "applying", "opportunity", "opportunities", "experience",
  "experienced", "years", "year", "month", "months", "day", "days",
  "ltd", "limited", "inc", "incorporated", "corp", "corporation", "llc", "pvt", "gigalogy",
  "we", "you", "they", "our", "us", "your", "their", "them", "who", "what", "where", "when", "why", "how",
  "for", "and", "with", "the", "a", "an", "in", "on", "at", "by", "to", "from", "of",
  "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
  "will", "would", "shall", "should", "can", "could", "may", "might", "must",
  "this", "that", "these", "those", "here", "there", "some", "any", "every", "all",
  "plus", "bonus", "prefer", "preferred", "minimum", "degree", "bachelor", "master",
  "skill", "skills", "ability", "abilities", "knowledge", "strong", "excellent", "good", "great",
  "proven", "track", "record", "demonstrated", "familiar", "hands-on", "expert", "expertise",
  "environment", "dynamic", "fast-paced", "high-quality", "modern", "scalable", "solutions",
  "full", "stack", "frontend", "backend", "engineer", "engineering", "developer", "development",
  "software", "web", "professional", "successful", "success", "effective", "effectively",
  "including", "such", "well", "ensure", "ensuring", "help", "helping", "create", "creating",
  "drive", "driving", "maintain", "maintaining", "support", "supporting", "provide", "providing"
]);

export interface ExtractedSkillResult {
  keyword: string;
  count: number;
  importance: "high" | "medium" | "low";
  category: string;
  matched: boolean;
}

/**
 * Extracts ONLY genuine skill keywords mentioned in the job description,
 * then checks their presence and count in the resume text.
 */
export function extractSkillKeywords(
  resumeText: string,
  jobDescription: string
): {
  matchedKeywords: ExtractedSkillResult[];
  missingKeywords: ExtractedSkillResult[];
  overallRatio: number;
} {
  const jobTextLower = jobDescription.toLowerCase();
  const resumeTextLower = resumeText.toLowerCase();

  const matchedKeywords: ExtractedSkillResult[] = [];
  const missingKeywords: ExtractedSkillResult[] = [];

  // 1. Check which known skills are mentioned in the job description
  for (const skill of KNOWN_SKILLS) {
    if (skill.match.test(jobTextLower)) {
      // Skill is requested in the job description!
      // Now check if resume contains it
      const matchInResume = skill.match.test(resumeTextLower);

      // Count occurrences in resume
      let count = 0;
      if (matchInResume) {
        const regexGlobal = new RegExp(skill.match.source, "gi");
        const matches = resumeText.match(regexGlobal);
        count = matches ? matches.length : 1;
      }

      const item: ExtractedSkillResult = {
        keyword: skill.name,
        count,
        importance: skill.importance,
        category: skill.category,
        matched: matchInResume,
      };

      if (matchInResume) {
        matchedKeywords.push(item);
      } else {
        missingKeywords.push(item);
      }
    }
  }

  // Sort matched by count descending, missing by importance
  matchedKeywords.sort((a, b) => b.count - a.count);
  missingKeywords.sort((a, b) => {
    const impOrder = { high: 0, medium: 1, low: 2 };
    return impOrder[a.importance] - impOrder[b.importance];
  });

  const totalRequired = matchedKeywords.length + missingKeywords.length;
  const overallRatio = totalRequired > 0 ? matchedKeywords.length / totalRequired : 0.75;

  return {
    matchedKeywords,
    missingKeywords,
    overallRatio,
  };
}

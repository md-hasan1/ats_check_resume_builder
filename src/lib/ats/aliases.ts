/**
 * Technology and skill alias dictionary.
 * Maps canonical skill names to recognized aliases, variants, and abbreviations.
 * Optimized with pre-built hash maps for O(1) lookups.
 */

export interface SkillAliasGroup {
  canonical: string;
  category: "languages" | "frameworks" | "databases" | "cloud" | "devops" | "tools" | "concepts" | "ai" | "other";
  aliases: string[];
}

export const SKILL_ALIAS_GROUPS: SkillAliasGroup[] = [
  // Programming Languages
  {
    canonical: "JavaScript",
    category: "languages",
    aliases: ["js", "javascript", "ecmascript", "es6", "es6+", "vanilla js", "es2020", "es2022"],
  },
  {
    canonical: "TypeScript",
    category: "languages",
    aliases: ["ts", "typescript", "typed javascript"],
  },
  {
    canonical: "Python",
    category: "languages",
    aliases: ["python", "python3", "py", "python 3.x"],
  },
  {
    canonical: "Go",
    category: "languages",
    aliases: ["golang", "go lang", "go language"],
  },
  {
    canonical: "Rust",
    category: "languages",
    aliases: ["rustlang", "rust"],
  },
  {
    canonical: "C++",
    category: "languages",
    aliases: ["cpp", "c plus plus", "c/c++"],
  },
  {
    canonical: "C#",
    category: "languages",
    aliases: ["csharp", "c sharp", "dotnet c#", ".net c#"],
  },
  {
    canonical: "PHP",
    category: "languages",
    aliases: ["php7", "php8", "modern php"],
  },
  {
    canonical: "Ruby",
    category: "languages",
    aliases: ["ruby", "ruby on rails", "ror"],
  },
  {
    canonical: "Java",
    category: "languages",
    aliases: ["java 8", "java 11", "java 17", "java 21", "core java", "j2ee"],
  },
  {
    canonical: "Kotlin",
    category: "languages",
    aliases: ["kotlin", "kt"],
  },
  {
    canonical: "Swift",
    category: "languages",
    aliases: ["swift", "swiftui", "apple swift"],
  },
  {
    canonical: "SQL",
    category: "languages",
    aliases: ["structured query language", "t-sql", "pl/sql", "ansi sql"],
  },
  {
    canonical: "HTML/CSS",
    category: "languages",
    aliases: ["html", "html5", "css", "css3", "sass", "scss", "semantic html"],
  },
  {
    canonical: "Dart",
    category: "languages",
    aliases: ["dartlang", "flutter dart"],
  },

  // Frontend & UI Frameworks
  {
    canonical: "React",
    category: "frameworks",
    aliases: ["react.js", "reactjs", "react js", "react 18", "react 19"],
  },
  {
    canonical: "Next.js",
    category: "frameworks",
    aliases: ["nextjs", "next js", "next.js framework", "next 14", "next 15"],
  },
  {
    canonical: "Vue.js",
    category: "frameworks",
    aliases: ["vue", "vuejs", "vue 3", "vue2", "nuxt", "nuxtjs"],
  },
  {
    canonical: "Angular",
    category: "frameworks",
    aliases: ["angularjs", "angular 2+", "angular io", "angular framework"],
  },
  {
    canonical: "Svelte",
    category: "frameworks",
    aliases: ["sveltejs", "sveltekit", "svelte kit"],
  },
  {
    canonical: "Tailwind CSS",
    category: "frameworks",
    aliases: ["tailwindcss", "tailwind", "tailwind-css"],
  },
  {
    canonical: "Redux",
    category: "frameworks",
    aliases: ["redux toolkit", "rtk", "react redux"],
  },
  {
    canonical: "React Native",
    category: "frameworks",
    aliases: ["react-native", "rn mobile", "expo react native"],
  },

  // Backend Frameworks & Runtimes
  {
    canonical: "Node.js",
    category: "frameworks",
    aliases: ["node", "nodejs", "node js", "node.js runtime"],
  },
  {
    canonical: "Express.js",
    category: "frameworks",
    aliases: ["express", "expressjs", "express js"],
  },
  {
    canonical: "NestJS",
    category: "frameworks",
    aliases: ["nest.js", "nest js", "nestjs framework"],
  },
  {
    canonical: "FastAPI",
    category: "frameworks",
    aliases: ["fast api", "fastapi framework"],
  },
  {
    canonical: "Django",
    category: "frameworks",
    aliases: ["django framework", "django rest framework", "drf"],
  },
  {
    canonical: "Flask",
    category: "frameworks",
    aliases: ["flask python", "flask framework"],
  },
  {
    canonical: "Spring Boot",
    category: "frameworks",
    aliases: ["springboot", "spring", "spring framework", "spring-boot"],
  },
  {
    canonical: "ASP.NET",
    category: "frameworks",
    aliases: [".net core", "asp.net core", "dotnet core", ".net 8", "dotnet"],
  },
  {
    canonical: "Laravel",
    category: "frameworks",
    aliases: ["laravel framework", "php laravel"],
  },

  // Databases & Storage
  {
    canonical: "PostgreSQL",
    category: "databases",
    aliases: ["postgres", "postgresql db", "pg", "psql", "postgres database"],
  },
  {
    canonical: "MySQL",
    category: "databases",
    aliases: ["my sql", "mariadb", "mysql database"],
  },
  {
    canonical: "MongoDB",
    category: "databases",
    aliases: ["mongo", "mongodb atlas", "nosql mongodb"],
  },
  {
    canonical: "Redis",
    category: "databases",
    aliases: ["redis cache", "redis store", "in-memory redis"],
  },
  {
    canonical: "Elasticsearch",
    category: "databases",
    aliases: ["elastic search", "elk", "elastic stack", "opensearch"],
  },
  {
    canonical: "Prisma",
    category: "databases",
    aliases: ["prisma orm", "prisma client"],
  },
  {
    canonical: "SQLite",
    category: "databases",
    aliases: ["sqlite3", "embedded sqlite"],
  },
  {
    canonical: "Cassandra",
    category: "databases",
    aliases: ["apache cassandra", "cassandra db"],
  },
  {
    canonical: "DynamoDB",
    category: "databases",
    aliases: ["dynamo db", "aws dynamodb", "amazon dynamodb"],
  },
  {
    canonical: "Firebase",
    category: "databases",
    aliases: ["firestore", "firebase realtime database", "google firebase"],
  },
  {
    canonical: "Kafka",
    category: "databases",
    aliases: ["apache kafka", "kafka streaming", "event-driven kafka"],
  },
  {
    canonical: "RabbitMQ",
    category: "databases",
    aliases: ["rabbit mq", "amqp", "message queue rabbitmq"],
  },

  // Cloud & DevOps
  {
    canonical: "Docker",
    category: "devops",
    aliases: ["docker compose", "dockerfile", "containerization", "containers"],
  },
  {
    canonical: "Kubernetes",
    category: "devops",
    aliases: ["k8s", "k8", "kube", "k8s cluster", "helm"],
  },
  {
    canonical: "AWS",
    category: "cloud",
    aliases: ["amazon web services", "amazon aws", "aws cloud", "ec2", "s3", "lambda"],
  },
  {
    canonical: "Google Cloud",
    category: "cloud",
    aliases: ["gcp", "google cloud platform", "google cloud provider", "bigquery"],
  },
  {
    canonical: "Microsoft Azure",
    category: "cloud",
    aliases: ["azure", "azure cloud", "ms azure"],
  },
  {
    canonical: "CI/CD",
    category: "devops",
    aliases: ["cicd", "continuous integration", "continuous deployment", "continuous delivery", "ci cd"],
  },
  {
    canonical: "Terraform",
    category: "devops",
    aliases: ["hashicorp terraform", "iac terraform", "infrastructure as code"],
  },
  {
    canonical: "GitHub Actions",
    category: "devops",
    aliases: ["github workflow", "gh actions", "github action"],
  },
  {
    canonical: "GitLab CI",
    category: "devops",
    aliases: ["gitlab ci/cd", "gitlab-ci", "gitlab pipelines"],
  },
  {
    canonical: "Jenkins",
    category: "devops",
    aliases: ["jenkins ci", "jenkins pipeline"],
  },
  {
    canonical: "Linux",
    category: "tools",
    aliases: ["unix", "ubuntu", "debian", "bash", "shell scripting", "centos", "rhel"],
  },

  // Artificial Intelligence & Machine Learning
  {
    canonical: "Machine Learning",
    category: "ai",
    aliases: ["ml", "machine-learning", "predictive modeling", "supervised learning"],
  },
  {
    canonical: "Deep Learning",
    category: "ai",
    aliases: ["neural networks", "dnn", "cnn", "rnn", "transformers"],
  },
  {
    canonical: "Artificial Intelligence",
    category: "ai",
    aliases: ["ai", "generative ai", "genai", "llm", "large language models"],
  },
  {
    canonical: "PyTorch",
    category: "ai",
    aliases: ["torch", "pytorch framework"],
  },
  {
    canonical: "TensorFlow",
    category: "ai",
    aliases: ["tf", "tensorflow 2", "keras"],
  },
  {
    canonical: "Natural Language Processing",
    category: "ai",
    aliases: ["nlp", "text processing", "spacy", "nltk", "hugging face"],
  },

  // Architecture & Concepts
  {
    canonical: "REST API",
    category: "concepts",
    aliases: ["restful api", "restful apis", "rest apis", "rest", "restful web services"],
  },
  {
    canonical: "GraphQL",
    category: "concepts",
    aliases: ["gql", "graphql api", "apollo graphql"],
  },
  {
    canonical: "Microservices",
    category: "concepts",
    aliases: ["microservice architecture", "micro-services", "service-oriented architecture", "soa"],
  },
  {
    canonical: "System Design",
    category: "concepts",
    aliases: ["distributed systems", "software architecture", "high availability", "scalability"],
  },
  {
    canonical: "Agile",
    category: "concepts",
    aliases: ["scrum", "kanban", "agile methodology", "sprint planning"],
  },
  {
    canonical: "Testing",
    category: "tools",
    aliases: ["unit testing", "integration testing", "e2e testing", "jest", "vitest", "cypress", "playwright", "tdd"],
  },
  {
    canonical: "Git",
    category: "tools",
    aliases: ["git version control", "github", "gitlab", "version control", "git flow"],
  },
];

// Pre-built lookup maps for O(1) matching
export const ALIAS_TO_CANONICAL = new Map<string, string>();
export const CANONICAL_SET = new Set<string>();

export function simplifyAlias(str: string): string {
  if (!str) return "";
  return str.toLowerCase().replace(/[^a-z0-9+#]/g, "").trim();
}

for (const group of SKILL_ALIAS_GROUPS) {
  const normCanonical = simplifyAlias(group.canonical);
  CANONICAL_SET.add(group.canonical);
  ALIAS_TO_CANONICAL.set(normCanonical, group.canonical);

  for (const alias of group.aliases) {
    ALIAS_TO_CANONICAL.set(simplifyAlias(alias), group.canonical);
  }
}

/**
 * Returns canonical name for a skill, or undefined if not in alias dictionary.
 * Runs in O(1) time.
 */
export function getCanonicalSkill(term: string): string | undefined {
  if (!term) return undefined;
  const simplified = simplifyAlias(term);
  return ALIAS_TO_CANONICAL.get(simplified);
}

/**
 * Check if two skill strings refer to the same technology alias.
 * Runs in O(1) time.
 */
export function areAliases(termA: string, termB: string): boolean {
  if (!termA || !termB) return false;
  const simA = simplifyAlias(termA);
  const simB = simplifyAlias(termB);
  if (simA === simB) return true;

  const canonA = ALIAS_TO_CANONICAL.get(simA);
  const canonB = ALIAS_TO_CANONICAL.get(simB);

  return Boolean(canonA && canonB && canonA === canonB);
}

import "dotenv/config";
import { PrismaClient, EmploymentType, WorkplaceType, JobStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const db = new PrismaClient({ adapter, log: ["error"] });

interface SeedJobDef {
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  experienceLevel: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  requiredSkills: string[];
  preferredSkills: string[];
  description: string;
  requirements: string;
}

const JOBS_DATA: SeedJobDef[] = [
  // 1
  {
    title: "Senior Full Stack Engineer (Next.js & Node.js)",
    department: "Engineering",
    location: "San Francisco, CA (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Senior",
    salaryMin: 145000,
    salaryMax: 185000,
    salaryCurrency: "USD",
    requiredSkills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    preferredSkills: ["GraphQL", "Redis", "Docker", "Jest", "AWS", "Prisma"],
    description: `### About the Role
We are seeking an experienced **Senior Full Stack Engineer** to build resilient, high-performance web applications using modern web technologies. You will collaborate with product designers, frontend specialists, and backend engineers to drive end-to-end user features.

### Key Responsibilities
- Architect, build, and maintain full-stack web applications with Next.js App Router, React Server Components, and Node.js.
- Design normalized relational database schemas in PostgreSQL and build optimized queries with Prisma and connection pooling.
- Create accessible, pixel-perfect, responsive user interfaces with Tailwind CSS and Radix UI components.
- Write robust unit, integration, and end-to-end tests using Jest and Playwright.
- Collaborate with product management on technical feasibility, scoping, and sprint planning.

### Qualifications & Requirements
- 5+ years of software engineering experience building production web applications.
- Strong proficiency in TypeScript, React, Next.js, and Node.js backend services.
- Deep hands-on experience with SQL, PostgreSQL database modeling, indexing, and query optimization.
- Proven track record with RESTful APIs, modern authentication flows (OAuth, JWT, session tokens), and state management.
- Excellent communication skills and comfortable working in an asynchronous, remote-first environment.

### Preferred Qualifications
- Experience with GraphQL schemas, Apollo Client, and microservices architecture.
- Hands-on familiarity with Docker containers, CI/CD pipelines (GitHub Actions), and AWS cloud hosting.
- Experience building B2B SaaS platforms or enterprise dashboards.`,
    requirements: "5+ years of experience with TypeScript, React, Next.js, Node.js, and PostgreSQL.",
  },

  // 2
  {
    title: "Staff Backend Engineer (Distributed Systems & Go)",
    department: "Engineering",
    location: "San Francisco, CA",
    employmentType: "FULL_TIME",
    workplaceType: "HYBRID",
    experienceLevel: "Lead",
    salaryMin: 180000,
    salaryMax: 230000,
    salaryCurrency: "USD",
    requiredSkills: ["Go", "Distributed Systems", "PostgreSQL", "gRPC", "Docker", "Kubernetes"],
    preferredSkills: ["Kafka", "Redis", "Terraform", "AWS", "Microservices", "Event-Driven Architecture"],
    description: `### About the Role
As a **Staff Backend Engineer**, you will lead technical direction for our core transaction processing engine, designing distributed microservices that scale to tens of millions of events per day with ultra-low latency and zero downtime.

### Key Responsibilities
- Design, implement, and scale distributed backend systems written in Golang and gRPC.
- Architect high-throughput event streaming pipelines using Apache Kafka and Redis caching.
- Optimize database performance, query execution plans, and data partitioning in PostgreSQL.
- Partner with infrastructure teams to deploy and manage containerized workloads across Kubernetes clusters.
- Mentor senior engineers, drive architecture review meetings, and author RFC technical design documents.

### Qualifications & Requirements
- 7+ years of backend engineering experience, with at least 3+ years writing high-throughput Go in production.
- Strong mastery of distributed systems principles, concurrency patterns, race conditions, and network protocols.
- Deep expertise in relational databases (PostgreSQL/MySQL) and asynchronous messaging queues (Kafka, RabbitMQ, SQS).
- Hands-on experience containerizing services with Docker and deploying to Kubernetes.
- Bachelor's degree in Computer Science or equivalent practical experience.

### Preferred Qualifications
- Experience with service mesh technologies (Istio, Linkerd) and OpenTelemetry tracing.
- Cloud architecture expertise on AWS or GCP utilizing Terraform for Infrastructure as Code (IaC).`,
    requirements: "7+ years software engineering experience with Go, Distributed Systems, gRPC, and PostgreSQL.",
  },

  // 3
  {
    title: "Senior Frontend Architect (React & Performance)",
    department: "Engineering",
    location: "New York, NY (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Senior",
    salaryMin: 150000,
    salaryMax: 190000,
    salaryCurrency: "USD",
    requiredSkills: ["React", "TypeScript", "Next.js", "Redux Toolkit", "Webpack", "Tailwind CSS"],
    preferredSkills: ["Web Vitals", "Storybook", "Playwright", "Accessibility (a11y)", "Micro-frontends", "Vite"],
    description: `### About the Role
We are looking for a **Senior Frontend Architect** to guide our frontend development practices, optimize Core Web Vitals, and maintain our multi-package design system across several customer-facing applications.

### Key Responsibilities
- Lead architecture decisions for enterprise React and Next.js applications, optimizing bundle sizes and initial load metrics.
- Establish frontend standards, linting rules, automated testing pipelines, and component library governance.
- Spearhead web accessibility (WCAG 2.1 AA compliance) and cross-browser responsiveness.
- Profile runtime client performance, eliminate hydration bottlenecks, and optimize memory consumption.
- Partner closely with Product Design to implement reusable design tokens in Figma and code.

### Qualifications & Requirements
- 5+ years of specialized frontend engineering experience with modern React and TypeScript.
- Deep understanding of the DOM, browser rendering pipelines, rendering lifecycles, and modern CSS/Tailwind.
- Proven experience with state management solutions (Redux Toolkit, Zustand, or TanStack Query).
- Expert knowledge of web performance metrics: LCP, FID/INP, and CLS.

### Preferred Qualifications
- Experience building design systems and testing components with Storybook and Chromatic.
- Experience with micro-frontend architectures, module federation, or Monorepo toolchains (Turborepo/Nx).`,
    requirements: "5+ years of React and TypeScript mastery, with proven expertise in Web Performance and Design Systems.",
  },

  // 4
  {
    title: "Lead AI / Machine Learning Engineer (LLMs & RAG)",
    department: "Data & AI",
    location: "New York, NY",
    employmentType: "FULL_TIME",
    workplaceType: "HYBRID",
    experienceLevel: "Lead",
    salaryMin: 185000,
    salaryMax: 245000,
    salaryCurrency: "USD",
    requiredSkills: ["Python", "PyTorch", "LangChain", "OpenAI API", "Vector Databases", "FastAPI"],
    preferredSkills: ["Fine-tuning", "HuggingFace", "Docker", "Kubernetes", "AWS SageMaker", "LlamaIndex"],
    description: `### About the Role
We are hiring a **Lead AI/ML Engineer** to spearhead our next-generation Generative AI capabilities. You will architect Retrieval-Augmented Generation (RAG) pipelines, fine-tune open-source LLMs, and deploy production ML microservices.

### Key Responsibilities
- Architect and operationalize high-accuracy RAG architectures using vector embeddings and hybrid search (Pinecone, Qdrant, pgvector).
- Fine-tune and evaluate LLMs (Llama 3, Mistral, BERT) for domain-specific NLP parsing, entity extraction, and semantic matching.
- Develop low-latency inference APIs using Python, FastAPI, and asynchronous request queuing.
- Implement comprehensive evaluation benchmarks (Ragas, TruLens) to monitor hallucinations, recall, and precision.
- Collaborate with product and backend teams to integrate intelligent AI copilot capabilities seamlessly.

### Qualifications & Requirements
- 6+ years of total software engineering / ML experience, with 2+ years dedicated to LLMs and NLP.
- Advanced proficiency in Python, PyTorch, Hugging Face transformers, and vector similarity algorithms.
- Hands-on experience developing production services with FastAPI, Docker, and Redis.
- Deep understanding of prompt engineering, semantic indexing, chunking strategies, and tokenization economics.

### Preferred Qualifications
- MS or PhD in Computer Science, Machine Learning, Artificial Intelligence, or related quantitative field.
- Experience deploying models on AWS SageMaker, RunPod, or Kubernetes with GPU orchestration.`,
    requirements: "6+ years experience with Python, PyTorch, LLMs, Vector Databases, and production ML pipelines.",
  },

  // 5
  {
    title: "Senior DevOps & Cloud Infrastructure Engineer",
    department: "DevOps",
    location: "Austin, TX (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Senior",
    salaryMin: 140000,
    salaryMax: 180000,
    salaryCurrency: "USD",
    requiredSkills: ["AWS", "Terraform", "Docker", "Kubernetes", "CI/CD", "Linux"],
    preferredSkills: ["Helm", "Prometheus", "Grafana", "Ansible", "Python", "Bash", "ArgoCD"],
    description: `### About the Role
Join our Infrastructure team as a **Senior DevOps Engineer**. You will manage multi-region AWS cloud environments, automate deployment pipelines, and ensure high availability, security, and developer velocity.

### Key Responsibilities
- Maintain Infrastructure as Code (IaC) using Terraform across multiple AWS environments (Dev, Staging, Production).
- Architect, manage, and scale Amazon EKS (Kubernetes) clusters, networking (VPC, Route53), and security groups.
- Build resilient CI/CD workflows in GitHub Actions to automate container builds, automated testing, and zero-downtime releases.
- Implement observability and monitoring stacks with Prometheus, Grafana, AWS CloudWatch, and Datadog.
- Drive security compliance, vulnerability scanning, secret management (AWS Secrets Manager, Vault), and disaster recovery plans.

### Qualifications & Requirements
- 5+ years of experience in DevOps, Cloud Engineering, or Systems Administration.
- Deep expertise in AWS cloud services (EKS, RDS, S3, IAM, CloudFront, VPC).
- Proven track record with Terraform modules, state management, and declarative cloud provisioning.
- Strong containerization and orchestration skills with Docker and Kubernetes.
- Proficient in Linux system administration and scripting in Bash or Python.

### Preferred Qualifications
- AWS Certified Solutions Architect or Certified Kubernetes Administrator (CKA).
- Experience implementing GitOps workflows with ArgoCD or Flux.`,
    requirements: "5+ years DevOps experience with AWS, Terraform, Kubernetes, and CI/CD automation.",
  },

  // 6
  {
    title: "Principal Site Reliability Engineer (SRE)",
    department: "DevOps",
    location: "Austin, TX",
    employmentType: "FULL_TIME",
    workplaceType: "ON_SITE",
    experienceLevel: "Lead",
    salaryMin: 175000,
    salaryMax: 225000,
    salaryCurrency: "USD",
    requiredSkills: ["Kubernetes", "Terraform", "Linux", "Prometheus", "Grafana", "Incident Management"],
    preferredSkills: ["Go", "Python", "Chaos Engineering", "AWS", "Service Mesh", "OpenTelemetry"],
    description: `### About the Role
We are seeking a **Principal Site Reliability Engineer (SRE)** to champion reliability, resilience, and operational excellence across all distributed services. You will establish SLOs/SLAs, conduct blameless postmortems, and eliminate system toil.

### Key Responsibilities
- Define, track, and enforce Service Level Objectives (SLOs) and Error Budgets with product and engineering teams.
- Lead high-severity incident response rotations, troubleshoot complex system anomalies, and conduct post-incident reviews.
- Automate operational toil using Go and Python, ensuring repeatable recovery and auto-scaling procedures.
- Conduct chaos engineering experiments to identify single points of failure before they impact customers.
- Manage observability instrumentation, distributed tracing, and real-time alerting systems.

### Qualifications & Requirements
- 8+ years of experience in Site Reliability Engineering, Systems Engineering, or Infrastructure Architecture.
- Deep expertise in Linux kernel diagnostics, TCP/IP networking, DNS, and TLS termination.
- Strong hands-on proficiency managing large-scale Kubernetes clusters and cloud infrastructure.
- Demonstrated success establishing on-call practices, runbooks, and incident command structures.

### Preferred Qualifications
- Contributions to open-source cloud native projects (CNCF).
- Experience managing multi-cloud or hybrid environments with strict uptime SLAs (99.99%+).`,
    requirements: "8+ years in SRE/Systems Engineering with Kubernetes, Observability, and Incident Leadership.",
  },

  // 7
  {
    title: "Lead Mobile Engineer (React Native & iOS/Android)",
    department: "Mobile",
    location: "Seattle, WA (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Lead",
    salaryMin: 160000,
    salaryMax: 205000,
    salaryCurrency: "USD",
    requiredSkills: ["React Native", "TypeScript", "Redux", "iOS", "Android", "Mobile CI/CD"],
    preferredSkills: ["Fastlane", "Swift", "Kotlin", "Firebase", "GraphQL", "Offline Storage"],
    description: `### About the Role
We are looking for a **Lead Mobile Engineer** to lead the architecture, performance, and cross-platform development of our flagship iOS and Android mobile apps built with React Native.

### Key Responsibilities
- Direct the architectural roadmap for our cross-platform React Native applications.
- Bridge native code modules in Swift/Objective-C (iOS) and Kotlin/Java (Android) when necessary.
- Optimize app launch times, frame rates (60fps/120fps), memory footprint, and offline caching.
- Build automated build and release pipelines using Fastlane, GitHub Actions, and App Center.
- Manage end-to-end releases on Apple App Store Connect and Google Play Console.

### Qualifications & Requirements
- 6+ years of professional mobile development experience, with 3+ years writing production React Native.
- Deep familiarity with TypeScript, React hooks, state management, and mobile navigation libraries.
- Hands-on knowledge of native iOS and Android build systems (Xcode, CocoaPods, Gradle).
- Experience handling mobile-specific edge cases: offline sync, background tasks, push notifications, and biometric auth.

### Preferred Qualifications
- Published top-ranking consumer apps in Apple App Store and Google Play Store.
- Experience with Expo EAS build workflows and Hermes engine optimizations.`,
    requirements: "6+ years mobile engineering experience with React Native, TypeScript, and native mobile bridges.",
  },

  // 8
  {
    title: "Senior Python / Django Backend Developer",
    department: "Engineering",
    location: "Chicago, IL",
    employmentType: "FULL_TIME",
    workplaceType: "HYBRID",
    experienceLevel: "Senior",
    salaryMin: 135000,
    salaryMax: 175000,
    salaryCurrency: "USD",
    requiredSkills: ["Python", "Django", "Django REST Framework", "PostgreSQL", "Celery", "Redis"],
    preferredSkills: ["Docker", "AWS", "Pytest", "Elasticsearch", "FastAPI", "Asyncio"],
    description: `### About the Role
We are hiring a **Senior Python/Django Backend Developer** to design scalable REST APIs, manage complex asynchronous tasks with Celery/Redis, and power high-volume transactions for our enterprise platform.

### Key Responsibilities
- Architect, build, and optimize backend applications using Python, Django, and Django REST Framework.
- Implement background job processing pipelines using Celery, Redis, and message queues.
- Write high-performance database queries and manage migrations in PostgreSQL.
- Integrate third-party APIs (Stripe, Twilio, OAuth2, AWS S3) and design clean RESTful contracts.
- Write thorough test suites with Pytest and maintain continuous integration checks.

### Qualifications & Requirements
- 5+ years of software engineering experience focusing on Python backend development.
- Strong mastery of Django ORM, query optimization, indexing, and connection management.
- Experience designing resilient asynchronous tasks and scheduled cron jobs.
- Solid understanding of web security fundamentals (CSRF, XSS, SQL Injection prevention, rate limiting).

### Preferred Qualifications
- Experience with search engines like Elasticsearch or OpenSearch.
- Experience migrating synchronous Django services to asynchronous patterns with FastAPI or Celery async.`,
    requirements: "5+ years of Python engineering experience with Django, DRF, PostgreSQL, and Celery.",
  },

  // 9
  {
    title: "Senior Java / Spring Boot Microservices Engineer",
    department: "Engineering",
    location: "Seattle, WA",
    employmentType: "FULL_TIME",
    workplaceType: "HYBRID",
    experienceLevel: "Senior",
    salaryMin: 145000,
    salaryMax: 185000,
    salaryCurrency: "USD",
    requiredSkills: ["Java", "Spring Boot", "Microservices", "Hibernate/JPA", "PostgreSQL", "Docker"],
    preferredSkills: ["Apache Kafka", "Kubernetes", "Maven", "JUnit", "Cloud Platforms", "Reactive Spring"],
    description: `### About the Role
Join our core platform engineering team as a **Senior Java/Spring Boot Engineer**. You will design secure, fault-tolerant enterprise microservices that process high volumes of financial and operational data.

### Key Responsibilities
- Design, code, and deploy microservices using modern Java (17/21) and the Spring Boot framework.
- Develop data access layers with Spring Data JPA, Hibernate, and optimized PostgreSQL queries.
- Implement event-driven communication between services using Apache Kafka and message schemas.
- Maintain test-driven development practices with JUnit 5, Mockito, and Testcontainers.
- Collaborate with cloud teams to deploy microservices within containerized Kubernetes environments.

### Qualifications & Requirements
- 5+ years of software engineering experience building scalable Java enterprise applications.
- Strong hands-on knowledge of the Spring ecosystem: Spring Boot, Spring Security, Spring Cloud.
- Deep understanding of OOP, clean code principles, design patterns, and multithreading.
- Solid experience with relational databases and transactional integrity.

### Preferred Qualifications
- Experience with Spring WebFlux and reactive programming paradigms.
- Experience in Fintech, payments processing, or high-security compliance environments.`,
    requirements: "5+ years of Java enterprise development with Spring Boot, JPA, and Microservices.",
  },

  // 10
  {
    title: "Principal Data Engineer (Modern Data Stack & Snowflake)",
    department: "Data & AI",
    location: "Denver, CO (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Lead",
    salaryMin: 170000,
    salaryMax: 215000,
    salaryCurrency: "USD",
    requiredSkills: ["Python", "SQL", "Snowflake", "dbt", "Apache Airflow", "Data Modeling"],
    preferredSkills: ["Spark", "Kafka", "AWS S3", "BigQuery", "Data Governance", "Fivetran"],
    description: `### About the Role
We are seeking a **Principal Data Engineer** to design and scale our enterprise data platform. You will build reliable analytical pipelines, establish dimensional data models, and empower our analytics and machine learning teams.

### Key Responsibilities
- Architect scalable ELT/ETL data pipelines using Python, SQL, dbt, and Apache Airflow.
- Design data warehouse schemas (Star/Snowflake schema, Kimball methodology) in Snowflake.
- Implement automated data quality testing, schema drift detection, and data lineage tracking.
- Optimize query performance, clustering keys, and warehouse compute spending in cloud databases.
- Partner with product analysts and data scientists to deliver reliable analytical data marts.

### Qualifications & Requirements
- 7+ years of experience in data engineering, building production-grade data pipelines.
- Expert-level SQL skills and deep mastery of cloud data warehouses (Snowflake, BigQuery, or Redshift).
- Proven track record with dbt (data build tool), modular modeling, and version-controlled data transformations.
- Strong programming skills in Python for data extraction, manipulation, and pipeline orchestration.

### Preferred Qualifications
- Experience streaming real-time data using Apache Kafka, Kinesis, or Spark Streaming.
- Experience implementing data governance, access controls, and GDPR/CCPA data privacy compliance.`,
    requirements: "7+ years experience in Data Engineering with Python, Snowflake, dbt, and Apache Airflow.",
  },

  // 11
  {
    title: "Senior Data Scientist (Predictive Analytics & ML)",
    department: "Data & AI",
    location: "Boston, MA",
    employmentType: "FULL_TIME",
    workplaceType: "HYBRID",
    experienceLevel: "Senior",
    salaryMin: 140000,
    salaryMax: 180000,
    salaryCurrency: "USD",
    requiredSkills: ["Python", "Scikit-learn", "Pandas", "NumPy", "SQL", "Statistical Modeling"],
    preferredSkills: ["Tableau", "XGBoost", "A/B Testing", "Feature Engineering", "Docker", "MLflow"],
    description: `### About the Role
We are looking for a **Senior Data Scientist** to translate complex business problems into actionable predictive models. You will explore large datasets, design experimental tests, and build machine learning algorithms that drive user engagement.

### Key Responsibilities
- Formulate hypotheses, perform exploratory data analysis (EDA), and engineer features from messy data.
- Develop, evaluate, and deploy predictive models (classification, regression, customer churn, LTV) using Scikit-learn and XGBoost.
- Design and analyze randomized controlled trials (A/B testing) to validate product enhancements.
- Build executive dashboards and data visualizations using Python (Matplotlib/Seaborn) and Tableau.
- Collaborate with engineering teams to package and serve models via REST API endpoints.

### Qualifications & Requirements
- 5+ years of professional data science experience applying statistical and machine learning models.
- Advanced proficiency in Python (Pandas, NumPy, Scikit-learn) and complex SQL queries.
- Solid grounding in statistics, hypothesis testing, probability distributions, and causal inference.
- Strong ability to articulate technical insights and model trade-offs to business stakeholders.

### Preferred Qualifications
- Master's or PhD degree in Statistics, Data Science, Economics, Mathematics, or Computer Science.
- Experience tracking experiments with MLflow or Weights & Biases.`,
    requirements: "5+ years of data science experience with Python, SQL, Machine Learning, and A/B Testing.",
  },

  // 12
  {
    title: "Senior QA Automation Engineer (Playwright & TypeScript)",
    department: "Quality Assurance",
    location: "Chicago, IL (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Senior",
    salaryMin: 125000,
    salaryMax: 160000,
    salaryCurrency: "USD",
    requiredSkills: ["TypeScript", "Playwright", "Cypress", "Test Automation", "CI/CD Integration", "API Testing"],
    preferredSkills: ["Jest", "Performance Testing", "Docker", "Postman", "Selenium", "k6"],
    description: `### About the Role
We are seeking a **Senior QA Automation Engineer** to build and scale our automated testing framework. You will ensure the quality and stability of our web and mobile applications across continuous delivery pipelines.

### Key Responsibilities
- Architect, implement, and maintain scalable end-to-end test automation suites using Playwright and TypeScript.
- Build comprehensive automated API test frameworks validating status codes, schemas, and response payloads.
- Integrate automated tests into GitHub Actions pipelines for automated smoke and regression runs on every PR.
- Partner with developers during sprint planning to identify test scenarios, edge cases, and test data requirements.
- Track test coverage, manage flaky tests, and report quality metrics to engineering leadership.

### Qualifications & Requirements
- 5+ years of quality engineering experience with a primary focus on test automation.
- Strong programming skills in TypeScript or JavaScript.
- Deep expertise in modern test frameworks like Playwright or Cypress (migrated from legacy Selenium).
- Experience testing RESTful APIs and verifying database state changes.
- Understanding of CI/CD pipelines and parallel test execution on cloud runners.

### Preferred Qualifications
- Experience with performance and load testing tools such as k6 or JMeter.
- Experience with visual regression testing tools like Percy or Applitools.`,
    requirements: "5+ years in QA Automation with TypeScript, Playwright, API Testing, and CI/CD pipelines.",
  },

  // 13
  {
    title: "Lead Security Engineer (Application & Cloud Security)",
    department: "Cybersecurity",
    location: "Washington, DC (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Lead",
    salaryMin: 165000,
    salaryMax: 215000,
    salaryCurrency: "USD",
    requiredSkills: ["Application Security", "OWASP Top 10", "Penetration Testing", "IAM", "AWS Security", "SOC 2"],
    preferredSkills: ["Vulnerability Scanning", "Terraform Security", "Python", "Bash", "SIEM", "DevSecOps"],
    description: `### About the Role
As our **Lead Security Engineer**, you will safeguard our platform, infrastructure, and customer data. You will champion security best practices, perform threat modeling, and lead compliance certifications.

### Key Responsibilities
- Embed security into the software development lifecycle (DevSecOps) through automated SAST, DAST, and dependency scanning.
- Conduct threat modeling, code reviews, and penetration testing against web applications and APIs.
- Architect identity and access management (IAM) policies, least-privilege models, and zero-trust security postures.
- Oversee compliance audits including SOC 2 Type II, ISO 27001, and GDPR.
- Coordinate incident response plans, monitor SIEM telemetry, and conduct security awareness drills.

### Qualifications & Requirements
- 6+ years of cybersecurity and application security experience in cloud SaaS environments.
- Thorough understanding of OWASP Top 10 vulnerabilities and modern mitigation strategies.
- Hands-on expertise with AWS cloud security controls (GuardDuty, Security Hub, WAF, KMS, IAM).
- Proficiency scripting security automation tools in Python or Bash.
- Strong cross-functional leadership and ability to balance security with developer productivity.

### Preferred Qualifications
- Industry certifications: CISSP, OSCP, or AWS Certified Security Specialty.
- Experience managing bug bounty programs through HackerOne or Bugcrowd.`,
    requirements: "6+ years in Application Security and Cloud Security with AWS, OWASP, and SOC 2 compliance.",
  },

  // 14
  {
    title: "Principal Product Manager (B2B SaaS)",
    department: "Product",
    location: "San Francisco, CA",
    employmentType: "FULL_TIME",
    workplaceType: "HYBRID",
    experienceLevel: "Lead",
    salaryMin: 165000,
    salaryMax: 210000,
    salaryCurrency: "USD",
    requiredSkills: ["Product Roadmap", "Agile/Scrum", "User Stories", "Product Analytics", "Customer Discovery", "SQL"],
    preferredSkills: ["Mixpanel", "Jira", "B2B SaaS", "Monetization", "A/B Testing", "Figma"],
    description: `### About the Role
We are looking for a **Principal Product Manager** to drive the vision, strategy, and execution of our core B2B SaaS platform. You will lead cross-functional squads to launch features that delight customers and drive business growth.

### Key Responsibilities
- Define multi-quarter product roadmaps aligned with executive strategy and enterprise customer needs.
- Conduct qualitative customer discovery interviews and analyze quantitative product metrics.
- Author clear, detailed product requirements documents (PRDs), user stories, and acceptance criteria.
- Lead Agile ceremonies (backlog grooming, sprint planning, feature demos) in partnership with engineering leads.
- Establish North Star metrics, track funnel conversion, and report product KPIs to stakeholders.

### Qualifications & Requirements
- 6+ years of product management experience, preferably in high-growth B2B SaaS companies.
- Proven track record taking complex software products from conception through successful enterprise launch.
- Strong analytical skills: ability to query data in SQL and interpret behavioral analytics (Mixpanel/Amplitude).
- Exceptional verbal and written communication skills with both technical and executive audiences.

### Preferred Qualifications
- Technical background or degree in Computer Science, Engineering, or related discipline.
- Experience with pricing, packaging, and self-serve PLG (Product-Led Growth) monetization funnels.`,
    requirements: "6+ years experience in B2B SaaS Product Management, Roadmap Strategy, and Product Analytics.",
  },

  // 15
  {
    title: "Technical Product Manager (API & Developer Platforms)",
    department: "Product",
    location: "San Francisco, CA (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Senior",
    salaryMin: 150000,
    salaryMax: 195000,
    salaryCurrency: "USD",
    requiredSkills: ["API Design", "REST", "GraphQL", "Developer Documentation", "Technical Roadmaps", "System Architecture"],
    preferredSkills: ["Microservices", "Postman", "OpenTelemetry", "Agile", "SQL", "Webhooks"],
    description: `### About the Role
We are seeking a **Technical Product Manager (TPM)** to own our public APIs, developer portal, webhooks, and third-party integrations. You will bridge the gap between engineering architecture and developer customer experience.

### Key Responsibilities
- Define the roadmap and developer experience (DevEx) for our public and internal APIs.
- Collaborate with backend architects on API standards, schema governance, versioning, and rate limiting.
- Author comprehensive developer documentation, OpenAPI/Swagger specifications, and SDK quickstart guides.
- Monitor API reliability, latency percentiles, error rates, and developer adoption metrics.
- Gather feedback from partner developers and enterprise integration engineers to refine technical requirements.

### Qualifications & Requirements
- 4+ years of product management experience working on technical developer products, APIs, or infrastructure.
- Background in software development or deep familiarity with RESTful, GraphQL, and webhook patterns.
- Strong understanding of authentication schemes (OAuth2, API keys, mTLS) and data formats (JSON, Protobuf).
- Excellent technical writing and documentation capabilities.

### Preferred Qualifications
- Former software engineer or developer advocate transition to product management.
- Experience creating developer communities or managing open-source SDK ecosystems.`,
    requirements: "4+ years experience as a Technical PM managing APIs, Developer Experience, and System Integrations.",
  },

  // 16
  {
    title: "Senior Product Designer (UI/UX & Design Systems)",
    department: "Design",
    location: "New York, NY (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Senior",
    salaryMin: 135000,
    salaryMax: 175000,
    salaryCurrency: "USD",
    requiredSkills: ["Figma", "Design Systems", "UX Research", "Prototyping", "Wireframing", "Information Architecture"],
    preferredSkills: ["Usability Testing", "HTML/CSS basics", "Auto-layout", "Design Tokens", "Mobile Design"],
    description: `### About the Role
We are looking for a **Senior Product Designer** with a passion for building intuitive, elegant software experiences. You will design user flows, maintain our multi-platform design system, and champion the voice of the user.

### Key Responsibilities
- Lead end-to-end product design from user research and wireframes to high-fidelity clickable prototypes in Figma.
- Maintain, document, and evolve our central design system, components, typography, and color tokens.
- Conduct generative user research, usability testing sessions, and synthesize user feedback into actionable design iterations.
- Collaborate closely with frontend engineers to ensure high design fidelity during implementation.
- Advocate for accessible, inclusive design practices (WCAG compliance) across desktop and mobile viewports.

### Qualifications & Requirements
- 5+ years of digital product design (UI/UX) experience for complex web and mobile SaaS applications.
- Mastery of Figma, including advanced auto-layout, interactive component states, and variables.
- A strong design portfolio demonstrating user-centered design processes, problem solving, and polished visual aesthetics.
- Solid understanding of frontend capabilities, constraints, and responsive design principles.

### Preferred Qualifications
- Experience with design tokens and code-to-design synchronization workflows.
- Experience conducting unmoderated usability tests on platforms like UserTesting or Maze.`,
    requirements: "5+ years product design experience with Figma, Design Systems, Prototyping, and UX Research.",
  },

  // 17
  {
    title: "Engineering Manager (Core Infrastructure & Platform)",
    department: "Engineering",
    location: "New York, NY",
    employmentType: "FULL_TIME",
    workplaceType: "HYBRID",
    experienceLevel: "Lead",
    salaryMin: 185000,
    salaryMax: 235000,
    salaryCurrency: "USD",
    requiredSkills: ["Engineering Leadership", "People Management", "System Architecture", "Agile Coaching", "Tech Hiring"],
    preferredSkills: ["Distributed Systems", "OKRs", "Budgeting", "Cloud Infrastructure", "Kubernetes"],
    description: `### About the Role
We are hiring an **Engineering Manager** to lead our Core Infrastructure and Platform engineering squads. You will guide technical direction, foster a culture of engineering excellence, and mentor high-performing engineers.

### Key Responsibilities
- Manage, mentor, and grow a team of 6-10 talented backend, infrastructure, and SRE engineers.
- Drive sprint planning, resource allocation, technical debt reduction, and project execution.
- Partner with product managers and architects to translate strategic business objectives into engineering roadmaps.
- Conduct regular 1-on-1s, performance reviews, career development discussions, and hiring interviews.
- Champion engineering best practices, continuous delivery, high uptime, and operational hygiene.

### Qualifications & Requirements
- 3+ years of people management experience leading software engineering teams.
- 5+ years of previous hands-on software development experience in backend or cloud systems.
- Demonstrated success recruiting, hiring, and retaining diverse engineering talent.
- Strong understanding of modern software architecture, cloud platforms, and Agile methodologies.
- Excellent interpersonal, conflict-resolution, and empathetic leadership skills.

### Preferred Qualifications
- Experience leading distributed, remote-friendly engineering teams.
- Track record managing platform teams that serve internal developers as their primary customer.`,
    requirements: "3+ years engineering management experience with technical background in distributed systems.",
  },

  // 18
  {
    title: "Senior Android Engineer (Kotlin & Jetpack Compose)",
    department: "Mobile",
    location: "San Jose, CA (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Senior",
    salaryMin: 145000,
    salaryMax: 185000,
    salaryCurrency: "USD",
    requiredSkills: ["Kotlin", "Jetpack Compose", "Android SDK", "Coroutines", "MVVM", "Gradle"],
    preferredSkills: ["Koin/Hilt", "Unit Testing", "App Store Deployment", "Firebase", "REST APIs", "Clean Architecture"],
    description: `### About the Role
We are seeking a **Senior Android Engineer** to build delightful, fluid native Android applications. You will modernize our UI using Jetpack Compose, architect clean Kotlin codebases, and optimize performance across diverse Android devices.

### Key Responsibilities
- Develop modern native Android applications using 100% Kotlin and Jetpack Compose.
- Implement reactive architectures using Kotlin Coroutines, StateFlow, ViewModel, and MVVM patterns.
- Manage dependency injection with Hilt or Koin and local data persistence with Room database.
- Optimize app memory usage, background synchronization, and battery consumption.
- Write unit and UI automation tests using MockK, Espresso, and Compose UI Test framework.

### Qualifications & Requirements
- 5+ years of professional Android application development experience.
- Deep expertise in Kotlin language features, functional constructs, and Kotlin Coroutines.
- Proven experience building production interfaces with Jetpack Compose.
- Thorough understanding of the Android platform lifecycle, material design guidelines, and background execution limits.

### Preferred Qualifications
- Experience building modular Android architectures and Multiplatform (KMP) code.
- Applications currently live in the Google Play Store with thousands of active daily users.`,
    requirements: "5+ years native Android development experience with Kotlin, Jetpack Compose, and Coroutines.",
  },

  // 19
  {
    title: "Senior iOS Engineer (Swift & SwiftUI)",
    department: "Mobile",
    location: "San Jose, CA",
    employmentType: "FULL_TIME",
    workplaceType: "HYBRID",
    experienceLevel: "Senior",
    salaryMin: 150000,
    salaryMax: 190000,
    salaryCurrency: "USD",
    requiredSkills: ["Swift", "SwiftUI", "Combine", "UIKit", "Xcode", "Core Data"],
    preferredSkills: ["Clean Architecture", "Unit Testing (XCTest)", "CI/CD", "App Store Submission", "Async/Await"],
    description: `### About the Role
Join our mobile team as a **Senior iOS Engineer**. You will design fluid, native iOS applications utilizing SwiftUI, Combine, and modern Swift concurrency to deliver exceptional user experiences for Apple device owners.

### Key Responsibilities
- Architect, build, and maintain native iOS applications using modern Swift and SwiftUI.
- Bridge existing UIKit components with modern SwiftUI declarative interfaces where required.
- Manage asynchronous networking, caching, and state transitions using Swift Concurrency (async/await, actors).
- Implement persistent local storage using Core Data or SwiftData.
- Maintain automated build and test pipelines with Xcode Cloud and Fastlane.

### Qualifications & Requirements
- 5+ years of professional iOS software development experience with Swift.
- Deep understanding of Apple's Human Interface Guidelines (HIG) and iOS design patterns.
- Proficiency in unit testing with XCTest and writing maintainable, clean code.
- Strong familiarity with App Store submission, provisioning profiles, and certificates.

### Preferred Qualifications
- Experience developing widgets, App Clips, or watchOS extensions.
- Active iOS apps in the App Store demonstrating smooth animations and high ratings.`,
    requirements: "5+ years native iOS development with Swift, SwiftUI, and iOS architectural patterns.",
  },

  // 20
  {
    title: "Associate Frontend Developer (React & JavaScript)",
    department: "Engineering",
    location: "Denver, CO",
    employmentType: "FULL_TIME",
    workplaceType: "HYBRID",
    experienceLevel: "Entry-level",
    salaryMin: 80000,
    salaryMax: 105000,
    salaryCurrency: "USD",
    requiredSkills: ["JavaScript", "React", "HTML5", "CSS3", "Git", "REST APIs"],
    preferredSkills: ["TypeScript", "Tailwind CSS", "Next.js", "Jest", "Responsive Design"],
    description: `### About the Role
We are excited to welcome an **Associate Frontend Developer** to our growing engineering team! This role is ideal for an ambitious developer looking to level up their skills in modern React, TypeScript, and modern web application development.

### Key Responsibilities
- Build responsive, interactive web components using JavaScript (ES6+), React, and Tailwind CSS.
- Consume backend REST APIs and handle loading, error, and empty application states gracefully.
- Participate in code reviews, bug fixes, and continuous improvement of user interface workflows.
- Write unit tests for frontend components and ensure cross-browser compatibility.
- Collaborate with senior engineers who will provide hands-on mentorship and code guidance.

### Qualifications & Requirements
- 1-2 years of software engineering experience or relevant internships/bootcamp project portfolio.
- Solid foundational knowledge of HTML5, CSS3, JavaScript (ES6+), and React component architecture.
- Familiarity with version control workflows using Git and GitHub.
- Passion for clean user experiences, attention to visual detail, and eager to learn new technologies.

### Preferred Qualifications
- Exposure to TypeScript and modern build tools (Vite, Next.js).
- Open-source contributions or personal side projects demonstrating full-stack curiosity.`,
    requirements: "1-2 years experience with JavaScript, React, HTML5, CSS3, and REST API integration.",
  },

  // 21
  {
    title: "Junior Backend Software Engineer (Node.js & Express)",
    department: "Engineering",
    location: "Atlanta, GA (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Entry-level",
    salaryMin: 85000,
    salaryMax: 110000,
    salaryCurrency: "USD",
    requiredSkills: ["JavaScript", "Node.js", "Express", "SQL", "Git", "Problem Solving"],
    preferredSkills: ["TypeScript", "Docker", "MongoDB", "Jest", "Postman", "PostgreSQL"],
    description: `### About the Role
We are seeking a **Junior Backend Software Engineer** to build scalable server-side features, database queries, and REST endpoints using Node.js, Express, and PostgreSQL.

### Key Responsibilities
- Develop and maintain RESTful API endpoints using Node.js, Express, and modern JavaScript.
- Write optimized SQL queries and manage relational database schemas in PostgreSQL.
- Perform automated testing with Jest and Supertest to ensure code stability.
- Investigate and resolve bugs reported by customer support and quality assurance.
- Learn from senior engineers through pair programming and structured technical training.

### Qualifications & Requirements
- 1-2 years of software development experience or Computer Science degree.
- Proficiency in JavaScript (Node.js) and asynchronous programming patterns (Promises, async/await).
- Understanding of database concepts, relational schemas, foreign keys, and SQL queries.
- Working knowledge of Git, branching models, and pull request workflows.

### Preferred Qualifications
- Experience with TypeScript and Docker development containers.
- Familiarity with API testing tools such as Postman or Insomnia.`,
    requirements: "1-2 years backend programming experience with Node.js, Express, and SQL.",
  },

  // 22
  {
    title: "Staff Rust Systems Engineer (High Performance Networking)",
    department: "Engineering",
    location: "San Francisco, CA (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Lead",
    salaryMin: 190000,
    salaryMax: 245000,
    salaryCurrency: "USD",
    requiredSkills: ["Rust", "Systems Programming", "Async (Tokio)", "Memory Management", "Concurrency", "Linux"],
    preferredSkills: ["WebAssembly", "eBPF", "C/C++", "Network Protocols", "Performance Profiling", "SIMD"],
    description: `### About the Role
We are looking for an exceptional **Staff Rust Systems Engineer** to build our high-performance networking engine. You will write memory-safe, ultra-low latency systems software that processes gigabits of streaming network traffic.

### Key Responsibilities
- Design and build mission-critical, low-latency networking software using Rust and Tokio async runtime.
- Optimize CPU cache locality, eliminate memory allocations, and profile hot paths using perf and valgrind.
- Implement custom network protocol parsers (HTTP/2, HTTP/3, QUIC, WebSocket) with zero-copy deserialization.
- Ensure strict memory safety, thread safety, and crash-resilient system architecture.
- Author technical documentation, benchmark suites, and lead architecture reviews for the systems team.

### Qualifications & Requirements
- 6+ years of systems programming experience in Rust, C++, or modern C.
- At least 3+ years writing production-grade Rust software in networked or distributed environments.
- Deep understanding of operating systems internals, Linux kernel syscalls, epoll, and memory models.
- Mastery of safe vs unsafe Rust, lifetimes, ownership, trait system, and concurrency primitives.

### Preferred Qualifications
- Experience with WebAssembly (Wasm) runtimes or Linux eBPF kernel probes.
- Background in high-frequency trading (HFT), CDN edge networking, or game engine networking.`,
    requirements: "6+ years systems programming with at least 3+ years production Rust and asynchronous networking.",
  },

  // 23
  {
    title: "Solutions Architect (Cloud Solutions & Enterprise Migration)",
    department: "Architecture",
    location: "Dallas, TX (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Lead",
    salaryMin: 165000,
    salaryMax: 215000,
    salaryCurrency: "USD",
    requiredSkills: ["AWS Solution Architecture", "System Design", "Cloud Migration", "Enterprise Integration", "Security"],
    preferredSkills: ["GCP", "Azure", "TOGAF", "Cost Optimization", "Kubernetes", "Disaster Recovery"],
    description: `### About the Role
As a **Solutions Architect**, you will partner with enterprise customers and internal engineering teams to design highly scalable, secure, and cost-effective cloud architectures on AWS.

### Key Responsibilities
- Architect enterprise-grade cloud migration blueprints and hybrid cloud infrastructure solutions.
- Conduct technical discovery sessions with enterprise CTOs, VP of Engineering, and lead architects.
- Review system designs for scalability, reliability (Well-Architected Framework), security, and cost efficiency.
- Build reference architectures, proof-of-concept (PoC) demonstrators, and whitepapers.
- Guide cross-functional delivery teams through complex multi-tenant migrations and integrations.

### Qualifications & Requirements
- 7+ years in software architecture, cloud consulting, or senior technical leadership.
- Deep expertise with Amazon Web Services (AWS) architectural design and cloud native patterns.
- Strong background in enterprise networking, identity federation (SAML/SSO), and data protection regulations.
- Outstanding presentation and client-facing communication skills.

### Preferred Qualifications
- AWS Certified Solutions Architect - Professional.
- Experience with multi-cloud architectures across AWS, Microsoft Azure, or Google Cloud Platform.`,
    requirements: "7+ years enterprise cloud solutions architecture experience with AWS and system design.",
  },

  // 24
  {
    title: "Database Administrator & Data Platform Engineer (PostgreSQL)",
    department: "Engineering",
    location: "Dallas, TX",
    employmentType: "FULL_TIME",
    workplaceType: "HYBRID",
    experienceLevel: "Senior",
    salaryMin: 140000,
    salaryMax: 180000,
    salaryCurrency: "USD",
    requiredSkills: ["PostgreSQL", "Query Optimization", "Replication", "High Availability", "Backup/Recovery", "Linux"],
    preferredSkills: ["PgBouncer", "Citus", "Terraform", "Monitoring", "Performance Tuning", "Patroni"],
    description: `### About the Role
We are seeking a skilled **Database Administrator (DBA) & Data Platform Engineer** specializing in PostgreSQL. You will manage our production database clusters, fine-tune indexing, ensure high availability, and protect critical data.

### Key Responsibilities
- Manage multi-terabyte production PostgreSQL clusters, replicas, and connection poolers (PgBouncer).
- Diagnose slow queries, optimize execution plans (EXPLAIN ANALYZE), index layouts, and autovacuum settings.
- Implement robust backup strategies, point-in-time recovery (PITR), and disaster recovery validation drills.
- Oversee database schema migrations, zero-downtime DDL updates, and partitioning schemes.
- Monitor database health, replication lag, buffer cache hits, and transaction wrap-around risks.

### Qualifications & Requirements
- 5+ years of specialized PostgreSQL administration experience in high-volume, 24/7 cloud environments.
- Deep knowledge of PostgreSQL internals: WAL, MVCC, lock escalation, vacuuming, and shared memory.
- Experience configuring streaming replication, failover orchestration (Patroni/Stolon), and connection pooling.
- Strong scripting skills in Bash or Python for automated database maintenance tasks.

### Preferred Qualifications
- Experience with distributed PostgreSQL extensions like Citus or TimescaleDB.
- Experience managing AWS Aurora PostgreSQL or Google Cloud SQL engines.`,
    requirements: "5+ years of PostgreSQL DBA experience with query tuning, replication, and high availability.",
  },

  // 25
  {
    title: "Scrum Master & Technical Agile Coach",
    department: "Project Management",
    location: "Raleigh, NC (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Mid-level",
    salaryMin: 105000,
    salaryMax: 140000,
    salaryCurrency: "USD",
    requiredSkills: ["Scrum", "Kanban", "Agile Coaching", "Jira", "Sprint Planning", "Retrospectives", "Facilitation"],
    preferredSkills: ["SAFe", "Confluence", "Metrics Tracking", "Technical Team Management", "Continuous Improvement"],
    description: `### About the Role
We are seeking a **Scrum Master & Technical Agile Coach** to empower multiple software development squads. You will remove roadblocks, facilitate Agile ceremonies, and foster a culture of continuous learning and delivery.

### Key Responsibilities
- Facilitate daily standups, sprint planning, backlog refinement, sprint reviews, and blameless retrospectives.
- Coach developers, product managers, and QA team members on Agile principles and pragmatic Scrum/Kanban practices.
- Track sprint metrics: velocity, burndown charts, cycle time, and throughput to identify delivery bottlenecks.
- Shield engineering teams from external distractions and resolve cross-team dependencies proactively.
- Optimize Jira workflows, automation rules, and board configurations to match team processes.

### Qualifications & Requirements
- 3+ years of experience as a Scrum Master or Agile Coach in software engineering organizations.
- Certified Scrum Master (CSM) or Professional Scrum Master (PSM I/II).
- Demonstrated ability to coach both technical and non-technical stakeholders on Agile delivery.
- Deep proficiency with Jira and Confluence management.

### Preferred Qualifications
- Experience working with remote and internationally distributed engineering teams.
- Technical background or past experience working alongside DevOps and CI/CD teams.`,
    requirements: "3+ years as a Scrum Master with CSM/PSM certification, Jira expertise, and Agile facilitation.",
  },

  // 26
  {
    title: "Senior NLP & GenAI Software Engineer",
    department: "Data & AI",
    location: "San Francisco, CA (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Senior",
    salaryMin: 165000,
    salaryMax: 215000,
    salaryCurrency: "USD",
    requiredSkills: ["Python", "Transformers", "BERT", "LLM Evaluation", "Embeddings", "PyTorch", "FastAPI"],
    preferredSkills: ["Semantic Search", "LangChain", "ONNX", "Vector DBs", "MLOps", "Model Quantization"],
    description: `### About the Role
We are hiring a **Senior NLP & GenAI Software Engineer** to build natural language processing models, semantic document matching, and automated text analysis engines that power our intelligent screening platform.

### Key Responsibilities
- Build, evaluate, and fine-tune NLP models for named-entity recognition (NER), text classification, and semantic parsing.
- Deploy high-throughput vector embedding pipelines and semantic search algorithms across millions of documents.
- Optimize neural network latency using ONNX Runtime, quantization (bitsandbytes, GGUF), and model distillation.
- Develop production RESTful inference services using Python, FastAPI, and Redis caching.
- Establish automated evaluation pipelines to monitor drift, accuracy, and latency metrics in production.

### Qualifications & Requirements
- 5+ years of software engineering experience with at least 3+ years dedicated to NLP and machine learning.
- Strong mastery of Python, PyTorch, Hugging Face Transformers, and text tokenization algorithms.
- Hands-on experience with vector search engines (Pinecone, Weaviate, Milvus, or FAISS).
- Solid software engineering fundamentals: testing, containerization (Docker), and clean API design.

### Preferred Qualifications
- Publications or open-source projects in NLP, information retrieval, or semantic search.
- Experience with large model quantization and inference acceleration with vLLM or TensorRT-LLM.`,
    requirements: "5+ years in Python/ML with strong focus on NLP, Hugging Face Transformers, and Semantic Search.",
  },

  // 27
  {
    title: "Contract Senior Frontend Developer (Vue 3 & Nuxt.js)",
    department: "Engineering",
    location: "Miami, FL (Remote)",
    employmentType: "CONTRACT",
    workplaceType: "REMOTE",
    experienceLevel: "Senior",
    salaryMin: 120000,
    salaryMax: 160000,
    salaryCurrency: "USD",
    requiredSkills: ["Vue 3", "Composition API", "Nuxt.js", "TypeScript", "Pinia", "Tailwind CSS"],
    preferredSkills: ["Vite", "Vitest", "SSR", "State Management", "REST APIs", "Component Design"],
    description: `### About the Role (Contract - 6 Months with Extension Option)
We are seeking a talented **Contract Senior Frontend Developer** with deep expertise in Vue 3 and Nuxt.js to help accelerate the rollout of our customer-facing portal and self-service analytics modules.

### Key Responsibilities
- Develop responsive, accessible web pages using Vue 3, Composition API, and Nuxt 3 (SSR/SSG).
- Implement centralized state management using Pinia and typed reactive stores.
- Style intuitive, modern user interfaces using Tailwind CSS and headless UI primitives.
- Connect with backend microservices via REST and GraphQL endpoints with robust error handling.
- Write unit and component tests with Vitest and Vue Test Utils.

### Qualifications & Requirements
- 4+ years of professional web development experience with extensive Vue.js (Vue 3 / Composition API).
- Strong proficiency in TypeScript, HTML5, modern CSS, and reactive state management.
- Experience building server-rendered and statically generated applications with Nuxt.js.
- Strong communication and independent delivery skills in a fast-paced contract environment.

### Preferred Qualifications
- Experience migrating legacy Vue 2 Options API codebases to Vue 3 Composition API.
- Available for an immediate start on a 40-hour/week contract basis.`,
    requirements: "4+ years frontend development experience with Vue 3, Composition API, Nuxt.js, and TypeScript.",
  },

  // 28
  {
    title: "Staff Platform & Developer Experience (DevEx) Engineer",
    department: "Engineering",
    location: "Seattle, WA (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Lead",
    salaryMin: 175000,
    salaryMax: 220000,
    salaryCurrency: "USD",
    requiredSkills: ["Developer Tooling", "CI/CD", "Monorepos", "Docker", "TypeScript", "Bash/Python"],
    preferredSkills: ["Internal Developer Portals", "Backstage", "Build Systems", "Kubernetes", "Turborepo"],
    description: `### About the Role
As a **Staff Platform & DevEx Engineer**, your mission is to make our engineering teams 10x more productive. You will own our developer toolchain, local development environments, monorepo architecture, and CI pipeline speeds.

### Key Responsibilities
- Architect, maintain, and optimize monorepo tooling using Turborepo/Nx, TypeScript, and pnpm.
- Accelerate CI build and test execution times, reducing feedback loops from 20 minutes to under 3 minutes.
- Create automated developer tooling, internal CLI tools, and scaffolding generators for new microservices.
- Maintain standardized local development environments with Docker Compose and cloud dev environments.
- Measure and improve Developer Experience metrics: lead time for changes, deployment frequency, and dev sentiment.

### Qualifications & Requirements
- 7+ years in software engineering, platform engineering, or build/release automation.
- Proven experience managing large multi-package monorepos and caching build targets.
- Strong scripting skills in TypeScript, Node.js, and Bash/Python.
- Deep familiarity with CI/CD platforms (GitHub Actions, GitLab CI) and runner optimizations.

### Preferred Qualifications
- Experience deploying Spotify Backstage or internal developer self-service portals.
- Experience with Bazel, remote build caching, or containerized ephemeral test environments.`,
    requirements: "7+ years platform engineering experience with Developer Tooling, Monorepos, and CI/CD optimization.",
  },

  // 29
  {
    title: "Senior Growth & Data Marketing Engineer",
    department: "Marketing",
    location: "San Francisco, CA (Remote)",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    experienceLevel: "Senior",
    salaryMin: 135000,
    salaryMax: 175000,
    salaryCurrency: "USD",
    requiredSkills: ["SQL", "Segment", "Google Tag Manager", "Python", "A/B Testing", "Webhooks", "API Integration"],
    preferredSkills: ["Amplitude", "Mixpanel", "Reverse ETL", "HTML/JS", "Marketing Automation", "HubSpot"],
    description: `### About the Role
We are seeking a **Senior Growth & Data Marketing Engineer** to bridge the gap between engineering, product, and growth marketing. You will build tracking pipelines, automate lead workflows, and implement experimentation frameworks.

### Key Responsibilities
- Architect customer data tracking infrastructure using Segment, Google Tag Manager (GTM), and server-side events.
- Implement and analyze high-velocity A/B tests and conversion rate optimization (CRO) experiments.
- Build automated data synchronization pipelines using Reverse ETL (Census/Hightouch) and Python scripts.
- Integrate CRM platforms (HubSpot, Salesforce) with internal product databases via webhooks and REST APIs.
- Write complex SQL models to calculate customer acquisition cost (CAC), LTV, and attribution funnels.

### Qualifications & Requirements
- 4+ years of experience in growth engineering, marketing analytics, or full-stack web development.
- Strong technical skills in JavaScript, HTML, SQL, and Python.
- Deep expertise in customer data platforms (CDP) like Segment and behavioral analytics tools (Amplitude/Mixpanel).
- Strong mathematical intuition for statistical significance in A/B testing.

### Preferred Qualifications
- Experience optimizing landing page performance and SEO technical audits.
- Background in high-growth B2B SaaS growth experimentation loops.`,
    requirements: "4+ years growth engineering experience with Segment, GTM, SQL, Python, and A/B Testing.",
  },

  // 30
  {
    title: "Lead Release & Build Engineer (DevOps & GitOps)",
    department: "DevOps",
    location: "Washington, DC",
    employmentType: "FULL_TIME",
    workplaceType: "HYBRID",
    experienceLevel: "Lead",
    salaryMin: 160000,
    salaryMax: 205000,
    salaryCurrency: "USD",
    requiredSkills: ["GitOps", "ArgoCD", "Kubernetes", "GitHub Actions", "Helm", "Linux", "Scripting"],
    preferredSkills: ["Docker", "Security Scanning", "Infrastructure as Code", "Cloudflare", "Vault"],
    description: `### About the Role
We are looking for a **Lead Release & Build Engineer** to govern our release engineering workflows. You will implement GitOps release automation with ArgoCD, streamline progressive delivery, and ensure zero-downtime production deployments.

### Key Responsibilities
- Architect and manage GitOps deployment workflows using ArgoCD, Helm charts, and Kubernetes.
- Implement progressive rollout strategies (canary deployments, blue-green releases) with automated rollbacks.
- Build secure, repeatable artifact pipelines with automated container signing, SBOM generation, and vulnerability gates.
- Collaborate with development squads to design standardized release branches, semantic versioning, and changelogs.
- Ensure 99.99% availability of build infrastructure, runners, and deployment controllers.

### Qualifications & Requirements
- 6+ years of DevOps, Release Engineering, or SRE experience.
- Deep hands-on expertise with GitOps principles, ArgoCD, and Kubernetes cluster operations.
- Strong proficiency writing Helm charts, Kustomize overlays, and GitHub Actions workflows.
- Solid background in Linux system internals, container security, and secret injection.

### Preferred Qualifications
- Experience with service mesh traffic shifting (Argo Rollouts, Flagger, or Istio).
- Certified Kubernetes Administrator (CKA) or GitOps certifications.`,
    requirements: "6+ years release engineering experience with GitOps, ArgoCD, Helm, and Kubernetes.",
  },
];

async function main() {
  console.log("=======================================================");
  console.log("  SEEDING 30 REALISTIC JOBS FOR ATS CHECKING");
  console.log("=======================================================\n");

  // Find target user Md Hasan
  const user = await db.user.findFirst({
    where: {
      OR: [
        { email: "mdhasan26096@gmail.com" },
        { id: "NUbCJlVrKkrpEkHuATitOu2k9SPkYTlo" }
      ]
    },
    include: {
      organizationMembers: {
        include: { organization: true }
      }
    }
  });

  if (!user) {
    throw new Error("Target user Md Hasan not found in database!");
  }

  // Get primary organization
  const primaryOrg = user.organizationMembers.find(m => m.organization.name.includes("Hasan")) || user.organizationMembers[0];
  if (!primaryOrg) {
    throw new Error("Target user has no organizations!");
  }

  const organizationId = primaryOrg.organizationId;
  const userId = user.id;

  console.log(`Target User: ${user.name} (${user.email}) - ID: ${userId}`);
  console.log(`Target Organization: ${primaryOrg.organization.name} - ID: ${organizationId}\n`);

  let createdJobs = 0;
  let createdJobDescriptions = 0;

  for (let i = 0; i < JOBS_DATA.length; i++) {
    const jobDef = JOBS_DATA[i];
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 45 + (i * 2)); // 45 to 105 days in future

    // 1. Create or upsert the Job in the user's workspace
    const job = await db.job.create({
      data: {
        organizationId,
        createdById: userId,
        title: jobDef.title,
        department: jobDef.department,
        location: jobDef.location,
        employmentType: jobDef.employmentType,
        workplaceType: jobDef.workplaceType,
        experienceLevel: jobDef.experienceLevel,
        salaryMin: jobDef.salaryMin,
        salaryMax: jobDef.salaryMax,
        salaryCurrency: jobDef.salaryCurrency,
        description: jobDef.description,
        requirements: jobDef.requirements,
        requiredSkills: jobDef.requiredSkills,
        preferredSkills: jobDef.preferredSkills,
        applicationDeadline: deadline,
        status: "PUBLISHED",
      },
    });

    createdJobs++;

    // 2. Also create a JobDescription in Copilot/ATS Checker for seamless 1-click ATS checking
    await db.jobDescription.create({
      data: {
        userId,
        title: jobDef.title,
        company: primaryOrg.organization.name,
        sourceUrl: `/careers/${job.id}`,
        content: jobDef.description,
        parsedSkills: {
          required: jobDef.requiredSkills,
          preferred: jobDef.preferredSkills,
          all: [...jobDef.requiredSkills, ...jobDef.preferredSkills],
        },
        keywords: [
          ...jobDef.requiredSkills,
          ...jobDef.preferredSkills,
          jobDef.experienceLevel,
          jobDef.department,
        ],
      },
    });

    createdJobDescriptions++;

    console.log(`[${i + 1}/30] Created: "${job.title}" (${job.department}) - ID: ${job.id}`);
  }

  console.log("\n=======================================================");
  console.log(`✓ Successfully created ${createdJobs} Jobs in ${primaryOrg.organization.name}`);
  console.log(`✓ Successfully created ${createdJobDescriptions} JobDescriptions for ATS Checker`);
  console.log("=======================================================\n");

  const totalJobs = await db.job.count({ where: { organizationId } });
  console.log(`Total active jobs in workspace "${primaryOrg.organization.name}": ${totalJobs}`);
}

main()
  .catch((err) => {
    console.error("Seeding failed with error:", err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());


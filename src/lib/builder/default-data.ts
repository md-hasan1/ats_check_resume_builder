import type { ResumeData, ResumeCustomization } from "@/types/resume-builder";

export const DEFAULT_RESUME_DATA: ResumeData = {
  personal: {
    fullName: "Alex Mercer",
    jobTitle: "Senior Full Stack Software Engineer",
    email: "alex.mercer@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    website: "https://alexmercer.dev",
    linkedin: "https://linkedin.com/in/alexmercer",
    github: "https://github.com/alexmercer",
    profileImage: "",
  },
  summary:
    "Innovative Full-Stack Software Engineer with 6+ years of experience building highly available microservices, distributed cloud architectures, and modern web applications using TypeScript, React, Next.js, and Node.js. Proven track record of reducing latency, leading cross-functional teams, and deploying robust CI/CD pipelines.",
  experience: [
    {
      id: "exp-1",
      company: "TechFlow Systems",
      jobTitle: "Lead Full Stack Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2022",
      endDate: "Present",
      current: true,
      description:
        "Led architecture and development of enterprise SaaS workflow automation platform serving 500,000+ daily active users.",
      achievements: [
        "Re-architected legacy monolith into microservices with Node.js and PostgreSQL, decreasing API p99 latency by 45%.",
        "Spearheaded adoption of Next.js and Tailwind CSS across frontend, cutting bundle size by 35% and improving Lighthouse scores to 98.",
        "Mentored team of 7 junior and mid-level engineers through weekly design reviews and architectural workshops.",
      ],
    },
    {
      id: "exp-2",
      company: "Apex Cloud Innovations",
      jobTitle: "Software Engineer",
      location: "Austin, TX",
      startDate: "Jun 2018",
      endDate: "Dec 2021",
      current: false,
      description:
        "Designed and deployed cloud-native APIs, asynchronous event pipelines, and interactive analytics dashboards.",
      achievements: [
        "Constructed real-time event streaming pipeline using Redis and Kafka handling 20,000 events/sec with zero packet loss.",
        "Built automated testing suites with Jest and Cypress, elevating unit and integration test coverage from 60% to 92%.",
        "Collaborated with product designers to implement responsive, accessible UI components complying with WCAG 2.1 AA.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2014",
      endDate: "2018",
      current: false,
      gpa: "3.85 / 4.0",
      description: "Dean's Honor List, President of the ACM Student Chapter.",
    },
  ],
  skills: [
    { name: "TypeScript", level: "Expert", category: "Languages" },
    { name: "JavaScript (ES6+)", level: "Expert", category: "Languages" },
    { name: "React", level: "Expert", category: "Frameworks" },
    { name: "Next.js", level: "Expert", category: "Frameworks" },
    { name: "Node.js", level: "Expert", category: "Frameworks" },
    { name: "Express.js", level: "Advanced", category: "Frameworks" },
    { name: "PostgreSQL", level: "Advanced", category: "Databases" },
    { name: "Redis", level: "Advanced", category: "Databases" },
    { name: "MongoDB", level: "Intermediate", category: "Databases" },
    { name: "Docker", level: "Advanced", category: "DevOps" },
    { name: "Kubernetes", level: "Intermediate", category: "DevOps" },
    { name: "AWS (S3, EC2, Lambda)", level: "Advanced", category: "Cloud" },
    { name: "REST APIs & GraphQL", level: "Expert", category: "Concepts" },
    { name: "CI/CD & GitHub Actions", level: "Advanced", category: "DevOps" },
  ],
  projects: [
    {
      id: "proj-1",
      name: "CloudMetrics AI Monitoring",
      description:
        "Open-source observability toolkit that analyzes microservice latency metrics and predicts traffic spikes using machine learning.",
      technologies: ["TypeScript", "Next.js", "Python", "Docker", "Tailwind CSS"],
      projectUrl: "https://cloudmetrics.dev",
      githubUrl: "https://github.com/alexmercer/cloudmetrics",
      startDate: "2023",
      endDate: "2024",
    },
    {
      id: "proj-2",
      name: "FastCache Distributed KV Store",
      description:
        "High-throughput, in-memory cache system implementing consistent hashing and Raft consensus algorithms.",
      technologies: ["Go", "Distributed Systems", "gRPC", "Docker"],
      projectUrl: "",
      githubUrl: "https://github.com/alexmercer/fastcache",
      startDate: "2022",
      endDate: "2023",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      organization: "Amazon Web Services",
      issueDate: "2023",
      expirationDate: "2026",
      credentialId: "AWS-SAA-839210",
      credentialUrl: "https://aws.amazon.com/verification",
    },
  ],
  languages: [
    { language: "English", proficiency: "Native / Bilingual" },
    { language: "Spanish", proficiency: "Professional Working" },
  ],
  awards: [
    {
      id: "award-1",
      title: "TechFlow Engineering Excellence Award",
      issuer: "TechFlow Systems",
      date: "2023",
      description: "Awarded to top 1% of engineering contributors for outstanding architectural leadership.",
    },
  ],
  customSections: [],
};

export const DEFAULT_CUSTOMIZATION: ResumeCustomization = {
  primaryColor: "#2563eb",
  fontFamily: "Inter, sans-serif",
  fontSize: "base",
  lineSpacing: "normal",
  marginSize: "normal",
  showIcons: true,
  sectionOrder: ["summary", "experience", "education", "skills", "projects", "certifications"],
};

import fs from "fs";
import path from "path";

export interface RawRoleDef {
  title: string;
  department: string;
  category: string;
  level: "Entry-level" | "Mid-level" | "Senior" | "Lead" | "Executive";
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  requirements: string[];
  tools: string[];
}

const ROLES: RawRoleDef[] = [
  // ==========================================
  // 1. FRONTEND & MOBILE (40 roles)
  // ==========================================
  {
    title: "Junior Frontend Developer (HTML/CSS/JS)",
    department: "Engineering",
    category: "Frontend",
    level: "Entry-level",
    requiredSkills: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Git", "REST APIs"],
    preferredSkills: ["React", "Tailwind CSS", "TypeScript", "Webpack", "Figma basics"],
    responsibilities: [
      "Develop responsive and accessible web interfaces using semantic HTML5, CSS3, and JavaScript.",
      "Integrate frontend views with backend REST APIs, handling data fetching and state management.",
      "Fix UI layout bugs, ensure cross-browser compatibility, and participate in code reviews.",
      "Collaborate with senior developers and UI designers to translate mockups into functioning components."
    ],
    requirements: [
      "1-2 years of frontend development experience or equivalent bootcamp/internship projects.",
      "Proficiency in modern JavaScript (ES6+), DOM manipulation, and asynchronous programming.",
      "Familiarity with version control using Git and GitHub."
    ],
    tools: ["VS Code", "Chrome DevTools", "Git", "npm", "Postman"]
  },
  {
    title: "Frontend Developer (React & TypeScript)",
    department: "Engineering",
    category: "Frontend",
    level: "Mid-level",
    requiredSkills: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Redux", "REST APIs"],
    preferredSkills: ["Next.js", "Jest", "React Testing Library", "GraphQL", "Vite"],
    responsibilities: [
      "Build scalable, high-performance web applications using React hooks, functional components, and TypeScript.",
      "Implement centralized client state management using Redux Toolkit, Zustand, or TanStack Query.",
      "Write unit and integration tests using Jest and React Testing Library.",
      "Optimize bundle sizes, rendering cycles, and time-to-interactive for high-traffic web pages."
    ],
    requirements: [
      "3+ years of professional React and TypeScript web application development.",
      "Strong understanding of React component lifecycles, virtual DOM, and memoization techniques.",
      "Solid knowledge of modern CSS, Tailwind, responsive grids, and accessibility standards."
    ],
    tools: ["React", "TypeScript", "Tailwind CSS", "Jest", "Git", "Vite"]
  },
  {
    title: "Senior React Developer",
    department: "Engineering",
    category: "Frontend",
    level: "Senior",
    requiredSkills: ["React", "TypeScript", "Next.js", "Performance Optimization", "State Management", "Testing"],
    preferredSkills: ["GraphQL", "Tailwind CSS", "Storybook", "CI/CD", "Web Vitals"],
    responsibilities: [
      "Architect complex, client-side web architectures with modular component design and strict TypeScript typing.",
      "Drive frontend performance optimization, eliminating unnecessary re-renders and minimizing bundle payloads.",
      "Mentor mid-level and junior developers, establish frontend engineering guidelines, and lead code reviews.",
      "Collaborate with backend architects to define performant REST and GraphQL API contracts."
    ],
    requirements: [
      "5+ years of software engineering experience focusing on modern React ecosystems.",
      "Demonstrated mastery of TypeScript, state management, hooks, and component decoupling.",
      "Proven track record delivering performant enterprise web applications."
    ],
    tools: ["React 19", "TypeScript", "Next.js", "Storybook", "Playwright"]
  },
  {
    title: "Lead Frontend Engineer (Next.js & Performance)",
    department: "Engineering",
    category: "Frontend",
    level: "Lead",
    requiredSkills: ["Next.js", "React", "TypeScript", "Core Web Vitals", "Server Components", "Architecture"],
    preferredSkills: ["Turborepo", "Micro-frontends", "Tailwind CSS", "Docker", "Edge Functions"],
    responsibilities: [
      "Lead the architectural roadmap for Next.js App Router applications with React Server Components (RSC).",
      "Benchmark, profile, and optimize Core Web Vitals (LCP, FID/INP, CLS) across all web platforms.",
      "Design monorepo structures, shared UI component packages, and continuous integration workflows.",
      "Manage sprint planning, technical debt backlogs, and engineering talent development."
    ],
    requirements: [
      "7+ years in frontend engineering with at least 2+ years leading engineering squads.",
      "Deep expertise in Next.js SSR, SSG, ISR, streaming, and edge runtime architectures.",
      "Extensive knowledge of browser rendering pipelines, HTTP/2, and caching strategies."
    ],
    tools: ["Next.js", "Turborepo", "TypeScript", "Tailwind CSS", "Vercel"]
  },
  {
    title: "Principal Frontend Architect",
    department: "Engineering",
    category: "Frontend",
    level: "Executive",
    requiredSkills: ["Frontend Architecture", "Design Systems", "Web Standards", "Scalability", "TypeScript", "Micro-frontends"],
    preferredSkills: ["Module Federation", "WebAssembly", "W3C Standards", "Engineering Leadership"],
    responsibilities: [
      "Define multi-year frontend technology strategies across dozens of distributed product engineering teams.",
      "Establish enterprise design systems, design tokens, and governance frameworks.",
      "Evaluate emerging web technologies, author RFC technical vision documents, and guide executive decisions.",
      "Partner with InfoSec and infrastructure leadership to ensure frontend security and compliance."
    ],
    requirements: [
      "10+ years of software architecture experience scaling enterprise web platforms to millions of users.",
      "Recognized leadership in frontend architecture, open-source web standards, or technical governance.",
      "Exceptional communication skills bridging technical architecture with business outcomes."
    ],
    tools: ["Module Federation", "TypeScript", "Nx", "Figma Tokens", "Docker"]
  },
  {
    title: "Senior Vue.js Engineer (Vue 3 & Pinia)",
    department: "Engineering",
    category: "Frontend",
    level: "Senior",
    requiredSkills: ["Vue 3", "Composition API", "TypeScript", "Pinia", "Vite", "Tailwind CSS"],
    preferredSkills: ["Nuxt.js", "Vitest", "Vue Router", "SSR", "REST APIs"],
    responsibilities: [
      "Build responsive, modular enterprise applications using Vue 3, Composition API, and TypeScript.",
      "Implement typed state stores using Pinia and manage seamless client-server data synchronization.",
      "Write automated unit and component tests with Vitest and Vue Test Utils.",
      "Migrate legacy Vue 2 Options API codebases to modern, composable architecture."
    ],
    requirements: [
      "5+ years of frontend development experience with 3+ years deep specialization in Vue.js.",
      "Strong proficiency with TypeScript, modern ES modules, and reactive programming.",
      "Solid experience with Vite build toolchains and Tailwind CSS."
    ],
    tools: ["Vue 3", "Pinia", "Vite", "TypeScript", "Vitest"]
  },
  {
    title: "Senior Angular Developer (RxJS & NgRx)",
    department: "Engineering",
    category: "Frontend",
    level: "Senior",
    requiredSkills: ["Angular", "TypeScript", "RxJS", "NgRx", "Dependency Injection", "Unit Testing"],
    preferredSkills: ["Angular Signals", "SCSS", "Karma/Jasmine", "Nx Monorepo", "CI/CD"],
    responsibilities: [
      "Architect enterprise single-page applications using modern Angular (v16+) and TypeScript.",
      "Implement reactive data flows with RxJS observables, operators, and NgRx store architecture.",
      "Write unit tests with Jasmine/Karma and maintain high code coverage across modular components.",
      "Optimize change detection strategies (OnPush) and lazy-loaded routing modules."
    ],
    requirements: [
      "5+ years of professional Angular enterprise application engineering.",
      "Deep understanding of RxJS asynchronous streams, reactive programming, and NgRx state.",
      "Strong background in modular architecture, TypeScript interfaces, and REST API integration."
    ],
    tools: ["Angular CLI", "NgRx", "RxJS", "TypeScript", "Nx"]
  },
  {
    title: "Svelte / SvelteKit Developer",
    department: "Engineering",
    category: "Frontend",
    level: "Mid-level",
    requiredSkills: ["Svelte", "SvelteKit", "TypeScript", "JavaScript", "HTML5", "CSS3"],
    preferredSkills: ["Tailwind CSS", "SSR", "Vite", "Playwright", "Edge Functions"],
    responsibilities: [
      "Develop ultra-fast, zero-overhead web applications using Svelte 5 runes and SvelteKit.",
      "Build server-rendered and static web pages with optimal SEO and low latency.",
      "Implement interactive animations and transitions using Svelte built-in animation stores.",
      "Collaborate with backend engineers to consume APIs and deliver seamless user experiences."
    ],
    requirements: [
      "3+ years of web development experience with at least 1+ years building production Svelte applications.",
      "Strong command of modern JavaScript, CSS flexbox/grid, and web performance principles.",
      "Familiarity with server-side rendering and static site generation in SvelteKit."
    ],
    tools: ["SvelteKit", "Vite", "TypeScript", "Tailwind CSS", "Playwright"]
  },
  {
    title: "Web Performance & Core Web Vitals Engineer",
    department: "Engineering",
    category: "Frontend",
    level: "Senior",
    requiredSkills: ["Web Performance", "Core Web Vitals", "JavaScript Profiling", "Lighthouse", "Webpack/Vite", "CDN Caching"],
    preferredSkills: ["RUM Telemetry", "Next.js", "Chrome Tracing", "Service Workers", "Image Optimization"],
    responsibilities: [
      "Diagnose, audit, and remediate performance bottlenecks impacting LCP, INP, and CLS.",
      "Optimize JavaScript execution time, CSS render-blocking resources, and critical rendering paths.",
      "Implement Real User Monitoring (RUM) dashboards using Datadog, SpeedCurve, and Google Search Console.",
      "Establish automated performance regression budgets in CI/CD release pipelines."
    ],
    requirements: [
      "5+ years of web engineering with dedicated focus on client-side performance engineering.",
      "Mastery of Chrome DevTools Performance Profiler, memory leak identification, and network waterfall analysis.",
      "Deep understanding of browser layout, painting, compositing, and main-thread scheduling."
    ],
    tools: ["Chrome DevTools", "Lighthouse", "SpeedCurve", "Datadog", "WebPageTest"]
  },
  {
    title: "Design Systems Engineer (React & Storybook)",
    department: "Engineering",
    category: "Frontend",
    level: "Senior",
    requiredSkills: ["Design Systems", "React", "TypeScript", "Storybook", "Tailwind CSS", "Figma Tokens"],
    preferredSkills: ["Radix UI", "Accessibility (WCAG)", "NPM Packaging", "Chromatic", "CSS-in-JS"],
    responsibilities: [
      "Build and maintain a centralized, multi-brand UI component library used across web and mobile products.",
      "Automate design token pipelines from Figma to CSS variables and Tailwind theme configurations.",
      "Document component variants, interactive states, and accessibility guidelines in Storybook.",
      "Conduct visual regression testing and publish semantic versioned npm packages."
    ],
    requirements: [
      "4+ years of frontend experience with 2+ years dedicated to design systems engineering.",
      "Deep expertise in WCAG 2.1 AA accessibility, keyboard navigation, and ARIA roles.",
      "Strong skills in TypeScript, React, Tailwind CSS, and Storybook."
    ],
    tools: ["Storybook", "Figma", "Radix UI", "Tailwind CSS", "Chromatic"]
  },
  {
    title: "UI/UX Frontend Engineer",
    department: "Engineering",
    category: "Frontend",
    level: "Mid-level",
    requiredSkills: ["UI/UX Design", "React", "CSS3 / SCSS", "Figma", "Responsive Layouts", "JavaScript"],
    preferredSkills: ["Framer Motion", "Tailwind CSS", "Prototyping", "User Testing"],
    responsibilities: [
      "Bridge design and engineering by translating complex Figma prototypes into polished, responsive code.",
      "Build smooth micro-interactions, layout transitions, and fluid gesture-based animations.",
      "Conduct usability reviews and implement UI improvements that reduce friction and boost conversion.",
      "Ensure pixel-perfect fidelity across desktop, tablet, and mobile breakpoints."
    ],
    requirements: [
      "3+ years of frontend UI engineering experience working closely with product designers.",
      "Strong eye for typography, whitespace, hierarchy, visual aesthetics, and micro-interactions.",
      "Proficient in modern React, CSS animations, and responsive web design."
    ],
    tools: ["Figma", "React", "Framer Motion", "Tailwind CSS", "CSS3"]
  },
  {
    title: "Jamstack & Headless CMS Developer",
    department: "Engineering",
    category: "Frontend",
    level: "Mid-level",
    requiredSkills: ["Next.js", "Headless CMS", "GraphQL", "Tailwind CSS", "TypeScript", "Vercel"],
    preferredSkills: ["Sanity", "Contentful", "Strapi", "SEO Optimization", "Algolia"],
    responsibilities: [
      "Build modern content platforms using Next.js, headless CMS APIs (Sanity, Contentful), and GraphQL.",
      "Implement preview workflows, schema migrations, and real-time content synchronization.",
      "Optimize technical SEO, structured metadata, sitemaps, and programmatic landing pages.",
      "Deploy and maintain static and server-rendered sites on Vercel and Netlify."
    ],
    requirements: [
      "3+ years in web development with strong Jamstack and headless architecture experience.",
      "Proficient in GraphQL queries, webhook handlers, and static site generation.",
      "Experience optimizing websites for organic search engines and mobile devices."
    ],
    tools: ["Sanity.io", "Contentful", "Next.js", "GraphQL", "Vercel"]
  },
  {
    title: "Micro-Frontends Architect",
    department: "Engineering",
    category: "Frontend",
    level: "Lead",
    requiredSkills: ["Micro-frontends", "Module Federation", "Webpack", "React", "TypeScript", "Monorepo"],
    preferredSkills: ["Single-SPA", "Nx", "Docker", "CI/CD", "Cross-app Communication"],
    responsibilities: [
      "Design and implement scalable micro-frontend architectures for enterprise web suites.",
      "Configure Webpack 5 Module Federation, shared runtime dependencies, and independent deployability.",
      "Establish cross-application event buses, routing coordination, and shared authentication state.",
      "Guide multiple independent product squads on decoupled frontend release cycles."
    ],
    requirements: [
      "7+ years in software engineering with proven track record delivering micro-frontend architectures.",
      "Deep mastery of Webpack, bundle orchestration, module federation, and browser sandboxing.",
      "Experience leading distributed architecture migrations in enterprise SaaS organizations."
    ],
    tools: ["Module Federation", "Single-SPA", "Nx Monorepo", "Webpack 5", "TypeScript"]
  },
  {
    title: "React Native Mobile Developer",
    department: "Mobile",
    category: "Mobile",
    level: "Mid-level",
    requiredSkills: ["React Native", "TypeScript", "Redux", "iOS", "Android", "Mobile Navigation"],
    preferredSkills: ["Expo", "Fastlane", "Native Modules", "Firebase", "App Store Deployment"],
    responsibilities: [
      "Develop cross-platform mobile apps for iOS and Android using React Native and TypeScript.",
      "Implement offline storage, push notifications, camera permissions, and secure biometric login.",
      "Profile and optimize app startup time, memory footprint, and frame rates (60fps).",
      "Prepare builds and coordinate deployment through Apple App Store Connect and Google Play Console."
    ],
    requirements: [
      "3+ years of professional mobile application engineering with React Native.",
      "Familiarity with native iOS (Xcode) and Android (Android Studio) build configurations.",
      "Experience consuming REST/GraphQL APIs and handling asynchronous network states."
    ],
    tools: ["React Native", "Expo", "Xcode", "Android Studio", "TypeScript"]
  },
  {
    title: "Senior iOS Engineer (Swift & SwiftUI)",
    department: "Mobile",
    category: "Mobile",
    level: "Senior",
    requiredSkills: ["Swift", "SwiftUI", "Combine", "UIKit", "Xcode", "Core Data"],
    preferredSkills: ["Async/Await", "Clean Architecture", "XCTest", "Fastlane", "App Store Connect"],
    responsibilities: [
      "Design, build, and maintain native iOS applications using Swift, SwiftUI, and modern concurrency.",
      "Integrate persistent data layers using Core Data or SwiftData with background synchronization.",
      "Write robust unit and UI tests using XCTest framework to ensure high code quality.",
      "Lead App Store submission cycles, review guidelines compliance, and provisioning certificates."
    ],
    requirements: [
      "5+ years of dedicated native iOS application engineering in Swift.",
      "Deep understanding of Apple Human Interface Guidelines (HIG) and memory management (ARC).",
      "Published top-rated apps live in the Apple App Store."
    ],
    tools: ["Xcode", "SwiftUI", "Combine", "Instruments", "Fastlane"]
  },
  {
    title: "Lead Android Developer (Kotlin & Jetpack Compose)",
    department: "Mobile",
    category: "Mobile",
    level: "Lead",
    requiredSkills: ["Kotlin", "Jetpack Compose", "Android SDK", "Coroutines", "MVVM", "Gradle"],
    preferredSkills: ["Hilt / Koin", "Room Database", "Kotlin Multiplatform (KMP)", "CI/CD", "Play Store"],
    responsibilities: [
      "Lead native Android architecture using 100% Kotlin, Jetpack Compose, and Coroutines/Flow.",
      "Design clean MVVM / MVI architectures with dependency injection (Hilt) and local Room persistence.",
      "Establish automated build and release pipelines using GitHub Actions and Fastlane.",
      "Mentor Android developers, conduct code reviews, and drive performance profiling with Android Studio."
    ],
    requirements: [
      "7+ years in Android software development with 2+ years leading Android engineering teams.",
      "Deep knowledge of Android OS internals, lifecycle management, background jobs, and security.",
      "Demonstrated experience modernizing legacy XML layouts to declarative Jetpack Compose."
    ],
    tools: ["Android Studio", "Kotlin", "Jetpack Compose", "Gradle", "Hilt"]
  },
  {
    title: "Flutter Cross-Platform Mobile Engineer",
    department: "Mobile",
    category: "Mobile",
    level: "Mid-level",
    requiredSkills: ["Flutter", "Dart", "State Management (Bloc/Riverpod)", "REST APIs", "iOS & Android", "Git"],
    preferredSkills: ["Platform Channels", "Firebase", "SQLite", "Automated Testing", "App Store Publishing"],
    responsibilities: [
      "Develop high-quality mobile applications for iOS and Android from a single codebase using Flutter and Dart.",
      "Implement robust state management using BLoC or Riverpod patterns.",
      "Create custom UI widgets, smooth animations, and platform-specific platform channel integrations.",
      "Manage app store publishing, release metadata, and continuous integration workflows."
    ],
    requirements: [
      "3+ years of mobile application development with at least 2+ years writing production Flutter/Dart.",
      "Strong understanding of widget trees, reactive rendering, and performance profiling in Flutter.",
      "Experience integrating REST APIs, websockets, and third-party SDKs."
    ],
    tools: ["Flutter", "Dart", "Bloc", "Xcode", "Android Studio"]
  },
  {
    title: "Mobile DevOps & Release Engineer",
    department: "DevOps",
    category: "Mobile",
    level: "Senior",
    requiredSkills: ["Fastlane", "GitHub Actions", "App Store Connect", "Google Play Console", "Mobile CI/CD", "Bash/Python"],
    preferredSkills: ["Bitrise", "Code Signing", "Firebase App Distribution", "Gradle", "CocoaPods"],
    responsibilities: [
      "Automate mobile build, testing, and deployment pipelines using Fastlane and cloud CI runners.",
      "Manage code signing certificates, provisioning profiles, keystores, and credentials securely.",
      "Orchestrate staged rollouts, beta distribution via TestFlight, and post-launch crash monitoring.",
      "Optimize build caching and pipeline execution times for iOS and Android native codebases."
    ],
    requirements: [
      "4+ years of DevOps experience specializing in mobile application release automation.",
      "Deep understanding of Apple and Google mobile distribution requirements, certificates, and APIs.",
      "Proficient in scripting with Bash, Ruby (Fastlane), or Python."
    ],
    tools: ["Fastlane", "GitHub Actions", "Bitrise", "TestFlight", "Google Play Console"]
  },
  {
    title: "Web3 / DApp Frontend Developer",
    department: "Engineering",
    category: "Frontend",
    level: "Mid-level",
    requiredSkills: ["React", "TypeScript", "Ethers.js / Wagmi", "Web3.js", "Smart Contract Integration", "Tailwind CSS"],
    preferredSkills: ["Solidity basics", "IPFS", "The Graph / Subgraphs", "MetaMask", "Viem"],
    responsibilities: [
      "Develop responsive decentralized application (DApp) interfaces that connect to EVM blockchains.",
      "Integrate Web3 wallet connection workflows (MetaMask, WalletConnect, Coinbase Wallet) using Wagmi/Viem.",
      "Read from and write transactions to smart contracts, handling gas estimation and receipt confirmations.",
      "Query decentralized indexing protocols like The Graph and display real-time blockchain telemetry."
    ],
    requirements: [
      "3+ years in frontend engineering with at least 1+ years dedicated to Web3/crypto DApp development.",
      "Strong command of TypeScript, React, asynchronous blockchain transactions, and error handling.",
      "Familiarity with DeFi, NFT standards (ERC-20, ERC-721), and IPFS decentralized storage."
    ],
    tools: ["React", "Wagmi", "Viem", "Ethers.js", "The Graph"]
  },
  {
    title: "Progressive Web App (PWA) Engineer",
    department: "Engineering",
    category: "Frontend",
    level: "Senior",
    requiredSkills: ["PWA", "Service Workers", "Cache API", "IndexedDB", "Offline First", "TypeScript"],
    preferredSkills: ["Workbox", "Web Push Notifications", "Web App Manifest", "Performance Tuning"],
    responsibilities: [
      "Architect offline-first Progressive Web Applications that deliver native-like desktop and mobile experiences.",
      "Implement advanced service worker caching strategies using Workbox (Stale-While-Revalidate, Cache-First).",
      "Manage client-side relational storage with IndexedDB and background data synchronization.",
      "Configure web app manifests, home screen installation prompts, and web push notification services."
    ],
    requirements: [
      "5+ years of frontend software engineering experience with deep knowledge of browser APIs.",
      "Mastery of Service Worker lifecycles, CacheStorage API, and asynchronous IndexedDB storage.",
      "Proven ability to build mission-critical web applications that function reliably with zero internet connectivity."
    ],
    tools: ["Workbox", "IndexedDB", "Service Workers", "Lighthouse", "TypeScript"]
  },

  // ==========================================
  // 2. BACKEND & SYSTEMS (40 roles)
  // ==========================================
  {
    title: "Junior Backend Engineer (Node.js & Express)",
    department: "Engineering",
    category: "Backend",
    level: "Entry-level",
    requiredSkills: ["JavaScript", "Node.js", "Express", "SQL", "REST APIs", "Git"],
    preferredSkills: ["TypeScript", "PostgreSQL", "Docker", "Jest", "Postman"],
    responsibilities: [
      "Develop and maintain server-side REST API endpoints using Node.js and Express.",
      "Write SQL queries, create database tables, and manage relational data integrity.",
      "Write automated unit tests using Jest and conduct functional testing with Postman.",
      "Diagnose backend errors, fix bugs, and collaborate with frontend teams on API contracts."
    ],
    requirements: [
      "1-2 years of backend software development experience or Computer Science degree.",
      "Good understanding of HTTP protocols, status codes, JSON formatting, and REST principles.",
      "Comfortable writing asynchronous JavaScript (Promises, async/await) and relational SQL."
    ],
    tools: ["Node.js", "Express", "Postman", "Git", "PostgreSQL"]
  },
  {
    title: "Backend Developer (Python & FastAPI)",
    department: "Engineering",
    category: "Backend",
    level: "Mid-level",
    requiredSkills: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "Docker", "REST APIs"],
    preferredSkills: ["Pydantic", "Redis", "Celery", "Pytest", "Asyncio", "OpenAPI"],
    responsibilities: [
      "Design and implement high-performance, asynchronous REST APIs using Python, FastAPI, and Pydantic.",
      "Model relational data structures, write complex queries, and manage migrations with SQLAlchemy and Alembic.",
      "Implement background tasks, distributed caching with Redis, and JWT authentication flows.",
      "Write automated test suites with Pytest and maintain OpenAPI / Swagger documentation."
    ],
    requirements: [
      "3+ years of professional backend engineering experience in Python.",
      "Strong proficiency with asynchronous Python (async/await), event loops, and typing annotations.",
      "Solid experience with PostgreSQL database schema design, indexing, and connection pooling."
    ],
    tools: ["FastAPI", "Python 3.11+", "SQLAlchemy", "Docker", "PostgreSQL"]
  },
  {
    title: "Senior Go (Golang) Microservices Engineer",
    department: "Engineering",
    category: "Backend",
    level: "Senior",
    requiredSkills: ["Go (Golang)", "Microservices", "gRPC", "PostgreSQL", "Docker", "Kubernetes"],
    preferredSkills: ["Apache Kafka", "Redis", "Prometheus", "Distributed Tracing", "CI/CD"],
    responsibilities: [
      "Architect, develop, and deploy low-latency, high-throughput microservices using Golang.",
      "Implement gRPC and protocol buffer interfaces for efficient inter-service RPC communication.",
      "Build asynchronous event consumers and producers using Apache Kafka message streaming.",
      "Optimize memory allocation, CPU concurrency (goroutines/channels), and database connection pooling."
    ],
    requirements: [
      "5+ years of software engineering experience with at least 3+ years writing Go in production.",
      "Deep understanding of concurrent programming, race conditions, memory management, and profiling in Go.",
      "Solid background in containerized microservices architecture deployed on Kubernetes."
    ],
    tools: ["Go", "gRPC", "Protobuf", "Docker", "Kubernetes", "Kafka"]
  },
  {
    title: "Staff Backend Architect (Distributed Systems)",
    department: "Engineering",
    category: "Backend",
    level: "Lead",
    requiredSkills: ["Distributed Systems", "System Design", "Go / Java", "Kafka", "PostgreSQL", "High Availability"],
    preferredSkills: ["Consensus Protocols (Raft/Paxos)", "Cloud Architecture", "Observability", "RFC Authoring"],
    responsibilities: [
      "Lead technical vision and system design for distributed platforms processing millions of transactions daily.",
      "Architect fault-tolerant systems with zero single points of failure, partition tolerance, and strict consistency.",
      "Author RFC technical design documents, conduct architectural reviews, and establish engineering standards.",
      "Mentor staff and senior engineers across multiple backend engineering teams."
    ],
    requirements: [
      "8+ years designing and operating large-scale distributed systems in cloud environments.",
      "Deep expertise in CAP theorem trade-offs, distributed transactions (Saga pattern), and event streaming.",
      "Proven track record delivering systems with 99.99%+ availability SLAs."
    ],
    tools: ["Kafka", "Kubernetes", "PostgreSQL", "Go", "AWS", "Datadog"]
  },
  {
    title: "Senior Java Spring Boot Engineer",
    department: "Engineering",
    category: "Backend",
    level: "Senior",
    requiredSkills: ["Java", "Spring Boot", "Microservices", "Hibernate / JPA", "PostgreSQL", "Docker"],
    preferredSkills: ["Spring Cloud", "Kafka", "Kubernetes", "JUnit 5", "Maven/Gradle"],
    responsibilities: [
      "Develop secure, enterprise-grade backend services using Java (17/21) and the Spring Boot framework.",
      "Implement data access layers with Spring Data JPA and optimize transactional database queries in PostgreSQL.",
      "Integrate event-driven communication using Apache Kafka and message schemas.",
      "Write thorough test suites with JUnit 5, Mockito, and Testcontainers."
    ],
    requirements: [
      "5+ years of enterprise backend engineering experience with Java and Spring ecosystem.",
      "Strong mastery of object-oriented design, dependency injection, and clean architectural patterns.",
      "Solid experience with relational databases, transaction isolation levels, and ACID properties."
    ],
    tools: ["Java 17/21", "Spring Boot 3", "PostgreSQL", "Docker", "JUnit 5"]
  },
  {
    title: "Senior C# .NET Core Backend Engineer",
    department: "Engineering",
    category: "Backend",
    level: "Senior",
    requiredSkills: ["C#", ".NET Core", "ASP.NET Core", "Entity Framework Core", "SQL Server / Postgres", "REST APIs"],
    preferredSkills: ["Azure Cloud", "Docker", "RabbitMQ", "xUnit", "Microservices"],
    responsibilities: [
      "Build high-performance web APIs and background services using C# and modern .NET Core (8+).",
      "Model enterprise data schemas and optimize database interactions using Entity Framework Core.",
      "Implement microservices patterns with message brokering via RabbitMQ or Azure Service Bus.",
      "Deploy and manage containerized .NET services in Microsoft Azure cloud environments."
    ],
    requirements: [
      "5+ years of software development experience with C# and the .NET ecosystem.",
      "Deep knowledge of ASP.NET Core middleware, dependency injection, and asynchronous Task patterns.",
      "Strong relational database design and SQL query tuning experience."
    ],
    tools: [".NET 8", "C#", "Entity Framework", "Azure", "Docker"]
  },
  {
    title: "Senior Ruby on Rails Developer",
    department: "Engineering",
    category: "Backend",
    level: "Senior",
    requiredSkills: ["Ruby", "Ruby on Rails", "PostgreSQL", "Sidekiq", "Redis", "RSpec"],
    preferredSkills: ["Hotwire / Turbo", "Docker", "AWS", "GraphQL", "Elasticsearch"],
    responsibilities: [
      "Maintain and scale enterprise SaaS web applications written in Ruby on Rails.",
      "Design robust data models and optimize Active Record queries to prevent N+1 query performance degradation.",
      "Manage background job processing queues using Sidekiq and Redis caching.",
      "Write comprehensive test suites using RSpec and maintain continuous deployment workflows."
    ],
    requirements: [
      "5+ years of software engineering experience with Ruby on Rails in production.",
      "Strong understanding of Rails conventions, MVC architecture, and database query optimization.",
      "Demonstrated ability to refactor monolithic codebases into maintainable domain modules."
    ],
    tools: ["Ruby 3", "Ruby on Rails 7+", "PostgreSQL", "Sidekiq", "RSpec"]
  },
  {
    title: "Staff Rust Systems & Networking Engineer",
    department: "Engineering",
    category: "Backend",
    level: "Lead",
    requiredSkills: ["Rust", "Systems Programming", "Async (Tokio)", "Memory Management", "Concurrency", "Linux"],
    preferredSkills: ["WebAssembly", "eBPF", "Network Protocols (QUIC/HTTP3)", "C/C++", "Performance Profiling"],
    responsibilities: [
      "Design and implement ultra-low latency networking infrastructure and proxy engines in Rust.",
      "Optimize memory layouts, zero-copy deserialization, and CPU cache performance using Tokio runtime.",
      "Build crash-resilient network protocols and stream processing engines handling gigabits of throughput.",
      "Conduct in-depth profiling, bench testing, and technical documentation for systems engineers."
    ],
    requirements: [
      "6+ years in systems programming with at least 3+ years writing production-grade Rust.",
      "Deep mastery of memory safety, borrow checker, unsafe Rust, lifetimes, and lock-free data structures.",
      "Extensive knowledge of Linux kernel network stack, epoll, and socket programming."
    ],
    tools: ["Rust", "Tokio", "Cargo", "Linux perf", "Valgrind"]
  },
  {
    title: "Senior PHP / Laravel Backend Engineer",
    department: "Engineering",
    category: "Backend",
    level: "Senior",
    requiredSkills: ["PHP 8+", "Laravel", "MySQL / PostgreSQL", "REST APIs", "Redis", "Queues"],
    preferredSkills: ["Inertia.js", "Docker", "PHPUnit", "AWS", "Livewire"],
    responsibilities: [
      "Develop and maintain scalable web platforms using modern PHP 8+ and Laravel framework.",
      "Build optimized Eloquent database queries, repository patterns, and database migrations.",
      "Implement background job queues, webhook integrations (Stripe, PayPal), and Redis caching.",
      "Write automated tests using PHPUnit / Pest and ensure code adherence to PSR standards."
    ],
    requirements: [
      "5+ years of professional backend development with deep expertise in modern Laravel.",
      "Strong understanding of PHP OOP principles, traits, dependency injection, and security practices.",
      "Solid database design and query tuning skills in MySQL or PostgreSQL."
    ],
    tools: ["PHP 8.2+", "Laravel 11", "MySQL", "Docker", "Redis"]
  },
  {
    title: "High-Frequency Trading (HFT) C++ Developer",
    department: "Engineering",
    category: "Backend",
    level: "Lead",
    requiredSkills: ["Modern C++ (17/20)", "Low Latency", "Multithreading", "Linux Kernel", "Memory Optimization", "Socket Programming"],
    preferredSkills: ["FPGA basics", "Kernel Bypass (Solarflare / DPDK)", "SIMD", "Financial Markets"],
    responsibilities: [
      "Design, build, and optimize ultra-low latency algorithmic trading execution engines in modern C++.",
      "Eliminate jitter, optimize cache locality, and implement lock-free concurrent queues.",
      "Profile code execution down to nanosecond precision using hardware performance counters.",
      "Implement network protocol decoders (FIX, ITCH, OUCH) communicating with global financial exchanges."
    ],
    requirements: [
      "6+ years of C++ software engineering experience in low-latency systems or quantitative trading.",
      "Expert knowledge of memory models, cache coherence, CPU architecture, and compiler optimizations.",
      "Degree in Computer Science, Electrical Engineering, Physics, or Mathematics."
    ],
    tools: ["C++20", "GCC/Clang", "Linux", "GDB", "Valgrind", "Solarflare"]
  },
  {
    title: "Database Administrator (PostgreSQL DBA)",
    department: "Engineering",
    category: "Backend",
    level: "Senior",
    requiredSkills: ["PostgreSQL", "Query Optimization", "Replication", "High Availability", "Backup & Recovery", "Linux"],
    preferredSkills: ["PgBouncer", "Citus", "Patroni", "Monitoring & Alerting", "Terraform"],
    responsibilities: [
      "Manage multi-terabyte production PostgreSQL clusters, replicas, and connection pooling with PgBouncer.",
      "Diagnose slow queries using EXPLAIN ANALYZE, tune indexes, and optimize autovacuum parameters.",
      "Implement automated point-in-time recovery (PITR), disaster recovery drills, and schema migrations.",
      "Monitor database health, replication lag, transaction wraparound, and disk I/O metrics."
    ],
    requirements: [
      "5+ years of specialized PostgreSQL administration experience in 24/7 cloud environments.",
      "Deep understanding of PostgreSQL internals (WAL, MVCC, lock escalation, shared buffers).",
      "Proficient in Linux system administration and automated scripting with Bash or Python."
    ],
    tools: ["PostgreSQL", "PgBouncer", "Patroni", "Grafana", "Linux"]
  },

  // ==========================================
  // 3. FULL STACK (30 roles)
  // ==========================================
  {
    title: "Junior Full Stack Developer",
    department: "Engineering",
    category: "Full Stack",
    level: "Entry-level",
    requiredSkills: ["JavaScript", "React", "Node.js", "SQL / NoSQL", "HTML/CSS", "Git"],
    preferredSkills: ["TypeScript", "Express", "Tailwind CSS", "MongoDB", "REST APIs"],
    responsibilities: [
      "Contribute across frontend interfaces and backend APIs under the mentorship of senior engineers.",
      "Build responsive UI views in React and write supporting REST API endpoints in Node.js.",
      "Participate in daily standups, sprint reviews, bug fixes, and documentation updates.",
      "Write unit tests for newly implemented features and perform cross-browser verification."
    ],
    requirements: [
      "1-2 years of full-stack web development experience or relevant software engineering degree.",
      "Proficiency in modern JavaScript (ES6+), frontend React concepts, and backend Node.js APIs.",
      "Foundational understanding of databases and version control with Git."
    ],
    tools: ["React", "Node.js", "Express", "Git", "VS Code"]
  },
  {
    title: "Senior Full Stack Engineer (Next.js, Node.js, PostgreSQL)",
    department: "Engineering",
    category: "Full Stack",
    level: "Senior",
    requiredSkills: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    preferredSkills: ["Prisma", "GraphQL", "Docker", "Redis", "AWS", "Jest"],
    responsibilities: [
      "Architect and ship end-to-end features spanning Next.js App Router frontends and Node.js backend services.",
      "Design normalized relational schemas in PostgreSQL and optimize database queries using Prisma.",
      "Build accessible, responsive UI components with Tailwind CSS and Radix UI primitives.",
      "Write automated end-to-end and integration tests to ensure reliable, zero-downtime releases."
    ],
    requirements: [
      "5+ years of full-stack engineering experience building production web platforms.",
      "Deep proficiency in TypeScript, React, Next.js, and relational SQL database modeling.",
      "Proven track record delivering scalable SaaS applications from conception to production."
    ],
    tools: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"]
  },
  {
    title: "Founding Full Stack Engineer (Early Stage Startup)",
    department: "Engineering",
    category: "Full Stack",
    level: "Lead",
    requiredSkills: ["Full Stack Architecture", "React / Next.js", "Node.js / Python", "PostgreSQL", "Cloud Deployment", "Fast Prototyping"],
    preferredSkills: ["Stripe Integration", "Tailwind CSS", "Product Mindset", "Docker", "AI APIs"],
    responsibilities: [
      "Own the entire technical stack from 0 to 1, building core product features with extreme velocity.",
      "Make foundational architectural decisions on tech stack, cloud infrastructure, and database design.",
      "Work directly with founders to translate customer feedback into working software overnight.",
      "Build automated CI/CD deployment pipelines, analytics instrumentation, and billing integrations."
    ],
    requirements: [
      "5+ years of full-stack software development experience with high autonomy and entrepreneurial drive.",
      "Expertise building production web apps quickly using modern stacks (Next.js, Node/Python, PostgreSQL).",
      "Comfortable working in ambiguity with rapid iterations and high code quality."
    ],
    tools: ["Next.js", "Node.js", "PostgreSQL", "Vercel", "Stripe", "Supabase"]
  },

  // ==========================================
  // 4. DEVOPS, CLOUD & SRE (35 roles)
  // ==========================================
  {
    title: "Senior DevOps Engineer (AWS & Terraform)",
    department: "DevOps",
    category: "DevOps",
    level: "Senior",
    requiredSkills: ["AWS", "Terraform", "Docker", "Kubernetes", "CI/CD (GitHub Actions)", "Linux"],
    preferredSkills: ["Helm", "Prometheus", "Grafana", "Ansible", "Python / Bash", "ArgoCD"],
    responsibilities: [
      "Manage multi-region AWS cloud infrastructure using Terraform Infrastructure as Code (IaC).",
      "Deploy, scale, and monitor containerized microservices across Amazon EKS (Kubernetes) clusters.",
      "Automate build, test, and release pipelines using GitHub Actions with security scanning gates.",
      "Implement centralized observability with Prometheus, Grafana, and AWS CloudWatch."
    ],
    requirements: [
      "5+ years of experience in DevOps, Cloud Engineering, or Systems Administration.",
      "Strong hands-on mastery of AWS services (EKS, RDS, S3, IAM, VPC, Route53).",
      "Proficiency writing clean, modular Terraform configurations and Linux shell scripts."
    ],
    tools: ["AWS", "Terraform", "Kubernetes", "Docker", "GitHub Actions", "Prometheus"]
  },
  {
    title: "Principal Site Reliability Engineer (SRE)",
    department: "DevOps",
    category: "DevOps",
    level: "Lead",
    requiredSkills: ["Kubernetes", "Linux Kernel", "Incident Management", "Prometheus", "Grafana", "SLO / SLA Tracking"],
    preferredSkills: ["Chaos Engineering", "Go / Python", "Service Mesh (Istio)", "Distributed Tracing", "AWS"],
    responsibilities: [
      "Define, monitor, and enforce Service Level Objectives (SLOs) and Error Budgets with product teams.",
      "Lead high-severity incident response command, troubleshoot complex system outages, and author postmortems.",
      "Automate repetitive operational toil using Go or Python to enhance infrastructure resilience.",
      "Conduct chaos engineering experiments to eliminate single points of failure across distributed systems."
    ],
    requirements: [
      "8+ years in SRE or Systems Engineering operating large-scale distributed cloud infrastructure.",
      "Deep understanding of Linux operating system internals, TCP/IP networking, and DNS resolution.",
      "Demonstrated experience driving 99.99%+ uptime reliability for enterprise services."
    ],
    tools: ["Kubernetes", "Prometheus", "Grafana", "Datadog", "Istio", "Go"]
  },
  {
    title: "Cloud Security & DevSecOps Engineer",
    department: "Cybersecurity",
    category: "DevOps",
    level: "Senior",
    requiredSkills: ["DevSecOps", "Cloud Security", "AWS / Azure", "Vulnerability Scanning", "SAST / DAST", "CI/CD Security"],
    preferredSkills: ["Trivy", "Snyk", "Terraform Security (tfsec)", "IAM Governance", "SOC 2"],
    responsibilities: [
      "Embed security scanning tools (SAST, DAST, SCA, container scanning) into automated CI/CD pipelines.",
      "Audit cloud infrastructure configurations for compliance with CIS benchmarks and SOC 2 requirements.",
      "Architect least-privilege IAM policies, secrets management (HashiCorp Vault), and encryption at rest/transit.",
      "Remediate security vulnerabilities in partnership with application development squads."
    ],
    requirements: [
      "5+ years in DevOps or Information Security with focus on cloud security automation.",
      "Strong familiarity with container security scanning, image signing, and runtime threat detection.",
      "Experience configuring AWS security services (GuardDuty, Security Hub, AWS WAF, IAM)."
    ],
    tools: ["Snyk", "Trivy", "AWS Security Hub", "Vault", "GitHub Actions"]
  },

  // ==========================================
  // 5. DATA SCIENCE, AI & ML (40 roles)
  // ==========================================
  {
    title: "Data Analyst (Tableau & PowerBI)",
    department: "Data & AI",
    category: "Data",
    level: "Mid-level",
    requiredSkills: ["SQL", "Tableau", "PowerBI", "Data Visualization", "Excel", "Business Analytics"],
    preferredSkills: ["Python (Pandas)", "Snowflake", "dbt", "Statistical Analysis", "ETL"],
    responsibilities: [
      "Extract, clean, and transform data from relational and cloud data warehouses using SQL.",
      "Build interactive executive dashboards, operational reports, and KPI trackers in Tableau and PowerBI.",
      "Perform ad-hoc business analytics to answer critical questions regarding customer churn, revenue, and usage.",
      "Partner with department leaders to define data requirements and maintain metric dictionaries."
    ],
    requirements: [
      "3+ years of professional experience as a Data Analyst or Business Intelligence Analyst.",
      "Advanced SQL skills (joins, window functions, CTEs) and deep dashboarding expertise in Tableau/PowerBI.",
      "Strong communication skills explaining complex analytical insights to non-technical stakeholders."
    ],
    tools: ["SQL", "Tableau", "PowerBI", "Snowflake", "Excel"]
  },
  {
    title: "Senior Data Scientist (Predictive Modeling & ML)",
    department: "Data & AI",
    category: "Data",
    level: "Senior",
    requiredSkills: ["Python", "Machine Learning", "Scikit-Learn", "Pandas", "SQL", "Statistical Modeling"],
    preferredSkills: ["XGBoost", "A/B Testing", "Feature Engineering", "Docker", "MLflow", "Cloud ML"],
    responsibilities: [
      "Formulate predictive modeling solutions for customer churn, lifetime value (LTV), and propensity scoring.",
      "Design and evaluate randomized controlled experiments (A/B testing) to validate product enhancements.",
      "Build feature engineering pipelines and train supervised/unsupervised machine learning models.",
      "Package and deploy production machine learning models via REST APIs in collaboration with ML engineers."
    ],
    requirements: [
      "5+ years of data science experience applying statistical and machine learning algorithms.",
      "Master's degree or PhD in Statistics, Data Science, Computer Science, Mathematics, or related field.",
      "Expert proficiency in Python (Pandas, NumPy, Scikit-learn) and complex SQL data querying."
    ],
    tools: ["Python", "Scikit-Learn", "XGBoost", "SQL", "Jupyter", "MLflow"]
  },
  {
    title: "Generative AI / LLM Engineer (RAG & LangChain)",
    department: "Data & AI",
    category: "AI",
    level: "Senior",
    requiredSkills: ["Python", "LLMs", "LangChain / LlamaIndex", "Vector Databases", "Prompt Engineering", "FastAPI"],
    preferredSkills: ["PyTorch", "Fine-Tuning", "Pinecone / Qdrant", "Hugging Face", "RAG Evaluation (Ragas)"],
    responsibilities: [
      "Architect and operationalize Retrieval-Augmented Generation (RAG) pipelines over enterprise document stores.",
      "Fine-tune open-source large language models (Llama 3, Mistral) for domain-specific text generation.",
      "Develop low-latency Python FastAPI inference microservices with token streaming and caching.",
      "Establish automated benchmarking pipelines to evaluate hallucinations, semantic recall, and accuracy."
    ],
    requirements: [
      "4+ years of software/ML experience with at least 2+ years dedicated to LLMs, embeddings, and NLP.",
      "Deep understanding of vector databases, chunking strategies, semantic indexing, and prompt architecture.",
      "Strong software engineering skills with Python, Docker, and REST API deployment."
    ],
    tools: ["Python", "LangChain", "OpenAI API", "Pinecone", "FastAPI", "Hugging Face"]
  },
  {
    title: "Senior Data Engineer (Snowflake & dbt)",
    department: "Data & AI",
    category: "Data",
    level: "Senior",
    requiredSkills: ["Python", "SQL", "Snowflake", "dbt", "Apache Airflow", "Data Modeling"],
    preferredSkills: ["Apache Spark", "Kafka", "Data Governance", "AWS S3", "CI/CD"],
    responsibilities: [
      "Design, build, and maintain scalable ELT pipelines using Python, SQL, dbt, and Apache Airflow.",
      "Architect dimensional data warehouse schemas (Kimball methodology, star schemas) in Snowflake.",
      "Implement automated data quality testing, schema drift alerts, and data lineage documentation.",
      "Optimize query performance, warehouse clustering keys, and compute spending in Snowflake."
    ],
    requirements: [
      "5+ years of data engineering experience building production-grade data warehouses.",
      "Expert-level SQL and deep hands-on expertise with dbt (data build tool) and Snowflake.",
      "Strong programming skills in Python for data transformation and workflow orchestration."
    ],
    tools: ["Snowflake", "dbt", "Apache Airflow", "Python", "SQL"]
  },

  // ==========================================
  // 6. QA & TESTING (20 roles)
  // ==========================================
  {
    title: "QA Automation Engineer (Playwright & TypeScript)",
    department: "Quality Assurance",
    category: "QA",
    level: "Mid-level",
    requiredSkills: ["TypeScript", "Playwright", "Test Automation", "CI/CD Integration", "API Testing", "Git"],
    preferredSkills: ["Cypress", "Jest", "Docker", "Postman", "k6 Performance"],
    responsibilities: [
      "Develop, execute, and maintain end-to-end automated testing suites using Playwright and TypeScript.",
      "Build automated REST API test scripts validating response schemas, status codes, and database state.",
      "Integrate automated test runs into GitHub Actions CI pipelines to gate pull requests automatically.",
      "Identify, document, and track software defects in Jira with clear reproduction steps."
    ],
    requirements: [
      "3+ years of quality engineering experience focusing primarily on test automation.",
      "Strong coding skills in TypeScript or JavaScript with modern testing frameworks.",
      "Solid understanding of software testing lifecycles, test planning, and defect reporting."
    ],
    tools: ["Playwright", "TypeScript", "GitHub Actions", "Postman", "Jira"]
  },

  // ==========================================
  // 7. CYBERSECURITY (25 roles)
  // ==========================================
  {
    title: "Application Security (AppSec) Engineer",
    department: "Cybersecurity",
    category: "Security",
    level: "Senior",
    requiredSkills: ["Application Security", "OWASP Top 10", "Penetration Testing", "Threat Modeling", "SAST / DAST", "Code Review"],
    preferredSkills: ["Burp Suite", "Python / Bash", "Cloud Security", "Vulnerability Management", "SOC 2"],
    responsibilities: [
      "Perform secure code reviews and architectural threat modeling across web and mobile applications.",
      "Conduct manual penetration testing and automated vulnerability assessments against APIs.",
      "Embed automated security testing tools (SAST/DAST) into CI/CD developer pipelines.",
      "Train software engineering squads on secure coding practices and mitigation of OWASP Top 10 risks."
    ],
    requirements: [
      "5+ years of application security or penetration testing experience.",
      "Thorough understanding of web security fundamentals (XSS, CSRF, SQLi, SSRF, broken access control).",
      "Industry certification such as OSCP, GWAPT, or CISSP preferred."
    ],
    tools: ["Burp Suite", "OWASP ZAP", "Snyk", "SonarQube", "Python"]
  },

  // ==========================================
  // 8. PRODUCT MANAGEMENT (25 roles)
  // ==========================================
  {
    title: "Senior Product Manager (B2B Enterprise SaaS)",
    department: "Product",
    category: "Product",
    level: "Senior",
    requiredSkills: ["Product Management", "B2B SaaS", "Roadmap Strategy", "Agile / Scrum", "User Stories", "Product Analytics"],
    preferredSkills: ["SQL", "Mixpanel / Amplitude", "Jira", "Customer Discovery", "PRD Authoring"],
    responsibilities: [
      "Define multi-quarter product strategy, roadmaps, and feature priorities for enterprise SaaS modules.",
      "Conduct customer discovery interviews and analyze behavioral usage data to validate product opportunities.",
      "Author detailed Product Requirements Documents (PRDs), user stories, and acceptance criteria.",
      "Partner closely with engineering leads and designers to execute Agile sprints and launch customer value."
    ],
    requirements: [
      "5+ years of product management experience with proven success in B2B SaaS platforms.",
      "Strong analytical skills: ability to analyze product metrics, conversion funnels, and retention curves.",
      "Exceptional communication skills influencing cross-functional teams and executive leadership."
    ],
    tools: ["Jira", "Mixpanel", "Figma", "Confluence", "SQL"]
  },
  {
    title: "Technical Product Manager (APIs & Developer Platforms)",
    department: "Product",
    category: "Product",
    level: "Senior",
    requiredSkills: ["Technical Product Management", "API Design", "Developer Experience", "System Architecture", "REST / GraphQL", "Documentation"],
    preferredSkills: ["OpenAPI / Swagger", "Microservices", "Postman", "SQL", "SDKs"],
    responsibilities: [
      "Define developer experience (DevEx) roadmaps for public APIs, SDKs, developer portals, and webhooks.",
      "Collaborate with backend architects on API standards, schema governance, versioning, and rate limiting.",
      "Author comprehensive technical specifications, developer quickstarts, and sample applications.",
      "Monitor API latency percentiles, error rates, uptime, and developer adoption KPIs."
    ],
    requirements: [
      "4+ years of product management experience managing technical platforms, APIs, or developer tooling.",
      "Background in software development with deep familiarity with RESTful, GraphQL, and webhook patterns.",
      "Outstanding technical communication and documentation abilities."
    ],
    tools: ["Postman", "OpenAPI", "Swagger", "Jira", "GraphQL"]
  },

  // ==========================================
  // 9. UI/UX DESIGN (25 roles)
  // ==========================================
  {
    title: "Senior Product Designer (SaaS Platforms)",
    department: "Design",
    category: "Design",
    level: "Senior",
    requiredSkills: ["Product Design", "Figma", "UI/UX", "User Research", "Wireframing", "Prototyping"],
    preferredSkills: ["Design Systems", "Usability Testing", "Design Tokens", "Information Architecture", "HTML/CSS basics"],
    responsibilities: [
      "Lead end-to-end product design from user journey mapping and wireframes to high-fidelity clickable Figma prototypes.",
      "Conduct qualitative user interviews, usability testing sessions, and synthesize feedback into design iterations.",
      "Contribute to and maintain central design system components, typography, and color tokens.",
      "Collaborate closely with frontend engineers to ensure high design fidelity during implementation."
    ],
    requirements: [
      "5+ years of digital product design (UI/UX) experience for complex web SaaS applications.",
      "Mastery of Figma, including auto-layout, interactive components, variables, and design tokens.",
      "Compelling design portfolio demonstrating clear user-centered problem-solving and visual polish."
    ],
    tools: ["Figma", "Miro", "UserTesting", "Storybook", "Framer"]
  },

  // ==========================================
  // 10. BUSINESS, MARKETING & HR (40 roles)
  // ==========================================
  {
    title: "Growth Marketing Lead (PLG & Funnels)",
    department: "Marketing",
    category: "Marketing",
    level: "Lead",
    requiredSkills: ["Growth Marketing", "Product-Led Growth (PLG)", "Conversion Rate Optimization (CRO)", "A/B Testing", "Google Analytics", "Paid Acquisition"],
    preferredSkills: ["Segment", "Mixpanel", "HubSpot", "SEO", "Copywriting"],
    responsibilities: [
      "Drive user acquisition, self-serve signups, and trial-to-paid conversion funnels.",
      "Design and execute rapid A/B experiments across landing pages, onboarding flows, and email nurture tracks.",
      "Analyze full-funnel customer acquisition costs (CAC), payback periods, and lifetime value (LTV).",
      "Manage paid advertising channels (Google Ads, LinkedIn Ads) with strict ROAS targets."
    ],
    requirements: [
      "5+ years in growth marketing or performance marketing in high-velocity SaaS companies.",
      "Deep expertise in Product-Led Growth (PLG) mechanics, user retention, and viral loops.",
      "Strong analytical mindset with proven experience running statistically significant A/B tests."
    ],
    tools: ["Google Analytics 4", "Mixpanel", "Google Ads", "HubSpot", "Hotjar"]
  },
  {
    title: "Senior Technical Talent Acquisition Partner",
    department: "Human Resources",
    category: "Human Resources",
    level: "Senior",
    requiredSkills: ["Technical Recruiting", "Sourcing", "Candidate Screening", "ATS Systems", "Offer Negotiation", "Stakeholder Management"],
    preferredSkills: ["LinkedIn Recruiter", "Boolean Search", "Tech Industry Knowledge", "Compensation Benchmarking"],
    responsibilities: [
      "Manage full-cycle recruiting for engineering, data, product, and leadership positions.",
      "Develop innovative sourcing strategies using LinkedIn Recruiter, GitHub, and technical communities.",
      "Screen candidates against role requirements and coordinate structured interview loops with hiring managers.",
      "Negotiate competitive compensation packages and drive exceptional candidate experience."
    ],
    requirements: [
      "5+ years of technical recruiting experience in high-growth technology companies or tech agencies.",
      "Deep understanding of software engineering roles, programming languages, and tech stacks.",
      "Proven ability to build diverse talent pipelines and achieve hiring goals consistently."
    ],
    tools: ["LinkedIn Recruiter", "Greenhouse / Lever", "Gem", "Slack", "Google Workspace"]
  }
];

// Helper to generate a full comprehensive 300+ dataset by expanding across levels, specialties, and industry domains
export function generate300JobTemplates(): any[] {
  console.log("Generating full comprehensive library of 300+ designations...");

  const departments = [
    {
      name: "Engineering",
      category: "Frontend",
      roles: [
        { title: "Junior Frontend Developer (HTML/CSS/JS)", level: "Entry-level", skills: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Git", "REST APIs"], pref: ["React", "Tailwind CSS", "TypeScript"] },
        { title: "Frontend Developer (React & TypeScript)", level: "Mid-level", skills: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Redux", "REST APIs"], pref: ["Next.js", "Jest", "Vite"] },
        { title: "Senior React Developer", level: "Senior", skills: ["React", "TypeScript", "Next.js", "Performance Optimization", "State Management", "Testing"], pref: ["GraphQL", "Storybook", "Web Vitals"] },
        { title: "Lead Frontend Engineer (Next.js & Performance)", level: "Lead", skills: ["Next.js", "React", "TypeScript", "Core Web Vitals", "Server Components", "Architecture"], pref: ["Turborepo", "Micro-frontends", "Tailwind CSS"] },
        { title: "Principal Frontend Architect", level: "Executive", skills: ["Frontend Architecture", "Design Systems", "Web Standards", "Scalability", "TypeScript", "Micro-frontends"], pref: ["Module Federation", "WebAssembly"] },
        { title: "Senior Vue.js Engineer (Vue 3 & Pinia)", level: "Senior", skills: ["Vue 3", "Composition API", "TypeScript", "Pinia", "Vite", "Tailwind CSS"], pref: ["Nuxt.js", "Vitest", "SSR"] },
        { title: "Senior Angular Developer (RxJS & NgRx)", level: "Senior", skills: ["Angular", "TypeScript", "RxJS", "NgRx", "Dependency Injection", "Unit Testing"], pref: ["Angular Signals", "Nx Monorepo"] },
        { title: "Svelte / SvelteKit Developer", level: "Mid-level", skills: ["Svelte", "SvelteKit", "TypeScript", "JavaScript", "HTML5", "CSS3"], pref: ["Tailwind CSS", "SSR", "Vite"] },
        { title: "Web Performance & Core Web Vitals Engineer", level: "Senior", skills: ["Web Performance", "Core Web Vitals", "JavaScript Profiling", "Lighthouse", "Webpack/Vite", "CDN Caching"], pref: ["RUM Telemetry", "Next.js"] },
        { title: "Design Systems Engineer (React & Storybook)", level: "Senior", skills: ["Design Systems", "React", "TypeScript", "Storybook", "Tailwind CSS", "Figma Tokens"], pref: ["Radix UI", "Accessibility (WCAG)"] },
        { title: "UI/UX Frontend Engineer", level: "Mid-level", skills: ["UI/UX Design", "React", "CSS3 / SCSS", "Figma", "Responsive Layouts", "JavaScript"], pref: ["Framer Motion", "Tailwind CSS"] },
        { title: "Jamstack & Headless CMS Developer", level: "Mid-level", skills: ["Next.js", "Headless CMS", "GraphQL", "Tailwind CSS", "TypeScript", "Vercel"], pref: ["Sanity", "Contentful", "SEO"] },
        { title: "Micro-Frontends Architect", level: "Lead", skills: ["Micro-frontends", "Module Federation", "Webpack", "React", "TypeScript", "Monorepo"], pref: ["Single-SPA", "Nx", "CI/CD"] },
        { title: "Web3 / DApp Frontend Developer", level: "Mid-level", skills: ["React", "TypeScript", "Ethers.js / Wagmi", "Web3.js", "Smart Contract Integration", "Tailwind CSS"], pref: ["Solidity", "IPFS", "The Graph"] },
        { title: "Progressive Web App (PWA) Engineer", level: "Senior", skills: ["PWA", "Service Workers", "Cache API", "IndexedDB", "Offline First", "TypeScript"], pref: ["Workbox", "Web Push Notifications"] },
        { title: "WebGL & 3D Web Graphics Developer (Three.js)", level: "Senior", skills: ["Three.js", "WebGL", "GLSL Shaders", "JavaScript / TypeScript", "3D Modeling", "Canvas API"], pref: ["Blender", "WebGPU", "React Three Fiber"] },
        { title: "Web Accessibility (a11y / WCAG) Specialist", level: "Senior", skills: ["Web Accessibility", "WCAG 2.1 AA", "Screen Readers", "ARIA", "Semantic HTML", "Automated Auditing"], pref: ["axe-core", "Color Contrast", "Keyboard Nav"] },
        { title: "Senior Nuxt.js & Vue SSR Engineer", level: "Senior", skills: ["Nuxt.js", "Vue 3", "SSR / SSG", "TypeScript", "Pinia", "SEO Optimization"], pref: ["Tailwind CSS", "Vite", "Nitro"] },
        { title: "E-Commerce Frontend Developer (Shopify / Hydrogen)", level: "Mid-level", skills: ["Shopify Liquid", "Hydrogen", "React", "Storefront API", "Tailwind CSS", "JavaScript"], pref: ["GraphQL", "Headless Commerce", "Klaviyo"] },
        { title: "Chrome Extension & Web Scraper Engineer", level: "Mid-level", skills: ["Chrome Extensions Manifest V3", "JavaScript", "DOM Parsing", "Background Scripts", "Web APIs"], pref: ["Puppeteer", "TypeScript", "Storage API"] },
        { title: "Micro-Animations & Motion UI Engineer", level: "Mid-level", skills: ["Framer Motion", "CSS Keyframes", "Lottie", "GSAP", "React", "UI Polish"], pref: ["Figma", "Canvas", "Interactive Design"] },
        { title: "Enterprise Portal UI Developer", level: "Senior", skills: ["TypeScript", "React", "Enterprise Grid", "Data Visualization", "REST APIs", "SSO Integration"], pref: ["AG-Grid", "Tailwind CSS", "Zustand"] },
        { title: "Staff Frontend Infrastructure Engineer", level: "Lead", skills: ["Build Tooling", "Turbopack / Vite", "Monorepos", "TypeScript", "Performance CI", "DevEx"], pref: ["Babel / SWC", "Docker", "Module Federation"] },
        { title: "Creative Web Developer (Awwwards Style)", level: "Senior", skills: ["GSAP", "Three.js", "Canvas", "Creative Coding", "Interactive Layouts", "JavaScript"], pref: ["ScrollTrigger", "Shaders", "WebGL"] },
        { title: "SDK & Developer Portal Frontend Engineer", level: "Senior", skills: ["TypeScript", "SDK Design", "API Documentation", "React", "OpenAPI", "Developer Experience"], pref: ["Stripe-like UI", "Playground", "Markdown"] },
        { title: "Canvas & SVG Data Visualization Engineer (D3.js)", level: "Senior", skills: ["D3.js", "SVG", "Canvas API", "Data Visualization", "TypeScript", "React"], pref: ["Chart.js", "WebGL", "Mathematical Modeling"] },
        { title: "Next.js App Router & Server Actions Specialist", level: "Senior", skills: ["Next.js App Router", "Server Actions", "React Server Components", "TypeScript", "PostgreSQL"], pref: ["Tailwind CSS", "Prisma", "Vercel"] },
        { title: "Junior React Developer", level: "Entry-level", skills: ["React", "JavaScript", "HTML5", "CSS3", "Git", "REST APIs"], pref: ["TypeScript", "Tailwind CSS", "Redux"] },
        { title: "Senior State Management Architect", level: "Senior", skills: ["State Architecture", "Redux Toolkit", "Zustand", "TanStack Query", "TypeScript", "Client Caching"], pref: ["XState", "Normalized Cache", "RxJS"] },
        { title: "Head of Frontend Engineering", level: "Executive", skills: ["Engineering Leadership", "Frontend Architecture", "Team Management", "Technical Roadmap", "Recruiting"], pref: ["Web Standards", "Product Vision", "Mentorship"] }
      ]
    },
    {
      name: "Mobile",
      category: "Mobile",
      roles: [
        { title: "Junior Mobile Developer (React Native)", level: "Entry-level", skills: ["React Native", "JavaScript", "Mobile UI", "Git", "REST APIs"], pref: ["TypeScript", "Expo", "Android Studio basics"] },
        { title: "React Native Mobile Developer", level: "Mid-level", skills: ["React Native", "TypeScript", "Redux", "iOS", "Android", "Mobile Navigation"], pref: ["Expo", "Fastlane", "Native Modules"] },
        { title: "Senior React Native Architect", level: "Senior", skills: ["React Native", "TypeScript", "Native Bridges (Swift/Kotlin)", "Performance Profiling", "Hermes Engine", "Offline Sync"], pref: ["Fastlane", "GraphQL", "App Store Connect"] },
        { title: "Senior iOS Engineer (Swift & SwiftUI)", level: "Senior", skills: ["Swift", "SwiftUI", "Combine", "UIKit", "Xcode", "Core Data"], pref: ["Async/Await", "Clean Architecture", "XCTest"] },
        { title: "Lead Android Developer (Kotlin & Jetpack Compose)", level: "Lead", skills: ["Kotlin", "Jetpack Compose", "Android SDK", "Coroutines", "MVVM", "Gradle"], pref: ["Hilt / Koin", "Room Database", "Play Store"] },
        { title: "Flutter Cross-Platform Mobile Engineer", level: "Mid-level", skills: ["Flutter", "Dart", "State Management (Bloc/Riverpod)", "REST APIs", "iOS & Android", "Git"], pref: ["Platform Channels", "Firebase", "SQLite"] },
        { title: "Senior Flutter Architect", level: "Senior", skills: ["Flutter", "Dart", "Custom Painter", "Native Interop", "Performance Profiling", "CI/CD"], pref: ["Bloc Architecture", "App Store Optimization"] },
        { title: "Mobile DevOps & Release Engineer", level: "Senior", skills: ["Fastlane", "GitHub Actions", "App Store Connect", "Google Play Console", "Mobile CI/CD", "Bash/Python"], pref: ["Bitrise", "Code Signing", "Firebase App Distribution"] },
        { title: "Mobile Security & Penetration Tester", level: "Senior", skills: ["Mobile AppSec", "OWASP Mobile Top 10", "Frida", "Reverse Engineering", "SSL Pinning", "Android/iOS Security"], pref: ["MobSF", "Jailbreak Detection", "Obfuscation"] },
        { title: "Staff Mobile Platform Engineer", level: "Lead", skills: ["Mobile Architecture", "Modular Apps", "Design Systems for Mobile", "CI/CD", "Observability", "Crashlytics"], pref: ["KMP (Kotlin Multiplatform)", "CocoaPods/SPM"] }
      ]
    },
    {
      name: "Engineering",
      category: "Backend",
      roles: [
        { title: "Junior Backend Engineer (Node.js & Express)", level: "Entry-level", skills: ["JavaScript", "Node.js", "Express", "SQL", "REST APIs", "Git"], pref: ["TypeScript", "PostgreSQL", "Docker"] },
        { title: "Backend Developer (Python & FastAPI)", level: "Mid-level", skills: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "Docker", "REST APIs"], pref: ["Pydantic", "Redis", "Celery"] },
        { title: "Senior Python / Django Backend Developer", level: "Senior", skills: ["Python", "Django", "Django REST Framework", "PostgreSQL", "Celery", "Redis"], pref: ["Docker", "AWS", "Pytest"] },
        { title: "Senior Go (Golang) Microservices Engineer", level: "Senior", skills: ["Go (Golang)", "Microservices", "gRPC", "PostgreSQL", "Docker", "Kubernetes"], pref: ["Apache Kafka", "Redis", "Prometheus"] },
        { title: "Staff Backend Architect (Distributed Systems)", level: "Lead", skills: ["Distributed Systems", "System Design", "Go / Java", "Kafka", "PostgreSQL", "High Availability"], pref: ["Consensus Protocols", "Cloud Architecture"] },
        { title: "Senior Java Spring Boot Engineer", level: "Senior", skills: ["Java", "Spring Boot", "Microservices", "Hibernate / JPA", "PostgreSQL", "Docker"], pref: ["Spring Cloud", "Kafka", "Kubernetes"] },
        { title: "Senior C# .NET Core Backend Engineer", level: "Senior", skills: ["C#", ".NET Core", "ASP.NET Core", "Entity Framework Core", "SQL Server / Postgres", "REST APIs"], pref: ["Azure Cloud", "Docker", "RabbitMQ"] },
        { title: "Senior Ruby on Rails Developer", level: "Senior", skills: ["Ruby", "Ruby on Rails", "PostgreSQL", "Sidekiq", "Redis", "RSpec"], pref: ["Hotwire / Turbo", "Docker", "AWS"] },
        { title: "Staff Rust Systems & Networking Engineer", level: "Lead", skills: ["Rust", "Systems Programming", "Async (Tokio)", "Memory Management", "Concurrency", "Linux"], pref: ["WebAssembly", "eBPF", "Network Protocols"] },
        { title: "Senior PHP / Laravel Backend Engineer", level: "Senior", skills: ["PHP 8+", "Laravel", "MySQL / PostgreSQL", "REST APIs", "Redis", "Queues"], pref: ["Inertia.js", "Docker", "PHPUnit"] },
        { title: "High-Frequency Trading (HFT) C++ Developer", level: "Lead", skills: ["Modern C++ (17/20)", "Low Latency", "Multithreading", "Linux Kernel", "Memory Optimization", "Socket Programming"], pref: ["Kernel Bypass", "SIMD", "Financial Markets"] },
        { title: "Database Administrator (PostgreSQL DBA)", level: "Senior", skills: ["PostgreSQL", "Query Optimization", "Replication", "High Availability", "Backup & Recovery", "Linux"], pref: ["PgBouncer", "Citus", "Patroni"] },
        { title: "NoSQL Database Engineer (MongoDB / DynamoDB)", level: "Senior", skills: ["MongoDB", "DynamoDB", "Document Modeling", "Sharding & Indexing", "Replication", "Performance Tuning"], pref: ["Redis", "Aggregations", "Cassandra"] },
        { title: "API Platform & Integration Architect", level: "Lead", skills: ["API Design", "REST", "GraphQL Federation", "API Gateway (Kong/Apigee)", "OAuth2/OIDC", "Developer Experience"], pref: ["gRPC", "Rate Limiting", "OpenAPI"] },
        { title: "Event-Driven Systems Engineer (Apache Kafka)", level: "Senior", skills: ["Apache Kafka", "Kafka Streams", "Event-Driven Architecture", "Schema Registry", "Java / Go", "Distributed Logging"], pref: ["RabbitMQ", "Flink", "Avro"] },
        { title: "Search Engine Architect (Elasticsearch / OpenSearch)", level: "Senior", skills: ["Elasticsearch", "OpenSearch", "Full-Text Search", "Inverted Index", "Query Optimization", "Cluster Management"], pref: ["Logstash", "Kibana", "Lucene"] },
        { title: "Real-Time Communications Engineer (WebSockets / WebRTC)", level: "Senior", skills: ["WebSockets", "WebRTC", "Socket.io", "Signaling Servers", "Audio/Video Streaming", "Node.js / Go"], pref: ["TURN/STUN", "Redis Pub/Sub", "SFU Media Servers"] },
        { title: "Serverless Backend Engineer (AWS Lambda & DynamoDB)", level: "Mid-level", skills: ["AWS Lambda", "Serverless Framework", "Node.js / Python", "DynamoDB", "API Gateway", "EventBridge"], pref: ["S3", "Step Functions", "CloudWatch"] },
        { title: "FinTech & Payment Gateway Backend Developer", level: "Senior", skills: ["Stripe API", "Payment Gateways", "PCI-DSS Compliance", "Idempotency", "Double-Entry Ledger", "PostgreSQL"], pref: ["Plaid", "ACH Transfers", "Fraud Checks"] },
        { title: "Identity & Authentication Engineer (OAuth / SAML / OIDC)", level: "Senior", skills: ["OAuth 2.0", "OpenID Connect", "SAML SSO", "JWT Tokens", "RBAC / ABAC", "Zero Trust Auth"], pref: ["Keycloak", "Auth0", "Session Security"] },
        { title: "Senior NestJS & TypeScript Backend Developer", level: "Senior", skills: ["NestJS", "TypeScript", "TypeORM / Prisma", "PostgreSQL", "Dependency Injection", "Microservices"], pref: ["Swagger", "Redis", "Docker"] },
        { title: "Elixir / Phoenix Real-Time Backend Developer", level: "Senior", skills: ["Elixir", "Phoenix Framework", "LiveView", "Erlang OTP", "Concurrency", "WebSockets"], pref: ["PostgreSQL", "Ecto", "Distributed Erlang"] },
        { title: "Embedded Firmware Engineer (C / C++ / RTOS)", level: "Senior", skills: ["C / C++", "Embedded Systems", "RTOS (FreeRTOS)", "Microcontrollers (ARM/STM32)", "I2C / SPI / UART", "Hardware Debugging"], pref: ["BLE", "IoT Protocols (MQTT)", "Oscilloscopes"] },
        { title: "Blockchain Smart Contract Engineer (Solidity)", level: "Senior", skills: ["Solidity", "Smart Contracts", "EVM", "Hardhat / Foundry", "ERC Standards", "Security Auditing"], pref: ["Slither", "OpenZeppelin", "DeFi"] },
        { title: "Legacy Modernization Specialist (COBOL to Java)", level: "Senior", skills: ["Java", "Legacy Architecture", "COBOL understanding", "Mainframe Data Mapping", "Microservices Migration", "Batch Processing"], pref: ["Spring Batch", "DB2", "Kafka"] },
        { title: "GraphQL Federation & Gateway Engineer", level: "Senior", skills: ["GraphQL", "Apollo Federation", "Schema Stitching", "Subgraph Design", "TypeScript / Go", "Caching"], pref: ["DataLoader", "Directives", "Performance"] },
        { title: "Data Ingestion & Reverse ETL Platform Engineer", level: "Senior", skills: ["Python", "SQL", "Reverse ETL", "API Connectors", "Webhooks", "PostgreSQL"], pref: ["Airbyte", "Census", "Kafka"] },
        { title: "High-Throughput Webhooks & Notification Engineer", level: "Senior", skills: ["Message Queues", "Webhook Delivery", "Exponential Backoff", "Redis", "Distributed Workers", "PostgreSQL"], pref: ["Twilio", "SendGrid", "Kafka"] },
        { title: "Cloud Database Migration Specialist", level: "Senior", skills: ["Database Migration", "Zero-Downtime DDL", "CDC (Change Data Capture)", "PostgreSQL", "MySQL", "AWS DMS"], pref: ["Debezium", "Data Validation", "Replication"] },
        { title: "VP of Backend Engineering", level: "Executive", skills: ["Engineering Leadership", "Distributed Systems", "Technology Strategy", "Budget Management", "Executive Hiring"], pref: ["Multi-Region Architecture", "High Scale"] }
      ]
    },
    {
      name: "Engineering",
      category: "Full Stack",
      roles: [
        { title: "Junior Full Stack Developer", level: "Entry-level", skills: ["JavaScript", "React", "Node.js", "SQL / NoSQL", "HTML/CSS", "Git"], pref: ["TypeScript", "Express", "Tailwind CSS"] },
        { title: "Full Stack Developer (MERN Stack)", level: "Mid-level", skills: ["MongoDB", "Express", "React", "Node.js", "JavaScript", "REST APIs"], pref: ["TypeScript", "Redux", "Tailwind CSS"] },
        { title: "Senior Full Stack Engineer (Next.js, Node.js, PostgreSQL)", level: "Senior", skills: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"], pref: ["Prisma", "GraphQL", "Docker", "Redis"] },
        { title: "Staff Full Stack Engineer (B2B SaaS)", level: "Lead", skills: ["Full Stack Architecture", "Next.js", "PostgreSQL", "Multi-Tenant SaaS", "RBAC", "TypeScript"], pref: ["Stripe Billing", "Tailwind CSS", "Microservices"] },
        { title: "Full Stack Engineer (Python Django + React)", level: "Mid-level", skills: ["Python", "Django", "React", "PostgreSQL", "REST APIs", "TypeScript"], pref: ["Celery", "Docker", "Tailwind CSS"] },
        { title: "Full Stack Engineer (Java Spring + Angular)", level: "Senior", skills: ["Java", "Spring Boot", "Angular", "TypeScript", "PostgreSQL", "Microservices"], pref: ["RxJS", "Docker", "JUnit"] },
        { title: "Full Stack Engineer (Ruby on Rails + Hotwire)", level: "Senior", skills: ["Ruby", "Ruby on Rails", "Hotwire / Turbo", "Stimulus", "PostgreSQL", "Tailwind CSS"], pref: ["Sidekiq", "Redis", "RSpec"] },
        { title: "Full Stack Engineer (.NET Core + Blazor)", level: "Senior", skills: ["C#", ".NET Core", "Blazor", "SQL Server", "Entity Framework", "Azure"], pref: ["WebAssembly", "REST APIs", "Docker"] },
        { title: "Founding Full Stack Engineer (Early Stage Startup)", level: "Lead", skills: ["Full Stack Architecture", "React / Next.js", "Node.js / Python", "PostgreSQL", "Cloud Deployment", "Fast Prototyping"], pref: ["Stripe", "Supabase", "Tailwind CSS"] },
        { title: "Growth Full Stack Engineer (Funnels & CRO)", level: "Senior", skills: ["Full Stack Dev", "A/B Testing", "Conversion Optimization", "React", "Node.js", "Analytics Tracking"], pref: ["Segment", "Mixpanel", "SQL"] },
        { title: "Internal Tools Full Stack Developer (Retool / Next.js)", level: "Mid-level", skills: ["Internal Tools", "React / Next.js", "PostgreSQL", "SQL", "REST APIs", "Retool"], pref: ["Admin Portals", "RBAC", "Node.js"] },
        { title: "Healthcare SaaS Full Stack Developer (HIPAA)", level: "Senior", skills: ["Healthcare SaaS", "HIPAA Compliance", "Full Stack TypeScript", "PostgreSQL", "Audit Logging", "Encryption"], pref: ["FHIR", "HL7", "AWS Health"] },
        { title: "EdTech Full Stack Engineer", level: "Mid-level", skills: ["React", "Node.js", "PostgreSQL", "Video Streaming", "LMS Standards (LTI)", "TypeScript"], pref: ["Interactive Quizzes", "WebSockets"] },
        { title: "AI Application Full Stack Developer", level: "Senior", skills: ["Next.js", "Python / FastAPI", "OpenAI API", "Vector Search", "TypeScript", "Tailwind CSS"], pref: ["LangChain", "Streaming UI", "PostgreSQL"] },
        { title: "Monorepo Full Stack Engineer (Turborepo)", level: "Senior", skills: ["Turborepo", "Nx", "TypeScript", "Next.js", "Node.js", "Shared Packages"], pref: ["pnpm", "CI/CD Cache", "Docker"] },
        { title: "Customer-Facing Solutions Full Stack Engineer", level: "Senior", skills: ["Solutions Architecture", "Full Stack Web", "API Integration", "Customer Demos", "TypeScript", "SQL"], pref: ["Technical Consulting", "Postman"] },
        { title: "Full Stack Developer (Go + React)", level: "Senior", skills: ["Go (Golang)", "React", "TypeScript", "PostgreSQL", "Docker", "REST / gRPC"], pref: ["Tailwind CSS", "Kubernetes", "Redis"] },
        { title: "Full Stack Developer (FastAPI + Svelte)", level: "Mid-level", skills: ["Python", "FastAPI", "SvelteKit", "TypeScript", "PostgreSQL", "Docker"], pref: ["Tailwind CSS", "Redis", "Pydantic"] },
        { title: "E-Commerce Marketplace Full Stack Architect", level: "Lead", skills: ["E-Commerce Architecture", "Inventory Management", "Stripe Connect", "React", "Node.js", "PostgreSQL"], pref: ["Algolia", "Redis", "Kafka"] },
        { title: "Principal Full Stack Architect", level: "Executive", skills: ["Enterprise Architecture", "Full Stack Strategy", "Cloud Infrastructure", "System Design", "Engineering Leadership"], pref: ["Technical Vision", "High Scale"] }
      ]
    },
    {
      name: "DevOps",
      category: "Cloud & Infrastructure",
      roles: [
        { title: "Junior Cloud Support Engineer", level: "Entry-level", skills: ["Cloud Basics", "Linux", "Networking (DNS/TCP)", "Bash Scripting", "AWS Console", "Ticketing"], pref: ["AWS Certified Cloud Practitioner", "Docker basics"] },
        { title: "Cloud Engineer (AWS Certified)", level: "Mid-level", skills: ["AWS (EC2, S3, RDS, IAM)", "Terraform", "Linux", "Networking (VPC)", "Docker", "CloudWatch"], pref: ["AWS Solutions Architect", "Python Scripting"] },
        { title: "Senior DevOps Engineer (AWS & Terraform)", level: "Senior", skills: ["AWS", "Terraform", "Docker", "Kubernetes", "CI/CD (GitHub Actions)", "Linux"], pref: ["Helm", "Prometheus", "Grafana", "Ansible"] },
        { title: "Azure Cloud Solutions DevOps Engineer", level: "Senior", skills: ["Microsoft Azure", "Azure DevOps Pipelines", "ARM / Bicep / Terraform", "Azure Kubernetes (AKS)", "PowerShell", "Linux"], pref: ["Azure Solutions Architect", "Docker"] },
        { title: "Google Cloud Platform (GCP) Infrastructure Engineer", level: "Senior", skills: ["Google Cloud (GCP)", "GKE (Kubernetes)", "Terraform", "Cloud Build", "BigQuery", "IAM"], pref: ["GCP Professional Cloud Architect", "Python"] },
        { title: "Kubernetes & Container Orchestration Specialist", level: "Senior", skills: ["Kubernetes", "Docker", "Helm", "Ingress Controllers", "Storage Classes", "Cluster Hardening"], pref: ["CKA Certification", "Cilium / Calico", "KEDA"] },
        { title: "Principal Site Reliability Engineer (SRE)", level: "Lead", skills: ["Kubernetes", "Linux Kernel", "Incident Management", "Prometheus", "Grafana", "SLO / SLA Tracking"], pref: ["Chaos Engineering", "Go / Python", "Istio"] },
        { title: "Infrastructure as Code (IaC) Engineer (Terraform / Pulumi)", level: "Senior", skills: ["Terraform", "Pulumi", "Terragrunt", "Module Architecture", "State Management", "CI/CD"], pref: ["Policy as Code (OPA)", "Multi-Cloud"] },
        { title: "CI/CD Release Automation Engineer", level: "Mid-level", skills: ["GitHub Actions", "GitLab CI", "Jenkins", "Docker", "Bash Scripting", "Artifact Management"], pref: ["Semantic Release", "Security Scanning"] },
        { title: "GitOps & Progressive Delivery Engineer (ArgoCD)", level: "Senior", skills: ["GitOps", "ArgoCD", "Kubernetes", "Helm", "Canary Deployments", "Argo Rollouts"], pref: ["Flux", "Istio Traffic Shifting", "Prometheus"] },
        { title: "FinOps Cloud Cost Optimization Specialist", level: "Senior", skills: ["Cloud Cost Management", "AWS Cost Explorer", "Reserved Instances / Savings Plans", "Kubernetes Resource Sizing", "FinOps Principles", "SQL / Python"], pref: ["Kubecost", "Spot Instances"] },
        { title: "Linux Systems Administrator & Operations Engineer", level: "Mid-level", skills: ["Linux (Ubuntu/RHEL)", "Shell Scripting (Bash)", "Systemd", "User & SSH Management", "NFS / Storage", "Networking"], pref: ["Ansible", "Troubleshooting", "Cron Jobs"] },
        { title: "Observability & Telemetry Engineer (Datadog / Prometheus)", level: "Senior", skills: ["Observability", "Prometheus", "Grafana", "Datadog", "OpenTelemetry", "Distributed Tracing"], pref: ["Log Aggregation (ELK)", "Alert Engineering"] },
        { title: "Chaos Engineering & System Resilience Specialist", level: "Senior", skills: ["Chaos Engineering", "Chaos Mesh / Gremlin", "Failure Injection", "Reliability Testing", "Postmortem Leadership", "Kubernetes"], pref: ["SRE Principles", "Load Simulation"] },
        { title: "Hybrid Cloud & Multi-Region Migration Architect", level: "Lead", skills: ["Cloud Migration", "Multi-Region Architecture", "Data Replication", "AWS / Azure", "Direct Connect / VPN", "Disaster Recovery"], pref: ["Active-Active Clusters", "Global Traffic Routing"] },
        { title: "Service Mesh Engineer (Istio / Linkerd)", level: "Senior", skills: ["Service Mesh", "Istio", "Envoy Proxy", "Mutual TLS (mTLS)", "Traffic Management", "Kubernetes"], pref: ["Linkerd", "Telemetry", "Zero Trust"] },
        { title: "Edge Computing & CDN Infrastructure Engineer", level: "Senior", skills: ["Cloudflare Workers", "CDN Caching Rules", "Fastly / Varnish", "Edge KV", "DNS Management", "DDoS Mitigation"], pref: ["WAF Configuration", "Web Performance"] },
        { title: "Virtualization & Private Cloud Engineer (VMware / Proxmox)", level: "Senior", skills: ["VMware ESXi", "vCenter", "Proxmox", "SAN / NAS Storage", "Virtual Networking (VLAN)", "Hardware Provisioning"], pref: ["Ansible", "Backup Systems (Veeam)"] },
        { title: "Build & Release Engineer (Bazel / Monorepos)", level: "Senior", skills: ["Bazel", "Build Caching", "Remote Execution", "Compiler Toolchains", "Monorepo Build Speeds", "Python / Go"], pref: ["Docker", "Distributed Compilation"] },
        { title: "Cloud Networking & VPC Infrastructure Engineer", level: "Senior", skills: ["AWS VPC", "Subnets & Routing Tables", "BGP / Transit Gateway", "VPN / Direct Connect", "Network Security Groups", "Firewalls"], pref: ["Cisco / Juniper", "Wireshark Packet Analysis"] },
        { title: "Zero Trust Network Access (ZTNA) Architect", level: "Lead", skills: ["Zero Trust", "ZTNA", "Identity-Aware Proxy", "mTLS", "SAML / OIDC", "Network Segmentation"], pref: ["Cloudflare Access", "Tailscale / WireGuard"] },
        { title: "Staff Platform Engineer (Internal Developer Portal)", level: "Lead", skills: ["Platform Engineering", "Spotify Backstage", "Developer Experience (DevEx)", "Software Templates", "Kubernetes", "TypeScript"], pref: ["Self-Service Tooling", "CI/CD Automation"] },
        { title: "Secrets Management & Vault Engineer (HashiCorp Vault)", level: "Senior", skills: ["HashiCorp Vault", "Dynamic Secrets", "PKI Certificate Authority", "Transit Encryption", "Kubernetes Auth", "KMS"], pref: ["Terraform", "Security Compliance"] },
        { title: "Database Reliability Engineer (DBRE)", level: "Senior", skills: ["DBRE", "Database Automation", "PostgreSQL / MySQL", "Replication", "Failover Orchestration", "Terraform"], pref: ["Patroni", "Connection Pooling", "Backups"] },
        { title: "VP of Cloud Infrastructure & SRE", level: "Executive", skills: ["Infrastructure Leadership", "Cloud Strategy", "Vendor Negotiation", "Uptime SLAs", "Team Scaling", "Security & Compliance"], pref: ["Budget Planning", "Executive Alignment"] }
      ]
    },
    {
      name: "Data & AI",
      category: "Data Science & AI",
      roles: [
        { title: "Junior Data Analyst (SQL & Excel)", level: "Entry-level", skills: ["SQL", "Excel (VLOOKUP, Pivot)", "Data Cleaning", "Data Visualization", "Descriptive Statistics", "Reporting"], pref: ["Python basics", "Tableau basics"] },
        { title: "Data Analyst (Tableau & PowerBI)", level: "Mid-level", skills: ["SQL", "Tableau", "PowerBI", "Data Visualization", "Excel", "Business Analytics"], pref: ["Python (Pandas)", "Snowflake", "dbt"] },
        { title: "Senior Product Data Analyst", level: "Senior", skills: ["Product Analytics", "SQL", "Cohort Analysis", "Retention Curves", "A/B Testing", "Mixpanel / Amplitude"], pref: ["dbt", "Tableau", "Python"] },
        { title: "Data Scientist (Predictive Modeling & ML)", level: "Mid-level", skills: ["Python", "Machine Learning", "Scikit-Learn", "Pandas", "SQL", "Statistical Modeling"], pref: ["XGBoost", "A/B Testing", "Feature Engineering"] },
        { title: "Senior Data Scientist (Causal Inference & Experimentation)", level: "Senior", skills: ["Causal Inference", "Quasi-Experiments", "A/B Testing", "Python", "Econometrics", "Advanced Statistics"], pref: ["PyMC", "Instrumental Variables", "SQL"] },
        { title: "Lead Machine Learning Engineer (MLOps & PyTorch)", level: "Lead", skills: ["PyTorch", "MLOps", "Model Deployment", "Docker", "Kubeflow / MLflow", "Python"], pref: ["GPU Inference", "TensorRT", "Kubernetes"] },
        { title: "AI Research Scientist (Deep Learning & Neural Nets)", level: "Lead", skills: ["Deep Learning", "PyTorch", "Neural Architectures", "Mathematical Modeling", "Research Papers", "Python"], pref: ["PhD", "Published Research (NeurIPS/ICLR)"] },
        { title: "Generative AI / LLM Engineer (RAG & LangChain)", level: "Senior", skills: ["Python", "LLMs", "LangChain / LlamaIndex", "Vector Databases", "Prompt Engineering", "FastAPI"], pref: ["Fine-Tuning", "Pinecone", "Hugging Face"] },
        { title: "Computer Vision Engineer (OpenCV & PyTorch)", level: "Senior", skills: ["Computer Vision", "OpenCV", "Object Detection (YOLO)", "Image Segmentation", "PyTorch", "Python"], pref: ["TensorRT", "Video Analytics", "C++"] },
        { title: "Natural Language Processing (NLP) Engineer", level: "Senior", skills: ["NLP", "Transformers", "BERT / RoBERTa", "Tokenization", "Text Classification", "PyTorch / Python"], pref: ["Named Entity Recognition", "Embeddings"] },
        { title: "Prompt Engineer & LLM Evaluator", level: "Mid-level", skills: ["Prompt Engineering", "LLM Evaluation", "Few-Shot Prompting", "Ragas Benchmark", "System Instructions", "Python"], pref: ["Hallucination Auditing", "Fine-Tuning"] },
        { title: "Data Engineer (Python, SQL, Apache Airflow)", level: "Mid-level", skills: ["Python", "SQL", "Apache Airflow", "ETL Pipelines", "PostgreSQL", "Docker"], pref: ["Pandas", "AWS S3", "Data Quality"] },
        { title: "Senior Data Engineer (Snowflake & dbt)", level: "Senior", skills: ["Python", "SQL", "Snowflake", "dbt", "Apache Airflow", "Data Modeling"], pref: ["Apache Spark", "Kafka", "Data Governance"] },
        { title: "Big Data Engineer (Apache Spark & Hadoop)", level: "Senior", skills: ["Apache Spark", "PySpark", "Hadoop / HDFS", "SQL", "Parquet Data Lake", "Distributed Computing"], pref: ["Scala", "Databricks", "Delta Lake"] },
        { title: "Real-Time Streaming Data Engineer (Kafka & Flink)", level: "Senior", skills: ["Apache Kafka", "Apache Flink", "Stream Processing", "Event Sourcing", "Java / Scala / Python", "Data Lakehouse"], pref: ["Iceberg", "Schema Registry"] },
        { title: "Analytics Engineer (dbt & Modern Data Stack)", level: "Senior", skills: ["dbt (Data Build Tool)", "SQL", "Snowflake / BigQuery", "Data Modeling (Dimensional)", "Git", "Data Testing"], pref: ["Fivetran", "Looker", "CI/CD for dbt"] },
        { title: "Business Intelligence (BI) Architect", level: "Lead", skills: ["BI Architecture", "Data Warehousing", "Semantic Layer Design", "Tableau / Looker", "SQL", "Data Governance"], pref: ["Star Schemas", "Executive Dashboards"] },
        { title: "MLOps Platform Engineer (Kubeflow & Feast)", level: "Senior", skills: ["MLOps", "Feature Stores (Feast)", "Model Registry (MLflow)", "Kubeflow Pipelines", "Docker", "Kubernetes"], pref: ["Triton Inference Server", "Monitoring"] },
        { title: "Vector Database & Semantic Search Specialist", level: "Senior", skills: ["Vector Search", "Pinecone / Milvus / Qdrant", "HNSW Indexing", "Dense Embeddings", "Python", "Hybrid Search"], pref: ["pgvector", "BM25 Ranking", "FastAPI"] },
        { title: "Speech & Audio AI Engineer (Whisper & TTS)", level: "Senior", skills: ["Speech Recognition (ASR)", "Audio Signal Processing", "Whisper", "Text-to-Speech (TTS)", "PyTorch", "Python"], pref: ["Librosa", "Audio Latency", "VAD"] },
        { title: "Fraud & Risk Detection Data Scientist", level: "Senior", skills: ["Fraud Analytics", "Anomaly Detection", "Imbalanced Classification", "Python", "XGBoost", "Feature Engineering"], pref: ["Graph Neural Networks", "Real-time Scoring"] },
        { title: "Recommendation Systems ML Engineer", level: "Senior", skills: ["Recommendation Systems", "Collaborative Filtering", "Two-Tower Models", "Candidate Generation", "PyTorch", "Python"], pref: ["Ranking Algorithms", "A/B Testing"] },
        { title: "Data Governance & Metadata Lead", level: "Senior", skills: ["Data Governance", "Data Catalogs (Alation/Atlan)", "Data Lineage", "Access Control & PII", "GDPR Compliance", "Data Quality"], pref: ["Great Expectations", "SQL"] },
        { title: "Marketing Data Scientist (MMM & Attribution)", level: "Senior", skills: ["Marketing Mix Modeling (MMM)", "Multi-Touch Attribution", "Python / R", "Bayesian Statistics", "SQL", "Ad Spend ROI"], pref: ["Robyn / LightweightMMM", "Tableau"] },
        { title: "Healthcare & Clinical Data Scientist", level: "Senior", skills: ["Biomedical Data", "Clinical Trial Analytics", "HIPAA", "Survival Analysis", "Python / R", "Electronic Health Records (EHR)"], pref: ["FDA Compliance", "Biostatistics"] },
        { title: "Spatial & Geospatial Data Analyst (GIS)", level: "Mid-level", skills: ["GIS Mapping", "PostGIS", "Spatial SQL", "Python (GeoPandas/Shapely)", "QGIS", "Location Analytics"], pref: ["Mapbox", "Satellite Imagery", "Raster Data"] },
        { title: "Autonomous Systems & Robotics AI Engineer", level: "Lead", skills: ["Robotics / ROS", "Sensor Fusion (LiDAR, Camera)", "SLAM", "C++", "PyTorch", "Path Planning"], pref: ["Kalman Filters", "Simulation (Gazebo)"] },
        { title: "AI Ethics & Model Fairness Auditor", level: "Senior", skills: ["AI Ethics", "Bias & Fairness Metrics", "Model Explainability (SHAP/LIME)", "Regulatory Compliance (EU AI Act)", "Python"], pref: ["Audit Frameworks", "Responsible AI"] },
        { title: "Cloud Data Warehouse Architect (BigQuery & Databricks)", level: "Lead", skills: ["Databricks Lakehouse", "Google BigQuery", "Delta Lake", "Data Architecture", "SQL / Python", "Data Security"], pref: ["Unity Catalog", "Serverless Warehousing"] },
        { title: "Chief Data Officer (CDO)", level: "Executive", skills: ["Data Strategy", "Executive Leadership", "Data Governance", "Enterprise Architecture", "AI Monetization", "Compliance"], pref: ["Board Reporting", "Team Scaling"] }
      ]
    },
    {
      name: "Quality Assurance",
      category: "QA & Testing",
      roles: [
        { title: "Junior Manual QA Tester", level: "Entry-level", skills: ["Manual Testing", "Test Cases", "Bug Reporting", "Jira", "Cross-Browser Verification", "Exploratory Testing"], pref: ["Postman basics", "Agile ceremonies"] },
        { title: "QA Automation Engineer (Playwright & TypeScript)", level: "Mid-level", skills: ["TypeScript", "Playwright", "Test Automation", "CI/CD Integration", "API Testing", "Git"], pref: ["Cypress", "Docker", "k6 Performance"] },
        { title: "Senior QA Automation Engineer (Cypress)", level: "Senior", skills: ["Cypress", "JavaScript / TypeScript", "End-to-End Testing", "API Automation", "CI/CD Integration", "Test Framework Design"], pref: ["Visual Regression", "Mocking Server"] },
        { title: "Lead SDET (Software Development Engineer in Test)", level: "Lead", skills: ["SDET", "Test Architecture", "Python / Java / TS", "CI/CD Quality Gates", "Automation Frameworks", "API Testing"], pref: ["Kubernetes Testing", "Performance Testing"] },
        { title: "Performance & Load Testing Engineer (k6 / JMeter)", level: "Senior", skills: ["Load Testing", "k6", "JMeter", "Stress & Spike Testing", "APM Monitoring", "Bottleneck Analysis"], pref: ["Distributed Load Runners", "Datadog"] },
        { title: "Mobile QA Automation Engineer (Appium)", level: "Senior", skills: ["Appium", "Mobile Automation", "iOS / Android Testing", "XCUITest", "Espresso", "Device Farms (BrowserStack)"], pref: ["Python / Java", "CI/CD for Mobile"] },
        { title: "API & Integration QA Specialist", level: "Mid-level", skills: ["API Testing", "Postman / Newman", "REST Assured", "JSON Schema Validation", "Mock Servers", "SQL Data Verification"], pref: ["Swagger / OpenAPI", "OAuth Testing"] },
        { title: "Accessibility (WCAG) Quality Auditor", level: "Senior", skills: ["Accessibility Testing", "WCAG 2.1 Guidelines", "Screen Readers (NVDA/JAWS/VoiceOver)", "Keyboard Navigation", "axe-core", "Color Contrast"], pref: ["VPAT Authoring", "HTML Semantics"] },
        { title: "Game QA Tester & Bug Specialist", level: "Entry-level", skills: ["Game Testing", "Bug Reporting", "Gameplay Mechanics", "Console / PC Verification", "Collision & Physics Testing", "Jira"], pref: ["Unreal Engine basics", "Steam QA"] },
        { title: "Director of Quality Engineering", level: "Executive", skills: ["Quality Strategy", "Test Automation Architecture", "QA Leadership", "Release Quality Gates", "Metrics & KPIs", "Hiring"], pref: ["Zero Defect Culture", "CI/CD Integration"] }
      ]
    },
    {
      name: "Cybersecurity",
      category: "Security",
      roles: [
        { title: "Junior Security Operations Center (SOC) Analyst", level: "Entry-level", skills: ["SOC Monitoring", "SIEM Alert Triage", "Log Analysis", "Incident Escalation", "Network Fundamentals", "Phishing Analysis"], pref: ["Security+ Certification", "Splunk basics"] },
        { title: "Information Security Analyst (Tier 2 SOC)", level: "Mid-level", skills: ["SIEM (Splunk/Sentinel)", "Threat Investigation", "Malware Analysis basics", "Incident Containment", "EDR Monitoring", "TCP/IP"], pref: ["CySA+ Certification", "Python Scripting"] },
        { title: "Senior Penetration Tester (Ethical Hacker)", level: "Senior", skills: ["Penetration Testing", "Burp Suite", "Network Vulnerability Exploitation", "Metasploit", "Report Writing", "Web App Security"], pref: ["OSCP Certified", "Bug Bounty Track Record"] },
        { title: "Application Security (AppSec) Engineer", level: "Senior", skills: ["Application Security", "OWASP Top 10", "Penetration Testing", "Threat Modeling", "SAST / DAST", "Code Review"], pref: ["Burp Suite", "Python / Bash", "CISSP"] },
        { title: "Cloud Security Architect (AWS / Azure)", level: "Lead", skills: ["Cloud Security", "AWS Security Hub / GuardDuty", "IAM Least Privilege", "Security Architecture", "Cloud Compliance", "Terraform Security"], pref: ["CISSP", "AWS Certified Security Specialty"] },
        { title: "Identity & Access Management (IAM) Engineer", level: "Senior", skills: ["IAM", "Okta / Azure AD", "Single Sign-On (SSO)", "MFA Enforce", "Privileged Access Management (PAM)", "SCIM Provisioning"], pref: ["SailPoint", "OAuth / SAML Protocols"] },
        { title: "Security Compliance & GRC Analyst (SOC 2, ISO 27001)", level: "Senior", skills: ["GRC", "SOC 2 Type II", "ISO 27001", "Risk Assessments", "Vendor Security Review", "Policy Documentation"], pref: ["Audit Management", "CISA Certification"] },
        { title: "Incident Response & Threat Hunting Lead", level: "Lead", skills: ["Digital Forensics", "Incident Response (IR)", "Threat Hunting", "Memory Forensics (Volatility)", "MITRE ATT&CK Framework", "SIEM"], pref: ["GCIH Certification", "Malware Reverse Engineering"] },
        { title: "Data Privacy Officer & Compliance Lead (GDPR / CCPA)", level: "Senior", skills: ["Data Privacy Regulations", "GDPR / CCPA", "Data Mapping & PII", "Consent Management", "Privacy Impact Assessments (DPIA)", "Legal Liaison"], pref: ["CIPP/E Certification", "Vendor Audits"] },
        { title: "Chief Information Security Officer (CISO)", level: "Executive", skills: ["Executive Security Strategy", "Enterprise Risk Management", "Board Presentations", "Security Budgeting", "Compliance & Audit", "Crisis Management"], pref: ["CISSP / CISM", "Zero Trust Vision"] }
      ]
    },
    {
      name: "Product",
      category: "Product Management",
      roles: [
        { title: "Associate Product Manager (APM)", level: "Entry-level", skills: ["Product Management Basics", "User Stories", "Feature Specifications", "Competitive Research", "Data Analysis", "Agile Ceremonies"], pref: ["SQL basics", "Figma familiarity"] },
        { title: "Product Manager (Core Platform)", level: "Mid-level", skills: ["Product Roadmap", "Sprint Execution", "PRD Authoring", "User Research", "Agile / Scrum", "KPI Tracking"], pref: ["Jira", "Mixpanel", "SQL"] },
        { title: "Senior Product Manager (B2B Enterprise SaaS)", level: "Senior", skills: ["Product Management", "B2B SaaS", "Roadmap Strategy", "Agile / Scrum", "User Stories", "Product Analytics"], pref: ["Mixpanel / Amplitude", "Jira", "SQL"] },
        { title: "Technical Product Manager (APIs & Developer Platforms)", level: "Senior", skills: ["Technical Product Management", "API Design", "Developer Experience", "System Architecture", "REST / GraphQL", "Documentation"], pref: ["OpenAPI / Swagger", "Microservices", "Postman"] },
        { title: "Growth Product Manager (Acquisition & Retention)", level: "Senior", skills: ["Growth Product Management", "A/B Testing Strategy", "Activation Funnels", "Product-Led Growth", "Behavioral Analytics", "Monetization"], pref: ["Amplitude", "SQL", "Experiment Design"] },
        { title: "AI / Machine Learning Product Manager", level: "Senior", skills: ["AI Product Strategy", "LLM Features", "Model Evaluation Metrics", "Data Requirements", "UX for AI", "Machine Learning Concepts"], pref: ["Technical PM background", "Fast Prototyping"] },
        { title: "Lead Product Manager (FinTech & Payments)", level: "Lead", skills: ["FinTech Product Strategy", "Payment Gateways", "Regulatory Compliance", "Fraud Prevention", "Multi-Currency Transactions", "Executive Communication"], pref: ["Stripe / Plaid Experience", "Banking Integrations"] },
        { title: "Principal Product Manager (0 to 1 New Ventures)", level: "Lead", skills: ["0-to-1 Product Discovery", "Market Opportunity Validation", "Rapid MVP Launch", "Customer Interviews", "Product Vision", "Cross-Functional Leadership"], pref: ["Startup Track Record", "Design Thinking"] },
        { title: "Product Owner (Scrum / Agile)", level: "Mid-level", skills: ["Product Backlog Management", "User Story Refinement", "Acceptance Criteria", "Sprint Planning", "Jira", "Stakeholder Alignment"], pref: ["CSPO Certified", "Burndown Analysis"] },
        { title: "Certified Scrum Master (CSM)", level: "Mid-level", skills: ["Scrum Ceremonies", "Agile Coaching", "Sprint Facilitation", "Impediment Removal", "Team Velocity", "Jira / Confluence"], pref: ["CSM / PSM Certified", "Kanban Workflows"] },
        { title: "Lead Agile Coach & Enterprise Delivery Transformation", level: "Lead", skills: ["Agile Coaching", "SAFe / LeSS Frameworks", "Organizational Change", "Value Stream Mapping", "Executive Coaching", "Retrospectives"], pref: ["SPC Certification", "Cross-Squad Alignment"] },
        { title: "Technical Program Manager (TPM)", level: "Senior", skills: ["Technical Program Management", "Cross-Team Dependency Tracking", "Gantt Charts & Roadmaps", "Risk Mitigation", "Engineering Coordination", "Executive Status Reporting"], pref: ["Complex Cloud Migrations", "Jira / Confluence"] },
        { title: "Product Operations (Product Ops) Manager", level: "Senior", skills: ["Product Operations", "Data Synthesis", "Launch Readiness", "Voice of Customer Analysis", "Tooling Administration (Productboard/Jira)", "Process Standardization"], pref: ["SQL", "Analytics Dashboards"] },
        { title: "VP of Product Management", level: "Executive", skills: ["Product Vision & Strategy", "Portfolio Management", "Executive Leadership", "Board Presentations", "Hiring & Mentoring PMs", "P&L Ownership"], pref: ["High Growth B2B/B2C", "Mergers & Acquisitions"] },
        { title: "Chief Product Officer (CPO)", level: "Executive", skills: ["Global Product Direction", "Executive Strategy", "Company Vision", "Cross-Functional Alignment (Eng, Design, Marketing)", "Investor Relations", "Talent Development"], pref: ["IPO / Scale Experience", "B2B SaaS Authority"] }
      ]
    },
    {
      name: "Design",
      category: "UI/UX & Creative",
      roles: [
        { title: "Junior UI Designer", level: "Entry-level", skills: ["UI Design", "Figma", "Visual Hierarchy", "Typography & Color", "Wireframing", "Component Layouts"], pref: ["Portfolio", "Prototyping basics"] },
        { title: "UI/UX Designer (Web & Mobile)", level: "Mid-level", skills: ["Figma", "UI/UX Design", "Wireframes", "Interactive Prototypes", "User Flow Diagrams", "Design Systems"], pref: ["Mobile Guidelines (HIG/Material)", "User Interviews"] },
        { title: "Senior Product Designer (SaaS Platforms)", level: "Senior", skills: ["Product Design", "Figma", "UI/UX", "User Research", "Wireframing", "Prototyping"], pref: ["Design Systems", "Usability Testing", "Design Tokens"] },
        { title: "Principal Product Designer (Design Systems & Tokens)", level: "Lead", skills: ["Design Systems Architecture", "Design Tokens", "Figma Variables", "Component Governance", "Cross-Platform Standards", "DesignOps"], pref: ["Code-to-Design Sync", "Storybook Collaboration"] },
        { title: "Lead UX Researcher (Qualitative & Quantitative)", level: "Lead", skills: ["UX Research", "User Interviews", "Usability Testing", "Surveys & Quantitative Analysis", "Persona Development", "Journey Mapping"], pref: ["UserTesting.com", "Dovetail", "Maze"] },
        { title: "UX Writer & Content Designer", level: "Senior", skills: ["UX Writing", "Microcopy", "Content Design", "Information Architecture", "Voice & Tone Guidelines", "Figma Collaboration"], pref: ["Localization", "Accessibility Copy"] },
        { title: "Motion Graphics & UI Animator (Lottie / Framer)", level: "Senior", skills: ["UI Animation", "Framer Motion", "After Effects", "Lottie / Bodymovin", "Micro-Interactions", "Figma"], pref: ["Interactive WebGL", "Timing & Easing"] },
        { title: "3D Digital Artist & Spatial Designer (Spline / Blender)", level: "Senior", skills: ["3D Modeling", "Blender", "Spline 3D", "Texture & Lighting", "Web 3D Assets", "Spatial Computing UI"], pref: ["Three.js integration", "AR/VR Concepts"] },
        { title: "Creative Director", level: "Executive", skills: ["Creative Vision", "Brand Identity", "Design Direction", "Cross-Medium Campaigns", "Agency / In-House Leadership", "Presentation Skills"], pref: ["Award-Winning Portfolio", "Video & Digital"] },
        { title: "Head of Design", level: "Executive", skills: ["Design Leadership", "Product Design Strategy", "Design Systems Scaling", "Hiring & Mentoring", "Cross-Functional Executive Partnership", "DesignOps"], pref: ["Global Product Track Record", "Design Thinking"] }
      ]
    },
    {
      name: "Business & Marketing",
      category: "Marketing, Sales & HR",
      roles: [
        { title: "Junior Technical Recruiter", level: "Entry-level", skills: ["Candidate Sourcing", "Resume Screening", "LinkedIn Recruiter basics", "Interview Scheduling", "ATS Management", "Communication"], pref: ["Boolean Search", "Tech Terminology"] },
        { title: "Senior Technical Talent Acquisition Partner", level: "Senior", skills: ["Technical Recruiting", "Sourcing", "Candidate Screening", "ATS Systems", "Offer Negotiation", "Stakeholder Management"], pref: ["Engineering Hiring", "Compensation Benchmarking"] },
        { title: "HR Business Partner (HRBP)", level: "Senior", skills: ["HR Strategy", "Employee Relations", "Performance Management", "Talent Development", "Labor Law Compliance", "Executive Coaching"], pref: ["Organizational Design", "HR Analytics"] },
        { title: "Head of People & Culture", level: "Executive", skills: ["People Strategy", "Culture Building", "Executive HR Leadership", "Total Rewards & Benefits", "DEI Initiatives", "Employee Retention"], pref: ["Scale-up HR", "Global Remote Work"] },
        { title: "Sales Development Representative (SDR)", level: "Entry-level", skills: ["Outbound Prospecting", "Cold Calling / Emailing", "Lead Qualification (BANT)", "Salesforce / CRM", "Pipeline Generation", "Communication"], pref: ["Salesloft / Outreach", "LinkedIn Sales Navigator"] },
        { title: "Account Executive (Mid-Market B2B SaaS)", level: "Senior", skills: ["B2B SaaS Sales", "Deal Negotiation", "Discovery Calls", "Contract Closing", "Salesforce", "Quota Attainment"], pref: ["MEDDPICC Framework", "Demo Mastery"] },
        { title: "Enterprise Account Executive", level: "Lead", skills: ["Enterprise Sales Cycles ($100k+ ARR)", "C-Level Relationship Building", "Procurement & Security Review", "Multi-Stakeholder Consensus", "Sales Pipeline Strategy"], pref: ["Complex Contract Negotiations", "President's Club"] },
        { title: "Solutions Engineer / Pre-Sales Consultant", level: "Senior", skills: ["Pre-Sales Engineering", "Technical Proof of Concept (PoC)", "Custom Demo Development", "API Architecture Explanation", "Client Q&A"], pref: ["Coding Background", "RFP Authoring"] },
        { title: "Customer Success Manager (CSM)", level: "Senior", skills: ["Customer Retention", "Onboarding & Adoption", "Quarterly Business Reviews (QBR)", "Net Retention Rate (NRR)", "Customer Health Scoring", "Churn Prevention"], pref: ["Gainsight", "Upsell Identification"] },
        { title: "Digital Marketing Specialist (SEO & SEM)", level: "Mid-level", skills: ["SEO Optimization", "Google Search Console", "Keyword Research", "Google Ads (PPC)", "Content Strategy", "Analytics"], pref: ["Ahrefs / SEMrush", "Landing Page CRO"] },
        { title: "Growth Marketing Lead (PLG & Funnels)", level: "Lead", skills: ["Growth Marketing", "Product-Led Growth (PLG)", "Conversion Rate Optimization (CRO)", "A/B Testing", "Google Analytics", "Paid Acquisition"], pref: ["Segment", "Mixpanel", "HubSpot"] },
        { title: "Content Marketing Manager & Copywriter", level: "Senior", skills: ["Content Strategy", "Long-Form Blog Articles", "Copywriting", "SEO Optimization", "Editorial Calendars", "Social Distribution"], pref: ["Ghostwriting", "E-Books & Whitepapers"] },
        { title: "Email Marketing & CRM Automation Specialist", level: "Mid-level", skills: ["Email Marketing", "Lifecycle Automation", "Klaviyo / HubSpot", "Segmentation", "A/B Subject Line Testing", "Deliverability"], pref: ["HTML Email Templates", "Drip Campaigns"] },
        { title: "Junior Business Analyst", level: "Entry-level", skills: ["Business Requirements Gathering", "Process Flow Diagrams", "SQL basics", "Excel Modeling", "Jira Documentation", "Stakeholder Interviews"], pref: ["BPMN", "Agile User Stories"] },
        { title: "Senior Financial Analyst (FP&A)", level: "Senior", skills: ["Financial Modeling", "Budgeting & Forecasting", "Variance Analysis", "SaaS Metrics (ARR, CAC, LTV)", "Advanced Excel", "ERP Systems"], pref: ["CPA / MBA", "Board Reporting"] },
        { title: "Chief Financial Officer (CFO)", level: "Executive", skills: ["Financial Strategy", "Capital Raising & M&A", "P&L Management", "Investor Relations", "Audit & Tax Compliance", "Executive Leadership"], pref: ["IPO Readiness", "SaaS Financial Scale"] },
        { title: "Chief Operating Officer (COO)", level: "Executive", skills: ["Business Operations", "Operational Scaling", "Cross-Functional Execution", "P&L Oversight", "Process Optimization", "Executive Leadership"], pref: ["Scaling 100+ to 1000+ employees", "Board Governance"] }
      ]
    }
  ];

  const templates: any[] = [];
  const seenIds = new Set<string>();

  // Process manual detailed roles first
  for (const r of ROLES) {
    const id = r.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    seenIds.add(id);

    const desc = `### About the Role
We are seeking a talented and driven **${r.title}** to join our team in ${r.department}. In this position, you will play a key role in driving technical execution, maintaining quality, and delivering meaningful business impact.

### Key Responsibilities
${r.responsibilities.map(x => `- ${x}`).join("\n")}

### Qualifications & Requirements
${r.requirements.map(x => `- ${x}`).join("\n")}
- Demonstrated experience with: ${r.requiredSkills.join(", ")}.

### Preferred Qualifications
- Strong familiarity with: ${r.preferredSkills.join(", ")}.
- Experience with modern tools including: ${r.tools.join(", ")}.

### What We Offer
- Competitive compensation, comprehensive health/dental/vision coverage, and flexible PTO.
- Remote-first working culture with home office stipend.
- Professional development budget, continuous learning, and clear career growth ladders.`;

    templates.push({
      id,
      title: r.title,
      department: r.department,
      category: r.category,
      experienceLevel: r.level,
      requiredSkills: r.requiredSkills,
      preferredSkills: r.preferredSkills,
      description: desc
    });
  }

  // Expand across all department roles to reach 300+
  let counter = 1;
  for (const dept of departments) {
    for (const r of dept.roles) {
      const id = r.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (seenIds.has(id)) continue;
      seenIds.add(id);

      const desc = `### About the Role
We are looking for an experienced **${r.title}** to join our ${dept.name} organization. You will take ownership of critical initiatives, collaborate with cross-functional partners, and ensure technical excellence.

### Key Responsibilities
- Lead and execute ${dept.category} projects adhering to industry best practices and organizational goals.
- Build, optimize, and maintain scalable solutions utilizing ${r.skills.slice(0, 3).join(", ")}.
- Conduct code reviews, establish technical guidelines, and mentor peers across the team.
- Partner with product, design, and operations teams to translate business requirements into technical deliverables.
- Monitor system reliability, maintain high performance, and resolve complex edge cases.

### Qualifications & Requirements
- Proven professional experience working as a ${r.title} or similar role (${r.level}).
- Hands-on mastery and production experience with core technologies: ${r.skills.join(", ")}.
- Strong analytical and problem-solving skills with a focus on code quality, testing, and documentation.
- Excellent interpersonal and communication skills in asynchronous and remote team environments.

### Preferred Qualifications
- Practical knowledge or experience with: ${r.pref.join(", ")}.
- Track record of delivering scalable software in modern cloud or agile settings.

### What We Offer
- Competitive salary range based on experience level and location.
- Generous equity grants, 401(k) retirement matching, and top-tier health coverage.
- Flexible remote work arrangements, home office stipend, and yearly educational allowances.`;

      templates.push({
        id,
        title: r.title,
        department: dept.name,
        category: dept.category,
        experienceLevel: r.level,
        requiredSkills: r.skills,
        preferredSkills: r.pref,
        description: desc
      });
      counter++;
    }
  }

  // To guarantee reaching 300+ unique real-world designations across every specialty:
  const specialties = [
    { prefix: "Associate", level: "Entry-level" as const },
    { prefix: "Senior", level: "Senior" as const },
    { prefix: "Staff", level: "Lead" as const },
    { prefix: "Lead", level: "Lead" as const },
    { prefix: "Principal", level: "Executive" as const },
  ];

  const baseDesignations = [
    { title: "React Developer", dept: "Engineering", cat: "Frontend", req: ["React", "TypeScript", "JavaScript", "Tailwind CSS"], pref: ["Next.js", "Jest", "GraphQL"] },
    { title: "Vue.js Developer", dept: "Engineering", cat: "Frontend", req: ["Vue 3", "JavaScript", "TypeScript", "Pinia"], pref: ["Nuxt.js", "Tailwind CSS"] },
    { title: "Angular Developer", dept: "Engineering", cat: "Frontend", req: ["Angular", "TypeScript", "RxJS", "HTML5"], pref: ["NgRx", "SCSS"] },
    { title: "Node.js Engineer", dept: "Engineering", cat: "Backend", req: ["Node.js", "Express", "TypeScript", "PostgreSQL"], pref: ["Docker", "Redis", "Jest"] },
    { title: "Python Backend Developer", dept: "Engineering", cat: "Backend", req: ["Python", "FastAPI / Django", "SQL", "Docker"], pref: ["Celery", "Redis", "AWS"] },
    { title: "Golang Microservices Engineer", dept: "Engineering", cat: "Backend", req: ["Go (Golang)", "Microservices", "Docker", "PostgreSQL"], pref: ["gRPC", "Kafka", "Kubernetes"] },
    { title: "Java Spring Developer", dept: "Engineering", cat: "Backend", req: ["Java", "Spring Boot", "JPA / Hibernate", "SQL"], pref: ["Kafka", "Docker", "Microservices"] },
    { title: "C# .NET Engineer", dept: "Engineering", cat: "Backend", req: ["C#", ".NET Core", "Entity Framework", "SQL Server"], pref: ["Azure", "Docker", "REST"] },
    { title: "Ruby on Rails Developer", dept: "Engineering", cat: "Backend", req: ["Ruby", "Ruby on Rails", "PostgreSQL", "Sidekiq"], pref: ["Redis", "RSpec", "Docker"] },
    { title: "Full Stack Web Engineer", dept: "Engineering", cat: "Full Stack", req: ["React", "Node.js", "TypeScript", "PostgreSQL"], pref: ["Next.js", "Tailwind CSS", "Docker"] },
    { title: "AWS Cloud DevOps Engineer", dept: "DevOps", cat: "DevOps", req: ["AWS", "Terraform", "Docker", "CI/CD"], pref: ["Kubernetes", "Linux", "Grafana"] },
    { title: "Kubernetes Platform Engineer", dept: "DevOps", cat: "DevOps", req: ["Kubernetes", "Docker", "Helm", "Linux"], pref: ["Terraform", "Prometheus", "ArgoCD"] },
    { title: "Site Reliability Engineer", dept: "DevOps", cat: "DevOps", req: ["Linux", "Kubernetes", "Prometheus", "Incident Response"], pref: ["Python / Go", "Terraform", "Grafana"] },
    { title: "Data Analyst", dept: "Data & AI", cat: "Data", req: ["SQL", "Tableau", "Excel", "Data Visualization"], pref: ["Python", "PowerBI", "Snowflake"] },
    { title: "Data Scientist", dept: "Data & AI", cat: "Data", req: ["Python", "Machine Learning", "Scikit-Learn", "SQL"], pref: ["Pandas", "XGBoost", "A/B Testing"] },
    { title: "Machine Learning Engineer", dept: "Data & AI", cat: "AI", req: ["PyTorch", "Python", "Docker", "Model Deployment"], pref: ["MLflow", "Kubernetes", "FastAPI"] },
    { title: "Data Engineer", dept: "Data & AI", cat: "Data", req: ["Python", "SQL", "Snowflake", "dbt"], pref: ["Apache Airflow", "Spark", "Kafka"] },
    { title: "QA Automation Engineer", dept: "Quality Assurance", cat: "QA", req: ["TypeScript / Python", "Playwright / Cypress", "API Testing"], pref: ["CI/CD", "Postman", "Jest"] },
    { title: "Security Engineer", dept: "Cybersecurity", cat: "Security", req: ["Application Security", "OWASP Top 10", "Vulnerability Scanning"], pref: ["Cloud Security", "Burp Suite", "Python"] },
    { title: "Product Manager", dept: "Product", cat: "Product", req: ["Product Roadmap", "User Stories", "Agile / Scrum", "Product Analytics"], pref: ["Jira", "Mixpanel", "SQL"] },
    { title: "Technical Product Manager", dept: "Product", cat: "Product", req: ["API Design", "System Architecture", "PRDs", "Developer Experience"], pref: ["Microservices", "Postman", "SQL"] },
    { title: "Product Designer (UI/UX)", dept: "Design", cat: "Design", req: ["Figma", "UI/UX Design", "Wireframing", "User Research"], pref: ["Design Systems", "Prototyping", "Tailwind"] },
    { title: "UX Researcher", dept: "Design", cat: "Design", req: ["User Research", "Usability Testing", "Interviews", "Data Synthesis"], pref: ["Figma", "Surveys", "Journey Mapping"] },
    { title: "Technical Recruiter", dept: "Human Resources", cat: "HR", req: ["Tech Sourcing", "Screening", "LinkedIn Recruiter", "ATS Systems"], pref: ["Boolean Search", "Negotiation"] },
    { title: "Growth Marketing Specialist", dept: "Marketing", cat: "Marketing", req: ["Growth Marketing", "Google Analytics", "A/B Testing", "Paid Ads"], pref: ["SEO", "HubSpot", "SQL"] },
    { title: "Customer Success Manager", dept: "Business & Marketing", cat: "Sales", req: ["Customer Success", "Onboarding", "Retention", "QBRs"], pref: ["SaaS Metrics", "Salesforce"] },
    { title: "Business Analyst", dept: "Business & Marketing", cat: "Business", req: ["Requirements Gathering", "SQL", "Excel", "Process Mapping"], pref: ["Agile", "Jira", "PowerBI"] },
    { title: "Systems Administrator", dept: "DevOps", cat: "IT", req: ["Linux / Windows Server", "Networking", "Active Directory", "Bash/PowerShell"], pref: ["Cloud Basics", "Virtualization"] },
    { title: "iOS Developer", dept: "Mobile", cat: "Mobile", req: ["Swift", "iOS SDK", "Xcode", "UIKit / SwiftUI"], pref: ["Combine", "Core Data", "REST APIs"] },
    { title: "Android Developer", dept: "Mobile", cat: "Mobile", req: ["Kotlin", "Android SDK", "Jetpack Compose", "Coroutines"], pref: ["MVVM", "Room", "Hilt"] }
  ];

  for (const base of baseDesignations) {
    for (const spec of specialties) {
      if (templates.length >= 310) break;
      const fullTitle = `${spec.prefix} ${base.title}`;
      const id = fullTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (seenIds.has(id)) continue;
      seenIds.add(id);

      const desc = `### About the Role
We are seeking a **${fullTitle}** to join our team in ${base.dept}. In this role, you will be responsible for executing key initiatives and ensuring high-quality outcomes across ${base.cat}.

### Key Responsibilities
- Architect, build, and maintain core systems using ${base.req.slice(0, 2).join(" and ")}.
- Collaborate with engineering, product, and operations peers on technical specifications.
- Drive continuous improvement in code quality, system reliability, and performance.
- Troubleshoot critical issues and implement proactive testing and monitoring.

### Qualifications & Requirements
- Professional experience as a ${fullTitle} (${spec.level}).
- Hands-on proficiency with required skills: ${base.req.join(", ")}.
- Strong communication, problem-solving, and collaboration capabilities.

### Preferred Qualifications
- Experience with: ${base.pref.join(", ")}.
- Understanding of modern cloud and agile deployment methodologies.

### What We Offer
- Competitive compensation, health benefits, and flexible PTO.
- Collaborative, remote-friendly team culture with dedicated growth budgets.`;

      templates.push({
        id,
        title: fullTitle,
        department: base.dept,
        category: base.cat,
        experienceLevel: spec.level,
        requiredSkills: base.req,
        preferredSkills: base.pref,
        description: desc
      });
    }
  }

  console.log(`✓ Total unique job templates compiled: ${templates.length}`);
  return templates;
}

// Generate and write file
const templates = generate300JobTemplates();
const outputPath = path.resolve("src/data/job-templates.ts");

const fileContent = `/**
 * Curated Library of 300+ Industry-Standard Job Descriptions & Designations
 * Designed for ATS Resume Checking, Keyword Matching, and Candidate Screening.
 *
 * Generated automatically with comprehensive details for each designation.
 */

export interface JobTemplate {
  id: string;
  title: string;
  department: string;
  category: string;
  experienceLevel: "Entry-level" | "Mid-level" | "Senior" | "Lead" | "Executive";
  requiredSkills: string[];
  preferredSkills: string[];
  description: string;
}

export const JOB_TEMPLATES: JobTemplate[] = ${JSON.stringify(templates, null, 2)};

export const JOB_DEPARTMENTS: string[] = [
  "All",
  "Engineering",
  "Mobile",
  "DevOps",
  "Data & AI",
  "Quality Assurance",
  "Cybersecurity",
  "Product",
  "Design",
  "Marketing",
  "Human Resources",
  "Business & Marketing"
];

/**
 * Searches job templates by title, designation, department, or required skills.
 */
export function searchJobTemplates(query = "", department = "All", limit = 20): JobTemplate[] {
  const cleanQuery = query.toLowerCase().trim();
  const filterDept = department && department !== "All" ? department.toLowerCase() : null;

  return JOB_TEMPLATES.filter((job) => {
    // Department filter
    if (filterDept && job.department.toLowerCase() !== filterDept) {
      return false;
    }

    if (!cleanQuery) return true;

    // Search across title, category, department, and required skills
    const matchesTitle = job.title.toLowerCase().includes(cleanQuery);
    const matchesCategory = job.category.toLowerCase().includes(cleanQuery);
    const matchesDept = job.department.toLowerCase().includes(cleanQuery);
    const matchesSkills = job.requiredSkills.some((s) => s.toLowerCase().includes(cleanQuery));

    return matchesTitle || matchesCategory || matchesDept || matchesSkills;
  }).slice(0, limit);
}

/**
 * Finds a job template by ID.
 */
export function getJobTemplateById(id: string): JobTemplate | undefined {
  return JOB_TEMPLATES.find((j) => j.id === id);
}

/**
 * Finds a job template by exact or closest title.
 */
export function getJobTemplateByTitle(title: string): JobTemplate | undefined {
  const clean = title.toLowerCase().trim();
  return (
    JOB_TEMPLATES.find((j) => j.title.toLowerCase() === clean) ||
    JOB_TEMPLATES.find((j) => j.title.toLowerCase().includes(clean))
  );
}
`;

fs.writeFileSync(outputPath, fileContent, "utf-8");
console.log(`✓ Successfully saved ${templates.length} templates to: ${outputPath}`);

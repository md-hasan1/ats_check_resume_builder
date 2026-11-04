import { runMultiJobATSAnalysis } from "../src/lib/ats/multi-job-engine";
import { getMultipleJobTemplatesForDesignation } from "../src/data/job-templates";

console.log("\n=======================================================");
console.log("  MULTI-JOB ATS BENCHMARK ENGINE - TEST SUITE");
console.log("=======================================================\n");

let passed = 0;
let failed = 0;

function assert(condition: boolean, desc: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    failed++;
  }
}

async function runTests() {
  const sampleResume = `
Jane Doe
Email: jane.doe@example.com | Phone: (555) 123-4567 | San Francisco, CA
GitHub: github.com/janedoe | LinkedIn: linkedin.com/in/janedoe

PROFESSIONAL SUMMARY
Senior Full Stack & Node.js Engineer with 6+ years of experience designing scalable microservices, REST APIs, and modern frontend applications using Node.js, TypeScript, React, and PostgreSQL.

SKILLS
- Languages: JavaScript, TypeScript, Python, SQL
- Backend: Node.js, Express.js, NestJS, REST APIs, GraphQL
- Databases: PostgreSQL, Redis, MongoDB
- Cloud & DevOps: Docker, AWS (S3, Lambda, ECS), Git, CI/CD

EXPERIENCE
Senior Backend Engineer | Acme Tech (2021 - Present)
- Architected and built 15+ Node.js and TypeScript microservices handling 2M+ requests daily.
- Optimized PostgreSQL database queries, reducing p99 latency by 45%.
- Integrated Redis caching and Docker containerized deployment pipelines on AWS.

Software Engineer | Beta Corp (2018 - 2021)
- Developed RESTful APIs using Node.js, Express, and MongoDB.
- Built responsive user interfaces using React and Redux.
`;

  // 1. Multi-job template discovery
  console.log("1. Multi-Job Template Retrieval");
  const nodeTemplates = getMultipleJobTemplatesForDesignation("nodejs", 5);
  assert(nodeTemplates.length >= 3, `Discovered at least 3 job templates for 'nodejs' (got ${nodeTemplates.length})`);

  // 2. Multi-Job ATS Analysis execution
  console.log("\n2. Multi-Job ATS Analysis Execution");
  const jobsInput = nodeTemplates.map((t, idx) => ({
    id: t.id,
    title: t.title,
    company: `Market Benchmark #${idx + 1}`,
    description: t.description,
    experienceLevel: t.experienceLevel,
  }));

  const startTime = Date.now();
  const { compositeReport, multiJobSummary } = await runMultiJobATSAnalysis(
    sampleResume,
    jobsInput,
    { jobTitle: "Node.js Developer" }
  );
  const duration = Date.now() - startTime;

  assert(Boolean(compositeReport), "Generated composite ATS report");
  assert(Boolean(multiJobSummary), "Generated multiJobSummary");
  assert(multiJobSummary.totalJobsAnalyzed === jobsInput.length, `Analyzed all ${jobsInput.length} jobs (got ${multiJobSummary.totalJobsAnalyzed})`);
  assert(multiJobSummary.averageScore > 0, `Computed valid average score: ${multiJobSummary.averageScore}/100`);
  assert(multiJobSummary.highestScore >= multiJobSummary.lowestScore, `Highest score (${multiJobSummary.highestScore}) >= lowest score (${multiJobSummary.lowestScore})`);
  assert(multiJobSummary.jobBreakdowns.length === jobsInput.length, `Contains ${jobsInput.length} individual job breakdowns`);
  console.log(`  ⚡ Executed ${jobsInput.length} concurrent full ATS analyses in ${duration}ms`);

  // 3. Market Consensus Skills
  console.log("\n3. Market Skill Consensus & Frequencies");
  assert(multiJobSummary.consensusSkills.length > 0, `Extracted consensus skills (found ${multiJobSummary.consensusSkills.length})`);

  const coreSkills = multiJobSummary.consensusSkills.filter((s) => s.isCore);
  assert(coreSkills.length > 0, `Identified core market skills (found ${coreSkills.length})`);
  assert(multiJobSummary.matchedCoreSkillsCount > 0, `Candidate matched core skills (matched ${multiJobSummary.matchedCoreSkillsCount})`);

  // Check that Node.js or TypeScript is matched
  const nodeSkill = multiJobSummary.consensusSkills.find((s) => s.skill.toLowerCase().includes("node"));
  assert(Boolean(nodeSkill), "Found Node.js in market consensus skills");
  if (nodeSkill) {
    assert(nodeSkill.matchedInResume === true, "Resume correctly matched Node.js");
  }

  // 4. Per-Job breakdowns
  console.log("\n4. Per-Job Breakdown Cards");
  for (const b of multiJobSummary.jobBreakdowns) {
    assert(typeof b.overallScore === "number" && b.overallScore >= 0 && b.overallScore <= 100, `Job '${b.jobTitle}' has valid score: ${b.overallScore}`);
    assert(Array.isArray(b.matchedSkills), `Job '${b.jobTitle}' has matched skills list`);
  }

  console.log("\n=======================================================");
  console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});


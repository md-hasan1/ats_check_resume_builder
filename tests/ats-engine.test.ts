/**
 * Automated test suite for the Production-Ready ATS Resume Checker Engine.
 * Execute with: npx tsx tests/ats-engine.test.ts
 */

import { areAliases, getCanonicalSkill } from "../src/lib/ats/aliases";
import { normalizeText, simplifyTechTerm, isStopword } from "../src/lib/ats/normalizer";
import { matchKeywordAgainstText, matchKeywords } from "../src/lib/ats/keyword-matcher";
import { matchSkills } from "../src/lib/ats/skill-matcher";
import { calculateTFIDFSimilarity } from "../src/lib/ats/tfidf-similarity";
import { checkResumeFormatting } from "../src/lib/ats/formatting-checker";
import { calculateATSScore } from "../src/lib/ats/scoring-engine";
import { runATSAnalysis } from "../src/lib/ats/engine";
import type { ParsedResumeData } from "../src/lib/ats/types";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, errorMsg?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${testName} - ${errorMsg || "Assertion failed"}`);
    failedCount++;
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("  ATS RESUME CHECKER ENGINE - TEST SUITE");
  console.log("=======================================================\n");

  // 1. Text Normalization & Alias Dictionary Tests
  console.log("1. Text Normalization & Alias Dictionary");
  assert(simplifyTechTerm("Node.js") === "nodejs", "simplifyTechTerm('Node.js') -> 'nodejs'");
  assert(simplifyTechTerm("Node JS") === "nodejs", "simplifyTechTerm('Node JS') -> 'nodejs'");
  assert(simplifyTechTerm("NodeJS") === "nodejs", "simplifyTechTerm('NodeJS') -> 'nodejs'");
  assert(areAliases("Node.js", "NodeJS"), "areAliases('Node.js', 'NodeJS') === true");
  assert(areAliases("Postgres", "PostgreSQL"), "areAliases('Postgres', 'PostgreSQL') === true");
  assert(areAliases("JS", "JavaScript"), "areAliases('JS', 'JavaScript') === true");
  assert(areAliases("K8s", "Kubernetes"), "areAliases('K8s', 'Kubernetes') === true");
  assert(!areAliases("Node.js", "PostgreSQL"), "areAliases('Node.js', 'PostgreSQL') === false");
  assert(getCanonicalSkill("react.js") === "React", "getCanonicalSkill('react.js') -> 'React'");
  assert(isStopword("responsible"), "isStopword('responsible') === true");
  assert(!isStopword("TypeScript"), "isStopword('TypeScript') === false");

  // 2. Keyword Matching Tests
  console.log("\n2. Multi-tier Keyword Matching");
  const testResume = `
    Senior Full Stack Engineer
    Built high-performance microservices using NodeJS, Express, and Postgres.
    Extensive experience with TypeScript, React, and Docker.
    Maintained cloud infrastructure on AWS.
  `;

  const matchExact = matchKeywordAgainstText("TypeScript", testResume);
  assert(matchExact.matched && (matchExact.matchType === "exact" || matchExact.matchType === "normalized"), "Matches TypeScript directly");

  const matchNormalized = matchKeywordAgainstText("Node.js", testResume);
  assert(matchNormalized.matched, "Matches 'Node.js' against 'NodeJS' (normalized/alias)");

  const matchAlias = matchKeywordAgainstText("PostgreSQL", testResume);
  assert(matchAlias.matched && (matchAlias.matchType === "alias" || matchAlias.matchType === "normalized"), "Matches 'PostgreSQL' against 'Postgres' as alias");

  const matchMissing = matchKeywordAgainstText("Ruby", testResume);
  assert(!matchMissing.matched && matchMissing.matchType === "missing", "Identifies missing 'Ruby' correctly");

  // Batch keyword matching
  const batchMatch = matchKeywords(["TypeScript", "Node.js", "PostgreSQL", "Kubernetes", "Ruby"], testResume);
  assert(batchMatch.matchedKeywords.length === 3, "Batch matching accurately matched 3 skills");
  assert(batchMatch.missingKeywords.length === 2, "Batch matching accurately flagged 2 missing skills");

  // 3. Skill Matching Tests (Required vs Preferred)
  console.log("\n3. Skill Matching (Required vs Preferred Weighting)");
  const skillsEval = matchSkills(
    ["TypeScript", "Node.js", "PostgreSQL"], // all 3 present
    ["Kubernetes", "Docker"],                // Docker present, Kubernetes missing
    testResume
  );
  assert(skillsEval.requiredScore === 100, `Required skills match is 100% (got ${skillsEval.requiredScore}%)`);
  assert(skillsEval.preferredScore === 50, `Preferred skills match is 50% (got ${skillsEval.preferredScore}%)`);
  // Required 75%, Preferred 25%: 100 * 0.75 + 50 * 0.25 = 75 + 12.5 = 87.5 -> 88
  assert(skillsEval.overallScore >= 85 && skillsEval.overallScore <= 90, `Overall skill score weighted correctly (got ${skillsEval.overallScore}%)`);

  // 4. TF-IDF Cosine Similarity Tests
  console.log("\n4. TF-IDF & Cosine Similarity");
  const sampleJob = "Looking for a Senior Full Stack Engineer with strong experience in NodeJS, TypeScript, React, Docker, and AWS cloud microservices.";
  const tfidfScore = calculateTFIDFSimilarity(testResume, sampleJob);
  assert(tfidfScore >= 50 && tfidfScore <= 100, `TF-IDF score for aligned texts is high (got ${tfidfScore}%)`);

  const unrelatedJob = "Hiring a Registered Nurse for emergency trauma care, patient triage, ICU monitoring, and medical dosage administration.";
  const unrelatedTfidf = calculateTFIDFSimilarity(testResume, unrelatedJob);
  assert(unrelatedTfidf < 25, `TF-IDF score for unrelated domain is low (got ${unrelatedTfidf}%)`);

  // 5. ATS Formatting Checker Tests
  console.log("\n5. ATS Formatting Checker");
  const cleanResumeData: ParsedResumeData = {
    contact: { email: "alex@example.com", phone: "555-123-4567" },
    summary: "Experienced developer.",
    skills: ["TypeScript", "Node.js"],
    experience: [{ description: "Dev work", technologies: ["Node.js"], responsibilities: ["Building APIs"], achievements: [] }],
    education: [{ degree: "B.S. in Computer Science" }],
    projects: [],
    certifications: [],
    sections: [
      { name: "experience", present: true, rawLength: 400 },
      { name: "skills", present: true, rawLength: 200 },
      { name: "education", present: true, rawLength: 150 },
    ],
  };

  const formattingClean = checkResumeFormatting(
    "A full clean resume text with more than two hundred words describing engineering achievements, technical leadership, project deliveries, database tuning, microservices architecture, and scalable systems... ".repeat(15),
    cleanResumeData
  );
  assert(formattingClean.score >= 80, `Clean resume gets high formatting score (got ${formattingClean.score})`);

  // Test with table formatting issue
  const tableResumeText = "Column 1 | Column 2 | Column 3\n---|---|---\nData A | Data B | Data C\nData D | Data E | Data F";
  const formattingWithTable = checkResumeFormatting(tableResumeText, {
    ...cleanResumeData,
    contact: { email: undefined, phone: undefined },
  });
  assert(formattingWithTable.issues.some((i) => i.type === "table"), "Flags table structure as potential ATS hazard");
  assert(formattingWithTable.issues.some((i) => i.type === "contact"), "Flags missing contact information");

  // 6. Weighted Scoring Engine Tests
  console.log("\n6. Weighted Scoring Engine (30% KW / 25% SEM / 20% SK / 15% EXP / 10% FMT)");
  // If scores are: KW: 90, SEM: 80, SK: 85, EXP: 70, FMT: 90
  // Formula: 90*0.30 + 80*0.25 + 85*0.20 + 70*0.15 + 90*0.10
  //        = 27 + 20 + 17 + 10.5 + 9 = 83.5 -> 84
  const calculated = calculateATSScore(90, 80, 85, 70, 90);
  assert(calculated.overallScore === 84, `Weighted score formula computes accurately (expected 84, got ${calculated.overallScore})`);
  assert(calculated.breakdown.keywordMatch === 90, "Breakdown includes keywordMatch: 90");
  assert(calculated.breakdown.semanticSimilarity === 80, "Breakdown includes semanticSimilarity: 80");
  assert(calculated.breakdown.skillMatch === 85, "Breakdown includes skillMatch: 85");
  assert(calculated.breakdown.experienceMatch === 70, "Breakdown includes experienceMatch: 70");
  assert(calculated.breakdown.formatting === 90, "Breakdown includes formatting: 90");

  // Boundary check: 0 and 100
  const maxScore = calculateATSScore(100, 100, 100, 100, 100);
  assert(maxScore.overallScore === 100, "Max score produces 100");
  const minScore = calculateATSScore(0, 0, 0, 0, 0);
  assert(minScore.overallScore === 0, "Min score produces 0");

  // 7. End-to-End ATS Engine Pipeline Execution
  console.log("\n7. End-to-End ATS Engine Execution");
  const fullResumeSample = `
    Alex Mercer
    alex.mercer@email.com | (555) 234-5678 | San Francisco, CA
    linkedin.com/in/alexmercer | github.com/alexmercer

    Professional Summary
    Senior Software Engineer with 6+ years of experience designing scalable distributed systems and web platforms.

    Technical Skills
    Languages & Frameworks: TypeScript, JavaScript, Node.js, Express.js, React, Next.js, Python
    Databases & Cloud: PostgreSQL, Redis, MongoDB, AWS, Docker, Kubernetes, CI/CD

    Work Experience
    Lead Backend Engineer - TechFlow Inc. (Jan 2021 - Present)
    • Architected microservices with Node.js, Express, and PostgreSQL handling 50M requests daily.
    • Decreased API latency by 40% through Redis distributed caching and database query optimization.
    • Spearheaded automated CI/CD pipelines with GitHub Actions and Docker.

    Software Engineer - NextGen Apps (Jan 2018 - Dec 2020)
    • Developed full-stack web applications and interactive features using React, TypeScript, and Node.js.
    • Integrated RESTful APIs and payment gateways, collaborating with cross-functional product teams.

    Projects
    • OpenSource Cloud Tool: Created automated deployment utilities using Docker, AWS, and TypeScript.
    • API Gateway Platform: Implemented rate limiting and authentication microservices with PostgreSQL and Redis.

    Education
    Bachelor of Science in Computer Science - University of California (2014 - 2018)
  `;

  const jobDescSample = `
    Senior Full Stack Engineer
    Requirements:
    • 5+ years of experience building web applications
    • Strong proficiency in Node.js, TypeScript, and PostgreSQL
    • Experience with AWS, Docker, and Redis
    • Nice to have: Kubernetes, GraphQL
    • Bachelor's degree in Computer Science or related field
  `;

  const report = await runATSAnalysis(fullResumeSample, jobDescSample, {
    jobTitle: "Senior Full Stack Engineer",
  });

  assert(Boolean(report.analysisId), "Report has a valid analysisId");
  assert(report.overallScore >= 70 && report.overallScore <= 100, `High alignment report score is strong (got ${report.overallScore}/100)`);
  assert(report.matchedKeywords.some((k) => k.keyword.toLowerCase().includes("node")), "Report matched Node keyword");
  assert(report.matchedKeywords.some((k) => k.keyword.toLowerCase().includes("typescript")), "Report matched TypeScript keyword");
  assert(report.skills.requiredScore >= 90, "Required skills score >= 90%");
  assert(report.recommendations.length > 0, "Generated actionable recommendations");
  assert(Boolean(report.resume.contact.email), "Extracted contact email");
  assert(report.resume.experience.length >= 2, "Extracted 2 work experience entries");

  console.log("\n=======================================================");
  console.log(`  RESULTS: ${passedCount} passed, ${failedCount} failed`);
  console.log("=======================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

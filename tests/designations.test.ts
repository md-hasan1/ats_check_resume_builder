import {
  JOB_TEMPLATES,
  JOB_DEPARTMENTS,
  searchJobTemplates,
  getJobTemplateById,
  getJobTemplateByTitle,
} from "../src/data/job-templates";

console.log("\n=======================================================");
console.log("  300+ JOB DESIGNATIONS LIBRARY - TEST SUITE");
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

// 1. Dataset size and completeness
console.log("1. Dataset Completeness & Integrity");
assert(JOB_TEMPLATES.length >= 300, `Has 300+ job templates (found ${JOB_TEMPLATES.length})`);
assert(JOB_DEPARTMENTS.length >= 8, `Has 8+ distinct departments (found ${JOB_DEPARTMENTS.length})`);

const invalidTemplates = JOB_TEMPLATES.filter(
  (t) =>
    !t.id ||
    !t.title ||
    !t.department ||
    !t.experienceLevel ||
    !Array.isArray(t.requiredSkills) ||
    t.requiredSkills.length === 0 ||
    !t.description ||
    t.description.length < 100
);
assert(invalidTemplates.length === 0, `All ${JOB_TEMPLATES.length} templates have valid schemas and non-empty descriptions`);

// Check unique IDs
const ids = new Set(JOB_TEMPLATES.map((t) => t.id));
assert(ids.size === JOB_TEMPLATES.length, `All ${JOB_TEMPLATES.length} template IDs are globally unique`);

// 2. Search by designation title
console.log("\n2. Designation Search Capabilities");
const reactMatches = searchJobTemplates("React", "All", 10);
assert(reactMatches.length > 0, `Search for 'React' returns matching roles (got ${reactMatches.length})`);
assert(
  reactMatches.some((m) => m.title.toLowerCase().includes("react") || m.requiredSkills.includes("React")),
  "React search result matches title or skill"
);

const devOpsMatches = searchJobTemplates("DevOps", "All", 10);
assert(devOpsMatches.length > 0, `Search for 'DevOps' returns matching roles (got ${devOpsMatches.length})`);

const aiMatches = searchJobTemplates("AI", "All", 10);
assert(aiMatches.length > 0, `Search for 'AI' returns matching roles (got ${aiMatches.length})`);

// 3. Department filtering
console.log("\n3. Department Filtering");
const frontendDeptRoles = searchJobTemplates("", "Engineering", 50);
assert(
  frontendDeptRoles.every((r) => r.department === "Engineering"),
  "All filtered Engineering roles belong to Engineering department"
);

const dataRoles = searchJobTemplates("", "Data & AI", 50);
assert(dataRoles.length > 0, `Found Data & AI roles (got ${dataRoles.length})`);

// 4. Lookup by ID and Title
console.log("\n4. Direct Lookup Functions");
const first = JOB_TEMPLATES[0];
const byId = getJobTemplateById(first.id);
assert(byId?.id === first.id, `getJobTemplateById found template '${first.id}'`);

const byTitle = getJobTemplateByTitle(first.title);
assert(byTitle?.title === first.title, `getJobTemplateByTitle found template '${first.title}'`);

console.log("\n=======================================================");
console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
console.log("=======================================================\n");

if (failed > 0) {
  process.exit(1);
}

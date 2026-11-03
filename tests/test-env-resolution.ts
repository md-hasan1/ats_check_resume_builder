import "dotenv/config";
import { isDevMode, isProdMode, getBaseUrl, getBetterAuthUrl, env } from "../src/lib/env";

// Helper to safely set NODE_ENV in test environments without TypeScript readonly errors
function setNodeEnv(value: string) {
  (process.env as Record<string, string | undefined>).NODE_ENV = value;
}

console.log("=================================================");
console.log("  ENV RESOLUTION TEST SUITE");
console.log("=================================================");

// 1. Test Dev Mode (current .env has NODE_ENV=dev)
console.log("Testing Development Mode (NODE_ENV = 'dev'):");
setNodeEnv("dev");
console.log("- isDevMode():", isDevMode());
console.log("- isProdMode():", isProdMode());
console.log("- getBaseUrl():", getBaseUrl());
console.log("- getBetterAuthUrl():", getBetterAuthUrl());
console.log("- env.appUrl:", env.appUrl);
console.log("- env.betterAuthUrl:", env.betterAuthUrl);

if (getBaseUrl() === "http://localhost:3000" && env.betterAuthUrl === "http://localhost:3000") {
  console.log("  ✓ PASS: In dev mode, resolves to local variable (http://localhost:3000)\n");
} else {
  console.error("  ✗ FAIL: Did not resolve to local variable in dev mode!\n");
  process.exit(1);
}

// 2. Test Production Mode (simulate NODE_ENV='production' or 'prod')
console.log("Testing Production Mode (NODE_ENV = 'production'):");
setNodeEnv("production");
console.log("- isDevMode():", isDevMode());
console.log("- isProdMode():", isProdMode());
console.log("- getBaseUrl():", getBaseUrl());
console.log("- getBetterAuthUrl():", getBetterAuthUrl());
console.log("- env.appUrl:", env.appUrl);
console.log("- env.betterAuthUrl:", env.betterAuthUrl);

if (getBaseUrl().includes("vercel.app") && env.betterAuthUrl.includes("vercel.app")) {
  console.log("  ✓ PASS: In prod mode, resolves to produrl (https://ats-ten-orpin.vercel.app)\n");
} else {
  console.error("  ✗ FAIL: Did not resolve to produrl in prod mode!\n");
  process.exit(1);
}

// 3. Test Prod alias ('prod')
console.log("Testing Production Mode alias (NODE_ENV = 'prod'):");
setNodeEnv("prod");
if (getBaseUrl().includes("vercel.app") && env.betterAuthUrl.includes("vercel.app")) {
  console.log("  ✓ PASS: 'prod' alias correctly resolves to produrl\n");
} else {
  console.error("  ✗ FAIL: 'prod' alias did not resolve to produrl!\n");
  process.exit(1);
}

console.log("=================================================");
console.log("  ALL ENV RESOLUTION CHECKS PASSED!");
console.log("=================================================");

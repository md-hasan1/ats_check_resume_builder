/**
 * Dynamic Environment Variable Manager
 * Resolves values conditionally based on NODE_ENV (development vs production).
 *
 * Supports conditional key naming in .env:
 * - KEY_DEV for development mode
 * - KEY_PROD for production mode
 * - KEY as general fallback
 */

export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
export const isTest = process.env.NODE_ENV === "test";

/**
 * Gets an environment variable conditionally based on NODE_ENV.
 * Checks _DEV / _PROD suffixes first, then falls back to the exact key.
 */
export function getEnv(key: string, defaultValue = ""): string {
  const standardVal = process.env[key];
  if (standardVal && standardVal.trim() !== "") {
    return standardVal.trim();
  }

  const suffix = isDevelopment ? "_DEV" : "_PROD";
  const conditionalVal = process.env[`${key}${suffix}`];

  if (conditionalVal && conditionalVal.trim() !== "") {
    return conditionalVal.trim();
  }

  return defaultValue;
}

/**
 * Resolves base URL dynamically based on execution environment and NODE_ENV.
 */
export function getBaseUrl(): string {
  // Client-side execution
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Development environment: default to localhost:3000
  if (isDevelopment) {
    const devUrl = process.env.NEXT_PUBLIC_APP_URL_DEV || process.env.NEXT_PUBLIC_APP_URL;
    if (devUrl && !devUrl.includes("ats-ten-orpin.vercel.app")) {
      return devUrl;
    }
    return "http://localhost:3000";
  }

  // Vercel deployment preview/production URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Production fallback
  return (
    process.env.NEXT_PUBLIC_APP_URL_PROD ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.BETTER_AUTH_URL ||
    "https://ats-ten-orpin.vercel.app"
  );
}

/**
 * Central Environment Configuration object with conditional keys pre-resolved.
 */
export const env = {
  // Mode flags
  isDevelopment,
  isProduction,
  isTest,

  // App & Auth URLs
  appUrl: getBaseUrl(),
  betterAuthUrl: getEnv("BETTER_AUTH_URL", isDevelopment ? "http://localhost:3000" : "https://ats-ten-orpin.vercel.app"),
  betterAuthSecret: getEnv("BETTER_AUTH_SECRET"),

  // Database
  databaseUrl: getEnv("DATABASE_URL"),

  // OAuth Credentials
  googleClientId: getEnv("GOOGLE_CLIENT_ID"),
  googleClientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
  githubClientId: getEnv("GITHUB_CLIENT_ID"),
  githubClientSecret: getEnv("GITHUB_CLIENT_SECRET"),

  // AI Credentials
  openaiApiKey: getEnv("OPENAI_API_KEY"),
  googleGeminiApiKey: getEnv("GOOGLE_GEMINI_API_KEY"),
  aiProvider: getEnv("AI_PROVIDER", "gemini"),

  // Stripe Credentials & Price IDs
  stripeSecretKey: getEnv("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: getEnv("STRIPE_WEBHOOK_SECRET"),
  stripePublishableKey: getEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
  stripeProPriceId: getEnv("NEXT_PUBLIC_STRIPE_PRO_PRICE_ID") || getEnv("STRIPE_PRO_PRICE_ID"),
  stripeBusinessPriceId: getEnv("NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID") || getEnv("STRIPE_BUSINESS_PRICE_ID"),

  // Resend Email
  resendApiKey: getEnv("RESEND_API_KEY"),
  resendFromEmail: getEnv("RESEND_FROM_EMAIL", "noreply@yourdomain.com"),
};

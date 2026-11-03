/**
 * Dynamic Environment Variable Manager
 * Resolves values conditionally based on NODE_ENV (development vs production).
 *
 * Rules:
 * - If NODE_ENV is 'dev' or 'development': automatically prioritize local variables (_DEV or localhost)
 * - If NODE_ENV is 'prod' or 'production': automatically prioritize production variables (_PROD or production URL)
 */

export function isDevMode(): boolean {
  const env = (process.env.NODE_ENV || "development").toLowerCase().trim();
  return env === "development" || env === "dev";
}

export function isProdMode(): boolean {
  const env = (process.env.NODE_ENV || "development").toLowerCase().trim();
  return env === "production" || env === "prod";
}

export function isTestMode(): boolean {
  const env = (process.env.NODE_ENV || "development").toLowerCase().trim();
  return env === "test";
}

export const isDevelopment = isDevMode();
export const isProduction = isProdMode();
export const isTest = isTestMode();

const DEFAULT_DEV_URL = "http://localhost:3000";
const DEFAULT_PROD_URL = "https://ats-ten-orpin.vercel.app";

/**
 * Gets an environment variable conditionally based on NODE_ENV.
 * Checks _DEV or _PROD suffix first depending on NODE_ENV, then falls back to the exact key.
 */
export function getEnv(key: string, defaultValue = ""): string {
  const inDev = isDevMode();
  const suffix = inDev ? "_DEV" : "_PROD";
  const conditionalVal = process.env[`${key}${suffix}`];

  if (conditionalVal && conditionalVal.trim() !== "") {
    return conditionalVal.trim();
  }

  const standardVal = process.env[key];
  if (standardVal && standardVal.trim() !== "") {
    return standardVal.trim();
  }

  // Opposite fallback if nothing else is defined
  const oppositeSuffix = inDev ? "_PROD" : "_DEV";
  const oppositeVal = process.env[`${key}${oppositeSuffix}`];
  if (oppositeVal && oppositeVal.trim() !== "") {
    return oppositeVal.trim();
  }

  return defaultValue;
}

/**
 * Resolves base URL dynamically based on execution environment and NODE_ENV.
 * - In dev (NODE_ENV=dev/development): uses local variable / localhost:3000
 * - In prod (NODE_ENV=prod/production): uses produrl / Vercel URL
 */
export function getBaseUrl(): string {
  // Client-side execution in browser
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Development environment
  if (isDevMode()) {
    const devUrl =
      process.env.NEXT_PUBLIC_APP_URL_DEV ||
      process.env.APP_URL_DEV ||
      process.env.BETTER_AUTH_URL_DEV ||
      (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("vercel.app")
        ? process.env.NEXT_PUBLIC_APP_URL
        : undefined);

    return devUrl ? devUrl.trim() : DEFAULT_DEV_URL;
  }

  // Production environment: Check Vercel URL first
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.trim()}`;
  }

  // Production URL fallback: Check prod keys
  const prodUrl =
    process.env.NEXT_PUBLIC_APP_URL_PROD ||
    process.env.APP_URL_PROD ||
    process.env.BETTER_AUTH_URL_PROD ||
    (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
      ? process.env.NEXT_PUBLIC_APP_URL
      : undefined) ||
    (process.env.BETTER_AUTH_URL && !process.env.BETTER_AUTH_URL.includes("localhost")
      ? process.env.BETTER_AUTH_URL
      : undefined) ||
    DEFAULT_PROD_URL;

  return prodUrl.trim();
}

/**
 * Resolves Better Auth Base URL based on NODE_ENV.
 */
export function getBetterAuthUrl(): string {
  if (isDevMode()) {
    const devUrl =
      process.env.BETTER_AUTH_URL_DEV ||
      process.env.NEXT_PUBLIC_APP_URL_DEV ||
      (process.env.BETTER_AUTH_URL && !process.env.BETTER_AUTH_URL.includes("vercel.app")
        ? process.env.BETTER_AUTH_URL
        : undefined);

    return devUrl ? devUrl.trim() : DEFAULT_DEV_URL;
  }

  // Production: Check Vercel URL or prod URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.trim()}`;
  }

  const prodUrl =
    process.env.BETTER_AUTH_URL_PROD ||
    process.env.NEXT_PUBLIC_APP_URL_PROD ||
    (process.env.BETTER_AUTH_URL && !process.env.BETTER_AUTH_URL.includes("localhost")
      ? process.env.BETTER_AUTH_URL
      : undefined) ||
    DEFAULT_PROD_URL;

  return prodUrl.trim();
}

/**
 * Central Environment Configuration object with conditional keys dynamically resolved.
 */
export const env = {
  // Mode getters
  get isDevelopment() {
    return isDevMode();
  },
  get isProduction() {
    return isProdMode();
  },
  get isTest() {
    return isTestMode();
  },

  // App & Auth URLs
  get appUrl() {
    return getBaseUrl();
  },
  get betterAuthUrl() {
    return getBetterAuthUrl();
  },
  get betterAuthSecret() {
    return getEnv("BETTER_AUTH_SECRET");
  },

  // Database
  get databaseUrl() {
    return getEnv("DATABASE_URL");
  },

  // OAuth Credentials
  get googleClientId() {
    return getEnv("GOOGLE_CLIENT_ID");
  },
  get googleClientSecret() {
    return getEnv("GOOGLE_CLIENT_SECRET");
  },
  get githubClientId() {
    return getEnv("GITHUB_CLIENT_ID");
  },
  get githubClientSecret() {
    return getEnv("GITHUB_CLIENT_SECRET");
  },

  // AI Credentials
  get openaiApiKey() {
    return getEnv("OPENAI_API_KEY");
  },
  get googleGeminiApiKey() {
    return getEnv("GOOGLE_GEMINI_API_KEY");
  },
  get aiProvider() {
    return getEnv("AI_PROVIDER", "gemini");
  },

  // Stripe Credentials & Price IDs
  get stripeSecretKey() {
    return getEnv("STRIPE_SECRET_KEY");
  },
  get stripeWebhookSecret() {
    return getEnv("STRIPE_WEBHOOK_SECRET");
  },
  get stripePublishableKey() {
    return getEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  },
  get stripeProPriceId() {
    return getEnv("NEXT_PUBLIC_STRIPE_PRO_PRICE_ID") || getEnv("STRIPE_PRO_PRICE_ID");
  },
  get stripeBusinessPriceId() {
    return getEnv("NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID") || getEnv("STRIPE_BUSINESS_PRICE_ID");
  },

  // Resend Email
  get resendApiKey() {
    return getEnv("RESEND_API_KEY");
  },
  get resendFromEmail() {
    return getEnv("RESEND_FROM_EMAIL", "noreply@yourdomain.com");
  },
};

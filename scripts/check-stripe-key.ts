import "dotenv/config";
import { env, getEnv } from "../src/lib/env";

console.log("process.env.STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY?.substring(0, 15));
console.log("getEnv('STRIPE_SECRET_KEY'):", getEnv("STRIPE_SECRET_KEY")?.substring(0, 15));
console.log("env.stripeSecretKey:", env.stripeSecretKey?.substring(0, 15));
console.log("STRIPE_SECRET_KEY_PROD:", process.env.STRIPE_SECRET_KEY_PROD?.substring(0, 15));
console.log("STRIPE_SECRET_KEY_DEV:", process.env.STRIPE_SECRET_KEY_DEV?.substring(0, 15));

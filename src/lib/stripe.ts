import Stripe from "stripe";
import { env } from "@/lib/env";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || env.stripeSecretKey || "sk_test_placeholder_key_for_build";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-07-29.dahlia",
  typescript: true,
});

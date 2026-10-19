import { env } from "@/lib/env";

export interface PricingTier {
  name: string;
  slug: string;
  description: string;
  price: number;
  priceId: string | null;
  features: string[];
  limitations: string[];
  cta: string;
  popular: boolean;
  checksPerMonth: number | null; // null = unlimited
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    slug: "free",
    description: "Perfect for trying out ATS analysis",
    price: 0,
    priceId: null,
    features: [
      "3 resume checks per month",
      "Basic ATS score",
      "Keyword matching",
      "Section detection",
      "Basic formatting check",
    ],
    limitations: [
      "No PDF report export",
      "No AI suggestions",
      "No report history",
      "Standard processing",
    ],
    cta: "Get Started Free",
    popular: false,
    checksPerMonth: 3,
  },
  {
    name: "Pro",
    slug: "pro",
    description: "For serious job seekers",
    price: 9.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || process.env.STRIPE_PRO_PRICE_ID || env.stripeProPriceId || "",
    features: [
      "Unlimited resume checks",
      "Full AI-powered analysis",
      "Detailed AI suggestions",
      "Bullet point rewriting",
      "PDF & JSON report export",
      "Report history & versioning",
      "Priority processing",
      "Skills gap analysis",
      "Grammar & readability check",
      "Action verb optimization",
    ],
    limitations: [],
    cta: "Upgrade to Pro",
    popular: true,
    checksPerMonth: null,
  },
  {
    name: "Business",
    slug: "business",
    description: "For teams and recruiters",
    price: 29.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID || process.env.STRIPE_BUSINESS_PRICE_ID || env.stripeBusinessPriceId || "",
    features: [
      "Everything in Pro",
      "Team accounts (up to 10)",
      "Admin panel & analytics",
      "Bulk resume analysis",
      "API access",
      "Custom branding",
      "Priority support",
      "Advanced reporting",
      "Webhook integrations",
      "Recruiter view simulation",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
    checksPerMonth: null,
  },
];

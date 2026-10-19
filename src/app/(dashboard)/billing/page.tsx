"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Check,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
  Loader2,
  ExternalLink,
  Shield,
} from "lucide-react";
import { pricingTiers } from "@/config/pricing";
import { toast, showAlert } from "@/lib/sweetalert";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const planIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  free: Zap,
  pro: Sparkles,
  business: Crown,
};

interface UserSubscription {
  plan: string;
  status: string;
  checksCount: number;
  checksLimit: number | null;
  cancelAtPeriodEnd: boolean;
}

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [subData, setSubData] = useState<UserSubscription | null>(null);

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/user/subscription");
      const data = await res.json();
      if (data.success && data.subscription) {
        setSubData(data.subscription);
      }
    } catch (err) {
      console.error("Failed to load subscription:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("success") === "true") {
        toast.success("Payment completed successfully! Your subscription is active.");
        setTimeout(() => fetchSubscription(), 500);
      } else if (params.get("canceled") === "true") {
        toast.info("Payment checkout process was canceled.");
      }
    }
  }, []);

  const currentPlan = (subData?.plan || "free").toLowerCase();

  const handleUpgrade = async (priceId: string | null, slug: string) => {
    setLoading(slug);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, plan: slug }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to secure Stripe Checkout page (SSL encrypted payment)
        window.location.assign(data.url);
      } else {
        toast.error(data.error || "Failed to initiate Stripe payment checkout");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment checkout error");
    } finally {
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();
      if (data.url) {
        window.location.assign(data.url);
      } else {
        toast.error(data.error || "Failed to open billing portal");
      }
    } catch {
      toast.error("Failed to open billing portal");
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl flex items-center gap-3">
          <CreditCard className="h-7 w-7 text-primary-500" />
          Billing & Subscription
        </h1>
        <p className="mt-1 text-muted-foreground">Manage your subscription plan and billing details.</p>
      </motion.div>

      {/* Current Plan */}
      <motion.div variants={item} className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="text-xl font-bold capitalize mt-1">
              {fetching ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : currentPlan}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {subData
                ? subData.checksLimit === null
                  ? "Unlimited resume checks this month"
                  : `${subData.checksCount} of ${subData.checksLimit} checks used this month`
                : "3 of 3 checks used this month"}
            </p>
          </div>
          {currentPlan !== "free" && (
            <button onClick={handleManageBilling} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/50 px-4 text-sm font-medium hover:bg-muted/50 transition-colors">
              <ExternalLink className="h-4 w-4" /> Manage Billing
            </button>
          )}
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
        {pricingTiers.map((tier) => {
          const Icon = planIcons[tier.slug] || Zap;
          const isCurrent = tier.slug.toLowerCase() === currentPlan;
          return (
            <div key={tier.slug} className={`glass rounded-2xl p-6 relative transition-all ${tier.popular ? "ring-2 ring-primary-500 shadow-xl shadow-primary-500/10" : ""}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full gradient-bg px-4 py-1 text-xs font-semibold text-white shadow-lg">
                    <Sparkles className="h-3 w-3" /> Most Popular
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tier.popular ? "gradient-bg text-white" : "bg-muted/50 text-muted-foreground"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold">{tier.name}</h3>
                  <p className="text-xs text-muted-foreground">{tier.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold">${tier.price}</span>
                {tier.price > 0 && <span className="text-sm text-muted-foreground">/month</span>}
              </div>

              <ul className="space-y-2 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
                {tier.limitations.map((limit) => (
                  <li key={limit} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="h-4 w-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">✕</span>
                    <span>{limit}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(tier.priceId, tier.slug)}
                disabled={isCurrent || loading === tier.slug}
                className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all ${
                  isCurrent
                    ? "border border-border bg-muted/30 text-muted-foreground cursor-default"
                    : tier.popular
                      ? "gradient-bg text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.01]"
                      : "border border-border hover:bg-muted/50"
                } disabled:opacity-50`}
              >
                {loading === tier.slug ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isCurrent ? (
                  "Current Plan"
                ) : (
                  <>
                    {tier.cta} <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </motion.div>

      {/* Security Note */}
      <motion.div variants={item} className="flex items-center gap-3 rounded-xl border border-border/50 p-4 text-xs text-muted-foreground">
        <Shield className="h-5 w-5 text-emerald-500 flex-shrink-0" />
        <p>All payments are securely processed by Stripe. Your card details are never stored on our servers. You can cancel anytime.</p>
      </motion.div>
    </motion.div>
  );
}

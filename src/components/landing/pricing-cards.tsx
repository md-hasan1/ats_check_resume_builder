"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";
import { pricingTiers } from "@/config/pricing";

export function PricingCards() {
  return (
    <section id="pricing" className="py-20 sm:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Simple,{" "}
            <span className="gradient-text">transparent pricing</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Start free. Upgrade when you need unlimited checks and AI-powered
            suggestions.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border p-7 transition-all ${
                tier.popular
                  ? "border-primary-500/50 bg-card shadow-2xl shadow-primary-500/10 scale-[1.02] lg:scale-105"
                  : "border-border/50 bg-card/50 backdrop-blur-sm hover:border-border"
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 rounded-full gradient-bg px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-primary-500/25">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-1 text-sm font-semibold text-primary-400 uppercase tracking-wider">
                {tier.name}
              </div>
              <p className="mb-5 text-sm text-muted-foreground">
                {tier.description}
              </p>

              {/* Price */}
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-heading">
                  {tier.price === 0 ? "Free" : `$${tier.price}`}
                </span>
                {tier.price > 0 && (
                  <span className="text-sm text-muted-foreground">/month</span>
                )}
              </div>

              {/* CTA */}
              <Link
                href={tier.price === 0 ? "/register" : "/register"}
                className={`mb-7 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                  tier.popular
                    ? "gradient-bg text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02]"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {tier.cta}
              </Link>

              {/* Features */}
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                    <span>{feature}</span>
                  </li>
                ))}
                {tier.limitations.map((limitation) => (
                  <li
                    key={limitation}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground/50" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

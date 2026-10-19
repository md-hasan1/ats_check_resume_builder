"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileCheck, ArrowRight, ShieldCheck } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-8 sm:p-12 border border-primary-500/20 text-center relative overflow-hidden shadow-2xl shadow-primary-500/5"
        >
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary-500/20 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3.5 py-1 text-xs font-semibold text-primary-400">
              <ShieldCheck className="h-4 w-4" />
              Boost Your Interview Callback Rate
            </div>

            <h2 className="font-heading text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight">
              Ready to Check Your Resume Against <span className="gradient-text">ATS?</span>
            </h2>

            <p className="text-base text-muted-foreground sm:text-lg leading-relaxed">
              Don&apos;t let an algorithm reject your application. Scan your resume now, see your score, and fix missing keywords in minutes.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/ats-checker"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl gradient-bg px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <FileCheck className="h-5 w-5" />
                Check My Resume Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-card/60 px-8 py-3.5 text-base font-semibold hover:bg-muted/50 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

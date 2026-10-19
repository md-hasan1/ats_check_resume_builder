"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  FileCheck,
  CheckCircle,
  LogIn,
  Target,
  ShieldCheck,
  FileText,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-primary-500/15 blur-[130px]" />
        <div className="absolute bottom-0 right-10 w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary-400">
              <ShieldCheck className="h-4 w-4" />
              Dedicated ATS Resume Optimization
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl"
          >
            Check Your Resume Against ATS{" "}
            <span className="gradient-text">Before You Apply</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl leading-relaxed"
          >
            Scan your resume against any job description to discover missing keywords,
            formatting red flags, and your instant ATS compatibility score.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:gap-4 w-full sm:w-auto justify-center"
          >
            <Link
              href="/ats-checker"
              className="inline-flex items-center justify-center gap-2 rounded-xl gradient-bg px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary-500/25 transition-all hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileCheck className="h-5 w-5" />
              Check My Resume
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-card/60 px-8 py-3.5 text-base font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-muted/50 hover:border-border hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="h-5 w-5 text-muted-foreground" />
              Login
            </Link>
          </motion.div>

          {/* Visual ATS Score Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 w-full max-w-3xl glass rounded-2xl p-6 border border-border/60 shadow-2xl text-left"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  <div className="h-20 w-20 rounded-full border-4 border-emerald-500/30 flex items-center justify-center bg-emerald-500/10">
                    <span className="text-2xl font-black text-emerald-500">88</span>
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase">
                    Strong ATS Match
                  </div>
                  <h3 className="font-heading text-base font-bold mt-1">Full-Stack Engineer Resume</h3>
                  <p className="text-xs text-muted-foreground">18 of 22 key job qualifications matched</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:justify-end">
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-medium">
                  <CheckCircle className="h-3 w-3" /> React (4x)
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-medium">
                  <CheckCircle className="h-3 w-3" /> TypeScript (3x)
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-500 font-medium">
                  + PostgreSQL Missing
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

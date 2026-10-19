"use client";

import { motion } from "framer-motion";
import { Upload, FileText, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Resume",
    description:
      "Upload your existing resume in PDF, DOCX, or DOC format. Our parser extracts all text and structure seamlessly.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    step: "02",
    icon: FileText,
    title: "Analyze Resume",
    description:
      "Paste your target job description. The engine cross-references keywords, qualifications, formatting, and sections.",
    color: "from-primary-500 to-violet-500",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Get ATS Score & Recommendations",
    description:
      "Receive your overall ATS score (0-100), matched/missing keywords, and actionable suggestions to pass applicant filters.",
    color: "from-emerald-500 to-green-500",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28 bg-muted/30"
    >
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
            How it{" "}
            <span className="gradient-text">works</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Three simple steps to optimize your resume for any job application.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-16 hidden h-0.5 w-8 translate-x-full bg-gradient-to-r from-border to-transparent lg:block" />
              )}

              <div className="group flex flex-col items-center text-center rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-border hover:shadow-xl hover:shadow-primary-500/5">
                {/* Step Number */}
                <div className="mb-4 text-xs font-bold tracking-widest text-primary-400 uppercase">
                  Step {item.step}
                </div>
                {/* Icon */}
                <div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg transition-transform group-hover:scale-110`}
                >
                  <item.icon className="h-7 w-7" />
                </div>
                {/* Content */}
                <h3 className="mb-3 text-xl font-semibold font-heading">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

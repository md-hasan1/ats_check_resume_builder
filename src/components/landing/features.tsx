"use client";

import { motion } from "framer-motion";
import {
  Target,
  FileCheck,
  Layout,
  AlertTriangle,
  Briefcase,
  Sparkles,
  FileSearch,
} from "lucide-react";

const atsFeatures = [
  {
    icon: Target,
    title: "ATS Compatibility Score",
    description:
      "Get a clear 0-100 score indicating how well your resume matches automated recruitment screening algorithms.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: FileSearch,
    title: "Keyword Matching",
    description:
      "See every matched keyword found in both your resume and the job listing, along with frequency counts.",
    color: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: AlertTriangle,
    title: "Missing Keywords",
    description:
      "Pinpoint crucial industry terms and skills present in the job description that your resume is currently missing.",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-500/10",
  },
  {
    icon: Layout,
    title: "Resume Formatting Analysis",
    description:
      "Identify tables, multi-columns, unreadable fonts, and problematic elements that cause ATS parsing errors.",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Briefcase,
    title: "Job Description Matching",
    description:
      "Compare your experience, skills, and qualifications against the exact requirements of the specific role.",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
  },
  {
    icon: Sparkles,
    title: "Improvement Suggestions",
    description:
      "Receive actionable bullet-point rewrites, metric additions, and phrasing improvements to boost your score.",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: FileCheck,
    title: "Resume Parsing",
    description:
      "Extract structured data from PDF, DOCX, and DOC files exactly the way real enterprise applicant tracking systems do.",
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-500/10",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
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
            Everything You Need to <span className="gradient-text">Pass ATS Screening</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Purpose-built ATS checking tools designed exclusively to get your resume past automated filters into recruiters&apos; hands.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {atsFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group relative rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm transition-all hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-md transition-transform group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold font-heading">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

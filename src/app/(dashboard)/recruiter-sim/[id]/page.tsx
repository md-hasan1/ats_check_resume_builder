"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
} from "lucide-react";
import Link from "next/link";

export default function RecruiterSimPage() {
  const [scanned, setScanned] = useState(true);

  const mockSim = {
    impressionScore: 84,
    hiringConfidence: 79,
    interviewChance: 88,
    strengths: [
      "Immediate tech stack alignment (React 19, TypeScript, Next.js)",
      "Strong lead line emphasizing 42% page load optimization metric",
      "Clean standard 1-page layout readable within seconds",
    ],
    weaknesses: [
      "Does not explicitly detail CI/CD pipeline automated deployment experience",
      "Contact header lacks explicit geographic location city/state",
    ],
    missingInfo: ["No active link to live portfolio or deployed demo applications"],
    overallImpression:
      "This candidate immediately catches the eye of a tech recruiter scanning hundreds of resumes. Their lead achievements align closely with senior frontend criteria. Highly recommended for a screen call.",
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Hero Score Header */}
      <div className="glass rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-500">
              <Eye className="h-3.5 w-3.5" /> 10-Second Scan Simulation
            </span>
            <h1 className="font-heading text-2xl font-bold sm:text-3xl mt-2">
              Recruiter Impression Analysis
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Simulates how a senior technical recruiter evaluates your resume in their first 10 seconds.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center p-3 rounded-xl bg-muted/30">
              <p className="text-2xl font-bold text-emerald-500">{mockSim.interviewChance}%</p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Interview Chance</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/30">
              <p className="text-2xl font-bold text-primary-500">{mockSim.hiringConfidence}%</p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Hiring Confidence</p>
            </div>
          </div>
        </div>

        {/* Impression Quote */}
        <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-4 space-y-1">
          <p className="text-xs font-semibold text-primary-500 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Recruiter Verdict
          </p>
          <p className="text-xs text-foreground italic leading-relaxed">
            &quot;{mockSim.overallImpression}&quot;
          </p>
        </div>
      </div>

      {/* Detailed Feedback Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Strengths */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-heading text-sm font-semibold flex items-center gap-2 text-emerald-500">
            <CheckCircle className="h-4 w-4" /> Recruiter Hook Strengths ({mockSim.strengths.length})
          </h2>
          <ul className="space-y-2">
            {mockSim.strengths.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Red Flags / Weaknesses */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-heading text-sm font-semibold flex items-center gap-2 text-amber-500">
            <AlertTriangle className="h-4 w-4" /> Hesitation Flags ({mockSim.weaknesses.length})
          </h2>
          <ul className="space-y-2">
            {mockSim.weaknesses.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="flex justify-end">
        <Link
          href="/builder/1"
          className="inline-flex h-11 items-center gap-2 rounded-xl gradient-bg px-5 text-xs font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:scale-[1.01]"
        >
          Fix These Flags in Tailor Studio <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Target, Sparkles, AlertCircle, FileCheck, Layers } from "lucide-react";

interface LiveATSScoreProps {
  overallScore: number;
  keywordMatchPct: number;
  skillsMatchPct: number;
  formattingScore: number;
  readabilityScore: number;
  experienceMatchPct: number;
  impactScore: number;
}

export function LiveATSScore({
  overallScore,
  keywordMatchPct,
  skillsMatchPct,
  formattingScore,
  readabilityScore,
  experienceMatchPct,
  impactScore,
}: LiveATSScoreProps) {
  const getScoreColor = (s: number) =>
    s >= 85 ? "text-emerald-500" : s >= 70 ? "text-amber-500" : "text-rose-500";

  const getScoreBadge = (s: number) =>
    s >= 85
      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      : s >= 70
        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
        : "bg-rose-500/10 text-rose-500 border-rose-500/20";

  return (
    <div className="glass rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm border border-border/50">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-bg text-white shadow-lg shadow-primary-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-base font-bold sm:text-lg">Live ATS Score</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-500/10 px-2 py-0.5 text-[10px] font-semibold text-primary-500 animate-pulse">
                <Sparkles className="h-3 w-3" /> Real-time
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Dynamic recalculation while editing</p>
          </div>
        </div>

        {/* Big Overall Score Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-muted-foreground block">Overall Readiness</span>
            <span className={`text-2xl sm:text-3xl font-extrabold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </span>
          </div>
          <span className={`rounded-xl border px-3 py-1 text-xs font-semibold ${getScoreBadge(overallScore)}`}>
            {overallScore >= 85 ? "ATS Ready" : overallScore >= 70 ? "Good" : "Needs Optimization"}
          </span>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 pt-1">
        <div className="rounded-xl bg-muted/20 p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Target className="h-3 w-3 text-primary-500" /> Keywords</span>
            <span className="font-bold text-foreground">{keywordMatchPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${keywordMatchPct}%` }} className="h-full bg-primary-500" />
          </div>
        </div>

        <div className="rounded-xl bg-muted/20 p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-emerald-500" /> Skills</span>
            <span className="font-bold text-foreground">{skillsMatchPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${skillsMatchPct}%` }} className="h-full bg-emerald-500" />
          </div>
        </div>

        <div className="rounded-xl bg-muted/20 p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><FileCheck className="h-3 w-3 text-amber-500" /> Formatting</span>
            <span className="font-bold text-foreground">{formattingScore}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${formattingScore}%` }} className="h-full bg-amber-500" />
          </div>
        </div>

        <div className="rounded-xl bg-muted/20 p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Layers className="h-3 w-3 text-violet-500" /> Readability</span>
            <span className="font-bold text-foreground">{readabilityScore}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${readabilityScore}%` }} className="h-full bg-violet-500" />
          </div>
        </div>

        <div className="rounded-xl bg-muted/20 p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-blue-500" /> Experience</span>
            <span className="font-bold text-foreground">{experienceMatchPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${experienceMatchPct}%` }} className="h-full bg-blue-500" />
          </div>
        </div>

        <div className="rounded-xl bg-muted/20 p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3 text-rose-500" /> Impact</span>
            <span className="font-bold text-foreground">{impactScore}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${impactScore}%` }} className="h-full bg-rose-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

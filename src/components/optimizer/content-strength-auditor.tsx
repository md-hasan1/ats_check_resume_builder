"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  CheckCircle,
  AlertTriangle,
  Flame,
  FileText,
  Volume2,
  TrendingUp,
  Sparkles,
} from "lucide-react";

interface ContentStrengthAuditorProps {
  summaryText: string;
  bullets: string[];
  skillsList: string[];
}

export function ContentStrengthAuditor({
  summaryText,
  bullets,
  skillsList,
}: ContentStrengthAuditorProps) {
  const auditResults = useMemo(() => {
    const allText = [summaryText, ...bullets].join(" ");
    const words = allText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // 1. Passive Voice Detection
    const passivePatterns = [
      /\b(was|were|been|being|is|are|am)\s+(\w+ed|\w+en)\b/gi,
      /\b(was|were)\s+(responsible for|involved in|assigned to|used for|created by)\b/gi,
    ];
    const passiveMatches: string[] = [];
    allText.split(/[.!?]+/).forEach((sentence) => {
      passivePatterns.forEach((pattern) => {
        const matches = sentence.match(pattern);
        if (matches) {
          matches.forEach((m) => {
            if (!passiveMatches.includes(m.trim())) {
              passiveMatches.push(m.trim());
            }
          });
        }
      });
    });

    // 2. Action Verb Power Index
    const strongActionVerbs = [
      "spearheaded", "architected", "engineered", "developed", "orchestrated",
      "pioneered", "implemented", "optimized", "built", "designed", "launched",
      "accelerated", "transformed", "restructured", "championed", "negotiated",
      "curated", "drove", "executed", "generated", "maximized", "reduced",
    ];

    let strongVerbCount = 0;
    bullets.forEach((b) => {
      const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase() || "";
      if (strongActionVerbs.includes(firstWord)) {
        strongVerbCount++;
      }
    });

    const actionVerbRatio = bullets.length > 0 ? Math.round((strongVerbCount / bullets.length) * 100) : 75;

    // 3. Wordiness & Redundancy Warnings
    const wordySentences = allText
      .split(/[.!?]+/)
      .filter((s) => s.trim().split(/\s+/).length > 28);

    // 4. Overall Content Strength Score Calculation
    let strengthScore = 85;
    if (passiveMatches.length > 0) strengthScore -= passiveMatches.length * 4;
    if (wordySentences.length > 0) strengthScore -= wordySentences.length * 3;
    if (actionVerbRatio < 70) strengthScore -= 10;
    strengthScore = Math.max(40, Math.min(100, strengthScore));

    return {
      wordCount,
      passiveMatches,
      actionVerbRatio,
      wordySentences,
      strengthScore,
    };
  }, [summaryText, bullets, skillsList]);

  return (
    <div className="glass rounded-2xl p-5 space-y-4 border border-border/50 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg text-white shadow-md">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold flex items-center gap-2">
              Content Strength & Style Auditor
            </h3>
            <p className="text-xs text-muted-foreground">
              Real-time writing impact, passive voice & verb power analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Strength Score:</span>
          <span className={`text-lg font-extrabold ${auditResults.strengthScore >= 80 ? "text-emerald-500" : auditResults.strengthScore >= 65 ? "text-amber-500" : "text-rose-500"}`}>
            {auditResults.strengthScore}%
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <div className="rounded-xl bg-muted/20 p-2.5 space-y-1 border border-border/30">
          <span className="text-[10px] uppercase font-semibold text-muted-foreground block flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-primary-500" /> Action Verb Power
          </span>
          <span className="text-base font-bold text-foreground">{auditResults.actionVerbRatio}%</span>
        </div>

        <div className="rounded-xl bg-muted/20 p-2.5 space-y-1 border border-border/30">
          <span className="text-[10px] uppercase font-semibold text-muted-foreground block flex items-center gap-1">
            <Volume2 className="h-3 w-3 text-amber-500" /> Passive Phrasing
          </span>
          <span className={`text-base font-bold ${auditResults.passiveMatches.length === 0 ? "text-emerald-500" : "text-amber-500"}`}>
            {auditResults.passiveMatches.length} flagged
          </span>
        </div>

        <div className="rounded-xl bg-muted/20 p-2.5 space-y-1 border border-border/30">
          <span className="text-[10px] uppercase font-semibold text-muted-foreground block flex items-center gap-1">
            <FileText className="h-3 w-3 text-blue-500" /> Wordiness
          </span>
          <span className={`text-base font-bold ${auditResults.wordySentences.length === 0 ? "text-emerald-500" : "text-amber-500"}`}>
            {auditResults.wordySentences.length} long
          </span>
        </div>

        <div className="rounded-xl bg-muted/20 p-2.5 space-y-1 border border-border/30">
          <span className="text-[10px] uppercase font-semibold text-muted-foreground block flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-violet-500" /> Total Words
          </span>
          <span className="text-base font-bold text-foreground">{auditResults.wordCount} words</span>
        </div>
      </div>

      {/* Flagged Passive Phrasing List */}
      {auditResults.passiveMatches.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
            <AlertTriangle className="h-3.5 w-3.5" /> Passive Voice Detected
          </div>
          <div className="flex flex-wrap gap-1.5">
            {auditResults.passiveMatches.map((m, i) => (
              <span key={i} className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-500 line-through">
                &quot;{m}&quot;
              </span>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Replace passive voice with active verbs (e.g. &quot;Engineered&quot;, &quot;Spearheaded&quot;) for maximum recruiter impact.
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, TrendingUp, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import type { TailoredResumeData } from "@/lib/ai/schemas/tailored-resume";

interface ResumeComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalData: Partial<TailoredResumeData>;
  optimizedData: TailoredResumeData;
  originalScore: number;
  optimizedScore: number;
}

export function ResumeComparisonModal({
  isOpen,
  onClose,
  originalData,
  optimizedData,
  originalScore,
  optimizedScore,
}: ResumeComparisonModalProps) {
  if (!isOpen) return null;

  const scoreGain = optimizedScore - originalScore;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl border border-border/80 bg-white dark:bg-zinc-900 text-foreground p-6 shadow-2xl overflow-hidden"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg text-white shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold flex items-center gap-2">
                  Resume Comparison & Diff Analysis
                </h2>
                <p className="text-xs text-muted-foreground">
                  Side-by-side view highlighting improvements and ATS score increase.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Score Increase Badge */}
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-500">
                <TrendingUp className="h-4 w-4" />
                <span>ATS Gain: +{Math.max(0, scoreGain)} pts</span>
              </div>

              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Side by Side Diff Columns */}
          <div className="flex-1 overflow-y-auto py-6 grid gap-6 md:grid-cols-2">
            {/* Left Column: Original */}
            <div className="space-y-4 rounded-2xl bg-muted/20 p-5 border border-border/40">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                  Original Resume
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  ATS Score: {originalScore}%
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-foreground mb-1">Summary</h4>
                  <p className="text-muted-foreground bg-rose-500/5 p-3 rounded-xl border border-rose-500/10 line-through">
                    {originalData.summary?.original || "Basic software developer profile."}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-1">Experience Bullets</h4>
                  <div className="space-y-2">
                    {originalData.experience?.map((exp, i) => (
                      <div key={i} className="space-y-1">
                        <p className="font-semibold text-muted-foreground">{exp.jobTitle}</p>
                        {exp.bullets.map((b, j) => (
                          <div key={j} className="rounded-lg bg-rose-500/5 p-2 text-muted-foreground line-through">
                            {b.original}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Optimized */}
            <div className="space-y-4 rounded-2xl bg-emerald-500/5 p-5 border border-emerald-500/20">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" /> Optimized & ATS Ready
                </span>
                <span className="text-xs font-extrabold text-emerald-500">
                  ATS Score: {optimizedScore}%
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-foreground mb-1">Enhanced Professional Summary</h4>
                  <p className="text-foreground font-medium bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                    ✨ {optimizedData.summary.tailored}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-1">High Impact Experience Bullets</h4>
                  <div className="space-y-2">
                    {optimizedData.experience.map((exp, i) => (
                      <div key={i} className="space-y-1">
                        <p className="font-semibold text-emerald-500">{exp.jobTitle}</p>
                        {exp.bullets.map((b, j) => (
                          <div key={j} className="rounded-lg bg-emerald-500/10 p-2.5 font-medium text-foreground border border-emerald-500/20 space-y-1">
                            <p>✨ {b.tailored}</p>
                            {b.keywordsAdded?.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap pt-1">
                                <span className="text-[10px] text-muted-foreground">Added Keywords:</span>
                                {b.keywordsAdded.map((kw) => (
                                  <span key={kw} className="rounded-full bg-primary-500/10 px-2 py-0.2 text-[9px] font-semibold text-primary-500">
                                    +{kw}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-4 border-t border-border/50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="h-10 rounded-xl gradient-bg px-6 text-xs font-semibold text-white shadow-lg"
            >
              Continue Editing
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

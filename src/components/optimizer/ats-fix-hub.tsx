"use client";

import { useState } from "react";
import {
  Wrench,
  Check,
  Loader2,
  Sparkles,
  Zap,
  BarChart2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export interface FixHubItem {
  id: string;
  category: "Passive Voice" | "Action Verb" | "Metrics" | "ATS Formatting";
  title: string;
  originalText?: string;
  fixedText: string;
  impactGain: string;
}

interface ATSFixHubProps {
  fixes: FixHubItem[];
  onApplyFix: (fix: FixHubItem) => Promise<void>;
}

export function ATSFixHub({ fixes, onApplyFix }: ATSFixHubProps) {
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleFix = async (item: FixHubItem) => {
    setLoadingId(item.id);
    try {
      await onApplyFix(item);
      setAppliedIds((prev) => [...prev, item.id]);
    } finally {
      setLoadingId(null);
    }
  };

  const pendingFixes = fixes.filter((f) => !appliedIds.includes(f.id));

  return (
    <div className="glass rounded-2xl p-5 space-y-4 border border-border/50 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg text-white shadow-md">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold flex items-center gap-2">
              1-Click ATS Fix Hub
            </h3>
            <p className="text-xs text-muted-foreground">
              Instant 1-click fixes for passive voice, weak verbs, metrics & formatting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 border border-emerald-500/20">
            {appliedIds.length} Fixed
          </span>
          {pendingFixes.length > 0 && (
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500 border border-amber-500/20">
              {pendingFixes.length} Fixes Available
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {fixes.map((item) => {
          const isApplied = appliedIds.includes(item.id);
          const isLoading = loadingId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-3.5 space-y-2 transition-all ${
                isApplied
                  ? "border-emerald-500/30 bg-emerald-500/5 opacity-80"
                  : "border-border/50 bg-card/60 hover:border-primary-500/30"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary-500/10 px-2 py-0.5 text-[10px] font-bold text-primary-500 uppercase">
                    {item.category}
                  </span>
                  <span className="text-xs font-semibold text-foreground">{item.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {item.impactGain}
                  </span>

                  {isApplied ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                      <Check className="h-3.5 w-3.5" /> Fixed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleFix(item)}
                      disabled={isLoading}
                      className="inline-flex h-7 items-center gap-1.5 rounded-lg gradient-bg px-3 text-xs font-semibold text-white shadow-sm transition-transform hover:scale-105 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <Zap className="h-3.5 w-3.5" /> Auto-Fix
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {item.originalText && (
                <div className="rounded-lg bg-rose-500/5 p-2 text-xs text-muted-foreground border border-rose-500/10 line-through">
                  {item.originalText}
                </div>
              )}

              <div className="rounded-lg bg-emerald-500/5 p-2 text-xs font-medium text-foreground border border-emerald-500/10">
                ✨ {item.fixedText}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

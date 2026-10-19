"use client";

import { useState } from "react";
import { Lightbulb, Wrench, Check, Loader2, Sparkles, TrendingUp } from "lucide-react";

export interface SmartSuggestionItem {
  id: string;
  type: "bullet" | "skills" | "experience" | "summary" | "metrics" | "action_verb";
  title: string;
  description: string;
  beforeText?: string;
  suggestedText: string;
  reason: string;
}

interface SmartSuggestionsProps {
  suggestions: SmartSuggestionItem[];
  onApplyFix: (suggestion: SmartSuggestionItem) => Promise<void>;
}

export function SmartSuggestions({ suggestions, onApplyFix }: SmartSuggestionsProps) {
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleFix = async (item: SmartSuggestionItem) => {
    setLoadingId(item.id);
    try {
      await onApplyFix(item);
      setAppliedIds((prev) => [...prev, item.id]);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="glass rounded-2xl p-5 space-y-4 border border-border/50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-bold flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" /> Smart Recommendations
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            1-Click &quot;Fix&quot; suggestions to improve weak bullets, action verbs, and missing impact.
          </p>
        </div>
      </div>

      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {suggestions.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No pending suggestions. Your resume looks great!</p>
        ) : (
          suggestions.map((item) => {
            const isApplied = appliedIds.includes(item.id);
            const isLoading = loadingId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-xl border border-border/50 bg-card/60 p-3.5 space-y-2 transition-all hover:border-primary-500/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary-500/10 px-2 py-0.5 text-[10px] font-bold text-primary-500 uppercase">
                      {item.type}
                    </span>
                    <span className="text-xs font-semibold text-foreground">{item.title}</span>
                  </div>

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
                          <Wrench className="h-3.5 w-3.5" /> Fix
                        </>
                      )}
                    </button>
                  )}
                </div>

                {item.beforeText && (
                  <div className="rounded-lg bg-rose-500/5 p-2 text-xs text-muted-foreground border border-rose-500/10 line-through">
                    {item.beforeText}
                  </div>
                )}

                <div className="rounded-lg bg-emerald-500/5 p-2 text-xs font-medium text-foreground border border-emerald-500/10">
                  ✨ {item.suggestedText}
                </div>

                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary-500" /> {item.reason}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

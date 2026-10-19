"use client";

import { useState } from "react";
import { Plus, Sparkles, Loader2, Check, Tag } from "lucide-react";

export interface KeywordCategoryItem {
  keyword: string;
  category: "Technical Skills" | "Soft Skills" | "Frameworks" | "Languages" | "Tools" | "Certifications" | "Responsibilities" | "Industry Keywords";
  importance?: "high" | "medium" | "low";
}

interface KeywordOptimizerProps {
  missingKeywords: KeywordCategoryItem[];
  onAddKeyword: (keyword: string, category: string) => Promise<void>;
  addedKeywords: string[];
}

export function KeywordOptimizer({
  missingKeywords,
  onAddKeyword,
  addedKeywords,
}: KeywordOptimizerProps) {
  const [loadingKw, setLoadingKw] = useState<string | null>(null);

  const categories = [
    "Technical Skills",
    "Soft Skills",
    "Frameworks",
    "Languages",
    "Tools",
    "Certifications",
    "Responsibilities",
    "Industry Keywords",
  ] as const;

  const handleAdd = async (kw: string, cat: string) => {
    setLoadingKw(kw);
    try {
      await onAddKeyword(kw, cat);
    } finally {
      setLoadingKw(null);
    }
  };

  return (
    <div className="glass rounded-2xl p-5 space-y-4 border border-border/50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-500" /> Missing ATS Keywords
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click &quot;Add&quot; to let AI insert the keyword into the most relevant section naturally.
          </p>
        </div>
      </div>

      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
        {categories.map((cat) => {
          const items = missingKeywords.filter((k) => k.category === cat);
          if (items.length === 0) return null;

          return (
            <div key={cat} className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Tag className="h-3.5 w-3.5 text-primary-500" />
                <span>{cat}</span>
                <span className="rounded-full bg-muted/40 px-1.5 py-0.2 text-[10px]">
                  {items.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {items.map((item) => {
                  const isAdded = addedKeywords.includes(item.keyword);
                  const isLoading = loadingKw === item.keyword;

                  return (
                    <div
                      key={item.keyword}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition-all ${
                        isAdded
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                          : "border-border/50 bg-card/60 hover:border-primary-500/40 hover:bg-muted/30"
                      }`}
                    >
                      <span className="font-medium">{item.keyword}</span>
                      {isAdded ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500">
                          <Check className="h-3 w-3" /> Added
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAdd(item.keyword, cat)}
                          disabled={isLoading}
                          className="inline-flex h-6 items-center gap-1 rounded-lg gradient-bg px-2 text-[11px] font-semibold text-white transition-transform hover:scale-105 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <Plus className="h-3 w-3" /> Add
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

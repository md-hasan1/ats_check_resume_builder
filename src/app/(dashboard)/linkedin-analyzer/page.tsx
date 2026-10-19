"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Check, Eye, Loader2, Award, UserCheck, MessageSquare, ExternalLink } from "lucide-react";
import { toast, showAlert } from "@/lib/sweetalert";

import type { LinkedInAnalysisResult } from "@/lib/ai/provider";

export default function LinkedInAnalyzerPage() {
  const [profileContent, setProfileContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkedInAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!profileContent || profileContent.length < 20) {
      toast.error("Please paste your LinkedIn profile headline, about text, or experience.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileContent }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Analysis failed");
      } else {
        setResult(data.data);
        toast.success("LinkedIn profile analyzed!");
      }
    } catch {
      toast.error("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl flex items-center gap-3">
          <UserCheck className="h-7 w-7 text-primary-500" />
          LinkedIn Profile Optimizer & Recruiter Score
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Optimize your headline, summary, and keywords to rank higher in LinkedIn Recruiter searches.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Input */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">
              Paste LinkedIn Profile Content
            </label>
            <textarea
              rows={10}
              placeholder="Paste your current headline, about section, or full profile summary here..."
              value={profileContent}
              onChange={(e) => setProfileContent(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs transition-colors focus:border-primary-500 focus:outline-none resize-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl gradient-bg text-xs font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4" /> Analyze LinkedIn Profile</>}
          </button>
        </div>

        {/* Analysis Output */}
        <div className="glass rounded-2xl p-6 space-y-4">
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">Recruiter Search Score</span>
                  <p className="text-3xl font-bold text-emerald-500">{result.recruiterScore}/100</p>
                </div>
              </div>

              <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-4 space-y-1">
                <p className="text-xs font-semibold text-primary-500">Recommended Headline</p>
                <p className="text-xs text-foreground font-medium">{result.suggestedHeadline}</p>
              </div>

              <div className="rounded-xl border border-border/50 bg-background p-4 space-y-1">
                <p className="text-xs font-semibold text-foreground">Recommended &quot;About&quot; Summary</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{result.suggestedAbout}</p>
              </div>

              <div>
                <p className="text-xs font-semibold mb-2">Missing High-Search Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords?.map((kw: string) => (
                    <span key={kw} className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-500">
                      +{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
              <UserCheck className="h-10 w-10 opacity-30 mb-2" />
              <p className="text-xs">Your AI profile analysis and recruiter recommendations will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

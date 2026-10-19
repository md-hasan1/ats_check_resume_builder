"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Sparkles, CheckCircle, ChevronDown, ChevronUp, Loader2, BookOpen } from "lucide-react";
import { toast, showAlert } from "@/lib/sweetalert";

import type { InterviewPrepResult, InterviewQuestionItem } from "@/lib/ai/provider";

export default function InterviewPrepPage() {
  const [targetRole, setTargetRole] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewPrepResult | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!targetRole) {
      toast.error("Please enter target job title.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, company, jobDescription }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Generation failed");
      } else {
        setQuestions(data.data);
        toast.success("Interview questions generated!");
      }
    } catch {
      toast.error("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl flex items-center gap-3">
          <HelpCircle className="h-7 w-7 text-primary-500" />
          AI Interview Question Generator & Practice
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate targeted technical, behavioral (STAR method), HR, and system design questions.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Target Role *</label>
            <input
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Target Company</label>
            <input
              type="text"
              placeholder="e.g. Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Job Description (Optional)</label>
          <textarea
            rows={3}
            placeholder="Paste job description to tailor questions..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full rounded-xl border border-border bg-background p-3 text-xs focus:border-primary-500 focus:outline-none resize-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex h-10 px-6 items-center justify-center gap-2 rounded-xl gradient-bg text-xs font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:scale-[1.01] disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4" /> Generate Practice Questions</>}
        </button>
      </div>

      {/* Questions Output */}
      {questions && (
        <div className="space-y-6">
          {["technical", "behavioral", "systemDesign"].map((cat) => (
            <div key={cat} className="space-y-3">
              <h2 className="text-sm font-bold capitalize flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary-500" /> {cat.replace(/([A-Z])/g, " $1")} Questions
              </h2>
              <div className="space-y-2">
                {questions[cat as keyof InterviewPrepResult]?.map((item: InterviewQuestionItem, i: number) => (
                  <div key={i} className="glass rounded-xl p-4 space-y-2 border border-border/50">
                    <div className="flex items-start justify-between cursor-pointer" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                      <div>
                        <span className="inline-block rounded-full bg-primary-500/10 px-2 py-0.5 text-[10px] font-semibold text-primary-500 mr-2">
                          {item.category || cat}
                        </span>
                        <p className="text-xs font-semibold inline">{item.question}</p>
                      </div>
                      {openIdx === i ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>

                    {openIdx === i && (
                      <div className="pt-2 border-t border-border/50 space-y-2 text-xs">
                        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
                          <p className="font-semibold text-emerald-500 mb-1">Answer Strategy & Key Guidance</p>
                          <p className="text-muted-foreground leading-relaxed">{item.answerGuidance}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

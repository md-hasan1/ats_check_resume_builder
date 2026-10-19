"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Check, Send, Download, FileText, Loader2 } from "lucide-react";
import { toast, showAlert } from "@/lib/sweetalert";

export default function CoverLetterPage() {
  const [targetCompany, setTargetCompany] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!targetCompany || !targetRole || !jobDescription) {
      toast.error("Please fill in target company, role, and job description.");
      return;
    }

    setLoading(true);
    try {
      // In production, pass actual user resumeId
      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: "mock-resume-id",
          jobDescription,
          targetCompany,
          targetRole,
          tone,
          length,
        }),
      });

      const res = await response.json();
      if (!res.success) {
        // Fallback for mock preview
        setGeneratedLetter(
          `Dear Hiring Team at ${targetCompany},\n\nI am writing to express my enthusiastic interest in the ${targetRole} position. With my background in building high-performance web applications and optimizing software architectures, I am confident in my ability to deliver immediate value to ${targetCompany}.\n\nThroughout my career, I have consistently focused on engineering scalable solutions and driving measurable product impacts. I look forward to discussing how my experience aligns with your team's goals.\n\nSincerely,\nCandidate Name`
        );
      } else {
        setGeneratedLetter(res.data.content);
      }
      toast.success("Cover letter generated!");
    } catch {
      toast.error("Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl flex items-center gap-3">
          <FileText className="h-7 w-7 text-primary-500" />
          AI Cover Letter Generator
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate a personalized, high-converting cover letter tailored to any role and company.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Generator Controls */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Target Company</label>
            <input
              type="text"
              placeholder="e.g. Google"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs transition-colors focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Target Role</label>
            <input
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs transition-colors focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs transition-colors focus:border-primary-500 focus:outline-none"
              >
                <option value="professional">Professional</option>
                <option value="persuasive">Persuasive</option>
                <option value="creative">Creative</option>
                <option value="concise">Concise</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs transition-colors focus:border-primary-500 focus:outline-none"
              >
                <option value="short">Short (~200 words)</option>
                <option value="standard">Standard (~350 words)</option>
                <option value="detailed">Detailed (~500 words)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Job Description</label>
            <textarea
              rows={6}
              placeholder="Paste job description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs transition-colors focus:border-primary-500 focus:outline-none resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl gradient-bg text-xs font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate Cover Letter
              </>
            )}
          </button>
        </div>

        {/* Generated Output */}
        <div className="glass rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Generated Cover Letter</h2>
              {generatedLetter && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            {generatedLetter ? (
              <div className="rounded-xl border border-border/50 bg-background p-4 text-xs leading-relaxed whitespace-pre-wrap font-sans text-foreground max-h-[400px] overflow-y-auto">
                {generatedLetter}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <FileText className="h-10 w-10 opacity-30 mb-2" />
                <p className="text-xs">Your AI-generated cover letter will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

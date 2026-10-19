import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle, Palette, Download } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Resume Builder — Build ATS-Friendly Resumes Free",
  description:
    "Build a modern, ATS-compatible resume in minutes with live real-time HTML preview and one-click PDF & DOCX export.",
};

export default function AIResumeBuilderSEOPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3.5 py-1 text-xs font-semibold text-primary-500">
          <Sparkles className="h-3.5 w-3.5" /> Interactive AI Resume Builder
        </span>
        <h1 className="font-heading text-4xl font-extrabold sm:text-5xl tracking-tight leading-tight">
          Create an <span className="gradient-text">ATS-Optimized Resume</span> in Minutes
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Step-by-step interactive builder with live preview, custom theme colors, section reordering, and one-click PDF/DOCX downloads.
        </p>
        <div className="pt-4 flex justify-center">
          <Link
            href="/resume-builder"
            className="inline-flex h-12 items-center gap-2 rounded-2xl gradient-bg px-8 text-sm font-semibold text-white shadow-xl shadow-primary-500/25 transition-all hover:scale-[1.02]"
          >
            Start Building Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

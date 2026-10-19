import Link from "next/link";
import { UserCheck, ArrowRight, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn Profile Analyzer & Recruiter Score",
  description:
    "Analyze your LinkedIn headline and about section. Get an instant Recruiter Score, AI-rewritten headline, and keyword optimizations.",
};

export default function LinkedInAnalyzerSEOPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3.5 py-1 text-xs font-semibold text-primary-500">
          <UserCheck className="h-3.5 w-3.5" /> LinkedIn Profile Optimizer
        </span>
        <h1 className="font-heading text-4xl font-extrabold sm:text-5xl tracking-tight leading-tight">
          Rank #1 in <span className="gradient-text">LinkedIn Recruiter Searches</span>
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Get an instant recruiter search score, optimized headline recommendations, and high-impact summary rewrites.
        </p>
        <div className="pt-4 flex justify-center">
          <Link
            href="/linkedin-analyzer"
            className="inline-flex h-12 items-center gap-2 rounded-2xl gradient-bg px-8 text-sm font-semibold text-white shadow-xl shadow-primary-500/25 transition-all hover:scale-[1.02]"
          >
            Analyze Profile Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

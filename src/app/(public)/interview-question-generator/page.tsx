import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Interview Question Generator & STAR Method Guidance",
  description:
    "Generate technical, behavioral, HR, and system design questions tailored to your role and target company.",
};

export default function InterviewGeneratorSEOPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3.5 py-1 text-xs font-semibold text-primary-500">
          <HelpCircle className="h-3.5 w-3.5" /> AI Interview Prep
        </span>
        <h1 className="font-heading text-4xl font-extrabold sm:text-5xl tracking-tight leading-tight">
          Ace Your Next <span className="gradient-text">Technical & Behavioral Interview</span>
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Generate role-tailored technical, behavioral (STAR method), and system design questions with expert answer strategies.
        </p>
        <div className="pt-4 flex justify-center">
          <Link
            href="/interview-prep"
            className="inline-flex h-12 items-center gap-2 rounded-2xl gradient-bg px-8 text-sm font-semibold text-white shadow-xl shadow-primary-500/25 transition-all hover:scale-[1.02]"
          >
            Practice Questions Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { FileSearch, CheckCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI ATS Resume Checker & Scanner (2026)",
  description:
    "Check your resume against ATS algorithms in seconds. Get instant match scores, missing keyword suggestions, and formatting checks.",
  keywords: ["ATS resume checker", "resume scanner", "ATS score", "resume keyword match"],
};

export default function ATSResumeCheckerSEOPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3.5 py-1 text-xs font-semibold text-primary-500">
          <FileSearch className="h-3.5 w-3.5" /> AI ATS Resume Scanner
        </span>
        <h1 className="font-heading text-4xl font-extrabold sm:text-5xl tracking-tight leading-tight">
          Beat the ATS & Land <span className="gradient-text">3x More Interviews</span>
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Scan your resume against any job description in seconds. Get instant keyword match analysis, formatting checks, and zero-hallucination recommendations.
        </p>
        <div className="pt-4 flex justify-center">
          <Link
            href="/upload"
            className="inline-flex h-12 items-center gap-2 rounded-2xl gradient-bg px-8 text-sm font-semibold text-white shadow-xl shadow-primary-500/25 transition-all hover:scale-[1.02]"
          >
            Check Your Resume Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="glass rounded-2xl p-6 space-y-2">
          <CheckCircle className="h-6 w-6 text-emerald-500" />
          <h3 className="font-heading text-base font-bold">Keyword Extraction</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Identifies exact hard skills, soft skills, and industry terms missing from your resume.
          </p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-2">
          <Zap className="h-6 w-6 text-amber-500" />
          <h3 className="font-heading text-base font-bold">10s Recruiter Simulation</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Simulates a recruiter&apos;s initial 10-second scan to pinpoint hesitation red flags.
          </p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-2">
          <ShieldCheck className="h-6 w-6 text-primary-500" />
          <h3 className="font-heading text-base font-bold">Zero Hallucination</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Guarantees no fake companies, experience, or degrees are ever added to your resume.
          </p>
        </div>
      </div>
    </div>
  );
}

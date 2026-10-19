"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Download,
  CheckCircle,
  FileText,
  Zap,
  ArrowLeft,
  Copy,
  Check,
  Edit3,
  Eye,
  ShieldCheck,
  Loader2,
  List,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast, showAlert } from "@/lib/sweetalert";
import type { TailoredResumeData } from "@/lib/ai/schemas/tailored-resume";

const mockTailoredData: TailoredResumeData = {
  versionName: "Tailored for Senior Frontend Engineer @ Google",
  targetRole: "Senior Frontend Engineer",
  targetCompany: "Google",
  contactInfo: {
    fullName: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
  },
  summary: {
    original: "Experienced software engineer with knowledge of React and web development.",
    tailored:
      "Results-driven Senior Frontend Engineer with 6+ years of expertise crafting high-performance web applications using React, TypeScript, and Next.js. Proven track record of reducing page load times by 42% and implementing scalable design systems adopted across 15+ engineering teams.",
    reasoning: "Incorporated target keywords (TypeScript, Next.js, Design Systems) and highlighted performance optimization achievements.",
  },
  skills: {
    matchedSkills: ["React", "TypeScript", "JavaScript", "HTML/CSS", "GraphQL", "Tailwind CSS"],
    highlightedSkills: [
      "React 19",
      "TypeScript",
      "Next.js App Router",
      "GraphQL",
      "Performance Optimization",
      "Design Systems",
      "Zustand",
      "Tailwind CSS",
    ],
    recommendedMissingSkills: ["Kubernetes", "WebAssembly"],
  },
  experience: [
    {
      jobTitle: "Senior Frontend Engineer",
      company: "Tech Corp",
      dates: "2022 - Present",
      bullets: [
        {
          original: "Worked on website speed and performance improvements.",
          tailored:
            "Spearheaded frontend performance optimizations, improving Core Web Vitals and reducing bundle size by 38% through code splitting and tree shaking.",
          keywordsAdded: ["Core Web Vitals", "bundle size", "code splitting"],
          reason: "Replaced passive phrasing with strong action verb 'Spearheaded' and specified optimization techniques.",
        },
        {
          original: "Built reusable UI components for the design team.",
          tailored:
            "Architected a responsive component library using React, TypeScript, and Tailwind CSS, standardizing UI patterns across 12 product modules.",
          keywordsAdded: ["Component library", "TypeScript", "Tailwind CSS"],
          reason: "Emphasized architecture and modern tech stack details.",
        },
      ],
    },
    {
      jobTitle: "Frontend Developer",
      company: "WebStudio Inc.",
      dates: "2019 - 2022",
      bullets: [
        {
          original: "Developed client web applications using React.",
          tailored:
            "Engineered 10+ client web applications leveraging React and GraphQL, delivering pixel-perfect UIs with 99.8% uptime.",
          keywordsAdded: ["GraphQL", "Engineered"],
          reason: "Enhanced impact using strong technical terminology.",
        },
      ],
    },
  ],
  education: [
    {
      degree: "B.S. in Computer Science",
      institution: "University of California, Berkeley",
      dates: "2015 - 2019",
      details: "Focus on Software Engineering & Human-Computer Interaction",
    },
  ],
  certifications: ["AWS Certified Developer"],
  projects: [
    {
      name: "ATS Resume Optimizer",
      description: "AI-powered resume tailoring platform with real-time feedback",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Gemini 2.5 Pro"],
      impact: "Helped 1,000+ job seekers optimize their resumes for ATS screening",
    },
  ],
  diffHighlights: {
    addedKeywordsCount: 14,
    improvedBulletsCount: 6,
    estimatedScoreIncrease: 22,
  },
};

export default function BuilderPage() {
  const params = useParams();
  const [data, setData] = useState<TailoredResumeData>(mockTailoredData);
  const [activeTab, setActiveTab] = useState<"side-by-side" | "preview" | "editor">("side-by-side");
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleExport = async (format: "docx" | "md" | "txt" | "json") => {
    setDownloading(format);
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, format }),
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Tailored_Resume.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success(`Exported as .${format.toUpperCase()}`);
    } catch {
      toast.error("Failed to download document");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-lg font-bold sm:text-xl">{data.versionName}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <ShieldCheck className="h-3 w-3" /> Zero Hallucination
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Target: {data.targetCompany || "Company"} • {data.targetRole}
            </p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleExport("docx")}
            disabled={!!downloading}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border/50 px-3 text-xs font-medium hover:bg-muted/50 transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> DOCX
          </button>
          <button
            onClick={() => handleExport("md")}
            disabled={!!downloading}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border/50 px-3 text-xs font-medium hover:bg-muted/50 transition-colors"
          >
            <FileText className="h-3.5 w-3.5" /> MD
          </button>
          <button
            onClick={() => handleExport("txt")}
            disabled={!!downloading}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border/50 px-3 text-xs font-medium hover:bg-muted/50 transition-colors"
          >
            TXT
          </button>
          <button
            onClick={() => handleExport("json")}
            disabled={!!downloading}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border/50 px-3 text-xs font-medium hover:bg-muted/50 transition-colors"
          >
            JSON
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 rounded-xl border border-border/50 bg-card/50 p-1 w-fit">
          <button
            onClick={() => setActiveTab("side-by-side")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "side-by-side" ? "bg-primary-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" /> Side-by-Side Diff
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "preview" ? "bg-primary-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-3.5 w-3.5" /> Document Preview
          </button>
        </div>

        <Link
          href={`/optimize/${params.id || 'demo'}`}
          className="inline-flex h-9 items-center gap-2 rounded-xl gradient-bg px-4 text-xs font-semibold text-white shadow-lg hover:scale-105 transition-all"
        >
          <Sparkles className="h-3.5 w-3.5" /> Open Full AI Resume Editor
        </Link>
      </div>

      {/* Main View Area */}
      {activeTab === "side-by-side" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Summary Comparison */}
          <div className="glass rounded-2xl p-6 lg:col-span-2 space-y-4">
            <h2 className="font-heading text-sm font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" /> Professional Summary Optimization
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-4">
                <p className="text-xs font-semibold text-rose-500 mb-1">Original Summary</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{data.summary.original}</p>
              </div>
              <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4">
                <p className="text-xs font-semibold text-emerald-500 mb-1">Tailored Summary</p>
                <p className="text-sm leading-relaxed">{data.summary.tailored}</p>
              </div>
            </div>
          </div>

          {/* Bullet Point Rewrites */}
          <div className="glass rounded-2xl p-6 lg:col-span-2 space-y-4">
            <h2 className="font-heading text-sm font-semibold flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> Experience Bullet Point Rewrites
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i} className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {exp.jobTitle} @ {exp.company}
                  </h3>
                  {exp.bullets.map((b, j) => (
                    <div key={j} className="rounded-xl border border-border/50 p-4 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="text-xs text-muted-foreground line-through bg-muted/20 p-3 rounded-lg">
                          {b.original}
                        </div>
                        <div className="text-xs font-medium text-foreground bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                          {b.tailored}
                        </div>
                      </div>
                      <div className="flex items-center justify-between flex-wrap gap-2 text-[11px]">
                        <span className="text-muted-foreground">Reason: {b.reason}</span>
                        <div className="flex gap-1 flex-wrap">
                          {b.keywordsAdded.map((kw) => (
                            <span key={kw} className="rounded-full bg-primary-500/10 px-2 py-0.5 text-[10px] font-semibold text-primary-500">
                              +{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "preview" && (
        <div className="glass rounded-2xl p-8 max-w-3xl mx-auto space-y-6 text-foreground bg-background shadow-2xl">
          <div className="text-center border-b border-border/50 pb-4 space-y-1">
            <h1 className="font-heading text-2xl font-bold">{data.contactInfo.fullName}</h1>
            <p className="text-xs text-muted-foreground">
              {[data.contactInfo.email, data.contactInfo.phone, data.contactInfo.location, data.contactInfo.linkedin]
                .filter(Boolean)
                .join(" • ")}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary-500 border-b border-border/50 pb-1">
              Professional Summary
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">{data.summary.tailored}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary-500 border-b border-border/50 pb-1">
              Technical Skills
            </h2>
            <p className="text-xs text-muted-foreground">{data.skills.highlightedSkills.join(" • ")}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary-500 border-b border-border/50 pb-1">
              Work Experience
            </h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>{exp.jobTitle} — {exp.company}</span>
                  <span className="text-muted-foreground font-normal">{exp.dates}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                  {exp.bullets.map((b, j) => (
                    <li key={j}>{b.tailored}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary-500 border-b border-border/50 pb-1">
              Education
            </h2>
            {data.education.map((edu, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="font-semibold">{edu.degree}, {edu.institution}</span>
                <span className="text-muted-foreground">{edu.dates}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

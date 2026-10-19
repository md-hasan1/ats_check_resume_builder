"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  ArrowLeft,
  Share2,
  Sparkles,
  BarChart3,
  Briefcase,
  GraduationCap,
  Layout,
  PenTool,
  ListChecks,
  Eye,
  Loader2,
  Brain,
  Download,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import type { AnalysisResult } from "@/types/analysis";
import { STOP_WORDS } from "@/lib/ai/skills-dictionary";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function getScoreColor(s: number) {
  return s >= 80 ? "text-emerald-500" : s >= 60 ? "text-amber-500" : "text-rose-500";
}
function getScoreBg(s: number) {
  return s >= 80 ? "bg-emerald-500/10" : s >= 60 ? "bg-amber-500/10" : "bg-rose-500/10";
}
function getScoreStroke(s: number) {
  return s >= 80 ? "stroke-emerald-500" : s >= 60 ? "stroke-amber-500" : "stroke-rose-500";
}
function getScoreLabel(s: number) {
  return s >= 80 ? "Excellent Match" : s >= 60 ? "Good Potential" : s >= 40 ? "Needs Improvement" : "Critical ATS Issues";
}
function getBarColor(s: number) {
  return s >= 80 ? "bg-emerald-500" : s >= 60 ? "bg-amber-500" : "bg-rose-500";
}

function SeverityIcon({ severity }: { severity: string }) {
  if (severity === "error") return <XCircle className="h-4 w-4 text-rose-500" />;
  if (severity === "warning") return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  return <Info className="h-4 w-4 text-blue-500" />;
}

const tabList = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "keywords", label: "Keywords", icon: Target },
  { id: "analysis", label: "Section Analysis", icon: ListChecks },
  { id: "ats", label: "ATS Compatibility", icon: Layout },
  { id: "recommendations", label: "Recommendations", icon: Sparkles },
];

export default function ATSResultPage() {
  const params = useParams();
  const reportId = params?.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [reportMeta, setReportMeta] = useState<{
    name?: string;
    jobTitle?: string;
    fileName?: string;
    createdAt?: string;
  } | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      if (!reportId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/reports/${reportId}`);
        const json = await res.json();

        if (!json.success || !json.data) {
          setError(json.error || "Report not found");
          return;
        }

        const rep = json.data;
        setReportMeta({
          name: rep.name,
          jobTitle: rep.jobTitle,
          fileName: rep.resume?.fileName,
          createdAt: rep.createdAt,
        });

        if (rep.analysisResult) {
          setAnalysis(rep.analysisResult as AnalysisResult);
        } else {
          setError("This report does not contain analysis data.");
        }
      } catch (err) {
        console.error("Failed to load ATS report:", err);
        setError("Network error while loading report. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500 mb-4" />
        <p className="text-base font-medium">Loading ATS Analysis Report...</p>
        <p className="text-xs text-muted-foreground mt-1">Retrieving parsed sections and compatibility metrics</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="h-14 w-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold">Report Not Found</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          {error || "We couldn't locate this ATS analysis report."}
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/ats-checker"
            className="inline-flex items-center gap-2 rounded-xl gradient-bg px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:scale-[1.02] transition-all"
          >
            Run New Check
          </Link>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            View History
          </Link>
        </div>
      </div>
    );
  }

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (analysis.overallScore / 100) * circumference;

  // Filter out any non-skill words or boilerplate
  const matchedKeywords = (analysis.keywordAnalysis?.matchedKeywords || []).filter(
    (kw) => !STOP_WORDS.has(kw.keyword.toLowerCase().trim())
  );
  const missingKeywords = (analysis.keywordAnalysis?.missingKeywords || []).filter(
    (kw) => !STOP_WORDS.has(kw.keyword.toLowerCase().trim())
  );

  const cleanSummary = analysis.summary?.replace(
    /Recommended adding\s+([^.]+)\s+to boost/i,
    (_match, p1) => {
      const validWords = p1
        .split(",")
        .map((w: string) => w.trim())
        .filter((w: string) => !STOP_WORDS.has(w.toLowerCase()));
      return validWords.length > 0
        ? `Recommended adding ${validWords.join(", ")} to boost`
        : "Focus on incorporating target technical skills to boost";
    }
  );

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            title="Back to History"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-heading text-xl font-bold sm:text-2xl flex items-center gap-2">
              {reportMeta?.name || "ATS Analysis Results"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {reportMeta?.fileName && `Resume: ${reportMeta.fileName}`}
              {reportMeta?.createdAt && ` • Checked on ${new Date(reportMeta.createdAt).toLocaleDateString()}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/ats-checker"
            className="inline-flex h-9 items-center gap-2 rounded-lg gradient-bg px-4 text-xs font-semibold text-white shadow-md hover:scale-105 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            New ATS Check
          </Link>
        </div>
      </motion.div>

      {/* 1. Score Hero */}
      <motion.div variants={item} className="glass rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <div className="relative flex-shrink-0">
            <svg className="h-32 w-32 sm:h-36 sm:w-36 -rotate-90">
              <circle cx="50%" cy="50%" r="45" className="score-ring-bg" strokeWidth="7" fill="none" />
              <circle
                cx="50%"
                cy="50%"
                r="45"
                className={`score-ring-fill ${getScoreStroke(analysis.overallScore)}`}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                style={{ strokeDashoffset: offset }}
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl sm:text-4xl font-extrabold ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore}
              </span>
              <span className="text-xs font-medium text-muted-foreground">/ 100</span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${getScoreBg(
                  analysis.overallScore
                )} ${getScoreColor(analysis.overallScore)}`}
              >
                {getScoreLabel(analysis.overallScore)}
              </span>
            </div>
            <p className="mt-3 text-sm text-foreground/80 leading-relaxed max-w-2xl">
              {cleanSummary || analysis.summary}
            </p>

            {/* Transparent Scoring Methodology Breakdown Grid */}
            <div className="mt-6 pt-5 border-t border-border/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  ATS Score Methodology Breakdown
                </span>
                <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded font-mono">
                  Formula: (KW×0.30) + (SEM×0.25) + (SK×0.20) + (EXP×0.15) + (FMT×0.10)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  {
                    name: "Keyword Match",
                    weight: "30%",
                    score: (analysis as any).breakdown?.keywordMatch ?? analysis.matchPercentages?.keywords ?? 85,
                    icon: Target,
                  },
                  {
                    name: "Semantic Sim.",
                    weight: "25%",
                    score: (analysis as any).breakdown?.semanticSimilarity ?? 80,
                    icon: Brain,
                  },
                  {
                    name: "Skill Match",
                    weight: "20%",
                    score: (analysis as any).breakdown?.skillMatch ?? analysis.skillsAnalysis?.score ?? 80,
                    icon: CheckCircle,
                  },
                  {
                    name: "Experience",
                    weight: "15%",
                    score: (analysis as any).breakdown?.experienceMatch ?? analysis.experienceAnalysis?.score ?? 75,
                    icon: Briefcase,
                  },
                  {
                    name: "Formatting",
                    weight: "10%",
                    score: (analysis as any).breakdown?.formatting ?? analysis.formattingAnalysis?.score ?? 90,
                    icon: Layout,
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-3 rounded-xl border border-border/50 bg-background/50 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-muted-foreground mb-1">
                        <span className="text-[11px] font-medium flex items-center gap-1">
                          <Icon className="h-3 w-3 text-primary-500" />
                          {item.name}
                        </span>
                        <span className="text-[10px] font-semibold opacity-70">{item.weight}</span>
                      </div>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className={`text-base font-bold ${getScoreColor(item.score)}`}>
                          {item.score}%
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-muted/50 mt-2">
                        <div
                          className={`h-full rounded-full ${getBarColor(item.score)}`}
                          style={{ width: `${Math.min(100, item.score)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto border-b border-border/50 pb-2">
        {tabList.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-primary-500 text-white shadow-md shadow-primary-500/25"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <motion.div variants={item} className="grid gap-6 md:grid-cols-2">
          {/* Matched vs Missing Keywords Highlights */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-heading text-base font-semibold flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary-500" />
              Top Missing Keywords
            </h3>
            {missingKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {missingKeywords.slice(0, 10).map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 text-rose-500 text-xs font-semibold border border-rose-500/20"
                  >
                    <XCircle className="h-3 w-3" />
                    {kw.keyword}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No critical missing keywords identified!</p>
            )}
          </div>

          {/* ATS Top Highlights */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-heading text-base font-semibold flex items-center gap-2 mb-4">
              <Layout className="h-5 w-5 text-emerald-500" />
              ATS Formatting Checks
            </h3>
            <div className="space-y-2.5">
              {analysis.atsCompatibility?.checks?.slice(0, 4).map((check, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-border/30 last:border-0">
                  <span className="text-muted-foreground">{check.name}</span>
                  <span className={`font-semibold flex items-center gap-1 ${check.passed ? "text-emerald-500" : "text-rose-500"}`}>
                    {check.passed ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    {check.passed ? "Passed" : "Action Needed"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Keyword Match */}
      {activeTab === "keywords" && (
        <motion.div variants={item} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Matched Keywords */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-base font-semibold flex items-center gap-2 text-emerald-500">
                  <CheckCircle className="h-5 w-5" />
                  Matched Keywords ({matchedKeywords.length})
                </h3>
                <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  Multi-tier (Exact, Normalized, Alias)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((kw, i) => {
                  const matchType = (kw as any).matchType || (kw as any).category || "exact";
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20"
                      title={(kw as any).foundInContext ? `Found: "${(kw as any).foundInContext}"` : undefined}
                    >
                      <CheckCircle className="h-3 w-3" />
                      {kw.keyword}
                      {matchType && matchType !== "exact" && (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          {matchType}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-base font-semibold flex items-center gap-2 text-rose-500">
                  <XCircle className="h-5 w-5" />
                  Missing Keywords ({missingKeywords.length})
                </h3>
                <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  Actionable Targets
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 text-xs font-semibold border border-rose-500/20"
                  >
                    <XCircle className="h-3 w-3" />
                    {kw.keyword}
                    {kw.importance && (
                      <span className="text-[10px] uppercase font-bold opacity-80 px-1 py-0.2 rounded bg-rose-500/20">
                        {kw.importance}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: Section Analysis */}
      {activeTab === "analysis" && (
        <motion.div variants={item} className="grid gap-6 md:grid-cols-2">
          {/* Section Detection */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-heading text-base font-semibold flex items-center gap-2 mb-4">
              <ListChecks className="h-5 w-5 text-primary-500" />
              Detected Resume Sections
            </h3>
            <div className="space-y-3">
              {analysis.sectionDetection?.detected?.map((sec, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/20">
                  <span className="text-sm font-medium">{sec.name}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sec.present ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                    {sec.present ? "Present" : "Missing"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-heading text-base font-semibold flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-violet-500" />
              Skills Matching
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Hard / Technical Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skillsAnalysis?.hardSkills?.map((sk, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2.5 py-1 rounded-md border ${
                        sk.matched
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-muted text-muted-foreground border-border/40"
                      }`}
                    >
                      {sk.skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Soft Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skillsAnalysis?.softSkills?.map((sk, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2.5 py-1 rounded-md border ${
                        sk.matched
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-muted text-muted-foreground border-border/40"
                      }`}
                    >
                      {sk.skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 4: ATS Compatibility */}
      {activeTab === "ats" && (
        <motion.div variants={item} className="glass rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div>
              <h3 className="font-heading text-lg font-semibold flex items-center gap-2">
                <Layout className="h-5 w-5 text-primary-500" />
                ATS Parser Compatibility Checklist
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Ensures automated parser algorithms can extract all sections, fonts, contact details, and dates.
              </p>
            </div>
            <span className={`text-xl font-bold ${getScoreColor(analysis.atsCompatibility?.score || 80)}`}>
              {analysis.atsCompatibility?.score || 80}/100
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {analysis.atsCompatibility?.checks?.map((check, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-muted/20"
              >
                <div className="mt-0.5">
                  {check.passed ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <SeverityIcon severity={check.severity || "warning"} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{check.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{check.message}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tab 5: Recommendations */}
      {activeTab === "recommendations" && (
        <motion.div variants={item} className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-heading text-lg font-semibold flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary-500" />
              Actionable AI Improvement Recommendations
            </h3>
            <div className="space-y-4">
              {analysis.aiSuggestions && analysis.aiSuggestions.length > 0 ? (
                analysis.aiSuggestions.map((sug, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-500/10 text-primary-500">
                        {sug.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{sug.reason}</span>
                    </div>
                    {sug.original && (
                      <div className="text-xs text-rose-500/90 line-through">
                        &ldquo;{sug.original}&rdquo;
                      </div>
                    )}
                    <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/20">
                      &rarr; {sug.improved}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No suggestions required. Resume looks well-optimized!</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

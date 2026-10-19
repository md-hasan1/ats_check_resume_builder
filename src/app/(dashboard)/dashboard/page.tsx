"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileSearch,
  TrendingUp,
  Trophy,
  BarChart3,
  Upload,
  ArrowRight,
  FileText,
  Clock,
  Sparkles,
  Zap,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

interface RecentReport {
  id: string;
  name: string;
  fileName: string;
  score: number;
  date: string;
  status: string;
}

interface ScorePoint {
  id: string;
  name: string;
  score: number;
  date: string;
}

interface DashboardData {
  stats: {
    totalChecks: number;
    averageScore: number;
    bestScore: number;
    scoreTrend: string;
  };
  recentReports: RecentReport[];
  scoreHistory: ScorePoint[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-rose-500";
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-emerald-500/10";
  if (score >= 60) return "bg-amber-500/10";
  return "bg-rose-500/10";
}

function getScoreRing(score: number) {
  if (score >= 80) return "stroke-emerald-500";
  if (score >= 60) return "stroke-amber-500";
  return "stroke-rose-500";
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  const rawName = session?.user?.name || "";
  const displayName = rawName.trim().length > 0 ? rawName : "there";

  const stats = [
    {
      label: "Total Checks",
      value: loading ? "..." : (data?.stats.totalChecks ?? 0),
      icon: FileSearch,
      color: "text-primary-500",
      bg: "bg-primary-500/10",
    },
    {
      label: "Average Score",
      value: loading ? "..." : `${data?.stats.averageScore ?? 0}%`,
      icon: BarChart3,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
    {
      label: "Best Score",
      value: loading ? "..." : `${data?.stats.bestScore ?? 0}%`,
      icon: Trophy,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Score Trend",
      value: loading ? "..." : (data?.stats.scoreTrend ?? "0%"),
      icon: TrendingUp,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
  ];

  const recentReports = data?.recentReports || [];
  const scoreHistory = data?.scoreHistory || [];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Welcome back, {displayName} <span className="wave">👋</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s an overview of your resume checks and ATS scores.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={item}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass rounded-2xl p-5 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions + Recent Reports */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Upload Card */}
        <motion.div variants={item} className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 h-full flex flex-col justify-between">
            <div>
              <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Quick Check
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload your resume and paste a job description to get an instant ATS analysis.
              </p>
              <Link
                href="/ats-checker"
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl gradient-bg text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-primary-500/40 hover:scale-[1.01]"
              >
                <Upload className="h-4 w-4" />
                Check Resume
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Tips */}
            <div className="mt-8 space-y-3 border-t border-border/40 pt-6">
              <h3 className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary-500" />
                Pro Tips
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                  Tailor your resume for each job application
                </p>
                <p className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                  Ensure exact keywords match the job requirements
                </p>
                <p className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                  Aim for an ATS score above 80% before applying
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Reports */}
        <motion.div variants={item} className="lg:col-span-2">
          <div className="glass rounded-2xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Recent Reports
              </h2>
              {recentReports.length > 0 && (
                <Link
                  href="/history"
                  className="text-sm font-medium text-primary-500 hover:text-primary-400 flex items-center gap-1"
                >
                  View All <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            ) : recentReports.length > 0 ? (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <Link
                    key={report.id}
                    href={`/ats-checker/${report.id}`}
                    className="flex items-center gap-4 rounded-xl border border-border/50 p-4 transition-all hover:bg-muted/30 hover:border-border"
                  >
                    {/* Score Ring */}
                    <div className="relative flex-shrink-0">
                      <svg className="h-12 w-12 -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-muted/30"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={`${(report.score / 100) * 125.6} 125.6`}
                          className={getScoreRing(report.score)}
                        />
                      </svg>
                      <span
                        className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${getScoreColor(report.score)}`}
                      >
                        {report.score}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{report.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <FileText className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{report.fileName}</span>
                        <span>•</span>
                        <span className="flex-shrink-0">
                          {new Date(report.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Score Badge */}
                    <div
                      className={`flex-shrink-0 rounded-lg px-3 py-1 text-xs font-semibold ${getScoreBg(report.score)} ${getScoreColor(report.score)}`}
                    >
                      {report.score >= 80
                        ? "Excellent"
                        : report.score >= 60
                          ? "Good"
                          : "Needs Work"}
                    </div>

                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <div className="h-14 w-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 mb-3">
                  <FileSearch className="h-7 w-7" />
                </div>
                <p className="font-semibold text-base">No resume checks yet</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Upload your resume and paste a job description to get your first detailed ATS compatibility score.
                </p>
                <Link
                  href="/ats-checker"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl gradient-bg px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-primary-500/25 hover:scale-[1.02] transition-all"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Check Your Resume Now
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Score History Chart */}
      <motion.div variants={item}>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary-500" />
                Score History &amp; Progress
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track how your ATS optimization scores improve over time.
              </p>
            </div>
            {scoreHistory.length > 0 && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-500">
                {scoreHistory.length} {scoreHistory.length === 1 ? "check" : "checks"} recorded
              </span>
            )}
          </div>

          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
            </div>
          ) : scoreHistory.length >= 2 ? (
            <div className="space-y-4">
              {/* Score Trend Visualization */}
              <div className="relative h-52 w-full pt-4">
                <svg className="w-full h-40 overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                  <line x1="0" y1="60" x2="500" y2="60" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />

                  {/* Area and Line */}
                  {(() => {
                    const points = scoreHistory.map((pt, idx) => {
                      const x = (idx / (scoreHistory.length - 1)) * 500;
                      const y = 120 - (pt.score / 100) * 100;
                      return { x, y, score: pt.score, date: pt.date, name: pt.name };
                    });

                    const lineD = points.reduce(
                      (acc, p, i) => `${acc} ${i === 0 ? "M" : "L"} ${p.x} ${p.y}`,
                      ""
                    );

                    const areaD = `${lineD} L 500 120 L 0 120 Z`;

                    return (
                      <>
                        <path d={areaD} fill="url(#scoreGradient)" />
                        <path d={lineD} fill="none" stroke="rgb(59, 130, 246)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {points.map((p, i) => (
                          <g key={i} className="group cursor-pointer">
                            <circle cx={p.x} cy={p.y} r="5" fill="rgb(59, 130, 246)" stroke="#fff" strokeWidth="2" className="transition-all hover:r-7" />
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between text-[11px] text-muted-foreground mt-2 px-1">
                  {scoreHistory.map((pt, idx) => (
                    <span key={idx} className="truncate max-w-[80px] text-center">
                      {pt.date} ({pt.score}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : scoreHistory.length === 1 ? (
            <div className="py-8 text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-semibold">
                Initial Score: {scoreHistory[0].score}%
              </div>
              <p className="text-sm text-muted-foreground">
                First check recorded! Run more checks to see your score progression chart.
              </p>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center rounded-xl border border-dashed border-border/50">
              <div className="text-center">
                <BarChart3 className="h-9 w-9 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Your score history trend will appear here after your checks
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

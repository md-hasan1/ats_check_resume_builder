"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Search,
  ArrowRight,
  Trash2,
  Calendar,
  Filter,
  ArrowUpDown,
  FileSearch,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast, showAlert } from "@/lib/sweetalert";

interface HistoryReport {
  id: string;
  name: string;
  jobTitle?: string | null;
  overallScore: number;
  createdAt: string;
  resume?: {
    fileName: string;
  };
}

function getScoreColor(s: number) {
  return s >= 80 ? "text-emerald-500" : s >= 60 ? "text-amber-500" : "text-rose-500";
}
function getScoreBg(s: number) {
  return s >= 80 ? "bg-emerald-500/10" : s >= 60 ? "bg-amber-500/10" : "bg-rose-500/10";
}
function getScoreRing(s: number) {
  return s >= 80 ? "stroke-emerald-500" : s >= 60 ? "stroke-amber-500" : "stroke-rose-500";
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function HistoryPage() {
  const [reports, setReports] = useState<HistoryReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "score">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reports?pageSize=50");
      const json = await res.json();
      if (json.success && json.data) {
        setReports(json.data);
      }
    } catch (err) {
      console.error("Failed to load history reports:", err);
      toast.error("Failed to load ATS history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmed = await showAlert.confirm({
      title: "Delete Report?",
      text: "Are you sure you want to delete this ATS report? This action cannot be undone.",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      isDestructive: true,
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/reports?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setReports((prev) => prev.filter((r) => r.id !== id));
        toast.success("Report deleted successfully");
      } else {
        toast.error(json.error || "Failed to delete report");
      }
    } catch {
      toast.error("Failed to delete report");
    }
  };

  const filtered = reports
    .filter((r) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        r.name?.toLowerCase().includes(q) ||
        r.jobTitle?.toLowerCase().includes(q) ||
        r.resume?.fileName?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
      }
      const scoreA = a.overallScore || 0;
      const scoreB = b.overallScore || 0;
      return sortOrder === "desc" ? scoreB - scoreA : scoreA - scoreB;
    });

  const toggleSort = (field: "date" | "score") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold sm:text-3xl">ATS Check History</h1>
          <p className="mt-1 text-muted-foreground">View and review all your previous resume scans and ATS reports.</p>
        </div>
        <Link
          href="/ats-checker"
          className="inline-flex h-10 items-center gap-2 rounded-xl gradient-bg px-5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:scale-[1.01]"
        >
          <FileSearch className="h-4 w-4" />
          Check Resume
        </Link>
      </motion.div>

      {/* Search & Sort */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by role, company, or resume file..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toggleSort("date")}
            className={`inline-flex h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors ${
              sortBy === "date"
                ? "border-primary-500 bg-primary-500/10 text-primary-500"
                : "border-border hover:bg-muted/50"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Date {sortBy === "date" && (sortOrder === "desc" ? "↓" : "↑")}
          </button>
          <button
            onClick={() => toggleSort("score")}
            className={`inline-flex h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors ${
              sortBy === "score"
                ? "border-primary-500 bg-primary-500/10 text-primary-500"
                : "border-border hover:bg-muted/50"
            }`}
          >
            <ArrowUpDown className="h-4 w-4" />
            Score {sortBy === "score" && (sortOrder === "desc" ? "↓" : "↑")}
          </button>
        </div>
      </motion.div>

      {/* Reports List */}
      <motion.div variants={item}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500 mb-3" />
            <p className="text-sm text-muted-foreground">Loading ATS scan history...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((r) => {
              const score = Math.round(r.overallScore || 0);
              return (
                <div
                  key={r.id}
                  className="glass rounded-xl p-4 transition-all hover:border-primary-500/40 flex items-center justify-between gap-4"
                >
                  <Link href={`/ats-checker/${r.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Score Ring */}
                    <div className="relative flex-shrink-0">
                      <svg className="h-12 w-12 -rotate-90">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={`${(score / 100) * 125.6} 125.6`}
                          className={getScoreRing(score)}
                        />
                      </svg>
                      <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${getScoreColor(score)}`}>
                        {score}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm truncate">{r.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 truncate">
                          <FileText className="h-3 w-3" />
                          {r.resume?.fileName || "Resume"}
                        </span>
                        <span>•</span>
                        <span>{new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        {r.jobTitle && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline truncate">{r.jobTitle}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Score Badge */}
                    <div className={`hidden sm:inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${getScoreBg(score)} ${getScoreColor(score)}`}>
                      {score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work"}
                    </div>
                  </Link>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/ats-checker/${r.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium hover:bg-muted/50 transition-colors"
                    >
                      View Report
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(r.id, e)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center glass rounded-2xl p-8">
            <div className="h-14 w-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 mb-4">
              <FileSearch className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg">No Previous ATS Scans</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {search
                ? `No reports match "${search}". Try a different keyword.`
                : "Run your first ATS check to build your score history and get recommendations."}
            </p>
            <Link
              href="/ats-checker"
              className="mt-6 inline-flex items-center gap-2 rounded-xl gradient-bg px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:scale-[1.02] transition-all"
            >
              Run ATS Check
            </Link>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

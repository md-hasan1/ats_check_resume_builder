"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Edit3,
  Copy,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
  FileCheck,
  CheckCircle2,
  ArrowUpRight,
  Upload,
} from "lucide-react";
import { TEMPLATES_100_CATALOG } from "@/config/templates";
import { toast, showAlert } from "@/lib/sweetalert";

interface BuilderResumeItem {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
  createdAt: string;
}

export default function MyResumesPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<BuilderResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  async function fetchResumes() {
    try {
      setLoading(true);
      const res = await fetch("/api/resumes");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setResumes(json.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your resumes");
    } finally {
      setLoading(false);
    }
  }

  async function handleDuplicate(id: string) {
    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/resumes/${id}/duplicate`, { method: "POST" });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Resume duplicated!");
        fetchResumes();
      } else {
        toast.error("Failed to duplicate resume");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error duplicating resume");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = await showAlert.confirm({
      title: "Delete Resume?",
      text: "Are you sure you want to delete this resume? This action cannot be undone.",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      isDestructive: true,
    });
    if (!confirmed) return;
    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Resume deleted!");
        setResumes((prev) => prev.filter((r) => r.id !== id));
      } else {
        toast.error("Failed to delete resume");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting resume");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold sm:text-3xl">My Resumes</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your tailored resumes, switch templates, and run instant ATS checks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/ats-checker"
            className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-xs font-semibold hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload to ATS Checker
          </Link>
          <Link
            href="/resume-builder"
            className="inline-flex items-center gap-2 rounded-xl gradient-bg px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary-500/20 hover:scale-105 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            Create New Resume
          </Link>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500 mb-3" />
          <p className="text-xs font-medium text-muted-foreground">Loading your resumes...</p>
        </div>
      ) : resumes.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center max-w-lg mx-auto border border-border/50 space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center mx-auto">
            <FileText className="h-7 w-7" />
          </div>
          <h3 className="font-heading text-lg font-bold">No Resumes Created Yet</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Choose from 100 professionally designed templates, enter your career achievements, and build an ATS-friendly resume in minutes.
          </p>
          <Link
            href="/resume-builder"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-white text-xs font-semibold shadow-lg shadow-primary-500/25 hover:scale-105 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            Browse 100 Templates
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => {
            const template =
              TEMPLATES_100_CATALOG.find((t) => t.id === resume.templateId) ||
              TEMPLATES_100_CATALOG[0];

            return (
              <motion.div
                key={resume.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="glass rounded-2xl overflow-hidden border border-border/50 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-500">
                      {template.name}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      ATS {template.atsScore}%
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-bold text-foreground truncate">
                    {resume.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-muted/20 border-t border-border/40 flex items-center justify-between gap-2">
                  <Link
                    href={`/resume-builder/${resume.id}/edit`}
                    className="flex-1 py-1.5 px-3 rounded-xl gradient-bg text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-all"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit Resume
                  </Link>

                  <button
                    onClick={() => handleDuplicate(resume.id)}
                    disabled={actionLoadingId === resume.id}
                    className="p-2 rounded-xl border border-border/50 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                    title="Duplicate Resume"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(resume.id)}
                    disabled={actionLoadingId === resume.id}
                    className="p-2 rounded-xl border border-border/50 hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-500 transition-colors"
                    title="Delete Resume"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

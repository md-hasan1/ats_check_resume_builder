"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Link as LinkIcon, Plus, Globe, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { toast, showAlert } from "@/lib/sweetalert";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  company: string;
  sourceUrl?: string;
  content: string;
  createdAt: string;
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "Google",
    sourceUrl: "https://careers.google.com/jobs/123",
    content: "We are looking for a Senior Frontend Engineer proficient in React, TypeScript...",
    createdAt: "2026-07-31",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "Stripe",
    sourceUrl: "https://stripe.com/jobs/456",
    content: "Stripe is seeking a Full Stack Engineer to build developer payment experiences...",
    createdAt: "2026-07-28",
  },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [url, setUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");

  const handleImportUrl = async () => {
    if (!url) {
      toast.error("Please enter a job URL.");
      return;
    }
    setImporting(true);
    try {
      const res = await fetch("/api/jobs/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to import URL");
      } else {
        setContent(data.data.extractedText);
        toast.success("Imported job description from URL!");
      }
    } catch {
      toast.error("Failed to import URL");
    } finally {
      setImporting(false);
    }
  };

  const handleSaveJob = () => {
    if (!title || !content) {
      toast.error("Please provide job title and content.");
      return;
    }
    const newJob: Job = {
      id: String(Date.now()),
      title,
      company: company || "Unknown",
      sourceUrl: url || undefined,
      content,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setJobs([newJob, ...jobs]);
    setTitle("");
    setCompany("");
    setUrl("");
    setContent("");
    toast.success("Job description saved!");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl flex items-center gap-3">
          <Briefcase className="h-7 w-7 text-primary-500" />
          Job Description Manager
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Import job postings via URL or text and save them for instant ATS optimization.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Importer Form */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary-500" /> Import from Web URL
          </h2>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="url"
                placeholder="https://careers.company.com/job/123"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs transition-colors focus:border-primary-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleImportUrl}
              disabled={importing}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-semibold hover:bg-muted/50 transition-colors disabled:opacity-50"
            >
              {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />} Fetch
            </button>
          </div>

          <hr className="border-border/50" />

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Job Title *</label>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs transition-colors focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Company</label>
              <input
                type="text"
                placeholder="e.g. Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs transition-colors focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Job Content *</label>
              <textarea
                rows={5}
                placeholder="Job description text..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-3 text-xs transition-colors focus:border-primary-500 focus:outline-none resize-none"
              />
            </div>
            <button
              onClick={handleSaveJob}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl gradient-bg text-xs font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:scale-[1.01]"
            >
              <Plus className="h-4 w-4" /> Save Job Description
            </button>
          </div>
        </div>

        {/* Saved Jobs List */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold">Saved Job Descriptions ({jobs.length})</h2>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="rounded-xl border border-border/50 p-4 space-y-2 hover:border-border transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-xs">{job.title}</h3>
                    <p className="text-[11px] text-muted-foreground">{job.company}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{job.createdAt}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{job.content}</p>
                <div className="flex justify-end pt-1">
                  <Link
                    href={`/upload`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary-500 hover:text-primary-400"
                  >
                    Optimize Resume <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

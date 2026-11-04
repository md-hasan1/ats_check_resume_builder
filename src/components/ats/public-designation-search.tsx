"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight, Briefcase, Check, Layers, ChevronRight } from "lucide-react";
import {
  JOB_TEMPLATES,
  JOB_DEPARTMENTS,
  searchJobTemplates,
  JobTemplate,
} from "@/data/job-templates";

const POPULAR_DESIGNATIONS = [
  "Senior React Developer",
  "Full Stack Developer (Next.js & PostgreSQL)",
  "Senior Python Backend Engineer",
  "DevOps Engineer (AWS & Kubernetes)",
  "Data Scientist (Machine Learning)",
  "AI / LLM Engineer (RAG & LangChain)",
  "Technical Product Manager",
  "Cybersecurity SOC Analyst",
  "Senior Product Designer (UI/UX)",
  "Senior QA Automation Engineer (Playwright)",
];

export function PublicDesignationSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedRole, setSelectedRole] = useState<JobTemplate | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchJobTemplates(query, selectedDept, 8);
  }, [query, selectedDept]);

  const handleSelect = (template: JobTemplate) => {
    setSelectedRole(template);
    setQuery(template.title);
    setIsOpen(false);
  };

  const handleQuickPill = (title: string) => {
    const found = JOB_TEMPLATES.find((t) => t.title.toLowerCase().includes(title.toLowerCase()));
    if (found) {
      setSelectedRole(found);
      setQuery(found.title);
      setIsOpen(false);
    }
  };

  const handleGo = () => {
    if (selectedRole) {
      router.push(`/ats-checker?role=${encodeURIComponent(selectedRole.id)}`);
    } else if (query.trim()) {
      router.push(`/ats-checker?title=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/ats-checker");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Search Bar Container */}
      <div className="relative glass rounded-3xl p-3 sm:p-4 border border-border/80 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Type your designation (e.g. React Developer, DevOps, Data Scientist, Product Manager)..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
                if (selectedRole && selectedRole.title !== e.target.value) {
                  setSelectedRole(null);
                }
              }}
              onFocus={() => {
                if (query.trim()) setIsOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGo();
                }
              }}
              className="h-12 w-full rounded-2xl border-0 bg-background/80 pl-11 pr-4 text-sm font-medium transition-all focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>

          <button
            onClick={handleGo}
            className="h-12 px-6 rounded-2xl gradient-bg font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm whitespace-nowrap"
          >
            <span>Scan for Role</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-border bg-popover/98 backdrop-blur-md p-2 shadow-2xl space-y-1 animate-in fade-in">
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase text-muted-foreground tracking-wider flex items-center justify-between">
              <span>Matching Designations ({searchResults.length})</span>
              <span className="text-[10px] text-primary-500">Click to select role</span>
            </div>
            {searchResults.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleSelect(template)}
                className="w-full text-left rounded-xl p-2.5 hover:bg-muted/70 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary-500 transition-colors">
                      {template.title}
                    </span>
                    <span className="text-[10px] rounded-md bg-primary-500/10 text-primary-500 font-medium px-2 py-0.5">
                      {template.department}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Skills: {template.requiredSkills.slice(0, 4).join(", ")}
                  </p>
                </div>
                <div className="text-xs font-semibold text-primary-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Select</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Selected Role Card */}
        {selectedRole && (
          <div className="rounded-2xl border border-primary-500/30 bg-primary-500/5 p-3.5 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-foreground">
                  Target Designation: {selectedRole.title}
                </span>
                <span className="text-[10px] rounded-md bg-primary-500/20 text-primary-500 font-medium px-2 py-0.5">
                  {selectedRole.department} • {selectedRole.experienceLevel}
                </span>
              </div>
              <Link
                href={`/ats-checker?role=${encodeURIComponent(selectedRole.id)}`}
                className="text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1 hover:underline"
              >
                Direct Check <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-1.5 items-center pt-1">
              <span className="text-[11px] text-muted-foreground font-medium">ATS Target Keywords:</span>
              {selectedRole.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-[11px] rounded-md bg-background border border-border px-2 py-0.5 font-medium text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Popular Designations Quick Filter Pills */}
        <div className="pt-2 border-t border-border/40 space-y-2">
          <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary-500" />
            <span>Popular Designations:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_DESIGNATIONS.map((title) => (
              <button
                key={title}
                type="button"
                onClick={() => handleQuickPill(title)}
                className={`text-xs px-2.5 py-1 rounded-xl transition-all cursor-pointer font-medium ${
                  selectedRole?.title === title || query.includes(title)
                    ? "bg-primary-500 text-white shadow-xs"
                    : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                }`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 300+ Roles Directory Overview */}
      <div className="glass rounded-3xl p-6 border border-border/60 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-heading text-lg font-bold flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary-500" />
              300+ Pre-Configured Industry Designations
            </h3>
            <p className="text-xs text-muted-foreground">
              Select any role below to launch the ATS Resume Checker pre-configured with that designation&apos;s real-world requirements.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            {JOB_DEPARTMENTS.slice(0, 5).map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedDept === dept
                    ? "bg-primary-500 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Curated Grid of Featured Roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {searchJobTemplates("", selectedDept, 9).map((job) => (
            <Link
              key={job.id}
              href={`/ats-checker?role=${encodeURIComponent(job.id)}`}
              className="rounded-2xl border border-border/60 bg-muted/20 p-3.5 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all group flex flex-col justify-between space-y-2.5"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold text-primary-500 rounded bg-primary-500/10 px-1.5 py-0.5">
                    {job.department}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {job.experienceLevel}
                  </span>
                </div>
                <h4 className="font-semibold text-sm group-hover:text-primary-500 transition-colors line-clamp-1">
                  {job.title}
                </h4>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {job.requiredSkills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] rounded bg-background border border-border/50 px-1.5 py-0.5 text-muted-foreground font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 3 && (
                    <span className="text-[10px] text-muted-foreground">+{job.requiredSkills.length - 3}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-primary-500 group-hover:translate-x-0.5 transition-transform pt-1 border-t border-border/30">
                  <span>Check Resume</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/ats-checker"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary-500 hover:text-primary-600 hover:underline"
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Open ATS Checker to Browse All 300+ Designations &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Layout,
  Download,
  Eye,
  Sliders,
  X,
  Palette,
  Edit3,
  Loader2,
  Briefcase,
  ShieldCheck,
  RefreshCw,
  BarChart3,
  Sun,
  Moon,
} from "lucide-react";
import {
  TEMPLATES_100_CATALOG,
  type ResumeTemplateDefinition,
} from "@/config/templates";
import { ResumeRenderer } from "@/components/builder/resume-renderer";
import { DEFAULT_RESUME_DATA, DEFAULT_CUSTOMIZATION } from "@/lib/builder/default-data";
import { exportResumeToPDF } from "@/lib/pdf/export-resume-pdf";
import { exportResumeToDocx } from "@/lib/export/export-resume-docx";
import type { ResumeData, ResumeCustomization } from "@/types/resume-builder";
import { toast, showAlert } from "@/lib/sweetalert";

export default function AIResumeGeneratorPage() {
  const router = useRouter();

  // Step 1: Template, Step 2: Job Description & Source, Step 3: Review
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [downloading, setDownloading] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);

  // Form states
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateDefinition>(
    TEMPLATES_100_CATALOG[0]
  );
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");

  // Existing resumes state
  const [userResumes, setUserResumes] = useState<{ id: string; title: string }[]>([]);
  const [selectedSourceResumeId, setSelectedSourceResumeId] = useState<string>("");

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Result state
  const [generatedResumeId, setGeneratedResumeId] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState<ResumeData>(DEFAULT_RESUME_DATA);
  const [atsScore, setAtsScore] = useState<number>(85);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [customization, setCustomization] = useState<ResumeCustomization>(DEFAULT_CUSTOMIZATION);
  const [paperMode, setPaperMode] = useState<"white" | "dark">("white");

  // Modals
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [atsModalReport, setAtsModalReport] = useState<any>(null);
  const [atsLoading, setAtsLoading] = useState(false);

  // Fetch user resumes
  useEffect(() => {
    fetch("/api/resumes")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setUserResumes(json.data);
          setSelectedSourceResumeId(json.data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  // Multi-step generation trigger
  async function handleGenerate() {
    if (!jobDescription || jobDescription.trim().length < 30) {
      toast.error("Please paste a complete job description (at least 30 characters).");
      return;
    }

    try {
      setGenerating(true);
      setGenerationStep(1);

      // Visual progress sequence
      const stepTimer1 = setTimeout(() => setGenerationStep(2), 900);
      const stepTimer2 = setTimeout(() => setGenerationStep(3), 1800);

      const res = await fetch("/api/resumes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          jobDescription,
          sourceResumeId: selectedSourceResumeId || undefined,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || "Failed to generate tailored resume");
        setGenerating(false);
        return;
      }

      setGeneratedResumeId(json.data.resumeId);
      setGeneratedData(json.data.data);
      setAtsScore(json.data.atsScore);
      setMatchedSkills(json.data.matchedSkills || []);
      setMissingSkills(json.data.missingSkills || []);
      setTargetRole(json.data.targetRole);

      setGenerationStep(4);
      setTimeout(() => {
        setGenerating(false);
        setStep(3);
        toast.success("Tailored resume generated successfully!");
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error("Network error generating resume");
      setGenerating(false);
    }
  }

  // Run full ATS engine audit
  async function runFullAtsAudit() {
    if (!generatedResumeId) return;
    try {
      setAtsLoading(true);
      setShowAtsModal(true);
      const res = await fetch("/api/ats/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: generatedResumeId,
          jobDescription,
          jobTitle: targetRole || selectedTemplate.name,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAtsModalReport(json.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to run ATS audit");
    } finally {
      setAtsLoading(false);
    }
  }

  return (
    <div className="space-y-8 pb-20 print:p-0 print:m-0">
      {/* Top Breadcrumb & Stepper (Hidden in Print) */}
      <div className="flex items-center justify-between flex-wrap gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/resume-builder"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-black flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary-500" />
              AI Resume Generator
            </h1>
            <p className="text-xs text-muted-foreground">
              Turn any Job Description into a verified, ATS-conscious resume tailored to the role.
            </p>
          </div>
        </div>

        {/* Stepper Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <div
            onClick={() => !generating && setStep(1)}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
              step === 1
                ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            1. Template
          </div>
          <span className="text-muted-foreground">&rarr;</span>
          <div
            onClick={() => !generating && setStep(2)}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
              step === 2
                ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            2. Job Description
          </div>
          <span className="text-muted-foreground">&rarr;</span>
          <div
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              step === 3
                ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                : "bg-muted text-muted-foreground opacity-60"
            }`}
          >
            3. Review & PDF
          </div>
        </div>
      </div>

      {/* STEP 1: CHOOSE TEMPLATE */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="glass rounded-3xl p-6 sm:p-8 space-y-2 border border-border/50">
            <h2 className="font-heading text-xl font-bold">Step 1: Choose Your Resume Template</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Select any of our 100 professionally formatted templates. You can switch templates anytime later with zero data loss.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEMPLATES_100_CATALOG.slice(0, 16).map((template) => {
              const isSelected = selectedTemplate.id === template.id;
              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`glass rounded-2xl p-4 border cursor-pointer transition-all flex flex-col justify-between space-y-3 hover:shadow-lg ${
                    isSelected
                      ? "border-primary-500 ring-2 ring-primary-500/30 bg-primary-500/5"
                      : "border-border/50 hover:border-primary-500/40"
                  }`}
                >
                  <div className="h-40 rounded-xl bg-white text-zinc-800 p-3 flex flex-col justify-between overflow-hidden border border-zinc-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="h-2.5 w-16 rounded shadow-xs" style={{ backgroundColor: template.primaryColor }} />
                      <span className="text-[10px] font-bold text-emerald-600">
                        ATS {template.atsScore}%
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full bg-zinc-200 rounded" />
                      <div className="h-1.5 w-3/4 bg-zinc-200 rounded" />
                      <div className="h-1.5 w-1/2 bg-zinc-100 rounded" />
                    </div>
                    <div className="text-[9px] uppercase font-bold tracking-wider text-zinc-500">
                      {template.layout.replace(/-/g, " ")}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading text-xs font-bold truncate">{template.name}</h4>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-primary-500" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {template.description}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template);
                      setStep(2);
                    }}
                    className={`w-full py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? "gradient-bg text-white shadow-md shadow-primary-500/20"
                        : "border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isSelected ? "Selected ✓" : "Use This Template"}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-bg text-white text-xs font-semibold shadow-lg shadow-primary-500/25 hover:scale-105 transition-all"
            >
              Continue to Job Description
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: JOB DESCRIPTION & CANDIDATE SOURCE */}
      {step === 2 && !generating && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="glass rounded-3xl p-6 sm:p-8 space-y-3 border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-500">
                Selected Template: {selectedTemplate.name}
              </span>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-muted-foreground hover:text-foreground hover:underline"
              >
                Change Template
              </button>
            </div>
            <h2 className="font-heading text-2xl font-bold">Paste Full Job Description</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Paste the entire job posting below. Our AI analyzes the requirements, required skills, and terminology to tailor your verified background specifically for this role.
            </p>
          </div>

          {/* Job Description Textarea */}
          <div className="glass rounded-2xl p-6 border border-border/50 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Job Description
              </label>
              <button
                onClick={() =>
                  setJobDescription(
                    `We are seeking a Senior Full-Stack Engineer with strong experience in TypeScript, React, Next.js, Node.js, and PostgreSQL. You will design distributed microservices, collaborate with cross-functional product teams, build robust REST APIs, and optimize frontend web performance. Nice to have: Docker, AWS, Redis.`
                  )
                }
                className="text-xs text-primary-500 hover:underline font-medium"
              >
                Paste Sample JD
              </button>
            </div>

            <textarea
              rows={9}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here...

Example:
We are looking for a Senior Full Stack Engineer with experience in React, TypeScript, Node.js, and PostgreSQL..."
              className="w-full px-4 py-3 text-xs rounded-xl bg-background border border-border/60 focus:outline-none focus:ring-2 focus:ring-primary-500/30 leading-relaxed font-mono"
            />

            {/* Candidate Source Section */}
            <div className="pt-3 border-t border-border/40 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  Source Candidate Information:
                </label>
                <span className="text-[11px] text-muted-foreground">
                  Strict Non-Fabrication Rule Applied
                </span>
              </div>

              {userResumes.length > 0 ? (
                <div className="flex items-center gap-3">
                  <select
                    value={selectedSourceResumeId}
                    onChange={(e) => setSelectedSourceResumeId(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-background border border-border/60 focus:outline-none"
                  >
                    {userResumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        Use: {r.title}
                      </option>
                    ))}
                  </select>
                  <Link
                    href="/ats-checker"
                    className="text-xs px-3 py-2 rounded-xl border border-border/60 text-muted-foreground hover:bg-muted"
                  >
                    Upload Another
                  </Link>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-primary-500/5 border border-primary-500/20 text-xs text-muted-foreground flex items-center justify-between">
                  <span>Using your verified account profile as the candidate foundation.</span>
                  <Link href="/ats-checker" className="text-primary-500 font-semibold hover:underline">
                    Upload Resume PDF
                  </Link>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="p-3 rounded-xl bg-muted/40 text-[11px] text-muted-foreground flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Truthful Tailoring Guarantee:</strong> The AI will never fabricate fake companies, dates, degrees, or skills you do not possess.
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold px-4 py-2 rounded-xl border border-border/60 hover:bg-muted"
            >
              &larr; Back to Templates
            </button>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl gradient-bg text-white text-xs font-bold shadow-xl shadow-primary-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Generate My Tailored Resume
            </button>
          </div>
        </div>
      )}

      {/* GENERATION IN PROGRESS STATE */}
      {generating && (
        <div className="max-w-md mx-auto py-16 text-center space-y-6">
          <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>

          <div className="space-y-2">
            <h3 className="font-heading text-lg font-bold">Tailoring Your Resume...</h3>
            <p className="text-xs text-muted-foreground">
              Aligning your verified background with target role requirements
            </p>
          </div>

          <div className="glass rounded-2xl p-5 text-left text-xs space-y-3 border border-border/50">
            <div className="flex items-center gap-2.5">
              {generationStep >= 1 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-muted" />
              )}
              <span className={generationStep >= 1 ? "font-semibold text-foreground" : "text-muted-foreground"}>
                Analyzing Job Description requirements
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {generationStep >= 2 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-muted" />
              )}
              <span className={generationStep >= 2 ? "font-semibold text-foreground" : "text-muted-foreground"}>
                Matching verified candidate skills & experience
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {generationStep >= 3 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-muted" />
              )}
              <span className={generationStep >= 3 ? "font-semibold text-foreground" : "text-muted-foreground"}>
                Optimizing summary & bullet points with action verbs
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {generationStep >= 4 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-muted" />
              )}
              <span className={generationStep >= 4 ? "font-semibold text-foreground" : "text-muted-foreground"}>
                Rendering formatted ATS document
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & LIVE PREVIEW SCREEN */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-border/60 sticky top-4 z-40 print:hidden shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-foreground">
                Target Role: <strong className="text-primary-500">{targetRole || "Software Engineer"}</strong>
              </span>
              <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                Template: {selectedTemplate.name}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* White Mode / Dark Mode Toggle */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/50">
                <button
                  type="button"
                  onClick={() => setPaperMode("white")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    paperMode === "white"
                      ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-900/5"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="View Authentic White Paper Resume"
                >
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  White Paper
                </button>
                <button
                  type="button"
                  onClick={() => setPaperMode("dark")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    paperMode === "dark"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="View Dark Theme Resume"
                >
                  <Moon className="h-3.5 w-3.5 text-primary-400" />
                  Dark
                </button>
              </div>

              <button
                onClick={() => setShowTemplateModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/60 text-xs font-medium hover:bg-muted"
              >
                <Layout className="h-3.5 w-3.5 text-primary-500" />
                Change Template (100)
              </button>

              <button
                onClick={runFullAtsAudit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                ATS Compatibility: {atsScore}%
              </button>

              <Link
                href={`/resume-builder/${generatedResumeId}/edit`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/60 text-xs font-medium hover:bg-muted"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Full Editor
              </Link>

              <button
                onClick={async () => {
                  try {
                    setDownloadingDocx(true);
                    toast.info("Generating Word document (.docx)...");
                    const candidateName =
                      generatedData.personal.fullName?.trim() || "Resume";
                    const cleanName = candidateName.replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_");
                    await exportResumeToDocx({
                      data: generatedData,
                      filename: `${cleanName}_Resume.docx`,
                    });
                    toast.success("Word document (.docx) downloaded successfully!");
                  } catch (err) {
                    console.error("DOCX export error:", err);
                    toast.error("Failed to generate Word document");
                  } finally {
                    setDownloadingDocx(false);
                  }
                }}
                disabled={downloadingDocx || downloading}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-primary-500/40 bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-semibold shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                title="Download resume as Microsoft Word document (.docx)"
              >
                {downloadingDocx ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileText className="h-3.5 w-3.5" />
                )}
                {downloadingDocx ? "Downloading DOC..." : "Download DOC"}
              </button>

              <button
                onClick={async () => {
                  try {
                    setDownloading(true);
                    toast.info("Generating high-quality PDF document...");
                    const candidateName =
                      generatedData.personal.fullName?.trim() || "Resume";
                    const cleanName = candidateName.replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_");
                    await exportResumeToPDF({
                      elementId: "resume-preview-document",
                      filename: `${cleanName}_Resume.pdf`,
                    });
                    toast.success("PDF downloaded successfully!");
                  } catch (err) {
                    console.error("PDF export error:", err);
                    toast.info("Opening print dialog for PDF saving...");
                    window.print();
                  } finally {
                    setDownloading(false);
                  }
                }}
                disabled={downloading || downloadingDocx}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl gradient-bg text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                {downloading ? "Downloading PDF..." : "Download PDF"}
              </button>
            </div>
          </div>

          {/* Main Review Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Quick Insights & Summary Tweaks */}
            <div className="lg:col-span-5 space-y-6 print:hidden">
              {/* Matched & Missing Skills Insight Card */}
              <div className="glass rounded-2xl p-5 border border-border/50 space-y-4">
                <h3 className="font-heading text-sm font-bold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary-500" />
                  ATS Keywords & Requirements Analysis
                </h3>

                {/* Matched Skills */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified Skills Matched & Highlighted ({matchedSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.map((s, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                {missingSkills.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-border/40">
                    <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      JD Skills Not Present in Candidate Data ({missingSkills.length})
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      Excluded to preserve factual truthfulness.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingSkills.map((s, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Summary Editor */}
              <div className="glass rounded-2xl p-5 border border-border/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-sm font-bold">Tailored Summary</h3>
                  <span className="text-[10px] text-muted-foreground">Click to edit directly</span>
                </div>
                <textarea
                  rows={4}
                  value={generatedData.summary || ""}
                  onChange={(e) =>
                    setGeneratedData({ ...generatedData, summary: e.target.value })
                  }
                  className="w-full text-xs p-3 rounded-xl bg-background border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary-500 leading-relaxed"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-2 text-xs rounded-xl border border-border/60 font-semibold hover:bg-muted"
                >
                  Regenerate with Different JD
                </button>
                <Link
                  href={`/resume-builder/${generatedResumeId}/edit`}
                  className="flex-1 py-2 text-xs rounded-xl gradient-bg text-white font-semibold text-center"
                >
                  Open in Full Editor
                </Link>
              </div>
            </div>

            {/* Right Column: Live High-Resolution Resume Preview */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className={`w-full max-w-2xl rounded-sm shadow-xl print:max-w-none print:shadow-none print:border-none print:rounded-none ${paperMode === "white" ? "bg-white ring-1 ring-zinc-900/10 shadow-zinc-950/15" : "bg-card"}`}>
                <ResumeRenderer
                  data={generatedData}
                  templateId={selectedTemplate.id}
                  customization={customization}
                  paperMode={paperMode}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 100 Template Switcher Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 text-foreground border border-border/80 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border/50 shrink-0">
                <div>
                  <h3 className="font-heading text-lg font-bold">Switch Template</h3>
                  <p className="text-xs text-muted-foreground">
                    Switch to any of the 100 designs. All your tailored content is preserved!
                  </p>
                </div>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="h-8 w-8 rounded-full border border-border/50 flex items-center justify-center hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/10">
                {TEMPLATES_100_CATALOG.map((t) => {
                  const isCurrent = t.id === selectedTemplate.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTemplate(t);
                        setShowTemplateModal(false);
                        toast.success(`Switched to ${t.name}!`);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                        isCurrent
                          ? "border-primary-500 bg-primary-500/10 shadow-md ring-2 ring-primary-500/30"
                          : "border-border/60 hover:border-primary-500/50 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="h-3 w-3 rounded-full border"
                          style={{ backgroundColor: t.primaryColor }}
                        />
                        <span className="text-[10px] font-bold text-emerald-500">
                          ATS {t.atsScore}%
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold truncate text-foreground">{t.name}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">
                          {t.layout.replace(/-/g, " ")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detailed ATS Audit Modal */}
      <AnimatePresence>
        {showAtsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 text-foreground border border-border/80 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h3 className="font-heading text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  ATS Compatibility Audit Report
                </h3>
                <button
                  onClick={() => setShowAtsModal(false)}
                  className="h-7 w-7 rounded-full border border-border/50 flex items-center justify-center hover:bg-muted"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {atsLoading ? (
                <div className="py-8 text-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto" />
                  <p className="text-xs text-muted-foreground">Running full ATS scoring engine...</p>
                </div>
              ) : atsModalReport ? (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20 text-center space-y-1">
                    <span className="text-3xl font-black text-primary-500">
                      {atsModalReport.overallScore}/100
                    </span>
                    <p className="text-muted-foreground font-medium">ATS Compatibility Score</p>
                  </div>

                  {atsModalReport.breakdown && (
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-muted/40 border">
                        <span className="text-muted-foreground">Keyword Match (30%):</span>
                        <p className="font-bold text-sm">{atsModalReport.breakdown.keywordMatch}%</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-muted/40 border">
                        <span className="text-muted-foreground">Semantic Sim. (25%):</span>
                        <p className="font-bold text-sm">{atsModalReport.breakdown.semanticSimilarity}%</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-muted/40 border">
                        <span className="text-muted-foreground">Skill Coverage (20%):</span>
                        <p className="font-bold text-sm">{atsModalReport.breakdown.skillMatch}%</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-muted/40 border">
                        <span className="text-muted-foreground">Experience (15%):</span>
                        <p className="font-bold text-sm">{atsModalReport.breakdown.experienceMatch}%</p>
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    This score reflects keyword coverage, vector cosine similarity, and layout parseability against your target Job Description.
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  ATS Score: {atsScore}/100 based on keyword alignment.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

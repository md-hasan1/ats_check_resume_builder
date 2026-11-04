"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useUploadStore } from "@/stores/upload-store";
import { useAnalysisStore } from "@/stores/analysis-store";
import { toast } from "@/lib/sweetalert";
import {
  Upload,
  FileText,
  X,
  ArrowRight,
  Loader2,
  FileSearch,
  Sparkles,
  CheckCircle,
  Briefcase,
  Link as LinkIcon,
  HelpCircle,
  Layers,
  Plus,
  Trash2,
  Check,
  Building2,
  ChevronDown,
} from "lucide-react";
import { fileSize } from "@/lib/utils";
import { DesignationSelector } from "@/components/ats/designation-selector";
import {
  getJobTemplateById,
  getJobTemplateByTitle,
  getMultipleJobTemplatesForDesignation,
  JobTemplate,
} from "@/data/job-templates";

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/msword": [".doc"],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface CustomJobPosting {
  id: string;
  title: string;
  company: string;
  description: string;
}

function ATSCheckerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    file,
    setFile,
    resumeId,
    setResumeId,
    jobDescription,
    setJobDescription,
    jobTitle,
    setJobTitle,
    jobUrl,
    setJobUrl,
    isUploading,
    setIsUploading,
    reset,
  } = useUploadStore();

  const { setIsAnalyzing, setCurrentStep, setProgress } = useAnalysisStore();
  const [isAnalyzing, setLocalAnalyzing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(Boolean(file && resumeId));

  // Multi-Job Modes: "benchmark" (default, 5 industry jobs), "custom_multi", "single"
  const [analysisMode, setAnalysisMode] = useState<"benchmark" | "custom_multi" | "single">("benchmark");

  // Multi-job benchmark postings list (default 5 templates)
  const [benchmarkJobs, setBenchmarkJobs] = useState<JobTemplate[]>(() =>
    getMultipleJobTemplatesForDesignation(jobTitle || "Full Stack Developer", 5)
  );
  const [previewJobId, setPreviewJobId] = useState<string | null>(null);

  // Custom multi-job list for user-entered postings
  const [customJobs, setCustomJobs] = useState<CustomJobPosting[]>([
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "Google",
      description: "",
    },
    {
      id: "2",
      title: "Full Stack Engineer",
      company: "Stripe",
      description: "",
    },
  ]);

  // Load benchmark roles helper
  const updateBenchmarkRoles = useCallback((targetTitle: string) => {
    const list = getMultipleJobTemplatesForDesignation(targetTitle, 5);
    setBenchmarkJobs(list);
    if (list.length > 0) {
      setPreviewJobId(list[0].id);
      setJobDescription(list[0].description);
    }
  }, [setJobDescription]);

  // Auto-populate from URL query params (e.g. ?role=senior-react-developer or ?title=React)
  useEffect(() => {
    const roleParam = searchParams.get("role");
    const titleParam = searchParams.get("title");

    if (roleParam) {
      const template = getJobTemplateById(roleParam);
      if (template) {
        setJobTitle(template.title);
        updateBenchmarkRoles(template.title);
        toast.success(`Loaded 5 industry benchmark jobs for "${template.title}"!`);
      }
    } else if (titleParam) {
      const template = getJobTemplateByTitle(titleParam);
      if (template) {
        setJobTitle(template.title);
        updateBenchmarkRoles(template.title);
        toast.success(`Loaded 5 industry benchmark jobs for "${template.title}"!`);
      }
    } else if (!jobTitle) {
      setJobTitle("Full Stack Developer");
      updateBenchmarkRoles("Full Stack Developer");
    }
  }, [searchParams, jobTitle, setJobTitle, updateBenchmarkRoles]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;

      setFile(selectedFile);
      setUploadComplete(false);
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!data.success) {
          toast.error(data.error || "Upload failed");
          setFile(null);
          return;
        }

        setResumeId(data.data.resumeId);
        setUploadComplete(true);
        toast.success("Resume uploaded successfully!");
      } catch {
        toast.error("Failed to upload file. Please try again.");
        setFile(null);
      } finally {
        setIsUploading(false);
      }
    },
    [setFile, setResumeId, setIsUploading]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0];
      if (error?.code === "file-too-large") {
        toast.error("File is too large. Max size is 10MB.");
      } else if (error?.code === "file-invalid-type") {
        toast.error("Only PDF, DOCX, and DOC files are accepted.");
      }
    },
  });

  const handleRemoveFile = () => {
    setFile(null);
    setResumeId(null);
    setUploadComplete(false);
  };

  // Custom Job Posting handlers
  const handleAddCustomJob = () => {
    if (customJobs.length >= 8) {
      toast.error("You can compare up to 8 job postings at a time.");
      return;
    }
    const newIdx = customJobs.length + 1;
    setCustomJobs([
      ...customJobs,
      {
        id: String(Date.now()),
        title: `Target Role #${newIdx}`,
        company: `Company #${newIdx}`,
        description: "",
      },
    ]);
  };

  const handleRemoveCustomJob = (id: string) => {
    if (customJobs.length <= 1) {
      toast.error("At least one job description is required.");
      return;
    }
    setCustomJobs(customJobs.filter((j) => j.id !== id));
  };

  const handleUpdateCustomJob = (id: string, field: keyof CustomJobPosting, value: string) => {
    setCustomJobs(customJobs.map((j) => (j.id === id ? { ...j, [field]: value } : j)));
  };

  // Execute ATS Analysis
  const handleAnalyze = async () => {
    if (!resumeId) {
      toast.error("Please upload a resume first.");
      return;
    }

    let payload: Record<string, any> = { resumeId };

    if (analysisMode === "benchmark") {
      const jobsToSend = benchmarkJobs.length > 0
        ? benchmarkJobs
        : getMultipleJobTemplatesForDesignation(jobTitle || "Software Engineer", 5);

      payload.jobTitle = jobTitle || jobsToSend[0].title;
      payload.jobDescriptions = jobsToSend.map((j, idx) => ({
        id: j.id,
        title: j.title,
        company: `Industry Standard #${idx + 1}`,
        description: j.description,
        experienceLevel: j.experienceLevel,
      }));
      payload.multiJobBenchmark = true;
    } else if (analysisMode === "custom_multi") {
      const validCustom = customJobs.filter((j) => j.description.trim().length >= 40);
      if (validCustom.length === 0) {
        toast.error("Please provide at least one job description (min 40 characters).");
        return;
      }
      payload.jobTitle = jobTitle || validCustom[0].title || "Multiple Target Jobs";
      payload.jobDescriptions = validCustom;
    } else {
      if (!jobDescription || jobDescription.trim().length < 50) {
        toast.error("Job description must be at least 50 characters for accurate matching.");
        return;
      }
      payload.jobTitle = jobTitle || "Target Role";
      payload.jobDescription = jobDescription;
      payload.jobUrl = jobUrl || undefined;
    }

    setLocalAnalyzing(true);
    setIsAnalyzing(true);
    const targetCount = payload.jobDescriptions ? payload.jobDescriptions.length : 1;
    setCurrentStep(`Benchmarking resume across ${targetCount} job descriptions in parallel...`);
    setProgress(15);

    try {
      let progressVal = 15;
      const progressInterval = setInterval(() => {
        progressVal = Math.min(progressVal + 8, 92);
        setProgress(progressVal);
      }, 1000);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearInterval(progressInterval);
      const data = await response.json();

      if (!data.success) {
        toast.error(data.error || "ATS Analysis failed");
        setIsAnalyzing(false);
        return;
      }

      setProgress(100);
      setCurrentStep("Analysis complete!");
      const jobsCount = data.data.totalJobsAnalyzed || 1;
      toast.success(
        `Analysis complete across ${jobsCount} job postings! Market Score: ${data.data.overallScore || 0}/100`
      );

      // Reset form store and navigate to results
      reset();
      router.push(`/ats-checker/${data.data.reportId}`);
    } catch {
      toast.error("Analysis failed. Please try again.");
      setIsAnalyzing(false);
    } finally {
      setLocalAnalyzing(false);
    }
  };

  const isFormReady = Boolean(
    resumeId &&
      uploadComplete &&
      !isAnalyzing &&
      (analysisMode === "benchmark"
        ? benchmarkJobs.length > 0
        : analysisMode === "custom_multi"
        ? customJobs.some((j) => j.description.trim().length >= 40)
        : jobDescription.trim().length >= 50)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-5xl space-y-8"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary-500 bg-primary-500/10 px-2.5 py-0.5 rounded-full">
            <Layers className="h-3 w-3" /> Multi-Job Market Benchmarking
          </span>
        </div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl flex items-center gap-3">
          <FileSearch className="h-7 w-7 text-primary-500" />
          ATS Resume Checker
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Check your resume against <strong>multiple job descriptions</strong> simultaneously to measure true market fit, consensus keywords, and eliminate single-job bias.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column — File Upload & Metadata (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-heading text-base font-semibold mb-3 flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary-500" />
              1. Upload Your Resume
            </h2>

            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    {...getRootProps()}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                      isDragActive
                        ? "border-primary-500 bg-primary-500/5"
                        : "border-border/50 hover:border-primary-500/50 hover:bg-muted/20"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 mb-3">
                      <Upload className="h-6 w-6 text-primary-500" />
                    </div>
                    {isDragActive ? (
                      <p className="font-medium text-sm text-primary-500">
                        Drop resume here...
                      </p>
                    ) : (
                      <>
                        <p className="font-semibold text-sm">
                          Drag &amp; Drop Resume Here
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          or click to browse files
                        </p>
                      </>
                    )}
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      PDF, DOCX, DOC • Max 10MB
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="file-preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl border border-border/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10">
                        <FileText className="h-5 w-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate max-w-[180px]">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {fileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isUploading && (
                        <div className="flex items-center gap-1.5 text-xs text-primary-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Uploading...</span>
                        </div>
                      )}
                      {uploadComplete && (
                        <div className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
                          <CheckCircle className="h-4 w-4" />
                          <span>Ready</span>
                        </div>
                      )}
                      <button
                        onClick={handleRemoveFile}
                        className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                        title="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mode Highlights Card */}
          <div className="glass rounded-2xl p-5 space-y-3 border border-border/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary-500" />
              Why Multi-Job Benchmarking?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Evaluating against only 1 job is prone to company-specific bias. Our engine tests your resume across <strong>multiple diverse postings</strong> to extract true market consensus keywords and average readiness.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="rounded-lg bg-background/50 border border-border/50 p-2 text-center">
                <span className="block font-bold text-foreground">5x More Accurate</span>
                <span className="text-[10px] text-muted-foreground">Cross-industry validation</span>
              </div>
              <div className="rounded-lg bg-background/50 border border-border/50 p-2 text-center">
                <span className="block font-bold text-foreground">Consensus Skills</span>
                <span className="text-[10px] text-muted-foreground">Ranked by frequency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Multi-Job Configuration (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          <div className="glass rounded-2xl p-6 flex flex-col h-full justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-base font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary-500" />
                  2. Target Jobs &amp; Designation
                </h2>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/40 text-xs">
                <button
                  type="button"
                  onClick={() => setAnalysisMode("benchmark")}
                  className={`py-2 px-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    analysisMode === "benchmark"
                      ? "bg-background text-foreground shadow-xs border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5 text-primary-500" />
                  <span className="truncate">Market Benchmark (5 Jobs)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAnalysisMode("custom_multi")}
                  className={`py-2 px-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    analysisMode === "custom_multi"
                      ? "bg-background text-foreground shadow-xs border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Plus className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="truncate">Custom Multi-Job</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAnalysisMode("single")}
                  className={`py-2 px-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    analysisMode === "single"
                      ? "bg-background text-foreground shadow-xs border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 text-blue-500" />
                  <span className="truncate">Single Job Posting</span>
                </button>
              </div>

              {/* MODE 1: Automated Market Benchmark (5 Diverse Industry Jobs) */}
              {analysisMode === "benchmark" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="space-y-2">
                    <DesignationSelector
                      selectedTitle={jobTitle}
                      onSelect={(template) => {
                        setJobTitle(template.title);
                        updateBenchmarkRoles(template.title);
                        toast.success(`Benchmarking 5 job postings for "${template.title}"!`);
                      }}
                    />
                  </div>

                  {/* Benchmark Jobs Display Card */}
                  <div className="rounded-2xl border border-primary-500/30 bg-primary-500/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-foreground">
                          Benchmarking Against {benchmarkJobs.length} Industry Job Descriptions
                        </span>
                      </div>
                      <span className="text-[10px] bg-primary-500/20 text-primary-500 font-semibold px-2 py-0.5 rounded-md">
                        {benchmarkJobs.length} Postings Aggregated
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Our engine will concurrently test your resume against each of the following postings to compute your market consensus score:
                    </p>

                    {/* Job Postings Pills List */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {benchmarkJobs.map((job, idx) => (
                        <div
                          key={job.id}
                          onClick={() => setPreviewJobId(previewJobId === job.id ? null : job.id)}
                          className={`rounded-xl border p-2.5 transition-all cursor-pointer text-xs flex flex-col gap-1 ${
                            previewJobId === job.id
                              ? "border-primary-500/60 bg-background shadow-xs"
                              : "border-border/60 bg-background/50 hover:border-border hover:bg-background/80"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                {idx + 1}
                              </span>
                              <span className="font-semibold text-foreground">
                                {job.title}
                              </span>
                              <span className="text-[10px] text-primary-500 bg-primary-500/10 px-1.5 py-0.5 rounded">
                                {job.experienceLevel}
                              </span>
                            </div>
                            <ChevronDown
                              className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                                previewJobId === job.id ? "rotate-180" : ""
                              }`}
                            />
                          </div>

                          {previewJobId === job.id && (
                            <div className="mt-2 pt-2 border-t border-border/40 space-y-1.5 animate-in fade-in">
                              <div className="flex flex-wrap gap-1">
                                <span className="text-[10px] text-muted-foreground font-medium mr-1">Skills:</span>
                                {job.requiredSkills.map((s) => (
                                  <span key={s} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground">
                                    {s}
                                  </span>
                                ))}
                              </div>
                              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                                {job.description.replace(/###/g, "").slice(0, 150)}...
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: Custom Multiple Job Descriptions */}
              {analysisMode === "custom_multi" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Paste 2 or more job descriptions from different companies to check market compatibility.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddCustomJob}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary-500 hover:text-primary-600 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Job Posting
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {customJobs.map((job, idx) => (
                      <div
                        key={job.id}
                        className="rounded-2xl border border-border/80 bg-background/50 p-3.5 space-y-2.5 shadow-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="h-5 w-5 rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              placeholder="Job Title (e.g. Senior Backend Engineer)"
                              value={job.title}
                              onChange={(e) => handleUpdateCustomJob(job.id, "title", e.target.value)}
                              className="h-8 flex-1 rounded-lg border border-border bg-background px-2.5 text-xs font-medium focus:border-primary-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Company (e.g. Google)"
                              value={job.company}
                              onChange={(e) => handleUpdateCustomJob(job.id, "company", e.target.value)}
                              className="h-8 w-28 sm:w-36 rounded-lg border border-border bg-background px-2.5 text-xs font-medium focus:border-primary-500 focus:outline-none"
                            />
                          </div>

                          {customJobs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomJob(job.id)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 cursor-pointer"
                              title="Remove job"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        <textarea
                          rows={3}
                          placeholder={`Paste Job #${idx + 1} description (requirements, skills, responsibilities)...`}
                          value={job.description}
                          onChange={(e) => handleUpdateCustomJob(job.id, "description", e.target.value)}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs leading-relaxed focus:border-primary-500 focus:outline-none resize-none font-sans"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODE 3: Single Job Description (Classic) */}
              {analysisMode === "single" && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Full Job Description
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {jobDescription.length} characters (min 50)
                      </span>
                    </div>

                    <textarea
                      placeholder="Paste the target job description here (requirements, qualifications, responsibilities)..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      rows={10}
                      className="w-full rounded-xl border border-border bg-background p-4 text-sm leading-relaxed transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none font-sans"
                    />

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <HelpCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>Single posting analysis. For market consensus, switch to Multi-Job Benchmark above.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-border/40">
              <button
                onClick={handleAnalyze}
                disabled={!isFormReady}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl font-semibold text-white shadow-lg transition-all ${
                  isFormReady
                    ? "gradient-bg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing ATS Compatibility...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>
                      {analysisMode === "benchmark"
                        ? `Analyze Resume Against ${benchmarkJobs.length} Industry Job Descriptions`
                        : analysisMode === "custom_multi"
                        ? `Analyze Resume Against ${customJobs.length} Job Postings`
                        : "Analyze Resume (Single Job)"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ATSCheckerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          <p className="text-sm text-muted-foreground">Loading ATS Checker...</p>
        </div>
      }
    >
      <ATSCheckerContent />
    </Suspense>
  );
}

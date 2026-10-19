"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useUploadStore } from "@/stores/upload-store";
import { useAnalysisStore } from "@/stores/analysis-store";
import { toast, showAlert } from "@/lib/sweetalert";
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
} from "lucide-react";
import { fileSize } from "@/lib/utils";

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/msword": [".doc"],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ATSCheckerPage() {
  const router = useRouter();
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

  const handleAnalyze = async () => {
    if (!resumeId || !jobDescription) {
      toast.error("Please upload a resume and paste a job description.");
      return;
    }

    if (jobDescription.trim().length < 50) {
      toast.error("Job description must be at least 50 characters for accurate matching.");
      return;
    }

    setLocalAnalyzing(true);
    setIsAnalyzing(true);
    setCurrentStep("Analyzing your resume against ATS algorithms...");
    setProgress(15);

    try {
      let progressVal = 15;
      const progressInterval = setInterval(() => {
        progressVal = Math.min(progressVal + 6, 92);
        setProgress(progressVal);
      }, 1500);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId,
          jobDescription,
          jobTitle: jobTitle || undefined,
          jobUrl: jobUrl || undefined,
        }),
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
      toast.success(`Analysis complete! Score: ${data.data.overallScore || 0}/100`);

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

  const canAnalyze =
    resumeId && uploadComplete && jobDescription.trim().length >= 50 && !isAnalyzing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl flex items-center gap-3">
          <FileSearch className="h-7 w-7 text-primary-500" />
          ATS Resume Checker
        </h1>
        <p className="mt-1 text-muted-foreground">
          Upload your resume and paste the target job description to get an in-depth ATS compatibility scan.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column — File Upload */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
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
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all ${
                      isDragActive
                        ? "border-primary-500 bg-primary-500/5"
                        : "border-border/50 hover:border-primary-500/50 hover:bg-muted/20"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10 mb-4">
                      <Upload className="h-7 w-7 text-primary-500" />
                    </div>
                    {isDragActive ? (
                      <p className="font-medium text-primary-500">
                        Drop your resume here...
                      </p>
                    ) : (
                      <>
                        <p className="font-medium">
                          Drag &amp; Drop Resume Here
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          or click to browse files
                        </p>
                      </>
                    )}
                    <p className="mt-3 text-xs text-muted-foreground">
                      Supported: PDF, DOCX, DOC • Max 10MB
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
                        <p className="font-medium text-sm truncate max-w-[200px]">
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
                        className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
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

          {/* Optional Job Metadata */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-heading text-sm font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Target Role Details (Optional)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Job Title / Target Company
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer at Acme Inc."
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Job Posting URL
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Job Description */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary-500" />
                  2. Job Description
                </h2>
                <span className="text-xs text-muted-foreground">
                  {jobDescription.length} characters (min 50)
                </span>
              </div>

              <textarea
                placeholder="Paste the complete job description here (requirements, qualifications, responsibilities, required technologies)..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={12}
                className="w-full rounded-xl border border-border bg-background p-4 text-sm leading-relaxed transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none font-sans"
              />

              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <HelpCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>The more detailed the job description, the more accurate the keyword &amp; skill matching.</span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="mt-6 pt-4 border-t border-border/40">
              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl font-semibold text-white shadow-lg transition-all ${
                  canAnalyze
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
                    <span>Analyze Resume</span>
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

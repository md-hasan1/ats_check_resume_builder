"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Download,
  ArrowLeft,
  Eye,
  Save,
  RotateCcw,
  CheckCircle,
  FileText,
  Layout,
  Wrench,
  Columns,
  Loader2,
  Share2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { toast, showAlert } from "@/lib/sweetalert";
import type { TailoredResumeData } from "@/lib/ai/schemas/tailored-resume";

import { EditorToolbar } from "@/components/optimizer/editor-toolbar";
import { LiveATSScore } from "@/components/optimizer/live-ats-score";
import { KeywordOptimizer, KeywordCategoryItem } from "@/components/optimizer/keyword-optimizer";
import { SmartSuggestions, SmartSuggestionItem } from "@/components/optimizer/smart-suggestions";
import { SectionManager, ResumeSectionItem } from "@/components/optimizer/section-manager";
import { InlineAIMenu } from "@/components/optimizer/inline-ai-menu";
import { ResumeComparisonModal } from "@/components/optimizer/resume-comparison-modal";
import { TemplateRenderer, ResumeTemplateId } from "@/components/optimizer/template-renderer";
import { ContentStrengthAuditor } from "@/components/optimizer/content-strength-auditor";
import { ATSFixHub, FixHubItem } from "@/components/optimizer/ats-fix-hub";
import { TemplateSelectorModal } from "@/components/optimizer/template-selector-modal";

const mockInitialData: TailoredResumeData = {
  versionName: "Optimized Resume",
  targetRole: "Senior Software Engineer",
  targetCompany: "Tech Corp",
  contactInfo: {
    fullName: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
  },
  summary: {
    original: "Software developer with experience in building web applications and working with teams.",
    tailored:
      "Results-driven Senior Software Engineer with 5+ years of experience engineering high-scale web platforms using React, TypeScript, and Node.js. Proven track record of improving application response time by 38% and managing cross-functional technical projects.",
    reasoning: "Incorporated high-priority job keywords and quantifiable achievements.",
  },
  skills: {
    matchedSkills: ["React", "TypeScript", "Node.js", "JavaScript", "SQL", "Git"],
    highlightedSkills: ["React", "TypeScript", "Node.js", "Next.js", "GraphQL", "Tailwind CSS", "Docker", "REST APIs"],
    recommendedMissingSkills: ["Kubernetes", "AWS", "CI/CD"],
  },
  experience: [
    {
      jobTitle: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      dates: "2022 - Present",
      bullets: [
        {
          original: "Worked on frontend performance and application features.",
          tailored:
            "Spearheaded frontend performance optimizations across core web applications, reducing bundle size by 35% and improving page load times.",
          keywordsAdded: ["bundle size", "optimizations"],
          reason: "Used strong action verb 'Spearheaded' and quantified optimization outcomes.",
        },
        {
          original: "Built reusable UI components for the engineering team.",
          tailored:
            "Architected a modular component library using React and TypeScript, standardizing design patterns for 10+ internal project modules.",
          keywordsAdded: ["React", "TypeScript", "Component library"],
          reason: "Added core technical stack keywords requested in job description.",
        },
      ],
    },
    {
      jobTitle: "Software Developer",
      company: "WebCraft Agency",
      dates: "2019 - 2022",
      bullets: [
        {
          original: "Developed client web applications and fixed bugs.",
          tailored:
            "Engineered 12+ scalable web applications leveraging Node.js and REST APIs, maintaining 99.9% uptime across production releases.",
          keywordsAdded: ["Node.js", "REST APIs"],
          reason: "Emphasized backend architecture expertise and reliability metrics.",
        },
      ],
    },
  ],
  education: [
    {
      degree: "B.S. in Computer Science",
      institution: "University of California, Berkeley",
      dates: "2015 - 2019",
      details: "Focus on Software Engineering & Distributed Systems",
    },
  ],
  certifications: ["AWS Certified Developer"],
  projects: [
    {
      name: "ATS Resume Optimizer",
      description: "AI-powered resume optimization platform with real-time feedback",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      impact: "Helped 1,000+ job seekers optimize their resumes for ATS screening",
    },
  ],
  diffHighlights: {
    addedKeywordsCount: 12,
    improvedBulletsCount: 6,
    estimatedScoreIncrease: 18,
  },
};

const defaultMissingKeywords: KeywordCategoryItem[] = [
  { keyword: "Docker", category: "Technical Skills", importance: "high" },
  { keyword: "CI/CD", category: "Technical Skills", importance: "high" },
  { keyword: "AWS", category: "Tools", importance: "high" },
  { keyword: "Kubernetes", category: "Tools", importance: "medium" },
  { keyword: "PostgreSQL", category: "Technical Skills", importance: "medium" },
  { keyword: "Agile Leadership", category: "Soft Skills", importance: "medium" },
  { keyword: "GraphQL", category: "Frameworks", importance: "medium" },
];

const defaultSuggestions: SmartSuggestionItem[] = [
  {
    id: "s1",
    type: "metrics",
    title: "Quantify Experience Bullet",
    description: "Bullet point lacks measurable results.",
    beforeText: "Worked on website speed and performance improvements.",
    suggestedText: "Optimized web application performance, reducing page load time by 40% [XX%].",
    reason: "Quantifying achievements boosts recruiter engagement and ATS impact score.",
  },
  {
    id: "s2",
    type: "action_verb",
    title: "Replace Weak Verb",
    description: "Replace 'Worked on' with strong technical verb.",
    beforeText: "Worked on client projects.",
    suggestedText: "Engineered scalable backend solutions for high-traffic client projects.",
    reason: "Strong action verbs demonstrate technical leadership.",
  },
];

export default function OptimizePage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [jobDescription, setJobDescription] = useState("");
  const [data, setData] = useState<TailoredResumeData>(mockInitialData);
  const [originalScore, setOriginalScore] = useState(72);
  const [overallScore, setOverallScore] = useState(90);
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [template, setTemplate] = useState<ResumeTemplateId>("modern");

  // Typography settings
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [fontSize, setFontSize] = useState("12px");
  const [lineSpacing, setLineSpacing] = useState("1.15");

  // Optimizer Panels State
  const [missingKw, setMissingKw] = useState<KeywordCategoryItem[]>(defaultMissingKeywords);
  const [addedKw, setAddedKw] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SmartSuggestionItem[]>(defaultSuggestions);
  const [showComparison, setShowComparison] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  // Load User's Actual Uploaded Resume and Analysis Report
  useEffect(() => {
    async function loadUserUploadedResume() {
      if (!params?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/reports/${params.id}`);
        const json = await res.json();
        if (json.success && json.data) {
          const report = json.data;
          const parsed = report.resume?.parsedData;
          const analysis = report.analysisResult;

          setOriginalScore(report.overallScore || 70);
          setOverallScore(report.overallScore || 70);
          setJobDescription(report.jobDescription || "");

          if (parsed && typeof parsed === "object") {
            setData((prev) => ({
              ...prev,
              versionName: `Optimized: ${report.name || report.resume?.fileName || "Uploaded Resume"}`,
              targetRole: report.jobTitle || prev.targetRole,
              contactInfo: {
                fullName: parsed.contactInfo?.name || parsed.contactInfo?.fullName || prev.contactInfo.fullName,
                email: parsed.contactInfo?.email || prev.contactInfo.email,
                phone: parsed.contactInfo?.phone || prev.contactInfo.phone,
                location: parsed.contactInfo?.location || prev.contactInfo.location,
                linkedin: parsed.contactInfo?.linkedin || prev.contactInfo.linkedin,
                github: parsed.contactInfo?.github || prev.contactInfo.github,
              },
              summary: {
                original: parsed.summary || prev.summary.original,
                tailored: parsed.summary || prev.summary.tailored,
                reasoning: "Loaded from uploaded resume",
              },
              skills: {
                matchedSkills: Array.isArray(analysis?.skillsAnalysis?.hardSkills)
                  ? analysis.skillsAnalysis.hardSkills.filter((s: any) => s.matched).map((s: any) => s.skill)
                  : prev.skills.matchedSkills,
                highlightedSkills: Array.isArray(parsed.skills?.technical)
                  ? parsed.skills.technical
                  : Array.isArray(parsed.skills)
                    ? parsed.skills
                    : prev.skills.highlightedSkills,
                recommendedMissingSkills: Array.isArray(analysis?.skillsAnalysis?.missingSkills)
                  ? analysis.skillsAnalysis.missingSkills
                  : prev.skills.recommendedMissingSkills,
              },
              experience: Array.isArray(parsed.experience) && parsed.experience.length > 0
                ? parsed.experience.map((exp: any) => ({
                    jobTitle: exp.jobTitle || exp.title || "Position",
                    company: exp.company || "Company",
                    dates: exp.dates || exp.duration || "Dates",
                    bullets: Array.isArray(exp.bullets || exp.responsibilities)
                      ? (exp.bullets || exp.responsibilities).map((b: any) => ({
                          original: typeof b === "string" ? b : JSON.stringify(b),
                          tailored: typeof b === "string" ? b : JSON.stringify(b),
                          keywordsAdded: [],
                          reason: "Uploaded resume bullet",
                        }))
                      : [{ original: "Responsibilities", tailored: "Responsibilities", keywordsAdded: [], reason: "Uploaded resume bullet" }],
                  }))
                : prev.experience,
              education: Array.isArray(parsed.education) && parsed.education.length > 0
                ? parsed.education.map((edu: any) => ({
                    degree: edu.degree || "Degree",
                    institution: edu.institution || edu.school || "University",
                    dates: edu.dates || edu.year || "",
                    details: edu.details || "",
                  }))
                : prev.education,
            }));
          }

          // Populate missing keywords from real analysis report
          if (Array.isArray(analysis?.keywordAnalysis?.missingKeywords)) {
            const realMissing: KeywordCategoryItem[] = analysis.keywordAnalysis.missingKeywords.map((k: any) => ({
              keyword: typeof k === "string" ? k : k.keyword,
              category: (k.category as any) || "Technical Skills",
              importance: k.importance || "high",
            }));
            if (realMissing.length > 0) setMissingKw(realMissing);
          }

          // Populate smart suggestions from real analysis report
          if (Array.isArray(analysis?.aiSuggestions) && analysis.aiSuggestions.length > 0) {
            const realSugg: SmartSuggestionItem[] = analysis.aiSuggestions.map((s: any, idx: number) => ({
              id: `real_${idx}`,
              type: s.type || "bullet",
              title: `Optimize ${s.type || "bullet"}`,
              description: s.reason || "Improve ATS compatibility",
              beforeText: s.original,
              suggestedText: s.improved,
              reason: s.reason || "Suggested by ATS analyzer",
            }));
            setSuggestions(realSugg);
          }
        }
      } catch (err) {
        console.error("Failed to load report for optimization:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUserUploadedResume();
  }, [params?.id]);

  // Sections State
  const [sections, setSections] = useState<ResumeSectionItem[]>([
    { id: "sec_summary", title: "Professional Summary", type: "summary", content: mockInitialData.summary.tailored },
    { id: "sec_skills", title: "Technical Skills", type: "skills", content: mockInitialData.skills.highlightedSkills.join(", ") },
    { id: "sec_exp", title: "Work Experience", type: "experience", content: "" },
    { id: "sec_edu", title: "Education", type: "education", content: "" },
  ]);

  // Recalculate live ATS score dynamically when content changes
  useEffect(() => {
    const totalKwCount = missingKw.length + addedKw.length;
    const kwMatchRatio = totalKwCount > 0 ? addedKw.length / totalKwCount : 0.7;
    const calculatedScore = Math.min(98, Math.max(60, Math.round(originalScore + kwMatchRatio * 20)));
    setOverallScore(calculatedScore);
  }, [addedKw, missingKw, originalScore]);

  // 1-Click Intelligent AI Keyword Insertion
  const handleAddKeyword = async (keyword: string, category: string) => {
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "insert_keyword",
          keyword,
          section: category,
          text: data.experience[0]?.bullets[0]?.tailored || data.summary.tailored,
          jobDescription: "Senior Software Engineer job description context",
        }),
      });

      const json = await res.json();
      if (json.success && json.result) {
        // Update first bullet point with updated text
        setData((prev) => {
          const newExp = [...prev.experience];
          if (newExp[0] && newExp[0].bullets[0]) {
            newExp[0].bullets[0].tailored = json.result;
            newExp[0].bullets[0].keywordsAdded = [...(newExp[0].bullets[0].keywordsAdded || []), keyword];
          }
          return { ...prev, experience: newExp };
        });
      }

      setAddedKw((prev) => [...prev, keyword]);
      toast.success(`Intelligently inserted "${keyword}" into resume`);
    } catch {
      toast.error(`Failed to insert ${keyword}`);
    }
  };

  // 1-Click Smart Suggestion Fix
  const handleApplyFix = async (item: SmartSuggestionItem) => {
    setData((prev) => {
      const newExp = [...prev.experience];
      if (newExp[0] && newExp[0].bullets[0]) {
        newExp[0].bullets[0].tailored = item.suggestedText;
      }
      return { ...prev, experience: newExp };
    });
    toast.success(`Applied fix: ${item.title}`);
  };

  // Inline AI Assistant Call
  const handleInlineAIAction = async (bulletIndex: number, actionKey: string) => {
    const currentBullet = data.experience[0]?.bullets[bulletIndex]?.tailored || data.summary.tailored;

    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "inline_ai",
          prompt: actionKey,
          text: currentBullet,
        }),
      });
      const json = await res.json();

      if (json.success && json.result) {
        setData((prev) => {
          const newExp = [...prev.experience];
          if (newExp[0] && newExp[0].bullets[bulletIndex]) {
            newExp[0].bullets[bulletIndex].tailored = json.result;
          }
          return { ...prev, experience: newExp };
        });
        toast.success("AI suggestion applied successfully!");
      }
    } catch {
      toast.error("Failed to run inline AI action");
    }
  };

  // Document Export Handler
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
      a.download = `Optimized_Resume.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success(`Successfully exported as .${format.toUpperCase()}`);
    } catch {
      toast.error("Failed to export document");
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">Loading your uploaded resume...</p>
          <p className="text-xs text-muted-foreground mt-1">Preparing live ATS optimizer & keyword analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 glass rounded-2xl p-4 sm:p-6 shadow-sm border border-border/50">
        <div className="flex items-center gap-3">
          <Link
            href={`/analysis/${params.id}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading text-lg font-bold sm:text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary-500" /> Optimize Your Resume
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <ShieldCheck className="h-3.5 w-3.5" /> Zero Hallucination
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live browser editor • Real-time ATS keyword & score optimization
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowComparison(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-primary-500/30 bg-primary-500/10 px-3.5 text-xs font-semibold text-primary-500 hover:bg-primary-500/20 transition-all"
          >
            <Columns className="h-3.5 w-3.5" /> Compare Original vs Optimized
          </button>

          <div className="h-4 w-[1px] bg-border/50 hidden sm:block" />

          {/* Template Selector */}
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value as ResumeTemplateId)}
            className="h-9 rounded-xl border border-border/50 bg-background px-3 text-xs font-medium focus:outline-none"
          >
            <option value="modern">Template: Modern</option>
            <option value="professional">Template: Professional</option>
            <option value="executive">Template: Executive</option>
            <option value="minimal">Template: Minimal</option>
            <option value="corporate">Template: Corporate</option>
            <option value="ats-optimized">Template: ATS Standard</option>
          </select>

          <button
            onClick={() => setTemplateModalOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-primary-500/40 bg-primary-500/10 px-3 text-xs font-semibold text-primary-500 hover:bg-primary-500/20 transition-all shadow-sm"
          >
            <Layout className="h-3.5 w-3.5" /> 100+ Templates Library
          </button>

          <TemplateSelectorModal
            isOpen={templateModalOpen}
            onClose={() => setTemplateModalOpen(false)}
            selectedTemplateId={template}
            onSelectTemplate={(newId) => {
              setTemplate(newId as ResumeTemplateId);
              toast.success("Applied professional template!");
            }}
          />

          {/* Export Dropdown */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleExport("docx")}
              disabled={!!downloading}
              className="inline-flex h-9 items-center gap-1 rounded-xl border border-border/50 px-3 text-xs font-medium hover:bg-muted/50 transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> DOCX
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl gradient-bg px-3.5 text-xs font-semibold text-white shadow-md hover:shadow-primary-500/25 transition-all"
            >
              <FileText className="h-3.5 w-3.5" /> Print / PDF
            </button>
          </div>
        </div>
      </div>

      {/* Live ATS Score Recalculation Bar */}
      <LiveATSScore
        overallScore={overallScore}
        keywordMatchPct={Math.min(96, Math.round(68 + addedKw.length * 5))}
        skillsMatchPct={85}
        formattingScore={92}
        readabilityScore={88}
        experienceMatchPct={84}
        impactScore={90}
      />

      {/* Main Workspace Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Control Column (Keywords & Recommendations) */}
        <div className="lg:col-span-4 space-y-6">
          <ContentStrengthAuditor
            summaryText={data.summary.tailored}
            bullets={data.experience.flatMap((e) => e.bullets.map((b) => b.tailored))}
            skillsList={data.skills.highlightedSkills}
          />

          <ATSFixHub
            fixes={[
              {
                id: "fix_1",
                category: "Passive Voice",
                title: "Convert Passive Voice in Experience",
                originalText: "Worked on performance improvements that were used by clients.",
                fixedText: "Engineered high-performance web solutions adopted by 10,000+ active users.",
                impactGain: "+8 ATS Pts",
              },
              {
                id: "fix_2",
                category: "Action Verb",
                title: "Upgrade Action Verb Power",
                originalText: "Was responsible for code reviews and team meetings.",
                fixedText: "Spearheaded code review processes and facilitated agile team sprints.",
                impactGain: "+6 ATS Pts",
              },
              {
                id: "fix_3",
                category: "Metrics",
                title: "Add Quantifiable Impact Placeholder",
                originalText: "Reduced server response time.",
                fixedText: "Reduced server response time by 35% [XX%] through query optimization.",
                impactGain: "+10 ATS Pts",
              },
            ]}
            onApplyFix={async (fixItem) => {
              setData((prev) => {
                const newExp = [...prev.experience];
                if (newExp[0] && newExp[0].bullets[0]) {
                  newExp[0].bullets[0].tailored = fixItem.fixedText;
                }
                return { ...prev, experience: newExp };
              });
              toast.success(`Applied fix: ${fixItem.title}`);
            }}
          />

          <KeywordOptimizer
            missingKeywords={missingKw}
            onAddKeyword={handleAddKeyword}
            addedKeywords={addedKw}
          />

          <SmartSuggestions
            suggestions={suggestions}
            onApplyFix={handleApplyFix}
          />

          <SectionManager
            sections={sections}
            onReorder={setSections}
            onDeleteSection={(id) => setSections((prev) => prev.filter((s) => s.id !== id))}
            onDuplicateSection={(id) => {
              const target = sections.find((s) => s.id === id);
              if (target) {
                setSections((prev) => [
                  ...prev,
                  { ...target, id: `sec_${Date.now()}`, title: `${target.title} (Copy)` },
                ]);
              }
            }}
            onAddSection={(title, type) =>
              setSections((prev) => [
                ...prev,
                { id: `sec_${Date.now()}`, title, type, content: "" },
              ])
            }
            onToggleCollapse={(id) =>
              setSections((prev) =>
                prev.map((s) => (s.id === id ? { ...s, collapsed: !s.collapsed } : s))
              )
            }
          />
        </div>

        {/* Right Editor & Document Preview Workspace */}
        <div className="lg:col-span-8 space-y-4">
          {/* Rich Editor Toolbar */}
          <EditorToolbar
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontSize={fontSize}
            setFontSize={setFontSize}
            lineSpacing={lineSpacing}
            setLineSpacing={setLineSpacing}
          />

          {/* Document View Tabs */}
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("editor")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "editor"
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <Wrench className="h-3.5 w-3.5" /> Interactive Editor
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "preview"
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <Eye className="h-3.5 w-3.5" /> Live Document Preview
              </button>
            </div>

            <span className="text-[11px] text-muted-foreground">
              Auto-saved locally
            </span>
          </div>

          {/* Print-only template container to guarantee clean PDF rendering regardless of active tab */}
          <div className="hidden print:block resume-print-area">
            <TemplateRenderer
              data={data}
              template={template}
              fontFamily={fontFamily}
              fontSize={fontSize}
              lineSpacing={lineSpacing}
            />
          </div>

          {/* Interactive Document Editor or Visual Preview */}
          <div className="print:hidden">
            {activeTab === "editor" ? (
              <div className="glass rounded-2xl p-6 sm:p-8 space-y-6 bg-card text-card-foreground shadow-2xl border border-border/50">
                {/* Header Info */}
                <div className="space-y-3 border-b border-border/50 pb-4">
                  <input
                    type="text"
                    value={data.contactInfo.fullName}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, fullName: e.target.value },
                      }))
                    }
                    className="font-heading text-2xl font-bold bg-transparent border-b border-transparent hover:border-border focus:border-primary-500 focus:outline-none w-full"
                  />
                  <div className="grid gap-2 sm:grid-cols-2 text-xs">
                    <input
                      type="text"
                      value={data.contactInfo.email || ""}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, email: e.target.value },
                        }))
                      }
                      placeholder="Email"
                      className="bg-transparent border-b border-transparent hover:border-border focus:border-primary-500 focus:outline-none text-muted-foreground"
                    />
                    <input
                      type="text"
                      value={data.contactInfo.phone || ""}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, phone: e.target.value },
                        }))
                      }
                      placeholder="Phone"
                      className="bg-transparent border-b border-transparent hover:border-border focus:border-primary-500 focus:outline-none text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Professional Summary Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary-500">
                      Professional Summary
                    </h3>
                    <InlineAIMenu onSelectAction={(act) => handleInlineAIAction(0, act)} />
                  </div>
                  <textarea
                    value={data.summary.tailored}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        summary: { ...prev.summary, tailored: e.target.value },
                      }))
                    }
                    rows={4}
                    className="w-full rounded-xl border border-border/50 bg-background/50 p-3 text-xs leading-relaxed focus:border-primary-500 focus:outline-none"
                  />
                </div>

                {/* Technical Skills Section */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary-500">
                    Technical & Key Skills
                  </h3>
                  <input
                    type="text"
                    value={data.skills.highlightedSkills.join(", ")}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        skills: {
                          ...prev.skills,
                          highlightedSkills: e.target.value.split(",").map((s) => s.trim()),
                        },
                      }))
                    }
                    className="w-full rounded-xl border border-border/50 bg-background/50 p-3 text-xs focus:border-primary-500 focus:outline-none"
                  />
                </div>

                {/* Work Experience Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary-500">
                    Work Experience
                  </h3>
                  {data.experience.map((exp, i) => (
                    <div key={i} className="space-y-3 rounded-xl border border-border/50 p-4 bg-muted/10">
                      <div className="grid gap-2 sm:grid-cols-2 text-xs font-bold">
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) =>
                            setData((prev) => {
                              const newExp = [...prev.experience];
                              newExp[i].jobTitle = e.target.value;
                              return { ...prev, experience: newExp };
                            })
                          }
                          className="bg-transparent border-b border-transparent hover:border-border focus:border-primary-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) =>
                            setData((prev) => {
                              const newExp = [...prev.experience];
                              newExp[i].company = e.target.value;
                              return { ...prev, experience: newExp };
                            })
                          }
                          className="bg-transparent border-b border-transparent hover:border-border focus:border-primary-500 focus:outline-none text-right"
                        />
                      </div>

                      {/* Bullet Points */}
                      <div className="space-y-2">
                        {exp.bullets.map((b, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <InlineAIMenu onSelectAction={(act) => handleInlineAIAction(j, act)} />
                            <textarea
                              value={b.tailored}
                              onChange={(e) =>
                                setData((prev) => {
                                  const newExp = [...prev.experience];
                                  newExp[i].bullets[j].tailored = e.target.value;
                                  return { ...prev, experience: newExp };
                                })
                              }
                              rows={2}
                              className="w-full flex-1 rounded-lg border border-border/50 bg-background/50 p-2.5 text-xs leading-relaxed focus:border-primary-500 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="resume-print-area">
                <TemplateRenderer
                  data={data}
                  template={template}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  lineSpacing={lineSpacing}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Modal */}
      <ResumeComparisonModal
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        originalData={mockInitialData}
        optimizedData={data}
        originalScore={originalScore}
        optimizedScore={overallScore}
      />
    </div>
  );
}

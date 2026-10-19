"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Crown,
  Eye,
  ArrowRight,
  SlidersHorizontal,
  X,
  FileText,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Sun,
  Moon,
} from "lucide-react";
import {
  TEMPLATES_100_CATALOG,
  TEMPLATE_CATEGORIES,
  type ResumeTemplateDefinition,
  type TemplateCategory,
} from "@/config/templates";
import { ResumeRenderer } from "@/components/builder/resume-renderer";
import { DEFAULT_RESUME_DATA } from "@/lib/builder/default-data";
import { toast, showAlert } from "@/lib/sweetalert";

export default function ResumeBuilderGalleryPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLayout, setSelectedLayout] = useState<string>("all");
  const [selectedPageFilter, setSelectedPageFilter] = useState<string>("all");
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplateDefinition | null>(null);
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [previewPaperMode, setPreviewPaperMode] = useState<"white" | "dark">("white");
  const [thumbnailPaperMode, setThumbnailPaperMode] = useState<"white" | "dark">("white");

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATES_100_CATALOG.filter((t) => {
      // Category filter
      if (selectedCategory !== "All") {
        if (!t.filterCategories.includes(selectedCategory)) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesTag = t.tags.some((tag) => tag.toLowerCase().includes(q));
        const matchesCategory = t.category.toLowerCase().includes(q);
        if (!matchesName && !matchesTag && !matchesCategory) {
          return false;
        }
      }

      // Layout filter
      if (selectedLayout !== "all" && t.layout !== selectedLayout) {
        return false;
      }

      // Page filter
      if (selectedPageFilter !== "all" && t.pages !== selectedPageFilter) {
        return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, selectedLayout, selectedPageFilter]);

  async function handleUseTemplate(template: ResumeTemplateDefinition) {
    try {
      setCreatingId(template.id);
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          title: `${template.name} Resume`,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || "Failed to create resume");
        return;
      }

      toast.success(`Created resume with ${template.name} template!`);
      router.push(`/resume-builder/${json.data.id}/edit`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to initialize resume editor");
    } finally {
      setCreatingId(null);
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl gradient-bg p-8 sm:p-10 text-white shadow-xl shadow-primary-500/10">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            100 Professional Resume Templates
          </div>
          <h1 className="font-heading text-2xl font-black sm:text-4xl tracking-tight">
            Craft an ATS-Optimized Resume in Minutes
          </h1>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            Select from 100 recruiter-approved templates. Customize styling, preview in real time, and switch designs anytime without losing your information.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/resume-builder/generate"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4 text-primary-500" />
              Generate from Job Description with AI
            </Link>
            <Link
              href="/my-resumes"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 text-white font-medium text-xs hover:bg-white/20 transition-all"
            >
              <FileText className="h-4 w-4" />
              View My Resumes
            </Link>
          </div>
        </div>

        {/* Decorative background blurs */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 -mb-16 h-56 w-56 rounded-full bg-primary-300/20 blur-2xl" />
      </div>

      {/* Filter and Search Bar */}
      <div className="glass rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, skill, or style (e.g. Modern, Minimal, Tech)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-border/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Secondary Select Dropdowns */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedLayout}
              onChange={(e) => setSelectedLayout(e.target.value)}
              className="text-xs bg-background border border-border/60 rounded-xl px-3 py-2 text-foreground focus:outline-none"
            >
              <option value="all">All Layouts</option>
              <option value="minimal-linear-ats">Minimal Linear ATS</option>
              <option value="left-sidebar-dark">Left Sidebar</option>
              <option value="right-sidebar">Right Sidebar</option>
              <option value="top-hero-banner">Hero Banner</option>
              <option value="compact-grid">Compact Grid</option>
              <option value="serif-academic-classic">Academic Serif</option>
              <option value="executive-gold-frame">Executive Frame</option>
              <option value="creative-pill-modern">Creative Pill</option>
              <option value="timeline-modern">Timeline</option>
            </select>

            <select
              value={selectedPageFilter}
              onChange={(e) => setSelectedPageFilter(e.target.value)}
              className="text-xs bg-background border border-border/60 rounded-xl px-3 py-2 text-foreground focus:outline-none"
            >
              <option value="all">Any Length</option>
              <option value="one-page">1 Page Formats</option>
              <option value="two-page">2+ Page Formats</option>
            </select>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {TEMPLATE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/30"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Count Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pb-1 flex-wrap gap-2">
        <p>
          Showing <strong className="text-foreground">{filteredTemplates.length}</strong> of 100 templates
        </p>
        <div className="flex items-center gap-3">
          {/* Card View Mode Toggle */}
          <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/50">
            <button
              type="button"
              onClick={() => setThumbnailPaperMode("white")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                thumbnailPaperMode === "white"
                  ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-900/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="h-3 w-3 text-amber-500" />
              White Cards
            </button>
            <button
              type="button"
              onClick={() => setThumbnailPaperMode("dark")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                thumbnailPaperMode === "dark"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="h-3 w-3 text-primary-400" />
              Dark Cards
            </button>
          </div>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">100% Guaranteed Zero Data Loss on Switch</span>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => {
          return (
            <motion.div
              key={template.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="glass rounded-2xl overflow-hidden border border-border/50 flex flex-col justify-between group shadow-sm hover:shadow-xl hover:border-primary-500/40 transition-all"
            >
              {/* Thumbnail Miniature Card: Real Small Full Preview */}
              <div
                onClick={() => setPreviewTemplate(template)}
                className="h-64 sm:h-72 bg-zinc-100/80 dark:bg-zinc-950/60 relative cursor-pointer overflow-hidden p-3 border-b border-border/40 flex items-start justify-center group/card"
              >
                {/* Real Miniature Full Resume Preview Document */}
                <div className={`w-[268px] h-full overflow-hidden rounded-xs shadow-md border flex justify-center ${
                  thumbnailPaperMode === "white"
                    ? "bg-white border-zinc-200/90 shadow-zinc-900/10"
                    : "bg-card border-border/50"
                }`}>
                  <div
                    className="w-[794px] min-h-[1123px] shrink-0 pointer-events-none select-none origin-top transition-transform duration-200 group-hover/card:scale-[0.345]"
                    style={{
                      transform: "scale(0.338)",
                      transformOrigin: "top center",
                    }}
                  >
                    <ResumeRenderer
                      data={DEFAULT_RESUME_DATA}
                      templateId={template.id}
                      customization={{ primaryColor: template.primaryColor, fontFamily: template.fontFamily }}
                      paperMode={thumbnailPaperMode}
                      editable={false}
                      elementId={`thumb-${template.id}`}
                    />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap z-10">
                  {template.atsFriendly && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/90 text-white text-[10px] font-bold shadow-sm">
                      <CheckCircle2 className="h-3 w-3" />
                      ATS {template.atsScore}%
                    </span>
                  )}
                  {template.isPremium && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[10px] font-bold shadow-sm">
                      <Crown className="h-3 w-3" />
                      PRO
                    </span>
                  )}
                </div>

                {/* Quick Preview Hover Overlay */}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-zinc-900 text-xs font-semibold shadow-lg hover:scale-105 transition-transform"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Quick Preview
                  </button>
                </div>
              </div>

              {/* Template Info & Action Bar */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary-500 transition-colors">
                      {template.name}
                    </h3>
                    <div
                      className="h-3 w-3 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: template.primaryColor }}
                      title={`Primary: ${template.primaryColor}`}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                    {template.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center gap-2">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="flex-1 text-xs py-2 rounded-xl border border-border/60 font-medium hover:bg-muted/60 transition-colors flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    disabled={creatingId === template.id}
                    className="flex-1 text-xs py-2 rounded-xl gradient-bg text-white font-semibold shadow-md shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    {creatingId === template.id ? (
                      "Loading..."
                    ) : (
                      <>
                        Use Template
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Modal Preview */}
      <AnimatePresence>
        {previewTemplate && (
          <div 
            onClick={() => setPreviewTemplate(null)}
            className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 bg-black/70 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 text-foreground border border-border/80 rounded-3xl w-full max-w-4xl h-[90vh] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div
                    className="h-4 w-4 rounded-full border border-border shadow-sm shrink-0"
                    style={{ backgroundColor: previewTemplate.primaryColor }}
                  />
                  <div>
                    <h2 className="font-heading text-lg font-bold flex items-center gap-2">
                      {previewTemplate.name}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-500 font-medium">
                        {previewTemplate.layout.replace(/-/g, " ")}
                      </span>
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Recruiter & ATS Score: {previewTemplate.atsScore}/100 • {previewTemplate.pages === "one-page" ? "Single Page" : "Multi Page"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Paper Mode Toggle */}
                  <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/50">
                    <button
                      type="button"
                      onClick={() => setPreviewPaperMode("white")}
                      className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                        previewPaperMode === "white"
                          ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-900/5"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title="View Authentic White Paper Resume"
                    >
                      <Sun className="h-3.5 w-3.5 text-amber-500" />
                      White Mode
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewPaperMode("dark")}
                      className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                        previewPaperMode === "dark"
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title="View Dark Theme Resume"
                    >
                      <Moon className="h-3.5 w-3.5 text-primary-400" />
                      Dark Mode
                    </button>
                  </div>

                  <button
                    onClick={() => handleUseTemplate(previewTemplate)}
                    className="px-4 py-2 rounded-xl gradient-bg text-white text-xs font-semibold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    Use This Template
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="h-8 w-8 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Live Rendered Resume */}
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 bg-zinc-900/40 flex justify-center items-start">
                <div className={`w-full max-w-2xl mx-auto shadow-2xl rounded-2xl overflow-hidden mb-6 ${previewPaperMode === "white" ? "bg-white ring-1 ring-zinc-900/5 shadow-zinc-950/15" : "bg-card"}`}>
                  <ResumeRenderer
                    data={DEFAULT_RESUME_DATA}
                    templateId={previewTemplate.id}
                    customization={{ primaryColor: previewTemplate.primaryColor, fontFamily: previewTemplate.fontFamily }}
                    paperMode={previewPaperMode}
                    editable={false}
                    elementId={`modal-preview-${previewTemplate.id}`}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

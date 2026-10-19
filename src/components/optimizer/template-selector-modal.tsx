"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Layout,
  Search,
  Check,
  X,
  ShieldCheck,
  Sun,
  Moon,
} from "lucide-react";
import { TEMPLATES_100_CATALOG, ResumeTemplateDefinition } from "@/config/templates";

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
}

function TemplateCardPreview({
  template,
  paperMode = "white",
}: {
  template: ResumeTemplateDefinition;
  paperMode?: "white" | "dark";
}) {
  const isAcademic = template.layout === "serif-academic-classic" || template.category === "academic";
  const dummyName = isAcademic ? "DR. ALEX MERCER" : template.category === "executive" ? "DANIEL VANCE" : "SARAH JENKINS";
  const dummyRole = isAcademic ? "Lead Research Fellow" : template.category === "executive" ? "Chief Executive Officer" : "Senior Software Engineer";
  const initials = dummyName.split(" ").map((n) => n[0]).join("");

  const isWhite = paperMode === "white";
  const textMuted = isWhite ? "text-zinc-500" : "text-muted-foreground";
  const textTitle = isWhite ? "text-zinc-900" : "text-foreground";
  const borderSubtle = isWhite ? "border-zinc-200" : "border-border/40";
  const neutralBg = isWhite ? "bg-zinc-100" : "bg-muted/30";

  return (
    <div
      className={`rounded-xl border p-2.5 mb-3 h-52 relative overflow-hidden flex flex-col justify-between group-hover:scale-[1.02] transition-transform shadow-sm text-[8.5px] leading-tight ${
        isWhite
          ? "bg-white text-zinc-800 border-zinc-200 shadow-xs"
          : "bg-background text-foreground border-border/60"
      }`}
      style={{
        fontFamily: isAcademic ? "Georgia, serif" : "Inter, sans-serif",
      }}
    >
      {/* LAYOUT 1: Left Sidebar Dark */}
      {template.layout === "left-sidebar-dark" && (
        <div className="grid grid-cols-3 gap-2 h-full">
          <div className="rounded-lg p-2 space-y-2 flex flex-col justify-between text-white" style={{ backgroundColor: template.primaryColor }}>
            <div className="text-center space-y-1">
              <div className="h-7 w-7 mx-auto rounded-full bg-white/20 flex items-center justify-center font-bold text-[9px] border border-white/40">
                {initials}
              </div>
              <p className="font-bold text-[8.5px] truncate">{dummyName}</p>
              <p className="text-[7px] text-white/80 truncate">{dummyRole}</p>
            </div>
            <div className="space-y-0.5 text-[6.5px] text-white/80">
              <p className="truncate">sarah@tech.io</p>
              <p className="truncate">+1 555-019</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-[7px] uppercase">Skills</p>
              <div className="flex flex-wrap gap-0.5">
                {["React", "TS", "Node"].map((s) => (
                  <span key={s} className="rounded bg-white/20 px-1 py-0.2 text-[6px]">{s}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-2 space-y-1.5 py-0.5">
            <div className="border-b border-border/40 pb-1">
              <p className="font-bold text-[8px] uppercase" style={{ color: template.primaryColor }}>Summary</p>
              <p className="text-[7px] text-muted-foreground line-clamp-2">Versatile engineer architecting high-performance cloud applications.</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-[8px] uppercase" style={{ color: template.primaryColor }}>Experience</p>
              <div className="space-y-0.5">
                <p className="font-bold text-[7.5px]">Lead Engineer — TechCorp</p>
                <p className="text-[6.5px] text-muted-foreground truncate">• Spearheaded microservices handling 1M+ reqs.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAYOUT 2: Right Sidebar */}
      {template.layout === "right-sidebar" && (
        <div className="grid grid-cols-3 gap-2 h-full">
          <div className="col-span-2 space-y-1.5 py-0.5">
            <div className="border-b border-border/40 pb-1">
              <p className="font-bold text-[9px]" style={{ color: template.primaryColor }}>{dummyName}</p>
              <p className="text-[7.5px] text-muted-foreground">{dummyRole}</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-[8px] uppercase" style={{ color: template.primaryColor }}>Experience</p>
              <p className="font-bold text-[7.5px]">Senior Software Engineer</p>
              <p className="text-[6.5px] text-muted-foreground truncate">• Optimized query speeds by 35%.</p>
            </div>
          </div>
          <div className="rounded-lg p-2 space-y-2 border border-border/40 bg-muted/20">
            <div className="h-6 w-6 mx-auto rounded-full flex items-center justify-center font-bold text-white text-[8px]" style={{ backgroundColor: template.primaryColor }}>
              {initials}
            </div>
            <div className="space-y-1 text-[6.5px] text-muted-foreground">
              <p className="font-bold text-foreground">Contact</p>
              <p className="truncate">sarah@tech.io</p>
            </div>
          </div>
        </div>
      )}

      {/* LAYOUT 3: Top Hero Banner */}
      {template.layout === "top-hero-banner" && (
        <div className="space-y-1.5">
          <div className="rounded-lg p-2 text-white flex items-center gap-2" style={{ backgroundColor: template.primaryColor }}>
            <div className="h-7 w-7 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-bold text-[8.5px]">
              {initials}
            </div>
            <div>
              <p className="font-bold text-[9px]">{dummyName}</p>
              <p className="text-[7px] text-white/80">{dummyRole} • sarah@tech.io</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[7px]">
            <div className="space-y-0.5">
              <p className="font-bold text-[7.5px] uppercase" style={{ color: template.primaryColor }}>Experience</p>
              <p className="font-semibold text-foreground">TechCorp — Lead Eng</p>
              <p className="text-muted-foreground truncate">• Reduced server latency 35%.</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-[7.5px] uppercase" style={{ color: template.primaryColor }}>Skills</p>
              <p className="text-muted-foreground">React, TS, Node, AWS</p>
            </div>
          </div>
        </div>
      )}

      {/* LAYOUT 4: Split Header Classic */}
      {template.layout === "split-header-classic" && (
        <div className="space-y-1.5">
          <div className="grid grid-cols-2 gap-1.5 pb-1 border-b border-border/50">
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-full flex items-center justify-center font-bold text-white text-[8px]" style={{ backgroundColor: template.primaryColor }}>
                {initials}
              </div>
              <div>
                <p className="font-bold text-[8.5px] text-foreground">{dummyName}</p>
                <p className="text-[7px] text-muted-foreground">{dummyRole}</p>
              </div>
            </div>
            <div className="text-right text-[6.5px] text-muted-foreground bg-muted/30 p-1 rounded-md">
              <p>sarah@tech.io</p>
              <p>San Francisco, CA</p>
            </div>
          </div>
          <div className="space-y-0.5 border-l-2 pl-2" style={{ borderColor: template.primaryColor }}>
            <p className="font-bold text-[8px]">Lead Software Engineer — TechCorp</p>
            <p className="text-[7px] text-muted-foreground truncate">• Built microservices handling 1.5M+ daily active requests.</p>
          </div>
        </div>
      )}

      {/* LAYOUT 5: Compact Grid */}
      {template.layout === "compact-grid" && (
        <div className="space-y-1">
          <div className="bg-muted/40 p-1.5 rounded-md flex justify-between items-center">
            <p className="font-bold text-[8.5px]" style={{ color: template.primaryColor }}>{dummyName}</p>
            <p className="text-[6.5px] text-muted-foreground">{dummyRole} | sarah@tech.io</p>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[7px]">
            <div className="border border-border/40 p-1 rounded space-y-0.5">
              <p className="font-bold text-[7.5px]" style={{ color: template.primaryColor }}>Experience</p>
              <p className="font-semibold">TechCorp (2022-Pres)</p>
              <p className="text-muted-foreground truncate">• Reduced latency 35%.</p>
            </div>
            <div className="border border-border/40 p-1 rounded space-y-0.5">
              <p className="font-bold text-[7.5px]" style={{ color: template.primaryColor }}>Education</p>
              <p className="font-semibold">B.S. CS — Stanford</p>
              <p className="text-muted-foreground">Skills: React, TS, AWS</p>
            </div>
          </div>
        </div>
      )}

      {/* LAYOUT 6: Serif Academic Classic */}
      {template.layout === "serif-academic-classic" && (
        <div className="space-y-1.5 text-center">
          <div className="border-b-2 border-t-2 py-1" style={{ borderColor: template.primaryColor }}>
            <p className="font-serif font-bold text-[9.5px] uppercase tracking-wide text-foreground">{dummyName}</p>
            <p className="text-[7px] text-muted-foreground italic">{dummyRole} — Stanford University</p>
          </div>
          <div className="text-left space-y-1 text-[7px]">
            <p className="font-bold uppercase text-[7.5px] border-b pb-0.5" style={{ color: template.primaryColor }}>Publications</p>
            <p className="text-muted-foreground truncate font-serif">• Mercer, A. (2025). &quot;Neural Genomic Alignment.&quot; Nature Biotech.</p>
          </div>
        </div>
      )}

      {/* LAYOUT 7: Executive Gold Frame */}
      {template.layout === "executive-gold-frame" && (
        <div className="border-2 p-1.5 rounded-lg space-y-1 bg-amber-500/5" style={{ borderColor: template.primaryColor }}>
          <div className="text-center space-y-0.5">
            <div className="h-6 w-6 mx-auto rounded-full bg-amber-500 text-white flex items-center justify-center font-serif text-[8px] font-bold">
              {initials}
            </div>
            <p className="font-serif font-bold text-[9px] uppercase tracking-widest text-foreground">{dummyName}</p>
            <p className="text-[6.5px] font-semibold text-muted-foreground uppercase">{dummyRole}</p>
          </div>
          <div className="border-t pt-1 text-[6.5px] text-muted-foreground italic text-center">
            &quot;Strategic executive driving digital transformation and P&L growth.&quot;
          </div>
        </div>
      )}

      {/* LAYOUT 8: Creative Pill Modern */}
      {template.layout === "creative-pill-modern" && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 bg-gradient-to-r from-primary-500/20 to-purple-500/20 p-1.5 rounded-full">
            <div className="h-6 w-6 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-[7.5px]">
              {initials}
            </div>
            <div>
              <p className="font-bold text-[8px] text-foreground">{dummyName}</p>
              <p className="text-[6.5px] text-muted-foreground">{dummyRole}</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/40 p-1.5 space-y-1">
            <span className="rounded-full px-2 py-0.2 text-[6.5px] font-bold text-white" style={{ backgroundColor: template.primaryColor }}>
              EXPERIENCE
            </span>
            <p className="text-[7px] text-muted-foreground truncate">Lead Product Designer @ Studio — Designed AI design system.</p>
          </div>
        </div>
      )}

      {/* LAYOUT 9: Minimal Linear ATS */}
      {template.layout === "minimal-linear-ats" && (
        <div className="space-y-1 font-mono">
          <div className="border-b pb-0.5">
            <p className="font-bold text-[9px] text-foreground uppercase">{dummyName}</p>
            <p className="text-[6.5px] text-muted-foreground">ENGINEER | SARAH@TECH.IO | 555-019-2834</p>
          </div>
          <div className="space-y-0.5 text-[6.5px]">
            <p className="font-bold uppercase text-[7.5px]" style={{ color: template.primaryColor }}>[EXPERIENCE]</p>
            <p className="font-bold">LEAD ENGINEER - TECHCORP (2022-PRESENT)</p>
            <p className="text-muted-foreground truncate">- Architected microservices for 1.5M daily active users.</p>
          </div>
        </div>
      )}

      {/* LAYOUT 10: Timeline Modern */}
      {template.layout === "timeline-modern" && (
        <div className="space-y-1.5">
          <div className="border-b pb-1 flex justify-between items-center">
            <p className="font-bold text-[8.5px]" style={{ color: template.primaryColor }}>{dummyName}</p>
            <p className="text-[6.5px] text-muted-foreground">{dummyRole}</p>
          </div>
          <div className="relative pl-3 border-l-2 space-y-1" style={{ borderColor: template.primaryColor }}>
            <div className="space-y-0.5">
              <span className="absolute -left-[5px] top-0 h-2 w-2 rounded-full" style={{ backgroundColor: template.primaryColor }} />
              <p className="font-bold text-[7.5px]">Senior Engineer — TechCorp</p>
              <p className="text-[6.5px] text-muted-foreground truncate">• Reduced query latencies by 35%.</p>
            </div>
          </div>
        </div>
      )}

      {/* ATS Score Badge */}
      <div className="absolute top-2 right-2 z-10">
        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[8.5px] font-bold text-emerald-500 flex items-center gap-1 shadow-sm backdrop-blur-md">
          <ShieldCheck className="h-3 w-3" /> ATS {template.atsScore}%
        </span>
      </div>
    </div>
  );
}

export function TemplateSelectorModal({
  isOpen,
  onClose,
  selectedTemplateId,
  onSelectTemplate,
}: TemplateSelectorModalProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [paperMode, setPaperMode] = useState<"white" | "dark">("white");

  const filteredTemplates = useMemo(() => {
    return TEMPLATES_100_CATALOG.filter((t) => {
      const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col bg-white dark:bg-zinc-900 text-foreground border border-border/80 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-border/50 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold flex items-center gap-2">
              <Layout className="h-6 w-6 text-primary-500" />
              100 Professional Templates with Distinct Layouts
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Every template features a distinct visual layout, header architecture & structural layout.
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-border/40 bg-card/40 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-semibold">
            {[
              { id: "all", label: `All (${TEMPLATES_100_CATALOG.length})` },
              { id: "ats-optimized", label: "ATS Guaranteed (25)" },
              { id: "modern", label: "Modern Tech (20)" },
              { id: "executive", label: "Executive & C-Suite (20)" },
              { id: "creative", label: "Creative Portfolio (20)" },
              { id: "academic", label: "Academic & CV (15)" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-3 py-1.5 whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "gradient-bg text-white shadow-md shadow-primary-500/20"
                    : "border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* White Cards / Dark Cards Toggle */}
            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/50">
              <button
                type="button"
                onClick={() => setPaperMode("white")}
                className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                  paperMode === "white"
                    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-900/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="White Paper Cards"
              >
                <Sun className="h-3 w-3 text-amber-500" />
                White
              </button>
              <button
                type="button"
                onClick={() => setPaperMode("dark")}
                className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                  paperMode === "dark"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Dark Cards"
              >
                <Moon className="h-3 w-3 text-primary-400" />
                Dark
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search 100 templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Templates Grid Catalog */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplateId === template.id;

            return (
              <div
                key={template.id}
                className={`group relative rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-primary-500 bg-primary-500/10 ring-2 ring-primary-500 shadow-xl shadow-primary-500/15"
                    : "border-border/60 bg-card/60 hover:border-primary-500/40 hover:shadow-lg"
                }`}
              >
                <div>
                  {/* Dynamic Distinct Layout Preview Component */}
                  <TemplateCardPreview template={template} paperMode={paperMode} />

                  <h3 className="font-heading text-sm font-bold text-foreground flex items-center justify-between">
                    {template.name}
                    {template.popular && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
                        Popular
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                  <div className="flex gap-1">
                    {template.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-muted/40 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      onSelectTemplate(template.id);
                      onClose();
                    }}
                    className={`inline-flex h-8 items-center gap-1 rounded-xl px-3 text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-emerald-500 text-white shadow-md"
                        : "gradient-bg text-white shadow-md hover:scale-105"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Selected
                      </>
                    ) : (
                      "Apply Template"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

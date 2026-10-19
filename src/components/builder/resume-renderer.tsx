"use client";

import React, { useState } from "react";
import type { ResumeData, ResumeCustomization } from "@/types/resume-builder";
import { TEMPLATES_100_CATALOG, type ResumeTemplateDefinition } from "@/config/templates";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Link2,
  Calendar,
  Award,
  BookOpen,
  Briefcase,
  Code,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { EditableField } from "@/components/builder/editable-field";

interface ResumeRendererProps {
  data: ResumeData;
  templateId?: string;
  customization?: Partial<ResumeCustomization>;
  scale?: number;
  className?: string;
  paperMode?: "white" | "dark";
  editable?: boolean;
  elementId?: string;
  onDataChange?: (newData: ResumeData) => void;
  onCustomizationChange?: (newCust: ResumeCustomization) => void;
}

export function ResumeRenderer({
  data,
  templateId = "ats-optimized_1",
  customization = {},
  scale = 1,
  className = "",
  paperMode = "white",
  editable = false,
  elementId = "resume-preview-document",
  onDataChange,
  onCustomizationChange,
}: ResumeRendererProps) {
  const templateDef: ResumeTemplateDefinition =
    TEMPLATES_100_CATALOG.find((t) => t.id === templateId) || TEMPLATES_100_CATALOG[0];

  const primaryColor = customization.primaryColor || templateDef.primaryColor || "#2563eb";
  const fontFamily = customization.fontFamily || templateDef.fontFamily || "Inter, sans-serif";
  const fontSize =
    customization.fontSize === "sm"
      ? "text-xs leading-relaxed"
      : customization.fontSize === "lg"
      ? "text-sm leading-relaxed"
      : "text-[13px] leading-relaxed";

  const paddingClass =
    customization.marginSize === "compact"
      ? "px-6 py-5"
      : customization.marginSize === "spacious"
      ? "px-10 py-9"
      : "px-8 py-7";

  const spacingClass =
    customization.lineSpacing === "tight"
      ? "space-y-3"
      : customization.lineSpacing === "relaxed"
      ? "space-y-5"
      : "space-y-4";

  const layout = templateDef.layout;

  // Authentic crisp white resume sheet or dark preview (flat document, no card borders)
  const isWhite = paperMode === "white";
  const textPrimary = isWhite ? "text-zinc-900" : "text-foreground";
  const textSecondary = isWhite ? "text-zinc-700" : "text-foreground/80";
  const textMuted = isWhite ? "text-zinc-500" : "text-muted-foreground";
  const borderSubtle = isWhite ? "border-zinc-300" : "border-border/50";
  const paperContainerClass = isWhite
    ? "bg-white text-zinc-900"
    : "bg-card text-foreground";

  // Data update helpers
  const updatePersonal = (field: keyof ResumeData["personal"], val: string) => {
    if (!onDataChange) return;
    onDataChange({
      ...data,
      personal: { ...data.personal, [field]: val },
    });
  };

  const updateSummary = (val: string) => {
    if (!onDataChange) return;
    onDataChange({
      ...data,
      summary: val,
    });
  };

  const updateExperience = (id: string, field: string, val: any) => {
    if (!onDataChange) return;
    onDataChange({
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: val } : exp
      ),
    });
  };

  const updateExperienceAchievement = (id: string, index: number, val: string) => {
    if (!onDataChange) return;
    onDataChange({
      ...data,
      experience: data.experience.map((exp) => {
        if (exp.id !== id) return exp;
        const newAch = [...(exp.achievements || [])];
        newAch[index] = val;
        return { ...exp, achievements: newAch };
      }),
    });
  };

  const addExperienceAchievement = (id: string) => {
    if (!onDataChange) return;
    onDataChange({
      ...data,
      experience: data.experience.map((exp) => {
        if (exp.id !== id) return exp;
        return {
          ...exp,
          achievements: [...(exp.achievements || []), "New achievement or responsibility..."],
        };
      }),
    });
  };

  const deleteExperienceAchievement = (id: string, index: number) => {
    if (!onDataChange) return;
    onDataChange({
      ...data,
      experience: data.experience.map((exp) => {
        if (exp.id !== id) return exp;
        return {
          ...exp,
          achievements: (exp.achievements || []).filter((_, i) => i !== index),
        };
      }),
    });
  };

  const addExperience = () => {
    if (!onDataChange) return;
    const newExp = {
      id: `exp_${Date.now()}`,
      jobTitle: "Job Title",
      company: "Company Name",
      location: "City, Country",
      startDate: "2023",
      endDate: "Present",
      current: true,
      description: "",
      achievements: ["Accomplishment or key project outcome with quantifiable impact."],
    };
    onDataChange({
      ...data,
      experience: [newExp, ...data.experience],
    });
  };

  const deleteExperience = (id: string) => {
    if (!onDataChange) return;
    onDataChange({
      ...data,
      experience: data.experience.filter((e) => e.id !== id),
    });
  };

  const updateEducation = (id: string, field: string, val: any) => {
    if (!onDataChange) return;
    onDataChange({
      ...data,
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: val } : edu
      ),
    });
  };

  const addEducation = () => {
    if (!onDataChange) return;
    const newEdu = {
      id: `edu_${Date.now()}`,
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "University Name",
      startDate: "2018",
      endDate: "2022",
      description: "",
    };
    onDataChange({
      ...data,
      education: [...data.education, newEdu],
    });
  };

  const deleteEducation = (id: string) => {
    if (!onDataChange) return;
    onDataChange({
      ...data,
      education: data.education.filter((e) => e.id !== id),
    });
  };

  const updateSkill = (index: number, val: string) => {
    if (!onDataChange) return;
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], name: val };
    onDataChange({
      ...data,
      skills: newSkills,
    });
  };

  const addSkill = () => {
    if (!onDataChange) return;
    onDataChange({
      ...data,
      skills: [...data.skills, { name: "New Skill", level: "Intermediate" }],
    });
  };

  const deleteSkill = (index: number) => {
    if (!onDataChange) return;
    onDataChange({
      ...data,
      skills: data.skills.filter((_, i) => i !== index),
    });
  };

  const updateProject = (id: string, field: string, val: any) => {
    if (!onDataChange) return;
    onDataChange({
      ...data,
      projects: (data.projects || []).map((proj) =>
        proj.id === id ? { ...proj, [field]: val } : proj
      ),
    });
  };

  const updateCertification = (id: string, field: string, val: any) => {
    if (!onDataChange) return;
    onDataChange({
      ...data,
      certifications: (data.certifications || []).map((cert) =>
        cert.id === id ? { ...cert, [field]: val } : cert
      ),
    });
  };

  const defaultOrder = ["summary", "experience", "education", "skills", "projects", "certifications"];
  const currentOrder =
    customization.sectionOrder && customization.sectionOrder.length > 0
      ? Array.from(new Set([...customization.sectionOrder, ...defaultOrder]))
      : defaultOrder;

  const handleMoveSection = (sectionKey: string, direction: "up" | "down") => {
    if (!onCustomizationChange) return;
    const index = currentOrder.indexOf(sectionKey);
    if (index === -1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;
    const newOrder = [...currentOrder];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);
    onCustomizationChange({
      ...customization,
      primaryColor,
      fontFamily,
      fontSize: (customization.fontSize as any) || "base",
      lineSpacing: (customization.lineSpacing as any) || "normal",
      marginSize: (customization.marginSize as any) || "normal",
      showIcons: customization.showIcons ?? true,
      sectionOrder: newOrder,
    });
  };

  // Drag and drop section reordering state
  const [draggedKey, setDraggedKey] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<"before" | "after" | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (!draggedKey || draggedKey === targetKey) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const pos = e.clientY < midY ? "before" : "after";

    if (dragOverKey !== targetKey || dropPosition !== pos) {
      setDragOverKey(targetKey);
      setDropPosition(pos);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedKey || draggedKey === targetKey) {
      setDraggedKey(null);
      setDragOverKey(null);
      setDropPosition(null);
      return;
    }

    const fromIndex = currentOrder.indexOf(draggedKey);
    if (fromIndex === -1) {
      setDraggedKey(null);
      setDragOverKey(null);
      setDropPosition(null);
      return;
    }

    const newOrder = [...currentOrder];
    const [removed] = newOrder.splice(fromIndex, 1);

    const targetPosIndex = newOrder.indexOf(targetKey);
    if (targetPosIndex === -1) {
      setDraggedKey(null);
      setDragOverKey(null);
      setDropPosition(null);
      return;
    }

    const insertIndex = dropPosition === "after" ? targetPosIndex + 1 : targetPosIndex;
    newOrder.splice(insertIndex, 0, removed);

    onCustomizationChange?.({
      ...customization,
      primaryColor,
      fontFamily,
      fontSize: (customization.fontSize as any) || "base",
      lineSpacing: (customization.lineSpacing as any) || "normal",
      marginSize: (customization.marginSize as any) || "normal",
      showIcons: customization.showIcons ?? true,
      sectionOrder: newOrder,
    });

    setDraggedKey(null);
    setDragOverKey(null);
    setDropPosition(null);
  };

  const wrapSection = (secKey: string, content: React.ReactNode) => {
    if (!content) return null;
    const isDragging = draggedKey === secKey;
    const isOver = dragOverKey === secKey;

    return (
      <div
        key={`sec-wrap-${secKey}`}
        data-section-key={secKey}
        onDragOver={(e) => handleDragOver(e, secKey)}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            if (dragOverKey === secKey) {
              setDragOverKey(null);
              setDropPosition(null);
            }
          }
        }}
        onDrop={(e) => handleDrop(e, secKey)}
        className={`resume-section-wrapper relative transition-all duration-150 ${
          isDragging
            ? "opacity-35 scale-[0.99] border-2 border-dashed border-primary-500/60 rounded-xl p-2 bg-primary-500/5 shadow-inner"
            : ""
        }`}
      >
        {/* Visual Drop Line Before */}
        {isOver && dropPosition === "before" && (
          <div className="absolute -top-2.5 left-0 right-0 z-40 flex items-center gap-1.5 print:hidden pointer-events-none">
            <div
              className="w-3 h-3 rounded-full ring-2 ring-white shadow-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
            <div
              className="flex-1 h-1 rounded-full shadow-sm"
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 0 8px ${primaryColor}90`,
              }}
            />
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white shadow-md shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              Move Here
            </span>
          </div>
        )}

        {content}

        {/* Visual Drop Line After */}
        {isOver && dropPosition === "after" && (
          <div className="absolute -bottom-2.5 left-0 right-0 z-40 flex items-center gap-1.5 print:hidden pointer-events-none">
            <div
              className="w-3 h-3 rounded-full ring-2 ring-white shadow-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
            <div
              className="flex-1 h-1 rounded-full shadow-sm"
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 0 8px ${primaryColor}90`,
              }}
            />
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white shadow-md shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              Move Here
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderSectionMoveControls = (sectionKey: string) => {
    if (!editable || !onCustomizationChange) return null;
    const index = currentOrder.indexOf(sectionKey);
    const isFirst = index <= 0;
    const isLast = index >= currentOrder.length - 1;

    return (
      <div
        className={`inline-flex items-center gap-0.5 p-0.5 rounded-lg border print:hidden text-xs shadow-xs ${
          isWhite
            ? "bg-zinc-100/90 border-zinc-200/90"
            : "bg-muted/70 border-border/40"
        }`}
      >
        {/* Drag Handle */}
        <div
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", sectionKey);
            e.dataTransfer.effectAllowed = "move";
            const sectionEl = (e.currentTarget as HTMLElement).closest(".resume-section-wrapper") as HTMLElement;
            if (sectionEl && e.dataTransfer.setDragImage) {
              e.dataTransfer.setDragImage(sectionEl, 30, 20);
            }
            setDraggedKey(sectionKey);
          }}
          onDragEnd={() => {
            setDraggedKey(null);
            setDragOverKey(null);
            setDropPosition(null);
          }}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded cursor-grab active:cursor-grabbing transition-all select-none ${
            isWhite
              ? "text-zinc-600 hover:text-zinc-950 hover:bg-white hover:shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-background/80"
          }`}
          title={`Drag and drop to move ${sectionKey} section`}
          aria-label={`Drag to reorder ${sectionKey} section`}
        >
          <GripVertical className="h-3.5 w-3.5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider hidden sm:inline">
            Drag
          </span>
        </div>

        <div className={`h-3 w-px ${isWhite ? "bg-zinc-300" : "bg-border/60"} mx-0.5`} />

        <button
          type="button"
          disabled={isFirst}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleMoveSection(sectionKey, "up");
          }}
          className={`p-1 rounded transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${
            isWhite
              ? "text-zinc-600 hover:text-zinc-950 hover:bg-white hover:shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-background/80"
          }`}
          title={`Move ${sectionKey} section up`}
          aria-label={`Move ${sectionKey} section up`}
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={isLast}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleMoveSection(sectionKey, "down");
          }}
          className={`p-1 rounded transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${
            isWhite
              ? "text-zinc-600 hover:text-zinc-950 hover:bg-white hover:shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-background/80"
          }`}
          title={`Move ${sectionKey} section down`}
          aria-label={`Move ${sectionKey} section down`}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  };

  // Render Summary Block (Clean executive format, no childish icons)
  const renderSummary = (title = "Professional Summary", icon = false) => {
    if (!data.summary && !editable) return null;
    return (
      <div key="sec-summary">
        <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-zinc-300 print:border-zinc-400">
          <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-zinc-900 print:text-black flex items-center gap-2">
            {icon && <BookOpen className="h-3.5 w-3.5" />}
            {title}
          </h2>
          <div className="flex items-center gap-2 print:hidden">
            {renderSectionMoveControls("summary")}
          </div>
        </div>
        <p className={`text-xs ${textSecondary} leading-relaxed`}>
          <EditableField
            as="span"
            editable={editable}
            multiline
            value={data.summary || ""}
            onChange={updateSummary}
            placeholder="Click here to write or paste your professional summary..."
          />
        </p>
      </div>
    );
  };

  // Render Header Contacts (Authentic HR standard: cohesive bullet-separated inline row or vertical list)
  const renderContacts = (
    iconColor = primaryColor,
    isDarkBg = false,
    vertical = false,
    align: "left" | "center" | "right" = "left"
  ) => {
    const showIcons = Boolean(customization.showIcons);
    const contactItems: React.ReactNode[] = [];

    if (data.personal.location || editable) {
      contactItems.push(
        <span key="loc" className="inline-flex items-center gap-1 shrink-0 whitespace-nowrap">
          {showIcons && <MapPin className="h-3 w-3 shrink-0 opacity-70" />}
          <EditableField
            editable={editable}
            value={data.personal.location || ""}
            onChange={(v) => updatePersonal("location", v)}
            placeholder="City, State"
          />
        </span>
      );
    }
    if (data.personal.phone || editable) {
      contactItems.push(
        <span key="phone" className="inline-flex items-center gap-1 shrink-0 whitespace-nowrap">
          {showIcons && <Phone className="h-3 w-3 shrink-0 opacity-70" />}
          <EditableField
            editable={editable}
            value={data.personal.phone || ""}
            onChange={(v) => updatePersonal("phone", v)}
            placeholder="+1 (555) 0199"
          />
        </span>
      );
    }
    if (data.personal.email || editable) {
      contactItems.push(
        <span key="email" className="inline-flex items-center gap-1 shrink-0 whitespace-nowrap">
          {showIcons && <Mail className="h-3 w-3 shrink-0 opacity-70" />}
          <EditableField
            editable={editable}
            value={data.personal.email || ""}
            onChange={(v) => updatePersonal("email", v)}
            placeholder="email@domain.com"
          />
        </span>
      );
    }
    if (data.personal.linkedin || editable) {
      contactItems.push(
        <span key="linkedin" className="inline-flex items-center gap-1 shrink-0 whitespace-nowrap">
          {showIcons && <Link2 className="h-3 w-3 shrink-0 opacity-70" />}
          <EditableField
            editable={editable}
            value={data.personal.linkedin || ""}
            onChange={(v) => updatePersonal("linkedin", v)}
            placeholder="linkedin.com/in/username"
          />
        </span>
      );
    }
    if (data.personal.github || editable) {
      contactItems.push(
        <span key="github" className="inline-flex items-center gap-1 shrink-0 whitespace-nowrap">
          {showIcons && <Link2 className="h-3 w-3 shrink-0 opacity-70" />}
          <EditableField
            editable={editable}
            value={data.personal.github || ""}
            onChange={(v) => updatePersonal("github", v)}
            placeholder="github.com/username"
          />
        </span>
      );
    }
    if (data.personal.website || editable) {
      contactItems.push(
        <span key="website" className="inline-flex items-center gap-1 shrink-0 whitespace-nowrap">
          {showIcons && <Globe className="h-3 w-3 shrink-0 opacity-70" />}
          <EditableField
            editable={editable}
            value={data.personal.website || ""}
            onChange={(v) => updatePersonal("website", v)}
            placeholder="portfolio.com"
          />
        </span>
      );
    }

    if (vertical) {
      return (
        <div className={`space-y-1.5 text-xs ${isDarkBg ? "text-white/90" : `${textMuted} print:text-zinc-600`}`}>
          {contactItems.map((item, idx) => (
            <div key={idx}>{item}</div>
          ))}
        </div>
      );
    }

    const justifyClass = align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start";

    return (
      <div
        className={`flex flex-wrap items-center ${justifyClass} gap-x-2.5 gap-y-1 text-xs ${
          isDarkBg ? "text-white/90" : `${textMuted} print:text-zinc-600`
        }`}
      >
        {contactItems.map((item, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="opacity-40 select-none">•</span>}
            {item}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Render Experience Block (Clean ATS / HR standard)
  const renderExperience = (isTimeline = false) => (
    <div>
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-zinc-300 print:border-zinc-400">
        <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-zinc-900 print:text-black flex items-center gap-2">
          Professional Experience
        </h2>
        <div className="flex items-center gap-2 print:hidden">
          {renderSectionMoveControls("experience")}
          {editable && (
            <button
              type="button"
              onClick={addExperience}
              className="text-[11px] font-semibold text-primary-500 hover:text-primary-600 inline-flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Add Position
            </button>
          )}
        </div>
      </div>

      <div className={`space-y-3.5 ${isTimeline ? "relative pl-4 border-l-2 border-primary-500/30" : ""}`}>
        {data.experience.map((exp) => (
          <div key={exp.id} className="relative space-y-0.5 group/item pr-8">
            {isTimeline && (
              <div
                className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background"
                style={{ backgroundColor: primaryColor }}
              />
            )}

            {editable && (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteExperience(exp.id);
                }}
                className="absolute right-0 top-0.5 z-30 opacity-0 group-hover/item:opacity-100 p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all print:hidden cursor-pointer"
                title="Delete this experience"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <span className={`font-bold text-xs sm:text-[13px] text-zinc-900 print:text-black`}>
                <EditableField
                  editable={editable}
                  value={exp.jobTitle}
                  onChange={(v) => updateExperience(exp.id, "jobTitle", v)}
                  placeholder="Job Title"
                />
              </span>
              <span className={`text-xs text-zinc-600 font-medium flex items-center gap-1 shrink-0 whitespace-nowrap`}>
                <EditableField
                  editable={editable}
                  value={exp.startDate}
                  onChange={(v) => updateExperience(exp.id, "startDate", v)}
                  placeholder="Start"
                />
                <span>–</span>
                <EditableField
                  editable={editable}
                  value={exp.current ? "Present" : exp.endDate}
                  onChange={(v) => updateExperience(exp.id, "endDate", v)}
                  placeholder="End / Present"
                />
              </span>
            </div>

            <div className={`text-xs text-zinc-700 flex items-center justify-between gap-2`}>
              <span className="font-semibold text-zinc-800">
                <EditableField
                  editable={editable}
                  value={exp.company}
                  onChange={(v) => updateExperience(exp.id, "company", v)}
                  placeholder="Company Name"
                />
              </span>
              {(exp.location || editable) && (
                <span className="shrink-0 whitespace-nowrap text-zinc-500 font-normal">
                  <EditableField
                    editable={editable}
                    value={exp.location || ""}
                    onChange={(v) => updateExperience(exp.id, "location", v)}
                    placeholder="Location"
                  />
                </span>
              )}
            </div>

            {(exp.description || editable) && (
              <p className={`text-xs ${textSecondary} pt-0.5 leading-relaxed`}>
                <EditableField
                  editable={editable}
                  multiline
                  value={exp.description}
                  onChange={(v) => updateExperience(exp.id, "description", v)}
                  placeholder="Role overview or team scope description..."
                />
              </p>
            )}

            {exp.achievements && exp.achievements.length > 0 && (
              <ul className={`list-disc list-outside pl-4 text-xs space-y-1 ${textSecondary} pt-0.5 leading-relaxed`}>
                {exp.achievements.map((ach, i) => (
                  <li key={i} className="group/bullet relative">
                    <EditableField
                      editable={editable}
                      multiline
                      value={ach}
                      onChange={(v) => updateExperienceAchievement(exp.id, i, v)}
                      placeholder="Bullet point achievement..."
                    />
                    {editable && (
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteExperienceAchievement(exp.id, i);
                        }}
                        className="opacity-0 group-hover/bullet:opacity-100 ml-2 px-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-all print:hidden text-[11px] inline-flex items-center cursor-pointer"
                        title="Remove bullet"
                      >
                        ✕
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {editable && (
              <button
                type="button"
                onClick={() => addExperienceAchievement(exp.id)}
                className="mt-1 text-[11px] text-primary-500 hover:text-primary-600 font-medium inline-flex items-center gap-1 print:hidden opacity-70 hover:opacity-100"
              >
                <Plus className="h-3 w-3" /> Add bullet point
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render Education Block (Clean ATS / HR standard)
  const renderEducation = () => (
    <div>
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-zinc-300 print:border-zinc-400">
        <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-zinc-900 print:text-black flex items-center gap-2">
          Education
        </h2>
        <div className="flex items-center gap-2 print:hidden">
          {renderSectionMoveControls("education")}
          {editable && (
            <button
              type="button"
              onClick={addEducation}
              className="text-[11px] font-semibold text-primary-500 hover:text-primary-600 inline-flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Add Education
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        {data.education.map((edu) => (
          <div key={edu.id} className="space-y-0.5 relative group/edu pr-8">
            {editable && (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteEducation(edu.id);
                }}
                className="absolute right-0 top-0.5 z-30 opacity-0 group-hover/edu:opacity-100 p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all print:hidden cursor-pointer"
                title="Delete education"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <div className="flex items-baseline justify-between flex-wrap gap-1">
              <span className={`font-bold text-xs sm:text-[13px] text-zinc-900 print:text-black`}>
                <EditableField
                  editable={editable}
                  value={edu.degree}
                  onChange={(v) => updateEducation(edu.id, "degree", v)}
                  placeholder="Degree"
                />
                <span className="mx-1 font-normal text-zinc-600">in</span>
                <EditableField
                  editable={editable}
                  value={edu.field || ""}
                  onChange={(v) => updateEducation(edu.id, "field", v)}
                  placeholder="Field of Study"
                />
              </span>
              <span className={`text-xs text-zinc-600 font-medium flex items-center gap-1 shrink-0 whitespace-nowrap`}>
                <EditableField
                  editable={editable}
                  value={edu.startDate || ""}
                  onChange={(v) => updateEducation(edu.id, "startDate", v)}
                  placeholder="Start"
                />
                <span>–</span>
                <EditableField
                  editable={editable}
                  value={edu.current ? "Present" : edu.endDate || ""}
                  onChange={(v) => updateEducation(edu.id, "endDate", v)}
                  placeholder="Graduation"
                />
              </span>
            </div>
            <div className={`text-xs text-zinc-700 flex items-center justify-between gap-2`}>
              <span className="font-semibold text-zinc-800">
                <EditableField
                  editable={editable}
                  value={edu.institution}
                  onChange={(v) => updateEducation(edu.id, "institution", v)}
                  placeholder="University / School"
                />
              </span>
              {(edu.gpa || editable) && (
                <span className="inline-flex items-center gap-1 shrink-0 whitespace-nowrap text-zinc-500 font-normal">
                  GPA:
                  <EditableField
                    editable={editable}
                    value={edu.gpa || ""}
                    onChange={(v) => updateEducation(edu.id, "gpa", v)}
                    placeholder="3.8"
                  />
                </span>
              )}
            </div>
            {(edu.description || editable) && (
              <p className={`text-xs ${textSecondary} leading-relaxed`}>
                <EditableField
                  editable={editable}
                  multiline
                  value={edu.description || ""}
                  onChange={(v) => updateEducation(edu.id, "description", v)}
                  placeholder="Honors, activities, or coursework..."
                />
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render Skills Block (Clean ATS / HR standard)
  const renderSkills = (isPills = false) => (
    <div>
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-zinc-300 print:border-zinc-400">
        <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-zinc-900 print:text-black flex items-center gap-2">
          Skills & Technologies
        </h2>
        <div className="flex items-center gap-2 print:hidden">
          {renderSectionMoveControls("skills")}
          {editable && (
            <button
              type="button"
              onClick={addSkill}
              className="text-[11px] font-semibold text-primary-500 hover:text-primary-600 inline-flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Add Skill
            </button>
          )}
        </div>
      </div>

      {isPills ? (
        <div className="flex flex-wrap gap-1.5 items-center">
          {data.skills.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium border group/skill"
              style={{
                backgroundColor: isWhite ? `${primaryColor}15` : `${primaryColor}10`,
                borderColor: isWhite ? `${primaryColor}40` : `${primaryColor}30`,
                color: primaryColor,
              }}
            >
              <EditableField
                editable={editable}
                value={skill.name}
                onChange={(v) => updateSkill(i, v)}
                placeholder="Skill"
              />
              {editable && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteSkill(i);
                  }}
                  className="opacity-0 group-hover/skill:opacity-100 ml-1.5 text-muted-foreground hover:text-destructive text-[10px] print:hidden cursor-pointer"
                  title="Remove skill"
                >
                  ✕
                </button>
              )}
            </span>
          ))}
        </div>
      ) : (
        <div className={`flex flex-wrap gap-x-2 gap-y-1.5 text-xs ${textPrimary} items-center leading-relaxed`}>
          {data.skills.map((skill, i) => (
            <span key={i} className="inline-flex items-center group/skill">
              <span className="font-medium text-zinc-800">
                <EditableField
                  editable={editable}
                  value={skill.name}
                  onChange={(v) => updateSkill(i, v)}
                  placeholder="Skill"
                />
              </span>
              {editable && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteSkill(i);
                  }}
                  className="opacity-0 group-hover/skill:opacity-100 ml-1 text-muted-foreground hover:text-destructive text-[10px] print:hidden cursor-pointer"
                  title="Remove skill"
                >
                  ✕
                </button>
              )}
              {i < data.skills.length - 1 && <span className={`${textMuted} ml-2 select-none opacity-50`}>•</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  // Render Projects Block (Clean ATS / HR standard)
  const renderProjects = () =>
    data.projects && (data.projects.length > 0 || editable) ? (
      <div>
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-zinc-300 print:border-zinc-400">
          <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-zinc-900 print:text-black flex items-center gap-2">
            Projects
          </h2>
          <div className="flex items-center gap-2 print:hidden">
            {renderSectionMoveControls("projects")}
            {editable && (
              <button
                type="button"
                onClick={() => {
                  if (!onDataChange) return;
                  const newProj = {
                    id: `proj_${Date.now()}`,
                    name: "Project Name",
                    description: "Key technologies used and project results achieved.",
                    technologies: ["React", "Node.js"],
                  };
                  onDataChange({
                    ...data,
                    projects: [...(data.projects || []), newProj],
                  });
                }}
                className="text-[11px] font-semibold text-primary-500 hover:text-primary-600 inline-flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add Project
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          {data.projects.map((proj) => (
            <div key={proj.id} className="space-y-0.5 relative group/proj pr-8">
              {editable && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!onDataChange) return;
                  onDataChange({
                    ...data,
                    projects: (data.projects || []).filter((p) => p.id !== proj.id),
                  });
                }}
                className="absolute right-0 top-0.5 z-30 opacity-0 group-hover/proj:opacity-100 p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all print:hidden cursor-pointer"
                title="Delete project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <div className="flex items-baseline justify-between flex-wrap gap-1">
              <span className={`font-bold text-xs sm:text-[13px] text-zinc-900 print:text-black`}>
                <EditableField
                  editable={editable}
                  value={proj.name}
                  onChange={(v) => updateProject(proj.id, "name", v)}
                  placeholder="Project Title"
                />
              </span>
              {proj.technologies && proj.technologies.length > 0 && (
                <span className={`text-xs text-zinc-500 font-normal`}>
                  ({proj.technologies.join(", ")})
                </span>
              )}
              {/* Project live URL and GitHub hyperlinks */}
              <div className="flex items-center gap-2 text-[11px]">
                {proj.projectUrl && (
                  <a
                    href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline font-medium inline-flex items-center gap-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Live Demo
                  </a>
                )}
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl.startsWith("http") ? proj.githubUrl : `https://${proj.githubUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-600 hover:text-zinc-800 underline font-medium inline-flex items-center gap-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
            <p className={`text-xs ${textSecondary} leading-relaxed`}>
              <EditableField
                editable={editable}
                multiline
                value={proj.description}
                onChange={(v) => updateProject(proj.id, "description", v)}
                placeholder="Project impact and architecture summary..."
              />
            </p>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  // Render Certifications Block (Clean ATS / HR standard)
  const renderCertifications = () =>
    data.certifications && (data.certifications.length > 0 || editable) ? (
      <div>
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-zinc-300 print:border-zinc-400">
          <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-zinc-900 print:text-black flex items-center gap-2">
            Certifications
          </h2>
          <div className="flex items-center gap-2 print:hidden">
            {renderSectionMoveControls("certifications")}
            {editable && (
              <button
                type="button"
                onClick={() => {
                  if (!onDataChange) return;
                  const newCert = {
                    id: `cert_${Date.now()}`,
                    name: "Certification Name",
                    organization: "Issuing Organization",
                    issueDate: "2024",
                  };
                  onDataChange({
                    ...data,
                    certifications: [...(data.certifications || []), newCert],
                  });
                }}
                className="text-[11px] font-semibold text-primary-500 hover:text-primary-600 inline-flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add Cert
              </button>
            )}
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          {data.certifications.map((c) => (
            <div key={c.id} className="flex items-center justify-between group/cert relative">
              <span className={`font-semibold text-zinc-800`}>
                <EditableField
                  editable={editable}
                  value={c.name}
                  onChange={(v) => updateCertification(c.id, "name", v)}
                  placeholder="Certificate Name"
                />
              </span>
              <span className={`${textMuted} flex items-center gap-2`}>
                <EditableField
                  editable={editable}
                  value={c.organization}
                  onChange={(v) => updateCertification(c.id, "organization", v)}
                  placeholder="Issuer"
                />
                {editable && (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!onDataChange) return;
                      onDataChange({
                        ...data,
                        certifications: (data.certifications || []).filter((item) => item.id !== c.id),
                      });
                    }}
                    className="opacity-0 group-hover/cert:opacity-100 text-muted-foreground hover:text-destructive px-1 rounded hover:bg-destructive/10 text-[10px] print:hidden cursor-pointer"
                    title="Remove certification"
                  >
                    ✕
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    ) : null;

  // Layout selection container
  return (
    <div
      id={elementId || undefined}
      className={`resume-print-area ${paperContainerClass} transition-all ${fontSize} ${className}`}
      style={{
        fontFamily,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top center",
      }}
    >
      {/* 1. Left Sidebar Layout */}
      {layout === "left-sidebar-dark" ? (
        <div className="grid grid-cols-12 min-h-[950px]">
          {/* Left Column Accent */}
          <div
            className="col-span-4 p-6 text-white space-y-6 flex flex-col justify-between"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  <EditableField
                    as="span"
                    editable={editable}
                    value={data.personal.fullName}
                    onChange={(v) => updatePersonal("fullName", v)}
                    placeholder="Your Full Name"
                  />
                </h1>
                {(data.personal.jobTitle || editable) && (
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-90 mt-1">
                    <EditableField
                      editable={editable}
                      value={data.personal.jobTitle || ""}
                      onChange={(v) => updatePersonal("jobTitle", v)}
                      placeholder="Your Job Title"
                    />
                  </p>
                )}
              </div>

              <div className="space-y-2 text-xs opacity-90">
                <p className="font-bold uppercase tracking-wider text-[11px] opacity-80 border-b border-white/20 pb-1">
                  Contact
                </p>
                {renderContacts("white", true, true)}
              </div>

              <div className="space-y-2">
                <p className="font-bold uppercase tracking-wider text-[11px] opacity-80 border-b border-white/20 pb-1">
                  Skills
                </p>
                <div className="flex flex-wrap gap-1">
                  {data.skills.map((s, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-white/15 text-white font-medium group/s inline-flex items-center"
                    >
                      <EditableField
                        editable={editable}
                        value={s.name}
                        onChange={(v) => updateSkill(i, v)}
                        placeholder="Skill"
                      />
                      {editable && (
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteSkill(i);
                          }}
                          className="opacity-0 group-hover/s:opacity-100 ml-1 text-white/80 hover:text-white text-[10px] print:hidden cursor-pointer"
                          title="Remove skill"
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))}
                  {editable && (
                    <button
                      onClick={addSkill}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/90 hover:bg-white/20 font-medium inline-flex items-center gap-1 print:hidden"
                    >
                      <Plus className="h-2.5 w-2.5" /> Add
                    </button>
                  )}
                </div>
              </div>

              {data.languages && data.languages.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <p className="font-bold uppercase tracking-wider text-[11px] opacity-80 border-b border-white/20 pb-1">
                    Languages
                  </p>
                  {data.languages.map((l, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{l.language}</span>
                      <span className="opacity-75">{l.proficiency}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-[10px] opacity-60">ATS Compatible Resume</div>
          </div>

          {/* Right Main Column */}
          <div className={`col-span-8 ${paddingClass} ${spacingClass}`}>
            {currentOrder
              .filter((k) => k !== "skills")
              .map((secKey) => {
                switch (secKey) {
                  case "summary":
                    return wrapSection("summary", renderSummary("About Me", false));
                  case "experience":
                    return wrapSection("experience", renderExperience());
                  case "education":
                    return wrapSection("education", renderEducation());
                  case "projects":
                    return wrapSection("projects", renderProjects());
                  case "certifications":
                    return wrapSection("certifications", renderCertifications());
                  default:
                    return null;
                }
              })}
          </div>
        </div>
      ) : layout === "right-sidebar" ? (
        /* 2. Right Sidebar Modern Layout */
        <div className="grid grid-cols-12 min-h-[950px]">
          {/* Left Main Column (8 cols) */}
          <div className={`col-span-8 ${paddingClass} ${spacingClass}`}>
            <div className={`border-b ${borderSubtle} pb-3 mb-1 space-y-1`}>
              <h1 className="text-2xl sm:text-[27px] font-bold tracking-tight leading-tight text-zinc-900 print:text-black">
                <EditableField
                  as="span"
                  editable={editable}
                  value={data.personal.fullName}
                  onChange={(v) => updatePersonal("fullName", v)}
                  placeholder="Your Full Name"
                />
              </h1>
              {(data.personal.jobTitle || editable) && (
                <p className="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-zinc-600 print:text-zinc-800">
                  <EditableField
                    as="span"
                    editable={editable}
                    value={data.personal.jobTitle || ""}
                    onChange={(v) => updatePersonal("jobTitle", v)}
                    placeholder="Professional Title"
                  />
                </p>
              )}
            </div>
            {currentOrder
              .filter((k) => ["summary", "experience", "projects"].includes(k))
              .map((secKey) => {
                if (secKey === "summary") return wrapSection("summary", renderSummary());
                if (secKey === "experience") return wrapSection("experience", renderExperience());
                if (secKey === "projects") return wrapSection("projects", renderProjects());
                return null;
              })}
          </div>

          {/* Right Shaded Sidebar (4 cols) */}
          <div className={`col-span-4 p-6 space-y-6 border-l border-zinc-200 dark:border-border/50 ${
            isWhite ? "bg-zinc-50/90 text-zinc-900" : "bg-muted/30 text-foreground"
          }`}>
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 print:text-black border-b border-zinc-200 dark:border-border/50 pb-1" style={{ color: primaryColor }}>
                Contact
              </h3>
              {renderContacts(primaryColor, false, true)}
            </div>
            {currentOrder.includes("education") && wrapSection("education", renderEducation())}
            {currentOrder.includes("skills") && wrapSection("skills", renderSkills(true))}
            {currentOrder.includes("certifications") && wrapSection("certifications", renderCertifications())}
          </div>
        </div>
      ) : layout === "top-hero-banner" ? (
        /* 3. Top Hero Banner Layout */
        <div>
          <div className="p-8 text-white space-y-3" style={{ backgroundColor: primaryColor }}>
            <h1 className="text-3xl font-black">
              <EditableField
                as="span"
                editable={editable}
                value={data.personal.fullName}
                onChange={(v) => updatePersonal("fullName", v)}
                placeholder="Your Full Name"
              />
            </h1>
            {(data.personal.jobTitle || editable) && (
              <p className="text-sm font-semibold opacity-90 uppercase tracking-widest">
                <EditableField
                  editable={editable}
                  value={data.personal.jobTitle || ""}
                  onChange={(v) => updatePersonal("jobTitle", v)}
                  placeholder="Your Job Title"
                />
              </p>
            )}
            {renderContacts("white", true)}
          </div>
          <div className={`${paddingClass} ${spacingClass}`}>
            {currentOrder.includes("summary") && wrapSection("summary", renderSummary("Executive Summary", false))}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 space-y-6">
                {currentOrder
                  .filter((k) => ["experience", "projects"].includes(k))
                  .map((secKey) => {
                    if (secKey === "experience")
                      return wrapSection("experience", renderExperience());
                    if (secKey === "projects")
                      return wrapSection("projects", renderProjects());
                    return null;
                  })}
              </div>
              <div className="md:col-span-4 space-y-6">
                {currentOrder
                  .filter((k) => ["skills", "education", "certifications"].includes(k))
                  .map((secKey) => {
                    if (secKey === "skills")
                      return wrapSection("skills", renderSkills(true));
                    if (secKey === "education")
                      return wrapSection("education", renderEducation());
                    if (secKey === "certifications")
                      return wrapSection("certifications", renderCertifications());
                    return null;
                  })}
              </div>
            </div>
          </div>
        </div>
      ) : layout === "split-header-classic" ? (
        /* 4. Split Header Classic Layout */
        <div className={`${paddingClass} ${spacingClass}`}>
          {/* Split Header */}
          <div className="grid grid-cols-12 gap-4 items-center pb-4 mb-2 border-b-2" style={{ borderColor: primaryColor }}>
            <div className="col-span-7 pl-3.5 border-l-4" style={{ borderColor: primaryColor }}>
              <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-zinc-900 print:text-black leading-tight">
                <EditableField
                  as="span"
                  editable={editable}
                  value={data.personal.fullName}
                  onChange={(v) => updatePersonal("fullName", v)}
                  placeholder="Your Full Name"
                />
              </h1>
              {(data.personal.jobTitle || editable) && (
                <p className="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-zinc-600 print:text-zinc-800 mt-0.5">
                  <EditableField
                    as="span"
                    editable={editable}
                    value={data.personal.jobTitle || ""}
                    onChange={(v) => updatePersonal("jobTitle", v)}
                    placeholder="Professional Title"
                  />
                </p>
              )}
            </div>
            <div className="col-span-5 p-2.5 rounded-sm bg-zinc-50 dark:bg-muted/30 border border-zinc-200 dark:border-border/50">
              {renderContacts(primaryColor, false, true)}
            </div>
          </div>

          {/* Dynamic Sections by Order */}
          {currentOrder.map((secKey) => {
            switch (secKey) {
              case "summary":
                return wrapSection("summary", renderSummary());
              case "experience":
                return wrapSection("experience", renderExperience());
              case "skills":
                return wrapSection("skills", renderSkills());
              case "education":
                return wrapSection("education", renderEducation());
              case "projects":
                return wrapSection("projects", renderProjects());
              case "certifications":
                return wrapSection("certifications", renderCertifications());
              default:
                return null;
            }
          })}
        </div>
      ) : layout === "compact-grid" ? (
        /* 5. Compact 2-Column Grid Layout */
        <div className={`${paddingClass} ${spacingClass}`}>
          {/* Centered Modern Header */}
          <div className="text-center pb-3 mb-2 border-b border-zinc-200 space-y-1">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-zinc-900 print:text-black">
              <EditableField
                as="span"
                editable={editable}
                value={data.personal.fullName}
                onChange={(v) => updatePersonal("fullName", v)}
                placeholder="Your Full Name"
              />
            </h1>
            {(data.personal.jobTitle || editable) && (
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: primaryColor }}>
                <EditableField
                  as="span"
                  editable={editable}
                  value={data.personal.jobTitle || ""}
                  onChange={(v) => updatePersonal("jobTitle", v)}
                  placeholder="Professional Title"
                />
              </p>
            )}
            <div className="pt-1">{renderContacts(primaryColor, false, false, "center")}</div>
          </div>

          {/* 2-Column Balanced Grid */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7 space-y-4">
              {currentOrder
                .filter((k) => ["summary", "experience"].includes(k))
                .map((secKey) => {
                  if (secKey === "summary") return wrapSection("summary", renderSummary());
                  if (secKey === "experience") return wrapSection("experience", renderExperience());
                  return null;
                })}
            </div>
            <div className="col-span-5 space-y-4">
              {currentOrder
                .filter((k) => ["education", "skills", "projects", "certifications"].includes(k))
                .map((secKey) => {
                  if (secKey === "education") return wrapSection("education", renderEducation());
                  if (secKey === "skills") return wrapSection("skills", renderSkills(true));
                  if (secKey === "projects") return wrapSection("projects", renderProjects());
                  if (secKey === "certifications") return wrapSection("certifications", renderCertifications());
                  return null;
                })}
            </div>
          </div>
        </div>
      ) : layout === "serif-academic-classic" ? (
        /* 6. Classical Serif Academic Layout */
        <div className={`${paddingClass} ${spacingClass} font-serif`}>
          {/* Classical Centered Ornate Header */}
          <div className="text-center pb-3 mb-3 border-b-2 border-double border-zinc-400 space-y-1">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-widest uppercase text-zinc-900 print:text-black">
              <EditableField
                as="span"
                editable={editable}
                value={data.personal.fullName}
                onChange={(v) => updatePersonal("fullName", v)}
                placeholder="Your Full Name"
              />
            </h1>
            {(data.personal.jobTitle || editable) && (
              <p className="text-xs font-serif uppercase tracking-widest italic text-zinc-700">
                <EditableField
                  as="span"
                  editable={editable}
                  value={data.personal.jobTitle || ""}
                  onChange={(v) => updatePersonal("jobTitle", v)}
                  placeholder="Academic Title"
                />
              </p>
            )}
            <div className="pt-1 font-sans">{renderContacts(primaryColor, false, false, "center")}</div>
          </div>

          {/* Academic Sections */}
          {currentOrder.map((secKey) => {
            switch (secKey) {
              case "summary":
                return wrapSection("summary", renderSummary("Curriculum Overview", false));
              case "experience":
                return wrapSection("experience", renderExperience());
              case "education":
                return wrapSection("education", renderEducation());
              case "skills":
                return wrapSection("skills", renderSkills());
              case "projects":
                return wrapSection("projects", renderProjects());
              case "certifications":
                return wrapSection("certifications", renderCertifications());
              default:
                return null;
            }
          })}
        </div>
      ) : layout === "executive-gold-frame" ? (
        /* 7. Executive Gold Frame Layout */
        <div className={`${paddingClass} ${spacingClass} pl-10 relative`} style={{ borderLeft: `5px solid ${primaryColor}` }}>
          {/* Executive Header */}
          <div className="pb-3 mb-2 border-b border-zinc-300 space-y-1">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-zinc-900 print:text-black">
              <EditableField
                as="span"
                editable={editable}
                value={data.personal.fullName}
                onChange={(v) => updatePersonal("fullName", v)}
                placeholder="Your Full Name"
              />
            </h1>
            {(data.personal.jobTitle || editable) && (
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
                <EditableField
                  as="span"
                  editable={editable}
                  value={data.personal.jobTitle || ""}
                  onChange={(v) => updatePersonal("jobTitle", v)}
                  placeholder="Executive Title"
                />
              </p>
            )}
            <div className="pt-1">{renderContacts(primaryColor)}</div>
          </div>

          {/* Executive Sections */}
          {currentOrder.map((secKey) => {
            switch (secKey) {
              case "summary":
                return wrapSection("summary", renderSummary());
              case "experience":
                return wrapSection("experience", renderExperience());
              case "skills":
                return wrapSection("skills", renderSkills());
              case "education":
                return wrapSection("education", renderEducation());
              case "projects":
                return wrapSection("projects", renderProjects());
              case "certifications":
                return wrapSection("certifications", renderCertifications());
              default:
                return null;
            }
          })}
        </div>
      ) : layout === "creative-pill-modern" ? (
        /* 8. Creative Pill Modern Layout */
        <div className={`${paddingClass} ${spacingClass}`}>
          {/* Creative Modern Header */}
          <div className="pb-3 mb-2 border-b border-zinc-200 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 print:text-black">
                <EditableField
                  as="span"
                  editable={editable}
                  value={data.personal.fullName}
                  onChange={(v) => updatePersonal("fullName", v)}
                  placeholder="Your Full Name"
                />
              </h1>
              {(data.personal.jobTitle || editable) && (
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                  <EditableField
                    as="span"
                    editable={editable}
                    value={data.personal.jobTitle || ""}
                    onChange={(v) => updatePersonal("jobTitle", v)}
                    placeholder="Creative Title"
                  />
                </span>
              )}
            </div>
            <div>{renderContacts(primaryColor)}</div>
          </div>

          {/* Creative Sections with Pill Skills */}
          {currentOrder.map((secKey) => {
            switch (secKey) {
              case "summary":
                return wrapSection("summary", renderSummary());
              case "experience":
                return wrapSection("experience", renderExperience());
              case "skills":
                return wrapSection("skills", renderSkills(true));
              case "education":
                return wrapSection("education", renderEducation());
              case "projects":
                return wrapSection("projects", renderProjects());
              case "certifications":
                return wrapSection("certifications", renderCertifications());
              default:
                return null;
            }
          })}
        </div>
      ) : layout === "timeline-modern" ? (
        /* 9. Timeline Modern Layout */
        <div className={`${paddingClass} ${spacingClass}`}>
          {/* Header */}
          <div className={`text-left border-b ${borderSubtle} pb-3 mb-1 space-y-1`}>
            <h1 className="text-2xl sm:text-[27px] font-bold tracking-tight leading-tight text-zinc-900 print:text-black">
              <EditableField
                as="span"
                editable={editable}
                value={data.personal.fullName}
                onChange={(v) => updatePersonal("fullName", v)}
                placeholder="Your Full Name"
              />
            </h1>
            {(data.personal.jobTitle || editable) && (
              <p className="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-zinc-600 print:text-zinc-800 leading-normal">
                <EditableField
                  as="span"
                  editable={editable}
                  value={data.personal.jobTitle || ""}
                  onChange={(v) => updatePersonal("jobTitle", v)}
                  placeholder="Professional Title"
                />
              </p>
            )}
            <div className="pt-1.5">{renderContacts(primaryColor)}</div>
          </div>

          {/* Timeline Sections */}
          {currentOrder.map((secKey) => {
            switch (secKey) {
              case "summary":
                return wrapSection("summary", renderSummary());
              case "experience":
                return wrapSection("experience", renderExperience(true));
              case "education":
                return wrapSection("education", renderEducation());
              case "skills":
                return wrapSection("skills", renderSkills());
              case "projects":
                return wrapSection("projects", renderProjects());
              case "certifications":
                return wrapSection("certifications", renderCertifications());
              default:
                return null;
            }
          })}
        </div>
      ) : (
        /* 10. Minimal Linear ATS (Harvard / Classic Clean) */
        <div className={`${paddingClass} ${spacingClass}`}>
          {/* Header */}
          <div className={`${templateDef.headerStyle === "centered" ? "text-center" : "text-left"} border-b ${borderSubtle} pb-3 mb-1 space-y-1`}>
            <h1 className="text-2xl sm:text-[27px] font-bold tracking-tight leading-tight text-zinc-900 print:text-black">
              <EditableField
                as="span"
                editable={editable}
                value={data.personal.fullName}
                onChange={(v) => updatePersonal("fullName", v)}
                placeholder="Your Full Name"
              />
            </h1>
            {(data.personal.jobTitle || editable) && (
              <p className="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-zinc-600 print:text-zinc-800 leading-normal">
                <EditableField
                  as="span"
                  editable={editable}
                  value={data.personal.jobTitle || ""}
                  onChange={(v) => updatePersonal("jobTitle", v)}
                  placeholder="Professional Title"
                />
              </p>
            )}
            <div className="pt-1.5">{renderContacts(primaryColor, false, false, templateDef.headerStyle === "centered" ? "center" : "left")}</div>
          </div>

          {/* Dynamic Sections by Order */}
          {currentOrder.map((secKey) => {
            switch (secKey) {
              case "summary":
                return wrapSection("summary", renderSummary());
              case "experience":
                return wrapSection("experience", renderExperience());
              case "skills":
                return wrapSection("skills", renderSkills());
              case "education":
                return wrapSection("education", renderEducation());
              case "projects":
                return wrapSection("projects", renderProjects());
              case "certifications":
                return wrapSection("certifications", renderCertifications());
              default:
                return null;
            }
          })}
        </div>
      )}
    </div>
  );
}

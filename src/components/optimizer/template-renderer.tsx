"use client";

import React from "react";
import type { TailoredResumeData } from "@/lib/ai/schemas/tailored-resume";
import { TEMPLATES_100_CATALOG, ResumeTemplateDefinition } from "@/config/templates";

export type ResumeTemplateId = string;

interface TemplateRendererProps {
  data: TailoredResumeData;
  template: ResumeTemplateId;
  fontFamily?: string;
  fontSize?: string;
  lineSpacing?: string;
  paperMode?: "white" | "dark";
  onContentChange?: (field: string, val: string) => void;
}

export function TemplateRenderer({
  data,
  template,
  fontFamily = "Inter, sans-serif",
  fontSize = "12px",
  lineSpacing = "1.2",
  paperMode = "white",
  onContentChange,
}: TemplateRendererProps) {
  // Find template definition in catalog or fallback
  const catalogMatch = TEMPLATES_100_CATALOG.find(
    (t) => t.id === template || t.name.toLowerCase() === template.toLowerCase()
  );

  const templateDef: ResumeTemplateDefinition = catalogMatch || {
    id: template || "ats-optimized_1",
    name: "Standard Resume",
    category: template?.includes("executive")
      ? "executive"
      : template?.includes("creative")
      ? "creative"
      : template?.includes("academic")
      ? "academic"
      : "ats-optimized",
    description: "Standard ATS format",
    layout: template?.includes("sidebar")
      ? "left-sidebar-dark"
      : template?.includes("executive")
      ? "executive-gold-frame"
      : template?.includes("creative")
      ? "creative-pill-modern"
      : ("single-column" as any),
    primaryColor: "#2563eb",
    headerStyle: "left-bold",
    atsScore: 95,
    atsFriendly: true,
    isPremium: false,
    pages: "one-page",
    filterCategories: ["All", "ATS Friendly", "Professional"],
    tags: ["ATS"],
  };

  const containerStyle = {
    fontFamily: templateDef.category === "academic" ? "Georgia, serif" : fontFamily,
    fontSize,
    lineHeight: lineSpacing,
  };

  const primaryColor = templateDef.primaryColor || "#2563eb";

  // White Paper Mode dynamic styles
  const isWhite = paperMode === "white";
  const textMuted = isWhite ? "text-zinc-600" : "text-muted-foreground";
  const textTitle = isWhite ? "text-zinc-900" : "text-foreground";
  const borderSubtle = isWhite ? "border-zinc-200" : "border-border/40";
  const cardBg = isWhite ? "bg-zinc-50/80 border-zinc-200" : "bg-card/40 border-border/50";
  const paperContainer = isWhite
    ? "bg-white text-zinc-900 border-zinc-200 shadow-2xl ring-1 ring-zinc-900/5"
    : "bg-background text-foreground border-border/40 shadow-2xl";

  // Google Docs-style Inline Editing Attributes & Focus Hover Styles
  const editProps = (fieldKey: string) => ({
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      if (onContentChange) {
        onContentChange(fieldKey, e.currentTarget.innerText);
      }
    },
  });

  // LAYOUT 1: Left Sidebar Dark / Sidebar Layout
  if (templateDef.layout === "left-sidebar-dark" || (templateDef.layout as string) === "sidebar-left") {
    return (
      <div style={containerStyle} className={`p-6 ${paperContainer} rounded-2xl border grid grid-cols-12 gap-6 min-h-[600px] relative group/doc`}>
        {/* Left Sidebar */}
        <div className="col-span-4 rounded-xl p-5 space-y-5 text-white flex flex-col justify-between" style={{ backgroundColor: primaryColor }}>
          <div className="space-y-3">
            <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg border-2 border-white/40 shadow-inner">
              {data.contactInfo.fullName.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold tracking-tight" {...editProps("fullName")}>{data.contactInfo.fullName}</h1>
              <p className="text-xs text-white/80 font-medium" {...editProps("targetRole")}>{data.targetRole}</p>
            </div>

            <div className="space-y-1.5 text-xs text-white/90 pt-2 border-t border-white/20">
              <p {...editProps("email")}>{data.contactInfo.email}</p>
              <p {...editProps("phone")}>{data.contactInfo.phone}</p>
              <p {...editProps("location")}>{data.contactInfo.location}</p>
              {data.contactInfo.linkedin && <p className="truncate" {...editProps("linkedin")}>{data.contactInfo.linkedin}</p>}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/20">
            <h3 className="font-bold text-xs uppercase tracking-wider">Key Skills</h3>
            <div className="flex flex-wrap gap-1">
              {data.skills.highlightedSkills.map((s, idx) => (
                <span key={idx} className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-semibold" {...editProps(`skill_${idx}`)}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="col-span-8 space-y-5 py-2">
          <div className="space-y-1.5 border-b border-border/40 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
              Executive Summary
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed" {...editProps("summary")}>{data.summary.tailored}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
              Work Experience
            </h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>
                    <span {...editProps(`exp_role_${i}`)}>{exp.jobTitle}</span> — <span style={{ color: primaryColor }} {...editProps(`exp_company_${i}`)}>{exp.company}</span>
                  </span>
                  <span className="text-muted-foreground font-normal" {...editProps(`exp_dates_${i}`)}>{exp.dates}</span>
                </div>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1 pl-1">
                  {exp.bullets.map((b, j) => (
                    <li key={j} {...editProps(`bullet_${i}_${j}`)}>{b.tailored}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
              Education
            </h2>
            {data.education.map((edu, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="font-semibold" {...editProps(`edu_degree_${i}`)}>{edu.degree}, {edu.institution}</span>
                <span className="text-muted-foreground" {...editProps(`edu_dates_${i}`)}>{edu.dates}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // LAYOUT 2: Executive Gold Frame
  if (templateDef.layout === "executive-gold-frame" || templateDef.category === "executive") {
    return (
      <div style={{ ...containerStyle, borderColor: primaryColor }} className={`p-8 space-y-6 ${paperContainer} border-2`}>
        <div className="text-center border-b-2 pb-4 space-y-1.5" style={{ borderColor: `${primaryColor}50` }}>
          <div className="h-12 w-12 mx-auto rounded-full text-white flex items-center justify-center font-serif text-base font-bold shadow-md" style={{ backgroundColor: primaryColor }}>
            {data.contactInfo.fullName.split(" ").map((n) => n[0]).join("")}
          </div>
          <h1 className="font-serif text-2xl font-extrabold uppercase tracking-wide" style={{ color: primaryColor }} {...editProps("fullName")}>
            {data.contactInfo.fullName}
          </h1>
          <p className={`text-xs font-semibold uppercase tracking-widest ${textMuted}`} {...editProps("targetRole")}>{data.targetRole}</p>
          <p className={`text-[11px] ${textMuted}`} {...editProps("contactLine")}>
            {[data.contactInfo.email, data.contactInfo.phone, data.contactInfo.location, data.contactInfo.linkedin].filter(Boolean).join(" | ")}
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>
            Executive Profile
          </h2>
          <p className={`text-xs leading-relaxed italic ${textMuted}`} {...editProps("summary")}>{data.summary.tailored}</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>
            Professional Experience
          </h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>
                  <span {...editProps(`exp_role_${i}`)}>{exp.jobTitle}</span> | <span style={{ color: primaryColor }} {...editProps(`exp_company_${i}`)}>{exp.company}</span>
                </span>
                <span className={`${textMuted} font-normal`} {...editProps(`exp_dates_${i}`)}>{exp.dates}</span>
              </div>
              <ul className={`list-square list-inside text-xs ${textMuted} space-y-1`}>
                {exp.bullets.map((b, j) => (
                  <li key={j} {...editProps(`bullet_${i}_${j}`)}>{b.tailored}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>
            Core Competencies
          </h2>
          <p className={`text-xs ${textMuted}`} {...editProps("skills")}>{data.skills.highlightedSkills.join(" • ")}</p>
        </div>
      </div>
    );
  }

  // LAYOUT 3: Creative Pill Modern / Top Hero Banner
  if (templateDef.layout === "creative-pill-modern" || templateDef.layout === "top-hero-banner" || templateDef.category === "creative") {
    return (
      <div style={containerStyle} className={`p-8 space-y-6 ${paperContainer}`}>
        <div className="p-6 rounded-2xl text-white flex items-center justify-between shadow-xl" style={{ backgroundColor: primaryColor }}>
          <div>
            <h1 className="font-heading text-2xl font-bold" {...editProps("fullName")}>{data.contactInfo.fullName}</h1>
            <p className="text-xs text-white/90 font-medium mt-0.5" {...editProps("targetRole")}>{data.targetRole}</p>
            <p className="text-[11px] text-white/80 mt-2" {...editProps("contactLine")}>
              {[data.contactInfo.email, data.contactInfo.phone, data.contactInfo.location].filter(Boolean).join(" • ")}
            </p>
          </div>
          <div className="h-14 w-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-xl shadow-inner">
            {data.contactInfo.fullName.split(" ").map((n) => n[0]).join("")}
          </div>
        </div>

        <div className="space-y-2">
          <span className="rounded-full px-3 py-1 text-xs font-bold text-white uppercase tracking-wider inline-block" style={{ backgroundColor: primaryColor }}>
            About & Summary
          </span>
          <p className={`text-xs ${textMuted} leading-relaxed`} {...editProps("summary")}>{data.summary.tailored}</p>
        </div>

        <div className="space-y-4">
          <span className="rounded-full px-3 py-1 text-xs font-bold text-white uppercase tracking-wider inline-block" style={{ backgroundColor: primaryColor }}>
            Career Accomplishments
          </span>
          {data.experience.map((exp, i) => (
            <div key={i} className={`rounded-xl border p-4 space-y-2 ${cardBg}`}>
              <div className="flex justify-between text-xs font-bold">
                <span>
                  <span {...editProps(`exp_role_${i}`)}>{exp.jobTitle}</span> — <span style={{ color: primaryColor }} {...editProps(`exp_company_${i}`)}>{exp.company}</span>
                </span>
                <span className={`${textMuted} font-normal`} {...editProps(`exp_dates_${i}`)}>{exp.dates}</span>
              </div>
              <ul className={`list-disc list-inside text-xs ${textMuted} space-y-1`}>
                {exp.bullets.map((b, j) => (
                  <li key={j} {...editProps(`bullet_${i}_${j}`)}>{b.tailored}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <span className="rounded-full px-3 py-1 text-xs font-bold text-white uppercase tracking-wider inline-block" style={{ backgroundColor: primaryColor }}>
            Featured Skills
          </span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {data.skills.highlightedSkills.map((s, idx) => (
              <span key={idx} className={`rounded-full border px-3 py-1 text-xs font-semibold ${isWhite ? "text-zinc-800 bg-zinc-100 border-zinc-200" : "text-foreground bg-muted/30 border-border/50"}`} {...editProps(`skill_${idx}`)}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT / ATS OPTIMIZED LAYOUT
  return (
    <div style={containerStyle} className={`p-8 space-y-5 ${paperContainer} font-sans`}>
      <div className={`border-b ${borderSubtle} pb-4 flex justify-between items-end`}>
        <div>
          <h1 className="font-heading text-2xl font-bold" style={{ color: primaryColor }} {...editProps("fullName")}>
            {data.contactInfo.fullName}
          </h1>
          <p className={`text-xs font-semibold ${textMuted} mt-0.5`} {...editProps("targetRole")}>{data.targetRole}</p>
        </div>
        <div className={`text-right text-[11px] ${textMuted} space-y-0.5`} {...editProps("contactLine")}>
          <p>{data.contactInfo.email} • {data.contactInfo.phone}</p>
          <p>{data.contactInfo.location} • {data.contactInfo.linkedin}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
          Professional Summary
        </h2>
        <p className={`text-xs leading-relaxed ${textMuted}`} {...editProps("summary")}>{data.summary.tailored}</p>
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
          Technical & Core Skills
        </h2>
        <p className={`text-xs ${textMuted}`} {...editProps("skills")}>{data.skills.highlightedSkills.join(" • ")}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
          Work Experience
        </h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>
                <span {...editProps(`exp_role_${i}`)}>{exp.jobTitle}</span> — <span style={{ color: primaryColor }} {...editProps(`exp_company_${i}`)}>{exp.company}</span>
              </span>
              <span className={`${textMuted} font-normal`} {...editProps(`exp_dates_${i}`)}>{exp.dates}</span>
            </div>
            <ul className={`list-disc list-inside text-xs ${textMuted} space-y-1`}>
              {exp.bullets.map((b, j) => (
                <li key={j} {...editProps(`bullet_${i}_${j}`)}>{b.tailored}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
          Education
        </h2>
        {data.education.map((edu, i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="font-semibold" {...editProps(`edu_degree_${i}`)}>{edu.degree}, {edu.institution}</span>
            <span className={textMuted} {...editProps(`edu_dates_${i}`)}>{edu.dates}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

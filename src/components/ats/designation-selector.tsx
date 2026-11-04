"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Search, Briefcase, Sparkles, Check, ChevronDown, X, BookOpen, Layers } from "lucide-react";
import {
  searchJobTemplates,
  getJobTemplateByTitle,
  JOB_DEPARTMENTS,
  JobTemplate,
} from "@/data/job-templates";

interface DesignationSelectorProps {
  onSelect: (template: JobTemplate) => void;
  selectedTitle?: string;
  onClear?: () => void;
}

export function DesignationSelector({
  onSelect,
  selectedTitle = "",
  onClear,
}: DesignationSelectorProps) {
  const [query, setQuery] = useState(selectedTitle);
  const [selectedDept, setSelectedDept] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<JobTemplate | null>(null);
  const [isBrowseModalOpen, setIsBrowseModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external selected title if changed and resolve template
  useEffect(() => {
    if (selectedTitle) {
      if (selectedTitle !== query) {
        setQuery(selectedTitle);
      }
      const match = getJobTemplateByTitle(selectedTitle);
      if (match) {
        setActiveTemplate(match);
      }
    } else {
      if (!query) {
        setActiveTemplate(null);
      }
    }
  }, [selectedTitle]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter templates for the quick dropdown
  const filteredTemplates = useMemo(() => {
    return searchJobTemplates(query, selectedDept, 15);
  }, [query, selectedDept]);

  // Filter templates for the full browse modal
  const modalTemplates = useMemo(() => {
    return searchJobTemplates(modalSearch, selectedDept, 350);
  }, [modalSearch, selectedDept]);

  const handleChoose = (template: JobTemplate) => {
    setQuery(template.title);
    setActiveTemplate(template);
    setIsOpen(false);
    setIsBrowseModalOpen(false);
    onSelect(template);
  };

  const handleClear = () => {
    setQuery("");
    setActiveTemplate(null);
    onClear?.();
  };

  return (
    <div ref={containerRef} className="relative w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary-500" />
          Select Target Designation (300+ Roles Available)
        </label>
        <button
          type="button"
          onClick={() => setIsBrowseModalOpen(true)}
          className="text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1 hover:underline cursor-pointer"
        >
          <BookOpen className="h-3 w-3" />
          Browse All Roles
        </button>
      </div>

      {/* Input Field with Dropdown Trigger */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Type a designation (e.g. React Developer, DevOps, Data Scientist, Product Manager)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-20 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 shadow-xs"
          />

          <div className="absolute right-2.5 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                title="Clear designation"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-md p-2 shadow-2xl space-y-2 animate-in fade-in-0 zoom-in-95 duration-100 max-h-[360px] flex flex-col">
            {/* Department Quick Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-1 px-1 border-b border-border/40 scrollbar-none text-xs">
              {JOB_DEPARTMENTS.slice(0, 7).map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedDept === dept
                      ? "bg-primary-500 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div className="overflow-y-auto space-y-1 flex-1 pr-1">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleChoose(template)}
                    className="w-full text-left rounded-xl p-2.5 hover:bg-muted/60 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="space-y-0.5 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground group-hover:text-primary-500 transition-colors">
                          {template.title}
                        </span>
                        <span className="text-[10px] font-medium rounded-full bg-primary-500/10 text-primary-500 px-2 py-0.5">
                          {template.department}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                        <span>{template.experienceLevel}</span>
                        <span>•</span>
                        <span className="truncate">Skills: {template.requiredSkills.slice(0, 4).join(", ")}</span>
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-primary-500/10 px-2 py-1 text-xs font-semibold text-primary-500">
                        Use Role <Check className="h-3 w-3" />
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  <Briefcase className="h-6 w-6 mx-auto mb-2 opacity-40" />
                  <p>No exact match for &quot;{query}&quot;.</p>
                  <p className="text-xs mt-1">You can still type a custom description below.</p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border/40 px-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Showing {filteredTemplates.length} matching roles</span>
              <span>Click any role to auto-populate description &amp; ATS keywords</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Designation Badge & Skills Preview */}
      {activeTemplate && (
        <div className="rounded-xl border border-primary-500/30 bg-primary-500/5 p-3 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-foreground">
                Selected Role: {activeTemplate.title}
              </span>
              <span className="text-[10px] rounded-md bg-primary-500/20 text-primary-500 font-medium px-1.5 py-0.5">
                {activeTemplate.department}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Change
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-muted-foreground font-medium">Target ATS Keywords:</span>
            {activeTemplate.requiredSkills.map((skill) => (
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

      {/* Browse All Roles Modal */}
      {isBrowseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl border border-border bg-card p-6 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div className="space-y-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary-500" />
                  Explore 300+ Industry Designations
                </h3>
                <p className="text-xs text-muted-foreground">
                  Select your target role to automatically fill the description and optimize your resume for ATS algorithms.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBrowseModalOpen(false)}
                className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search within Modal */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search across 300+ designations by role, department, or required skill (e.g. Next.js, Kubernetes, NLP, Product)..."
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-10 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              {modalSearch && (
                <button
                  type="button"
                  onClick={() => setModalSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Department Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {JOB_DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedDept === dept
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Roles Grid */}
            <div className="overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pr-1 min-h-[300px]">
              {modalTemplates.length > 0 ? (
                modalTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleChoose(template)}
                    className="rounded-2xl border border-border/60 bg-muted/20 p-3.5 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-primary-500 rounded-md bg-primary-500/10 px-2 py-0.5">
                          {template.department}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {template.experienceLevel}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm group-hover:text-primary-500 transition-colors line-clamp-1">
                        {template.title}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {template.requiredSkills.slice(0, 3).map((s) => (
                        <span key={s} className="text-[10px] rounded bg-background border border-border/60 px-1.5 py-0.5 text-muted-foreground">
                          {s}
                        </span>
                      ))}
                      {template.requiredSkills.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">+{template.requiredSkills.length - 3}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="font-medium text-sm">No designations found matching &quot;{modalSearch}&quot;</p>
                  <p className="text-xs mt-1">Try another keyword or select &quot;All&quot; departments.</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <span>Showing {modalTemplates.length} matching roles</span>
              <button
                type="button"
                onClick={() => setIsBrowseModalOpen(false)}
                className="px-4 py-1.5 rounded-xl border border-border hover:bg-muted font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

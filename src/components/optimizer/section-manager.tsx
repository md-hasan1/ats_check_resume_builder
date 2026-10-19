"use client";

import { useState } from "react";
import {
  Layers,
  ChevronDown,
  ChevronUp,
  Trash2,
  Copy,
  Plus,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";

export interface ResumeSectionItem {
  id: string;
  title: string;
  type: "summary" | "experience" | "skills" | "education" | "projects" | "certifications" | "custom";
  content: string;
  collapsed?: boolean;
}

interface SectionManagerProps {
  sections: ResumeSectionItem[];
  onReorder: (newSections: ResumeSectionItem[]) => void;
  onDeleteSection: (id: string) => void;
  onDuplicateSection: (id: string) => void;
  onAddSection: (title: string, type: ResumeSectionItem["type"]) => void;
  onToggleCollapse: (id: string) => void;
}

export function SectionManager({
  sections,
  onReorder,
  onDeleteSection,
  onDuplicateSection,
  onAddSection,
  onToggleCollapse,
}: SectionManagerProps) {
  const [newTitle, setNewTitle] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSecs = [...sections];
    const [moved] = newSecs.splice(index, 1);
    newSecs.splice(targetIndex, 0, moved);
    onReorder(newSecs);
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddSection(newTitle.trim(), "custom");
    setNewTitle("");
    setShowAddModal(false);
  };

  return (
    <div className="glass rounded-2xl p-5 space-y-4 border border-border/50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-bold flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary-500" /> Resume Section Manager
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Reorder, add, duplicate, or remove sections.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex h-8 items-center gap-1.5 rounded-xl gradient-bg px-3 text-xs font-semibold text-white shadow-sm transition-transform hover:scale-105"
        >
          <Plus className="h-3.5 w-3.5" /> Add Section
        </button>
      </div>

      {/* Sections List */}
      <div className="space-y-2">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/60 px-3.5 py-2.5 text-xs transition-all hover:bg-muted/30"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />
              <span className="font-bold text-foreground">{sec.title}</span>
              <span className="rounded-full bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground uppercase">
                {sec.type}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => moveSection(idx, "up")}
                disabled={idx === 0}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:opacity-30"
                title="Move Up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => moveSection(idx, "down")}
                disabled={idx === sections.length - 1}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:opacity-30"
                title="Move Down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDuplicateSection(sec.id)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                title="Duplicate"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onToggleCollapse(sec.id)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                title={sec.collapsed ? "Expand" : "Collapse"}
              >
                {sec.collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => onDeleteSection(sec.id)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500"
                title="Delete Section"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal Input */}
      {showAddModal && (
        <div className="rounded-xl border border-primary-500/30 bg-primary-500/5 p-3 space-y-3">
          <p className="text-xs font-semibold text-primary-500">Create New Custom Section</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Section Title (e.g. Volunteer Work, Awards)..."
              className="h-9 flex-1 rounded-xl border border-border bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <button
              onClick={handleAdd}
              className="h-9 rounded-xl gradient-bg px-4 text-xs font-semibold text-white"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddModal(false)}
              className="h-9 rounded-xl border border-border/50 px-3 text-xs hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

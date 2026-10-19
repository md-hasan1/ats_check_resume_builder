"use client";

import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Type,
} from "lucide-react";

interface EditorToolbarProps {
  fontFamily: string;
  setFontFamily: (font: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  lineSpacing: string;
  setLineSpacing: (spacing: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function EditorToolbar({
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  lineSpacing,
  setLineSpacing,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: EditorToolbarProps) {
  const formatDoc = (cmd: string, value: string | undefined = undefined) => {
    document.execCommand(cmd, false, value);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border/50 bg-card/80 p-2 text-xs backdrop-blur-md shadow-sm">
      {/* History */}
      <div className="flex items-center gap-0.5 border-r border-border/50 pr-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:opacity-40"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:opacity-40"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Font Family */}
      <div className="flex items-center gap-1 border-r border-border/50 pr-2">
        <Type className="h-3.5 w-3.5 text-muted-foreground" />
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="h-8 rounded-lg border border-border/50 bg-background px-2 text-xs focus:outline-none"
        >
          <option value="Inter, sans-serif">Inter (Modern)</option>
          <option value="Roboto, sans-serif">Roboto</option>
          <option value="Arial, sans-serif">Arial (ATS Standard)</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="Georgia, serif">Georgia (Executive)</option>
          <option value="Calibri, sans-serif">Calibri</option>
        </select>
      </div>

      {/* Font Size */}
      <div className="flex items-center gap-1 border-r border-border/50 pr-2">
        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="h-8 rounded-lg border border-border/50 bg-background px-2 text-xs focus:outline-none"
        >
          <option value="11px">11 pt</option>
          <option value="12px">12 pt (Standard)</option>
          <option value="13px">13 pt</option>
          <option value="14px">14 pt</option>
          <option value="16px">16 pt (Heading)</option>
        </select>
      </div>

      {/* Basic Styles */}
      <div className="flex items-center gap-0.5 border-r border-border/50 pr-2">
        <button
          onClick={() => formatDoc("bold")}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground font-bold"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => formatDoc("italic")}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground italic"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          onClick={() => formatDoc("underline")}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground underline"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-0.5 border-r border-border/50 pr-2">
        <button
          onClick={() => formatDoc("insertUnorderedList")}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          onClick={() => formatDoc("insertOrderedList")}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 border-r border-border/50 pr-2">
        <button
          onClick={() => formatDoc("justifyLeft")}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => formatDoc("justifyCenter")}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          onClick={() => formatDoc("justifyRight")}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => formatDoc("justifyFull")}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </button>
      </div>

      {/* Line Spacing */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-muted-foreground uppercase font-medium">Spacing</span>
        <select
          value={lineSpacing}
          onChange={(e) => setLineSpacing(e.target.value)}
          className="h-8 rounded-lg border border-border/50 bg-background px-2 text-xs focus:outline-none"
        >
          <option value="1.0">1.0 (Tight)</option>
          <option value="1.15">1.15 (Standard)</option>
          <option value="1.25">1.25</option>
          <option value="1.5">1.5 (Relaxed)</option>
        </select>
      </div>
    </div>
  );
}

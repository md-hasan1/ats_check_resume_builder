"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Link2, ExternalLink, Edit3, Trash2 } from "lucide-react";
import { HyperlinkDialog } from "./hyperlink-dialog";

interface EditableFieldProps {
  value: string;
  onChange?: (value: string) => void;
  editable?: boolean;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
  isLink?: boolean;
  href?: string;
}

interface SelectionPosition {
  top: number;
  left: number;
}

/**
 * Utility to parse text with embedded markdown hyperlinks: [Anchor Text](https://example.com)
 * or bare URLs: https://... or www....
 */
export function renderTextWithLinks(text: string) {
  if (!text) return null;

  // Regex matching markdown link: [label](url) OR standard http(s)/www URLs
  const linkRegex = /\[([^\]]+)\]\(((?:https?:\/\/|mailto:|tel:|\/)[^\s)]+)\)|((?:https?:\/\/|www\.)[^\s]+)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      // Markdown link: [match[1]](match[2])
      const label = match[1];
      let url = match[2];
      if (
        !url.startsWith("http://") &&
        !url.startsWith("https://") &&
        !url.startsWith("mailto:") &&
        !url.startsWith("tel:")
      ) {
        url = `https://${url}`;
      }
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 underline underline-offset-2 decoration-primary-400 font-medium transition-colors inline-flex items-center gap-0.5 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <span>{label}</span>
          <ExternalLink className="h-2.5 w-2.5 opacity-60 ml-0.5" />
        </a>
      );
    } else if (match[3]) {
      // Bare URL
      const rawUrl = match[3];
      const href = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
      parts.push(
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 underline underline-offset-2 decoration-primary-400 font-medium transition-colors inline-flex items-center gap-0.5 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <span>{rawUrl}</span>
          <ExternalLink className="h-2.5 w-2.5 opacity-60 ml-0.5" />
        </a>
      );
    }

    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export function EditableField({
  value,
  onChange,
  editable = false,
  multiline = false,
  placeholder = "Click to type...",
  className = "",
  style,
  as: Component = "span",
  isLink = false,
  href,
}: EditableFieldProps) {
  const ref = useRef<HTMLElement>(null);
  const isFocusedRef = useRef(false);

  // Hyperlink state
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);
  const [selectionPos, setSelectionPos] = useState<SelectionPosition | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInitialText, setDialogInitialText] = useState("");
  const [dialogInitialUrl, setDialogInitialUrl] = useState("");
  const [isExistingLink, setIsExistingLink] = useState(false);
  const [existingLinkMatch, setExistingLinkMatch] = useState<{ full: string; label: string; url: string } | null>(null);

  // Sync value from props only when not actively being edited by user
  useEffect(() => {
    if (ref.current && !isFocusedRef.current) {
      if (ref.current.innerText !== (value || "")) {
        ref.current.innerText = value || "";
      }
    }
  }, [value]);

  // Monitor text selections inside this field
  const checkSelection = useCallback(() => {
    if (!editable || !ref.current) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      setSelectionPos(null);
      setSelectedText("");
      setSelectionRange(null);
      return;
    }

    // Ensure the selection is within our editable element
    const range = selection.getRangeAt(0);
    if (!ref.current.contains(range.commonAncestorContainer)) {
      setSelectionPos(null);
      setSelectedText("");
      setSelectionRange(null);
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 0) {
      const rect = range.getBoundingClientRect();
      const parentRect = ref.current.getBoundingClientRect();

      setSelectedText(text);
      setSelectionRange(range.cloneRange());

      // Position floating pill above selection
      setSelectionPos({
        top: rect.top - parentRect.top - 36,
        left: rect.left - parentRect.left + rect.width / 2,
      });
    } else {
      setSelectionPos(null);
      setSelectedText("");
      setSelectionRange(null);
    }
  }, [editable]);

  // Global listener for toolbar hyperlink triggers
  useEffect(() => {
    if (!editable) return;

    const handleGlobalTrigger = (e: CustomEvent<{ selectedText?: string }>) => {
      if (isFocusedRef.current || (ref.current && window.getSelection()?.containsNode(ref.current, true))) {
        const text = e.detail?.selectedText || selectedText || ref.current?.innerText || "";
        openInsertDialog(text);
      }
    };

    window.addEventListener("ats-trigger-insert-link" as any, handleGlobalTrigger);
    return () => {
      window.removeEventListener("ats-trigger-insert-link" as any, handleGlobalTrigger);
    };
  }, [editable, selectedText]);

  // Detect existing markdown link under cursor/hover
  const inspectExistingLink = () => {
    if (!value) return;
    const match = value.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (match) {
      setExistingLinkMatch({
        full: match[0],
        label: match[1],
        url: match[2],
      });
    } else {
      setExistingLinkMatch(null);
    }
  };

  const openInsertDialog = (textToLink?: string) => {
    const txt = textToLink !== undefined ? textToLink : selectedText;
    setDialogInitialText(txt);
    setDialogInitialUrl("https://");
    setIsExistingLink(false);
    setDialogOpen(true);
    setSelectionPos(null);
  };

  const openEditDialog = (label: string, url: string) => {
    setDialogInitialText(label);
    setDialogInitialUrl(url);
    setIsExistingLink(true);
    setDialogOpen(true);
  };

  const handleApplyLink = (labelText: string, linkUrl: string) => {
    const markdownLink = `[${labelText}](${linkUrl})`;

    if (isExistingLink && existingLinkMatch) {
      // Replace existing link
      const updated = value.replace(existingLinkMatch.full, markdownLink);
      if (ref.current) ref.current.innerText = updated;
      if (onChange) onChange(updated);
      setExistingLinkMatch(null);
      return;
    }

    if (selectionRange && ref.current) {
      // Replace selected text using saved DOM Range
      selectionRange.deleteContents();
      const node = document.createTextNode(markdownLink);
      selectionRange.insertNode(node);

      const newFullText = ref.current.innerText;
      if (onChange) onChange(newFullText);
    } else if (ref.current) {
      // If no range, replace whole field or append
      const currentVal = ref.current.innerText.trim();
      const newFullText = currentVal ? currentVal.replace(selectedText || currentVal, markdownLink) : markdownLink;
      ref.current.innerText = newFullText;
      if (onChange) onChange(newFullText);
    } else if (onChange) {
      onChange(markdownLink);
    }

    setSelectedText("");
    setSelectionRange(null);
    setSelectionPos(null);
  };

  const handleRemoveLink = () => {
    if (existingLinkMatch) {
      const updated = value.replace(existingLinkMatch.full, existingLinkMatch.label);
      if (ref.current) ref.current.innerText = updated;
      if (onChange) onChange(updated);
      setExistingLinkMatch(null);
    }
  };

  // If not in edit mode
  if (!editable) {
    if (isLink || href) {
      const linkTarget = href || (value.startsWith("http") ? value : `https://${value}`);
      return (
        <a
          href={linkTarget}
          target="_blank"
          rel="noopener noreferrer"
          className={`hover:underline cursor-pointer ${className}`}
          style={style}
        >
          {value || ""}
        </a>
      );
    }

    const rendered = renderTextWithLinks(value || "");
    return (
      <Component className={className} style={style}>
        {rendered}
      </Component>
    );
  }

  const handleFocus = () => {
    isFocusedRef.current = true;
    inspectExistingLink();
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    isFocusedRef.current = false;
    const text = e.currentTarget.innerText.trim();
    if (onChange && text !== value) {
      onChange(text);
    }
    // Small timeout so clicking the floating "Add Link" button doesn't immediately dismiss
    setTimeout(() => {
      if (!isFocusedRef.current) {
        setSelectionPos(null);
      }
    }, 250);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }

    // Shortcut Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const selection = window.getSelection();
      const text = selection ? selection.toString().trim() : selectedText;
      openInsertDialog(text);
    }
  };

  const isEmpty = !value || value.trim() === "";

  return (
    <span
      className="relative inline-block align-baseline group/field"
      onMouseEnter={inspectExistingLink}
    >
      <Component
        ref={ref as any}
        contentEditable={editable}
        suppressContentEditableWarning
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onMouseUp={checkSelection}
        onKeyUp={checkSelection}
        data-placeholder={placeholder}
        className={`relative inline align-baseline transition-colors cursor-text group outline-none select-text ${
          editable
            ? "hover:bg-primary-500/10 hover:ring-1 hover:ring-dashed hover:ring-primary-400/50 focus:bg-primary-500/10 focus:ring-2 focus:ring-primary-500 rounded px-0.5 -mx-0.5"
            : ""
        } ${isEmpty && editable ? "italic text-muted-foreground/60 min-w-[60px]" : ""} ${className}`}
        style={style}
        title={editable ? "Click to edit text. Select text and click 🔗 or press Ctrl+K to insert hyperlink." : undefined}
      >
        {value || (editable ? placeholder : "")}
      </Component>

      {/* Floating "Add Link" Tooltip Bubble over Selected Text */}
      {editable && selectionPos && selectedText && (
        <span
          style={{
            top: `${selectionPos.top}px`,
            left: `${selectionPos.left}px`,
            transform: "translateX(-50%)",
          }}
          className="absolute z-50 flex items-center gap-1.5 rounded-full bg-zinc-900 text-white px-2.5 py-1 text-[11px] font-semibold shadow-xl border border-zinc-700 animate-in fade-in zoom-in-95 duration-100 select-none print:hidden pointer-events-auto"
          onMouseDown={(e) => {
            // Prevent blur of editable element
            e.preventDefault();
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openInsertDialog(selectedText);
            }}
            className="flex items-center gap-1 hover:text-primary-400 transition-colors cursor-pointer"
            title="Insert Hyperlink (Ctrl+K)"
          >
            <Link2 className="h-3.5 w-3.5 text-primary-400" />
            <span>Add Link</span>
          </button>
          <span className="text-[9px] text-zinc-400 bg-zinc-800 px-1 py-0.2 rounded font-mono">
            Ctrl+K
          </span>
        </span>
      )}

      {/* Floating Link Inspector for Existing Markdown Links */}
      {editable && existingLinkMatch && !selectionPos && (
        <span className="opacity-0 group-hover/field:opacity-100 transition-opacity ml-1.5 inline-flex items-center gap-1 text-[11px] bg-background border border-border/80 shadow-md rounded-lg px-2 py-0.5 print:hidden select-none align-middle z-20">
          <Link2 className="h-3 w-3 text-primary-500 shrink-0" />
          <span
            className="text-primary-600 font-medium max-w-[120px] truncate hover:underline cursor-pointer"
            title={existingLinkMatch.url}
            onClick={(e) => {
              e.stopPropagation();
              window.open(existingLinkMatch.url, "_blank");
            }}
          >
            {existingLinkMatch.label}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openEditDialog(existingLinkMatch.label, existingLinkMatch.url);
            }}
            className="p-0.5 text-muted-foreground hover:text-foreground transition-colors ml-0.5"
            title="Edit Hyperlink"
          >
            <Edit3 className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveLink();
            }}
            className="p-0.5 text-rose-500 hover:text-rose-600 transition-colors"
            title="Remove Hyperlink"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Hyperlink Dialog Modal */}
      <HyperlinkDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialText={dialogInitialText}
        initialUrl={dialogInitialUrl}
        isExisting={isExistingLink}
        onApply={handleApplyLink}
        onRemove={handleRemoveLink}
      />
    </span>
  );
}

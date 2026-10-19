"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, ExternalLink, X, Check, Trash2, Globe, Sparkles } from "lucide-react";

export interface HyperlinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialText?: string;
  initialUrl?: string;
  isExisting?: boolean;
  onApply: (text: string, url: string) => void;
  onRemove?: () => void;
}

const QUICK_PRESETS = [
  { label: "LinkedIn", prefix: "https://linkedin.com/in/" },
  { label: "GitHub", prefix: "https://github.com/" },
  { label: "Portfolio", prefix: "https://" },
  { label: "Email", prefix: "mailto:" },
];

export function HyperlinkDialog({
  isOpen,
  onClose,
  initialText = "",
  initialUrl = "",
  isExisting = false,
  onApply,
  onRemove,
}: HyperlinkDialogProps) {
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setText(initialText);
      setUrl(initialUrl || "https://");
      setError("");
      // Autofocus URL if text is already present, otherwise autofocus text
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isOpen, initialText, initialUrl]);

  // Handle keyboard shortcuts (Enter to submit, Escape to close)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const sanitizeUrl = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("mailto:") ||
      trimmed.startsWith("tel:")
    ) {
      return trimmed;
    }
    // If looks like email
    if (trimmed.includes("@") && !trimmed.includes("/")) {
      return `mailto:${trimmed}`;
    }
    // Default to https://
    return `https://${trimmed}`;
  };

  const handleSubmit = () => {
    const cleanText = text.trim() || initialText.trim() || "link";
    const cleanUrl = sanitizeUrl(url);

    if (!cleanUrl || cleanUrl === "https://") {
      setError("Please provide a valid hyperlink URL");
      return;
    }

    onApply(cleanText, cleanUrl);
    onClose();
  };

  const handleTestLink = () => {
    const cleanUrl = sanitizeUrl(url);
    if (cleanUrl && cleanUrl !== "https://") {
      window.open(cleanUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            onKeyDown={handleKeyDown}
            className="relative w-full max-w-md rounded-2xl border border-border/80 bg-white dark:bg-zinc-900 text-foreground p-6 shadow-2xl z-10 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500">
                  <Link2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {isExisting ? "Edit Hyperlink" : "Insert Hyperlink"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Attach a web link to your selected resume text
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5 pt-1">
              {/* Text to Display */}
              <div>
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Text to display</span>
                  <span className="text-[10px] text-muted-foreground">Will appear on resume</span>
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. GitHub Profile, Live Demo, Portfolio"
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-background border border-border/70 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                />
              </div>

              {/* URL */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Hyperlink URL</label>
                  {url && url !== "https://" && (
                    <button
                      type="button"
                      onClick={handleTestLink}
                      className="text-[11px] text-primary-500 hover:text-primary-600 hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Test link</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="https://example.com"
                    className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-background border ${
                      error ? "border-rose-500 ring-1 ring-rose-500/20" : "border-border/70 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    } focus:outline-none transition-all`}
                  />
                </div>
                {error && <p className="text-[11px] text-rose-500 mt-1 font-medium">{error}</p>}
              </div>

              {/* Quick Presets */}
              <div>
                <span className="text-[11px] text-muted-foreground block mb-1.5">Quick Presets</span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setUrl(preset.prefix);
                        if (!text.trim() && preset.label !== "Portfolio") {
                          setText(preset.label);
                        }
                        inputRef.current?.focus();
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {text.trim() && url.trim() && url !== "https://" && (
                <div className="rounded-xl bg-muted/30 p-2.5 border border-border/40 text-xs">
                  <span className="text-[10px] text-muted-foreground block mb-0.5 uppercase tracking-wider font-semibold">
                    Preview
                  </span>
                  <a
                    href={sanitizeUrl(url)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-600 dark:text-primary-400 underline underline-offset-2 font-medium inline-flex items-center gap-1 hover:text-primary-700"
                  >
                    <span>{text}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              {isExisting && onRemove ? (
                <button
                  type="button"
                  onClick={() => {
                    onRemove();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove Link</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-xl gradient-bg text-white shadow-md hover:shadow-primary-500/25 transition-all"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{isExisting ? "Update Link" : "Apply Link"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

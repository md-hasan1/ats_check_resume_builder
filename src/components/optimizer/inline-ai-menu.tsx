"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  BarChart2,
  Minimize2,
  Maximize2,
  CheckCheck,
  Target,
  Rocket,
  Plus,
  Flame,
  Loader2,
} from "lucide-react";

export interface InlineAIAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  promptKey: string;
  description: string;
}

export const INLINE_AI_ACTIONS: InlineAIAction[] = [
  { id: "improve", label: "Improve Writing", icon: Sparkles, promptKey: "improve", description: "Enhance clarity & tone" },
  { id: "professional", label: "Make More Professional", icon: Zap, promptKey: "professional", description: "Executive recruiter tone" },
  { id: "metrics", label: "Add Metrics", icon: BarChart2, promptKey: "metrics", description: "Insert [XX%] placeholders" },
  { id: "shorten", label: "Shorten", icon: Minimize2, promptKey: "shorten", description: "Concise & high impact" },
  { id: "expand", label: "Expand", icon: Maximize2, promptKey: "expand", description: "Elaborate achievements" },
  { id: "grammar", label: "Fix Grammar", icon: CheckCheck, promptKey: "grammar", description: "Fix spelling & sentence flow" },
  { id: "ats", label: "Improve ATS Score", icon: Target, promptKey: "ats", description: "ATS keyword optimization" },
  { id: "action_verbs", label: "Add Action Verbs", icon: Rocket, promptKey: "action_verbs", description: "Replace weak verbs" },
  { id: "keywords", label: "Add Missing Keywords", icon: Plus, promptKey: "keywords", description: "Insert target skills" },
  { id: "impact", label: "Make More Impactful", icon: Flame, promptKey: "impact", description: "Focus on results & ROI" },
];

interface InlineAIMenuProps {
  onSelectAction: (actionKey: string) => Promise<void>;
  loading?: boolean;
}

export function InlineAIMenu({ onSelectAction, loading }: InlineAIMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleAction = async (actionKey: string) => {
    setActiveAction(actionKey);
    try {
      await onSelectAction(actionKey);
    } finally {
      setActiveAction(null);
      setOpen(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-7 w-7 items-center justify-center rounded-lg gradient-bg text-white shadow-md transition-transform hover:scale-110"
        title="Inline AI Assistant"
      >
        <Sparkles className="h-3.5 w-3.5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute left-0 top-9 z-40 w-64 rounded-2xl border border-border/50 bg-card p-2 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-primary-500 border-b border-border/50 mb-1">
                <Sparkles className="h-3.5 w-3.5" /> Inline AI Copilot
              </div>

              <div className="space-y-0.5 max-h-60 overflow-y-auto pr-1">
                {INLINE_AI_ACTIONS.map((act) => {
                  const Icon = act.icon;
                  const isLoading = loading && activeAction === act.promptKey;

                  return (
                    <button
                      key={act.id}
                      onClick={() => handleAction(act.promptKey)}
                      disabled={loading}
                      className="flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition-colors hover:bg-primary-500/10 hover:text-primary-500 text-left disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="h-3.5 w-3.5 flex-shrink-0 text-primary-500" />
                        <div className="truncate">
                          <p className="font-medium text-foreground">{act.label}</p>
                          <p className="text-[10px] text-muted-foreground">{act.description}</p>
                        </div>
                      </div>
                      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-500" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

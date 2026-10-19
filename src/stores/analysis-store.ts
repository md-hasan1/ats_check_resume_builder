import { create } from "zustand";
import type { AnalysisResult } from "@/types/analysis";

interface AnalysisState {
  isAnalyzing: boolean;
  progress: number;
  currentStep: string;
  reportId: string | null;
  result: AnalysisResult | null;
  error: string | null;
  setIsAnalyzing: (val: boolean) => void;
  setProgress: (val: number) => void;
  setCurrentStep: (step: string) => void;
  setReportId: (id: string | null) => void;
  setResult: (result: AnalysisResult | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  isAnalyzing: false,
  progress: 0,
  currentStep: "",
  reportId: null,
  result: null,
  error: null,
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setProgress: (progress) => set({ progress }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setReportId: (reportId) => set({ reportId }),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      isAnalyzing: false,
      progress: 0,
      currentStep: "",
      reportId: null,
      result: null,
      error: null,
    }),
}));

import { create } from "zustand";

interface UploadState {
  file: File | null;
  resumeId: string | null;
  fileUrl: string | null;
  jobDescription: string;
  jobTitle: string;
  jobUrl: string;
  isUploading: boolean;
  uploadProgress: number;
  setFile: (file: File | null) => void;
  setResumeId: (id: string | null) => void;
  setFileUrl: (url: string | null) => void;
  setJobDescription: (text: string) => void;
  setJobTitle: (title: string) => void;
  setJobUrl: (url: string) => void;
  setIsUploading: (val: boolean) => void;
  setUploadProgress: (val: number) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  file: null,
  resumeId: null,
  fileUrl: null,
  jobDescription: "",
  jobTitle: "",
  jobUrl: "",
  isUploading: false,
  uploadProgress: 0,
  setFile: (file) => set({ file }),
  setResumeId: (resumeId) => set({ resumeId }),
  setFileUrl: (fileUrl) => set({ fileUrl }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  setJobTitle: (jobTitle) => set({ jobTitle }),
  setJobUrl: (jobUrl) => set({ jobUrl }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  reset: () =>
    set({
      file: null,
      resumeId: null,
      fileUrl: null,
      jobDescription: "",
      jobTitle: "",
      jobUrl: "",
      isUploading: false,
      uploadProgress: 0,
    }),
}));

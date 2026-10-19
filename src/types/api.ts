export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface UploadResponse {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  resumeId: string;
}

export interface AnalyzeRequest {
  resumeId: string;
  jobDescription: string;
  jobTitle?: string;
  jobUrl?: string;
}

export interface AnalyzeResponse {
  reportId: string;
  status: "processing" | "completed" | "failed";
}

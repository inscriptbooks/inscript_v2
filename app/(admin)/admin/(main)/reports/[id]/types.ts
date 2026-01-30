// 신고 상태 타입
export type ReportStatus = "submitted" | "approved" | "rejected";

// 신고 처리 방식 타입
export type ProcessingMethod = "visible" | "hidden";

// 신고 대상 타입
export interface ReportTarget {
  id: string;
  type: "댓글" | "게시물" | "메모";
  author: string;
  content: string;
  createdAt: string;
  originalLink?: string;
}

// 신고 정보 타입
export interface ReportInfo {
  reporter: string;
  reportType: string;
  reason: string;
  reportedAt: string;
}

// 댓글 타입
export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isPrivate?: boolean;
  isVisible: boolean;
}

// 신고 상세 정보 타입
export interface ReportDetail {
  id: string;
  reportId: string;
  status: ReportStatus;
  target: ReportTarget;
  reportInfo: ReportInfo;
  comments: Comment[];
  processingMethod?: ProcessingMethod;
}

// 운영자 조치 폼 타입
export interface AdminActionForm {
  status: ReportStatus;
  processingMethod: ProcessingMethod;
}

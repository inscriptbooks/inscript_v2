export interface MemberDetailData {
  memberType: string;
  nickname: string;
  email: string;
  signupMethod: string;
  joinDate: string;
  status: "normal" | "suspended" | "blacklist";
  lastLogin: string;
  adminMemo: string;
  phone: string;
}

export interface ActivityLog {
  id: string;
  type: string;
  date: string;
  content: string;
}

export interface ActivityResponse {
  activities: ActivityLog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

export interface SanctionHistory {
  no: number;
  type: "블랙리스트" | "활동정지";
  category: string;
  reason: string;
  startDate: string;
  endDate: string;
  date: string;
}

export interface WriterApplication {
  writerName: string;
  majorWork: string;
  document: string;
  applicationDate: string;
  status: "pending" | "approved" | "rejected";
}

export interface AuthorApplication {
  id: string;
  authorName: string;
  representativeWork: string;
  verificationFileUrl: string;
  keyword: string[];
  introduction: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
}

export interface PurchaseHistory {
  no: number;
  purchaseDate: string;
  playTitle: string;
  author: string;
  price: number;
  isDownloaded: boolean;
  isRefunded?: boolean; // 환불 완료 여부
  orderId: string;
  playId: string;
}

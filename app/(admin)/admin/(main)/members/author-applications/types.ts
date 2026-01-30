export interface AuthorApplicationItem {
  id: string;
  no: number;
  userId: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface AuthorApplicationsResponse {
  applications: AuthorApplicationItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

export interface AuthorApplicationDetail {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
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

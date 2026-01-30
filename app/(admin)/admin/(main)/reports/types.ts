export interface Report {
  id: string;
  type: "post" | "memo" | "comment";
  user_id: string;
  reporter_name: string;
  reporter_email: string;
  memo_id?: string;
  post_id?: string;
  comment_id?: string;
  reason: string;
  created_at: string;
  is_complete: string;
  category: string;
  target_id: string;
  author_email: string;
  author_name: string;
  content_preview: string;
  status: "submitted" | "approved" | "rejected";
}

export interface ReportsResponse {
  reports: Report[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
  statistics: {
    completedCount: number;
    pendingCount: number;
    invalidCount: number;
  };
}

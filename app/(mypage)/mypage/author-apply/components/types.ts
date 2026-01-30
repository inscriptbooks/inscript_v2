export type AuthorApplicationStatus = "pending" | "approved" | "rejected";

export interface AuthorApplication {
  id: string;
  user_id: string;
  author_name: string;
  representative_work: string;
  verification_file_url: string | null;
  keyword: string[];
  introduction: string;
  status: AuthorApplicationStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
}

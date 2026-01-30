export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author_name: string;
  author_email: string;
  type: "memo" | "post";
  category: string;
  original_title: string;
  status: "exposed" | "hidden";
  is_deleted: boolean;
  like_count: number;
  report_count: number;
  post_id?: string;
  memo_id?: string;
  post_type?: string;
  memo_type?: string;
  play_id?: string;
  author_id?: string;
  program_id?: string;
}


export interface CommentsResponse {
  comments: Comment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
  statistics: {
    exposedCount: number;
    hiddenCount: number;
  };
}

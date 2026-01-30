export interface Memo {
  id: string;
  content: string;
  title: string | null;
  created_at: string;
  user_id: string;
  author_name: string;
  author_email: string;
  type: "play" | "writer" | "program" | "author";
  category: string;
  target_title: string;
  target_id?: string;
  status: "exposed" | "hidden";
  is_visible: boolean;
  is_deleted: boolean;
  like_count: number;
  comment_count: number;
  report_count: number;
  play_id?: string;
  author_id?: string;
  program_id?: string;
}

export interface MemosResponse {
  memos: Memo[];
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

export interface MemoComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author_name: string;
  author_email: string;
  status: "exposed" | "hidden";
  is_deleted: boolean;
}

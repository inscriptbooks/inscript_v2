export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  type: string;
  user_id: string;
  author_name: string;
  author_username: string;
  status: "exposed" | "hidden";
  like_count: number;
  comment_count: number;
  report_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface CommunityResponse {
  posts: CommunityPost[];
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

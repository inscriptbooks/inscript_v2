export interface PlayData {
  id: string;
  title: string;
  author: string;
  created_at: string;
  status: string;
  tags: string[];
  views_count: number;
  memos_count: number;
  bookmarks_count: number;
}

export interface PlaysResponse {
  plays: PlayData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

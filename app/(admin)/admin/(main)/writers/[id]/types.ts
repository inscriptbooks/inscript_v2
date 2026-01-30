// 작가 상세 정보 타입
export interface WriterDetailData {
  id: string;
  author_name: string;
  author_name_en: string | null;
  genre: string | null;
  keyword: string[];
  description: string;
  is_visible: boolean;
  featured_work: string;
  created_at: string;
  updated_at: string;
  plays: PlayData[];
  memos: MemoData[];
}

// Author 테이블 데이터 타입
export interface AuthorData {
  id: string;
  author_name: string;
  author_name_en: string | null;
  genre: string | null;
  keyword: string[] | null;
  description: string;
  view_count: number;
  bookmark_count: number;
  is_visible: boolean;
  request_status: "pending" | "approved" | "rejected";
  featured_work: string;
  created_at: string;
  is_deleted: boolean;
}

// Play 테이블 데이터 타입
export interface PlayData {
  id: string;
  title: string;
  created_at: string;
  like_count: number;
  comment_count: number;
  report_count: number;
}

// Memo 테이블 데이터 타입
export interface MemoData {
  id: string;
  author: string;
  content: string;
  like_count: number;
  comment_count: number;
  report_count: number;
}

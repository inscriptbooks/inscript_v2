import { User } from "./user";

export type PostType =
  | "recruit"
  | "market"
  | "qna"
  | "promotion"
  | "news"
  | "author";

export interface Post {
  id: string;
  type: PostType;
  category: string;
  title: string;
  content: string;
  commentCount: number;
  likeCount: number;
  viewCount: number;
  user: User;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

// 게시판별 카테고리 옵션 맵 (타입 안전성을 위해 export)
export const categoryOptionsMap = {
  recruit: ["배우", "스태프", "작가", "기타"] as const,
  market: ["구매", "판매", "나눔", "대여"] as const,
  qna: ["희곡", "공연", "기타"] as const,
  promotion: ["공연", "연습실", "워크숍", "레슨", "기타"] as const,
  news: ["공지사항", "이벤트", "업데이트", "기타"] as const,
  author: ["창작 노하우", "작품 리뷰", "작가 소식", "자유 게시판"] as const,
} as const;

// 게시판 옵션 맵 (전체)
export const postTypeOptionsMap = {
  recruit: "함께하기",
  market: "사고팔기",
  qna: "홍보하기",
  promotion: "얘기하기",
  news: "인크소식", // 관리자 전용
  author: "작가 커뮤니티", // 작가 권한 필요
} as const;

// 일반 사용자용 게시판 옵션 맵 (news, author 제외)
export const publicPostTypeOptionsMap = {
  recruit: "함께하기",
  market: "사고팔기",
  qna: "홍보하기",
  promotion: "얘기하기",
} as const;

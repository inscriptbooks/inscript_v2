import { User } from "./user";

export type AuthorRequestStatus = "pending" | "approved" | "rejected";

export interface Author {
  id: string;
  user: User;
  authorName: string;
  authorNameEn?: string;
  keyword: string[];
  description: string;
  featuredWork: string;
  viewCount: number;
  bookmarkCount: number;
  isVisible: boolean;
  requestStatus: AuthorRequestStatus;
}

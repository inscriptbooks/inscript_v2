import { User } from "./user";
import { Author } from "./author";

export enum ApplyStatus {
  APPLIED = "applied",
  REVIEW = "review",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export const ApplyStatusLabel: Record<ApplyStatus, string> = {
  [ApplyStatus.APPLIED]: "신청완료",
  [ApplyStatus.REVIEW]: "검토중",
  [ApplyStatus.ACCEPTED]: "등록 완료",
  [ApplyStatus.REJECTED]: "반려",
};

export enum PublicStatus {
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
  OUT_OF_PRINT = "outOfPrint",
}

export const PublicStatusLabel: Record<PublicStatus, string> = {
  [PublicStatus.PUBLISHED]: "출간",
  [PublicStatus.UNPUBLISHED]: "미출간",
  [PublicStatus.OUT_OF_PRINT]: "절판",
};

export interface Play {
  id: string;
  createdBy: User;
  createdAt: string;
  viewCount: number;
  bookmarkCount: number;
  isBookmarked?: boolean;
  title: string;
  author: Author | null;
  summary: string;
  keyword: string[];
  isVisible: boolean;
  line1?: string;
  line2?: string;
  line3?: string;
  year?: string;
  country?: string;
  femaleCharacterCount?: string;
  maleCharacterCount?: string;
  characterList?: string[];
  publicHistory?: string;
  publicStatus?: PublicStatus;
  applyStatus: ApplyStatus;
  rejectionReason?: string;
  // 판매 관련
  salesStatus?: "판매함" | "판매 안 함";
  price?: number | null;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  attachmentPath?: string | null;
}

export type ProgramStatus = "ongoing" | "closed";

export interface Program {
  id: string;
  title: string;
  eventDateTime: string;
  applicationStartAt: string;
  applicationEndAt: string;
  location: string;
  capacity?: number;
  notes: string;
  keyword: string[];
  description: string;
  smartstoreUrl: string;
  thumbnailUrl: string;
  isVisible: boolean;
  isBookmarked?: boolean;
  isDeleted: boolean;
  createdAt: string;
  applicationCount: number;
  viewCount: number;
  bookmarkCount: number;
}

/**
 * 프로그램 신청 기간 내에 있는지 확인
 * @param applicationStartAt 신청 시작일
 * @param applicationEndAt 신청 종료일
 * @param targetDate 확인할 날짜 (기본값: 현재 시간)
 * @returns 신청 기간 내이면 true, 아니면 false
 */
export const isWithinApplicationPeriod = (
  applicationStartAt: string | Date,
  applicationEndAt: string | Date,
  targetDate: Date = new Date()
): boolean => {
  const startDate = new Date(applicationStartAt);
  const endDate = new Date(applicationEndAt);
  return startDate <= targetDate && targetDate <= endDate;
};

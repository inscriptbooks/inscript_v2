import { Program } from "./program";
import { User } from "./user";

/**
 * 프로그램 신청 상태
 * - submitted: 신청완료 - 현재 진행 중인 프로그램에 대한 신청
 * - closed: 종료 - 신청 기간이 지난 프로그램에 대한 신청
 * - cancelled: 취소 - 관리자가 취소한 신청
 */
export enum ApplicationStatus {
  SUBMITTED = "submitted",
  CLOSED = "closed",
  CANCELLED = "cancelled",
}

export const ApplicationStatusLabel: Record<ApplicationStatus, string> = {
  [ApplicationStatus.SUBMITTED]: "신청완료",
  [ApplicationStatus.CLOSED]: "종료",
  [ApplicationStatus.CANCELLED]: "취소",
};

export interface ProgramApplication {
  id: string;
  programId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  status: ApplicationStatus;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
  createdAt: string;
  updatedAt: string;
  program: Program;
  user: User;
}

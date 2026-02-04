"use client";

import { useState, Suspense, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Mail from "@/components/icons/Mail";
import Hamburger from "@/components/icons/Hamburger";
import SuspensionModal from "./components/SuspensionModal";
import BlacklistModal from "./components/BlacklistModal";
import RejectWriterModal from "./components/RejectWriterModal";
import RefundModal from "./components/RefundModal";
import ActivitySection from "./components/ActivitySection";
import NoteSendModal from "@/components/common/Modal/NoteSendModal";
import {
  MemberDetailData,
  SanctionHistory,
  WriterApplication,
  AuthorApplication,
  PurchaseHistory,
} from "./types";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { useCreateNote } from "@/hooks/notes";

const MemberStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    normal: {
      label: "정상",
      className: "border border-[#B0D5F2] bg-[#F6FBFF] text-[#2581F9]",
    },
    pending: {
      label: "승인대기",
      className: "border border-[#D7825E] bg-[#FBEEE8] text-[#D44F34]",
    },
    approved: {
      label: "승인완료",
      className: "border border-[#B0D5F2] bg-[#F6FBFF] text-[#2581F9]",
    },
    rejected: {
      label: "반려",
      className: "border border-[#EBB9A3] bg-[#FBEEE8] text-[#D44F34]",
    },
    suspended: {
      label: "활동 정지",
      className: "border border-[#EBB9A3] bg-[#FBEEE8] text-[#D44F34]",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div
      className={`flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium ${config.className}`}
    >
      {config.label}
    </div>
  );
};

function MemberDetailContent() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [memo, setMemo] = useState("");
  const [isSuspensionModalOpen, setIsSuspensionModalOpen] = useState(false);
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
  const [isRejectWriterModalOpen, setIsRejectWriterModalOpen] = useState(false);
  const [memberData, setMemberData] = useState<MemberDetailData | null>(null);
  const [sanctionHistory, setSanctionHistory] = useState<SanctionHistory[]>([]);
  const [writerApplication, setWriterApplication] =
    useState<WriterApplication | null>(null);
  const [authorApplication, setAuthorApplication] =
    useState<AuthorApplication | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] =
    useState<PurchaseHistory | null>(null);
  const [isRefunding, setIsRefunding] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const { mutate: createNote, isPending } = useCreateNote();

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await fetch(`/api/admin/members/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setMemberData(data.memberData);
          setSanctionHistory(data.sanctionHistory || []);
          setWriterApplication(data.writerApplication);
          setAuthorApplication(data.authorApplication);
          setPurchaseHistory(data.purchaseHistory || []);
          setMemo(data.memberData.adminMemo || "");
        }
      } catch (error) {
        // Error handling
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMemberData();
    }
  }, [userId]);

  const handleSaveMemo = async () => {
    try {
      const response = await fetch(`/api/admin/members/${userId}/memo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memo }),
      });

      if (response.ok) {
        showSuccessToast("메모가 저장되었습니다.");
      } else {
        showErrorToast("메모 저장에 실패했습니다.");
      }
    } catch (error) {
      showErrorToast("메모 저장에 실패했습니다.");
    }
  };

  const handleCancelApproval = async () => {
    if (!authorApplication?.id) return;

    try {
      const response = await fetch("/api/admin/members/author-approval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorApplicationId: authorApplication.id,
          action: "cancel_approval",
        }),
      });

      if (response.ok) {
        showSuccessToast("승인이 취소되었습니다.");
        window.location.reload();
      } else {
        showErrorToast("승인 취소에 실패했습니다.");
      }
    } catch (error) {
      showErrorToast("오류가 발생했습니다.");
    }
  };

  const handleApproveAuthor = async () => {
    if (!authorApplication?.id) return;

    try {
      const response = await fetch("/api/admin/members/author-approval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorApplicationId: authorApplication.id,
          action: "approve",
        }),
      });

      if (response.ok) {
        showSuccessToast("작가 신청이 승인되었습니다.");
        // 데이터 새로고침
        window.location.reload();
      } else {
        showErrorToast("작가 승인에 실패했습니다.");
      }
    } catch (error) {
      showErrorToast("오류가 발생했습니다.");
    }
  };

  const handleRejectSuccess = () => {
    // 데이터 새로고침
    window.location.reload();
  };

  const handleRefundClick = (purchase: PurchaseHistory) => {
    setSelectedPurchase(purchase);
    setIsRefundModalOpen(true);
  };

  const handleRefundConfirm = async () => {
    if (!selectedPurchase || isRefunding) return;

    setIsRefunding(true);
    try {
      const response = await fetch("/api/admin/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          playId: selectedPurchase.playId,
          orderId: selectedPurchase.orderId,
        }),
      });

      if (response.ok) {
        showSuccessToast(
          `'${selectedPurchase.playTitle}' 환불 처리가 완료되었습니다.`,
        );
        setIsRefundModalOpen(false);
        setSelectedPurchase(null);
        // 데이터 새로고침
        window.location.reload();
      } else {
        showErrorToast("환불 처리에 실패했습니다.");
      }
    } catch (error) {
      showErrorToast("오류가 발생했습니다.");
    } finally {
      setIsRefunding(false);
    }
  };

  const handleMessageSend = async (message: string) => {
    return new Promise<void>((resolve, reject) => {
      createNote(
        {
          receiver_id: userId,
          message,
        },
        {
          onSuccess: () => {
            resolve();
          },
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.error ||
              error?.message ||
              "쪽지 전송에 실패했습니다. 다시 시도해주세요.";
            showErrorToast(errorMessage);
            reject(error);
          },
        },
      );
    });
  };

  if (loading || !memberData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="font-pretendard text-base text-gray-3">
          로딩 중...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-transparent p-8">
      <div className="flex w-full flex-col gap-10 rounded bg-white p-11">
        {/* 헤더 */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="font-pretendard text-2xl font-bold leading-8 text-gray-1">
                회원 관리
              </h1>
              <Button
                onClick={() => setIsMessageModalOpen(true)}
                className="flex h-9 w-24 items-center justify-center gap-1.5 rounded border border-primary bg-white hover:bg-gray-6"
              >
                <Mail size={16} color="#911A00" />
                <span className="font-pretendard text-sm font-bold text-primary">
                  쪽지 보내기
                </span>
              </Button>
            </div>

            {/* 회원 정보 테이블 */}
            <div className="border border-gray-7">
              {/* 첫 번째 행 */}
              <div className="flex">
                <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-2">
                    이메일
                  </span>
                </div>
                <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {memberData.email}
                  </span>
                </div>
                <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-2">
                    회원 유형
                  </span>
                </div>
                <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {memberData.memberType}
                  </span>
                </div>
              </div>

              {/* 두 번째 행 */}
              <div className="flex">
                <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-2">
                    닉네임
                  </span>
                </div>
                <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {memberData.nickname}
                  </span>
                </div>
                <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-2">
                    최근 로그인
                  </span>
                </div>
                <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {memberData.lastLogin}
                  </span>
                </div>
              </div>

              {/* 두 번째 행 */}
              <div className="flex">
                <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-2">
                    가입방식
                  </span>
                </div>
                <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {memberData.signupMethod}
                  </span>
                </div>
                <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-2">
                    가입일
                  </span>
                </div>
                <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {memberData.joinDate}
                  </span>
                </div>
              </div>

              {/* 네 번째 행 */}
              <div className="flex">
                <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-2">
                    상태
                  </span>
                </div>
                <div className="flex flex-1 items-center px-6 py-2.5">
                  <MemberStatusBadge status={memberData.status} />
                </div>
                <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-2">
                    휴대폰
                  </span>
                </div>
                <div className="flex flex-1 items-center px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {memberData.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 활동 정보 */}
          <ActivitySection userId={userId} />

          {/* 제재 이력 관리 */}
          <div className="flex flex-col gap-4">
            <h2 className="font-pretendard text-xl font-bold text-gray-1">
              제재 이력 관리
            </h2>
            {sanctionHistory.length > 0 ? (
              <div className="flex flex-col ">
                {/* 테이블 헬더 */}
                <div className="flex bg-gray-7">
                  <div className="flex w-[80px] items-center justify-center px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      NO
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      분류
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      카테고리
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      사유
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      시작일
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      종료일
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      등록일
                    </span>
                  </div>
                </div>

                {/* 데이터 로우 */}
                {sanctionHistory.map((sanction) => (
                  <div
                    key={sanction.no}
                    className="flex border-t border-gray-7"
                  >
                    <div className="flex w-[80px] items-center justify-center px-6 py-2.5">
                      <span className="font-pretendard text-base font-normal text-gray-1">
                        {sanction.no}
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-6 py-2.5">
                      <span className="font-pretendard text-base font-normal text-gray-1">
                        {sanction.type}
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-6 py-2.5">
                      <span className="font-pretendard text-base font-normal text-gray-1">
                        {sanction.category}
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-6 py-2.5">
                      <span className="font-pretendard text-base font-normal text-gray-1">
                        {sanction.reason}
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-6 py-2.5">
                      <span className="font-pretendard text-base font-normal text-gray-1">
                        {sanction.startDate}
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-6 py-2.5">
                      <span className="font-pretendard text-base font-normal text-gray-1">
                        {sanction.endDate}
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-6 py-2.5">
                      <span className="font-pretendard text-base font-normal text-gray-1">
                        {sanction.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-10">
                <span className="font-pretendard text-base text-gray-3">
                  제재 이력이 없습니다.
                </span>
              </div>
            )}
          </div>

          {/* 운영자 메모 */}
          <div className="flex flex-col gap-4">
            <h2 className="font-pretendard text-xl font-bold text-gray-1">
              운영자 메모
            </h2>
            <div className="relative rounded-lg border border-gray-6 bg-[#FAF8F6] p-5">
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="해당 회원을 정지하려는 사유를 입력해주세요. 해당 회원을 정지하려는 사유를 입력해주세요."
                className="h-24 w-full resize-none bg-transparent font-pretendard text-base font-normal text-orange-3 placeholder-orange-3 focus:outline-none"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <svg
                  className="rotate-[135deg] fill-[#E0E2E7]"
                  width="12"
                  height="8"
                  viewBox="0 0 7 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6.67466 5.74813C6.71829 6.3557 6.21319 6.86079 5.60562 6.81717L1.02376 6.48821C0.169203 6.42686 -0.217554 5.38949 0.388262 4.78367L4.64116 0.53078C5.24698 -0.0750349 6.28435 0.311721 6.3457 1.16627L6.67466 5.74813Z" />
                </svg>
                <Button
                  onClick={handleSaveMemo}
                  className="h-7 w-16 justify-center rounded bg-primary hover:bg-primary/90"
                >
                  <span className="font-pretendard text-xs font-bold text-white">
                    저장하기
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* 작가 신청 정보 (author_applications 테이블) */}
          {authorApplication && (
            <div className="flex flex-col gap-4">
              <h2 className="font-pretendard text-xl font-bold text-gray-1">
                작가 신청 정보
              </h2>
              <div className="border border-gray-7">
                {/* 첫 번째 행 */}
                <div className="flex">
                  <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      작가명
                    </span>
                  </div>
                  <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-1">
                      {authorApplication.authorName}
                    </span>
                  </div>
                  <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      대표작
                    </span>
                  </div>
                  <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-1">
                      {authorApplication.representativeWork}
                    </span>
                  </div>
                </div>

                {/* 두 번째 행 */}
                <div className="flex">
                  <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      키워드
                    </span>
                  </div>
                  <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                    <div className="flex flex-wrap gap-2">
                      {authorApplication.keyword.map((kw, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-gray-6 px-3 py-1 font-pretendard text-sm text-gray-1"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      신청일자
                    </span>
                  </div>
                  <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-1">
                      {authorApplication.createdAt}
                    </span>
                  </div>
                </div>

                {/* 세 번째 행 */}
                <div className="flex">
                  <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      소개
                    </span>
                  </div>
                  <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-1">
                      {authorApplication.introduction}
                    </span>
                  </div>
                  <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      인증자료
                    </span>
                  </div>
                  <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                    {authorApplication.verificationFileUrl !== "-" ? (
                      <a
                        href={authorApplication.verificationFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-pretendard text-base font-normal text-primary underline"
                      >
                        파일 보기
                      </a>
                    ) : (
                      <span className="font-pretendard text-base font-normal text-gray-1">
                        -
                      </span>
                    )}
                  </div>
                </div>

                {/* 네 번째 행 */}
                <div className="flex">
                  <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      상태
                    </span>
                  </div>
                  <div className="flex flex-1 items-center px-6 py-2.5">
                    <MemberStatusBadge status={authorApplication.status} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 작가 신청 정보 (레거시) */}
          {writerApplication && (
            <div className="flex flex-col gap-4">
              <h2 className="font-pretendard text-xl font-bold text-gray-1">
                작가 신청 정보
              </h2>
              <div className="border border-gray-7">
                {/* 첫 번째 행 */}
                <div className="flex">
                  <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      작가명
                    </span>
                  </div>
                  <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-1">
                      {writerApplication.writerName}
                    </span>
                  </div>
                  <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      대표작
                    </span>
                  </div>
                  <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-1">
                      {writerApplication.majorWork}
                    </span>
                  </div>
                </div>

                {/* 두 번째 행 */}
                <div className="flex">
                  <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      인증자료
                    </span>
                  </div>
                  <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-1">
                      {writerApplication.document}
                    </span>
                  </div>
                  <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      신청일자
                    </span>
                  </div>
                  <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-1">
                      {writerApplication.applicationDate}
                    </span>
                  </div>
                </div>

                {/* 세 번째 행 */}
                <div className="flex">
                  <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                    <span className="font-pretendard text-base font-normal text-gray-2">
                      상태
                    </span>
                  </div>
                  <div className="flex flex-1 items-center px-6 py-2.5">
                    <MemberStatusBadge status={writerApplication.status} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 희곡 구매 이력 */}
          <div className="flex flex-col gap-4">
            <h2 className="font-pretendard text-xl font-semibold leading-6 text-gray-1">
              희곡 구매 이력
            </h2>
            {purchaseHistory.length > 0 ? (
              <div className="flex flex-col">
                {/* 테이블 헤더 */}
                <div className="flex w-full items-center justify-center bg-gray-7">
                  <div className="flex w-[100px] items-center justify-center px-2.5 py-4">
                    <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                      NO
                    </span>
                  </div>
                  <div className="flex items-center justify-center px-2.5 py-4">
                    <span className="w-[200px] font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2 text-center">
                      날짜
                    </span>
                  </div>
                  <div className="flex flex-1 min-w-0 items-center justify-center px-2.5 py-4">
                    <span className="w-[400px] font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2 text-center">
                      희곡명
                    </span>
                  </div>
                  <div className="flex w-[160px] items-center justify-center px-2.5 py-4">
                    <span className="w-[120px] font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2 text-center">
                      환불 관리
                    </span>
                  </div>
                </div>

                {/* 데이터 로우 */}
                <div className="flex flex-col w-full">
                  {purchaseHistory.map((purchase) => (
                    <div
                      key={`${purchase.orderId}_${purchase.playId}`}
                      className="flex w-full items-center rounded"
                    >
                      <div className="flex w-[100px] items-center justify-center p-2.5">
                        <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                          {purchase.no}
                        </span>
                      </div>
                      <div className="flex items-center justify-center p-2.5">
                        <span className="w-[200px] font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1 text-center">
                          {purchase.purchaseDate}
                        </span>
                      </div>
                      <div className="flex flex-1 min-w-0 items-center justify-center p-2.5">
                        <span className="w-[400px] font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1 text-center">
                          {purchase.playTitle} -{" "}
                          {purchase.author && purchase.author !== "-"
                            ? purchase.author
                            : "작가 미지정"}
                        </span>
                      </div>
                      <div className="flex w-[160px] items-center justify-center p-2.5">
                        {/* 환불된 항목: 환불 완료 표시 / 다운로드 완료: 환불 불가 / 그 외: 환불 처리 */}
                        <Button
                          onClick={() => handleRefundClick(purchase)}
                          disabled={purchase.isRefunded || purchase.isDownloaded}
                          className={
                            purchase.isRefunded || purchase.isDownloaded
                              ? "border border-gray-4 bg-white px-3 py-2.5 rounded hover:bg-white cursor-not-allowed"
                              : "border border-primary bg-white px-3 py-2.5 rounded hover:bg-gray-6"
                          }
                        >
                          <span
                            className={
                              purchase.isRefunded || purchase.isDownloaded
                                ? "font-pretendard text-sm font-semibold leading-4 tracking-[-0.28px] text-gray-4"
                                : "font-pretendard text-sm font-semibold leading-4 tracking-[-0.28px] text-primary"
                            }
                          >
                            {purchase.isRefunded
                              ? "환불 완료"
                              : purchase.isDownloaded
                                ? "환불 불가"
                                : "환불 처리"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-10">
                <span className="font-pretendard text-base text-gray-3">
                  구매 이력이 없습니다.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼들 */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.push("/admin/members")}
            className="flex h-9 w-[84px] items-center justify-center gap-1.5 rounded border border-gray-4 bg-white hover:bg-gray-6"
          >
            <Hamburger size={16} color="#555555" />
            <span className="font-pretendard text-sm font-bold text-gray-2">
              목록으로
            </span>
          </Button>
          <div className="flex items-center gap-2.5">
            {authorApplication && authorApplication.status === "pending" && (
              <Button
                onClick={() => setIsRejectWriterModalOpen(true)}
                className="h-9 w-[84px] justify-center rounded bg-gray-4 hover:bg-gray-3"
              >
                <span className="font-pretendard text-sm font-bold text-white">
                  작가 반려
                </span>
              </Button>
            )}
            {authorApplication &&
              (authorApplication.status === "pending" ||
                authorApplication.status === "rejected") && (
                <Button
                  onClick={handleApproveAuthor}
                  className="h-9 w-[84px] justify-center rounded bg-primary hover:bg-primary/90"
                >
                  <span className="font-pretendard text-sm font-bold text-white">
                    작가 승인
                  </span>
                </Button>
              )}
            {authorApplication && authorApplication.status === "approved" && (
              <Button
                onClick={handleCancelApproval}
                className="h-9 w-[84px] justify-center rounded bg-primary hover:bg-primary/90"
              >
                <span className="font-pretendard text-sm font-bold text-white">
                  승인 취소
                </span>
              </Button>
            )}
            <Button
              onClick={() => setIsSuspensionModalOpen(true)}
              className="h-9 w-[84px] justify-center rounded border border-primary bg-white hover:bg-gray-6"
            >
              <span className="font-pretendard text-sm font-bold text-primary">
                활동정지
              </span>
            </Button>
            <Button
              onClick={() => setIsBlacklistModalOpen(true)}
              className="h-9 w-[84px] justify-center rounded bg-gray-1 hover:bg-gray-2"
            >
              <span className="font-pretendard text-sm font-bold text-white">
                블랙리스트
              </span>
            </Button>
          </div>
        </div>

        {/* 활동 정지 모달 */}
        <SuspensionModal
          isOpen={isSuspensionModalOpen}
          onClose={() => setIsSuspensionModalOpen(false)}
          memberId={userId}
        />

        {/* 블랙리스트 모달 */}
        <BlacklistModal
          isOpen={isBlacklistModalOpen}
          onClose={() => setIsBlacklistModalOpen(false)}
          memberId={userId}
        />

        {/* 작가 반려 모달 */}
        {authorApplication && (
          <RejectWriterModal
            isOpen={isRejectWriterModalOpen}
            onClose={() => setIsRejectWriterModalOpen(false)}
            authorApplicationId={authorApplication.id}
            memberId={userId}
            onSuccess={handleRejectSuccess}
          />
        )}

        {/* 환불 처리 모달 */}
        {selectedPurchase && (
          <RefundModal
            isOpen={isRefundModalOpen}
            onClose={() => {
              if (!isRefunding) {
                setIsRefundModalOpen(false);
                setSelectedPurchase(null);
              }
            }}
            onConfirm={handleRefundConfirm}
            userId={memberData?.email || userId}
            playTitle={selectedPurchase.playTitle}
            author={selectedPurchase.author}
            purchaseDate={selectedPurchase.purchaseDate}
            isLoading={isRefunding}
          />
        )}

        {/* 쪽지 보내기 모달 */}
        <NoteSendModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          onSend={handleMessageSend}
          recipientName={memberData?.nickname}
          isLoading={isPending}
        />
      </div>
    </div>
  );
}

export default function MemberDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <span className="font-pretendard text-base text-gray-3">
            로딩 중...
          </span>
        </div>
      }
    >
      <MemberDetailContent />
    </Suspense>
  );
}

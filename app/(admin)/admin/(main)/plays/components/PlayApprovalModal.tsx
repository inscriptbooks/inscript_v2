"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useLoader } from "@/hooks/common/useLoader";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { formatKoreanDate } from "@/lib/utils/date";

interface PlayApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  playId: string;
  onSuccess?: () => void;
}

interface PlayDetailData {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  userId: string;
  summary: string;
  line1: string | null;
  line2: string | null;
  line3: string | null;
}

export default function PlayApprovalModal({
  isOpen,
  onClose,
  playId,
  onSuccess,
}: PlayApprovalModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [playData, setPlayData] = useState<PlayDetailData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (isOpen && playId) {
      fetchPlayDetail();
    } else if (!isOpen) {
      setPlayData(null);
    }
  }, [isOpen, playId]);

  const fetchPlayDetail = async () => {
    showLoader();
    try {
      const response = await fetch(`/api/admin/plays/${playId}`);
      if (!response.ok) {
        showErrorToast("희곡 정보를 불러오는데 실패했습니다.");
        return;
      }
      const data = await response.json();
      setPlayData(data);
    } catch (error) {
      showErrorToast("희곡 정보를 불러오는데 실패했습니다.");
    } finally {
      hideLoader();
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      showErrorToast("반려 사유를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/plays/approval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playId,
          action: "reject",
          rejectionReason: rejectionReason.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        showErrorToast(error.error || "반려 처리에 실패했습니다.");
        return;
      }

      const result = await response.json();
      showSuccessToast(result.message || "희곡이 반려되었습니다.");
      setRejectionReason("");
      onSuccess?.();
      onClose();
    } catch (error) {
      showErrorToast("반려 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/plays/approval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playId,
          action: "approve",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        showErrorToast(error.error || "승인 처리에 실패했습니다.");
        return;
      }

      const result = await response.json();
      showSuccessToast(result.message || "희곡이 승인되었습니다.");
      onSuccess?.();
      onClose();
    } catch (error) {
      showErrorToast("승인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!playData) {
    return null;
  }

  const dialogueText =
    [playData.line1, playData.line2, playData.line3]
      .filter(Boolean)
      .join("\n") || playData.summary;

  return (
    <Modal open={isOpen && !!playData} onClose={onClose}>
      <ModalContent>
        <ModalHeader onClose={onClose}>희곡 등록 신청</ModalHeader>

        <ModalBody>
          {/* 작품 정보 테이블 */}
          <div className="flex w-full flex-col">
            {/* 등록회원ID */}
            <div className="flex h-12 items-stretch border-b border-gray-7">
              <div className="flex w-40 items-start bg-gray-7 px-6 py-2.5">
                <span className="text-base font-normal text-gray-2">
                  등록회원ID
                </span>
              </div>
              <div className="flex flex-1 items-center px-6 py-2.5">
                <span className="text-base font-normal text-gray-1">
                  {playData.userId}
                </span>
              </div>
            </div>

            {/* 신청일자 */}
            <div className="flex h-12 items-stretch border-b border-gray-7">
              <div className="flex w-40 items-start bg-gray-7 px-6 py-2.5">
                <span className="text-base font-normal text-gray-2">
                  신청일자
                </span>
              </div>
              <div className="flex flex-1 items-center px-6 py-2.5">
                <span className="text-base font-normal text-gray-1">
                  {formatKoreanDate(playData.createdAt)}
                </span>
              </div>
            </div>

            {/* 제목 */}
            <div className="flex h-12 items-stretch border-b border-gray-7">
              <div className="flex w-40 items-start bg-gray-7 px-6 py-2.5">
                <span className="text-base font-normal text-gray-2">제목</span>
              </div>
              <div className="flex flex-1 items-center px-6 py-2.5">
                <span className="text-base font-normal text-gray-1">
                  {playData.title}
                </span>
              </div>
            </div>

            {/* 작가 */}
            <div className="flex h-12 items-stretch border-b border-gray-7">
              <div className="flex w-40 items-start bg-gray-7 px-6 py-2.5">
                <span className="text-base font-normal text-gray-2">작가</span>
              </div>
              <div className="flex flex-1 items-start px-6 py-2.5">
                <span className="text-base font-normal text-gray-1">
                  {playData.author}
                </span>
              </div>
            </div>

            {/* 대사 */}
            <div className="flex min-h-[100px] items-stretch border-b border-gray-7">
              <div className="flex w-40 items-start bg-gray-7 px-6 py-2.5">
                <span className="text-base font-normal text-gray-2">대사</span>
              </div>
              <div className="flex flex-1 items-start px-6 py-2.5">
                <span className="flex-1 whitespace-pre-wrap text-base font-normal text-gray-1">
                  {dialogueText}
                </span>
              </div>
            </div>
          </div>

          {/* 반려사유 입력 */}
          <div className="flex w-full flex-col items-start">
            <div className="flex h-11 w-40 items-start gap-1 px-0 py-4">
              <span className="text-sm font-medium text-gray-3">반려사유</span>
            </div>
            <div className="relative flex w-full flex-col items-end gap-[84px] rounded-lg border border-gray-6 bg-[#FAF8F6] p-5">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="희곡을 반려하려는 사유를 입력해주세요."
                className="w-full resize-none border-none bg-transparent text-base font-normal leading-6 text-gray-1 placeholder-orange-3 outline-none"
                rows={3}
                disabled={isSubmitting}
              />
              <svg
                className="rotate-[135deg] transform"
                width="12"
                height="8"
                viewBox="0 0 7 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.67466 5.74715C6.71829 6.35472 6.21319 6.85982 5.60562 6.8162L1.02376 6.48723C0.169203 6.42588 -0.217554 5.38851 0.388262 4.7827L4.64116 0.529803C5.24698 -0.0760114 6.28435 0.310745 6.3457 1.1653L6.67466 5.74715Z"
                  fill="#E0E2E7"
                />
              </svg>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex w-full items-start gap-3">
            <Button
              onClick={handleReject}
              disabled={!rejectionReason.trim() || isSubmitting}
              variant="default"
              className="flex text-[#6D6D6D] bg-[#E0E0E0] hover:bg-[#E0E0E0]/90 flex-1 items-center justify-center gap-2.5 px-6 py-5 text-lg font-bold"
            >
              {isSubmitting ? "처리 중..." : "반려"}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isSubmitting}
              variant="default"
              className="flex flex-1 items-center justify-center gap-2.5 px-6 py-5 text-lg font-bold"
            >
              {isSubmitting ? "처리 중..." : "승인"}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

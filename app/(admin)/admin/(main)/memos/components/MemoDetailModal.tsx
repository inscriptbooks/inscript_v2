"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import { Memo } from "../types";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { useState } from "react";

interface MemoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  memo: Memo;
  onStatusChange?: () => void;
}

export default function MemoDetailModal({
  isOpen,
  onClose,
  memo,
  onStatusChange,
}: MemoDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      // memos 테이블에는 is_visible이 없으므로 연결된 대상의 is_visible을 변경해야 함
      let targetTable = "";
      let targetId = "";

      if (memo.type === "play" && memo.play_id) {
        targetTable = "plays";
        targetId = memo.play_id;
      } else if ((memo.type === "writer" || memo.type === "author") && memo.author_id) {
        targetTable = "authors";
        targetId = memo.author_id;
      } else if (memo.type === "program" && memo.program_id) {
        targetTable = "programs";
        targetId = memo.program_id;
      }

      if (!targetTable || !targetId) {
        showErrorToast("대상 정보를 찾을 수 없습니다.");
        return;
      }

      const newIsVisible = memo.status === "exposed" ? false : true;
      
      const response = await fetch(`/api/admin/memos/${memo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          is_visible: newIsVisible,
          target_table: targetTable,
          target_id: targetId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        showErrorToast(error.error || "상태 변경에 실패했습니다.");
        return;
      }

      showSuccessToast(
        newIsVisible ? "메모가 공개되었습니다." : "메모가 비공개되었습니다."
      );
      onStatusChange?.();
      onClose();
    } catch (error) {
      showErrorToast("상태 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // URL 생성 함수
  const getOriginalUrl = (): string | null => {
    // play 타입: /play/{play_id}/memo/{memo_id}
    if (memo.type === "play" && memo.play_id) {
      return `/play/${memo.play_id}/memo/${memo.id}`;
    }
    // author 타입: /author/{author_id}/memo/{memo_id}
    if ((memo.type === "author" || memo.type === "writer") && memo.author_id) {
      return `/author/${memo.author_id}/memo/${memo.id}`;
    }
    // program 타입: /program/{program_id}/memo/{memo_id}
    if (memo.type === "program" && memo.program_id) {
      return `/program/${memo.program_id}/memo/${memo.id}`;
    }
    
    return null;
  };

  const originalUrl = getOriginalUrl();

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent className="w-[520px]">
        <ModalHeader onClose={onClose} className="gap-6">
          <span className="font-pretendard text-xl font-bold leading-6 text-[#202224]">
            메모 관리
          </span>
        </ModalHeader>

        <ModalBody className="gap-6">
          {/* 메모 정보 테이블 */}
          <div className="flex w-full flex-col border border-gray-7">
            {/* 메모ID */}
            <div className="flex h-12 border-b border-gray-7">
              <div className="flex w-40 items-center bg-gray-7 px-6 py-[10px]">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  메모ID
                </span>
              </div>
              <div className="flex flex-1 items-center px-6 py-[10px]">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                  {memo.id.slice(0, 8)}
                </span>
              </div>
            </div>

            {/* 구분 */}
            <div className="flex h-12 border-b border-gray-7">
              <div className="flex w-40 items-center bg-gray-7 px-6 py-[10px]">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  구분
                </span>
              </div>
              <div className="flex flex-1 items-center px-6 py-[10px]">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                  {memo.category}
                </span>
              </div>
            </div>

            {/* 대상 */}
            <div className="flex h-12 border-b border-gray-7">
              <div className="flex w-40 items-center bg-gray-7 px-6 py-[10px]">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  대상
                </span>
              </div>
              <div className="flex flex-1 items-center px-6 py-[10px]">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                  {memo.target_title}
                </span>
              </div>
            </div>

            {/* 대상링크 */}
            <div className="flex h-12 border-b border-gray-7">
              <div className="flex w-40 items-center bg-gray-7 px-6 py-[10px]">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  대상링크
                </span>
              </div>
              <div className="flex flex-1 items-center px-6 py-[10px]">
                {originalUrl ? (
                  <a
                    href={originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-pretendard text-base font-medium leading-6 tracking-[-0.32px] text-[#2581F9] underline hover:text-[#2581F9]/80"
                  >
                    원문 바로가기
                  </a>
                ) : (
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-4">
                    원문 없음
                  </span>
                )}
              </div>
            </div>

            {/* 작성자 */}
            <div className="flex h-12 border-b border-gray-7">
              <div className="flex w-40 items-center bg-gray-7 px-6 py-[10px]">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  작성자
                </span>
              </div>
              <div className="flex flex-1 items-center px-6 py-[10px]">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                  {memo.author_name}({memo.author_email})
                </span>
              </div>
            </div>

            {/* 등록일시 */}
            <div className="flex h-12">
              <div className="flex w-40 items-center bg-gray-7 px-6 py-[10px]">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  등록일시
                </span>
              </div>
              <div className="flex flex-1 items-center px-6 py-[10px]">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                  {new Date(memo.created_at).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* 메모 내용 */}
          <div className="flex w-full flex-col items-start gap-3">
            <h3 className="font-pretendard text-base font-bold leading-[150%] text-gray-1">
              메모 내용
            </h3>
            <div className="relative flex w-full flex-col items-end gap-[84px] rounded-lg border border-gray-6 bg-[#FAF8F6] p-5">
              <div className="w-full font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                {memo.content}
              </div>
              {/* 말풍선 꼬리 */}
              <svg
                className="absolute bottom-5 right-5 h-2 w-3 rotate-[135deg] fill-[#E0E2E7]"
                width="7"
                height="7"
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

          {/* 비공개/공개 버튼 */}
          <button
            onClick={handleToggleStatus}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2.5 rounded bg-primary px-[55px] py-5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-4"
          >
            <span className="font-pretendard text-lg font-semibold leading-6 text-white">
              {isLoading
                ? "처리 중..."
                : memo.status === "exposed"
                  ? "비공개"
                  : "공개"}
            </span>
          </button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

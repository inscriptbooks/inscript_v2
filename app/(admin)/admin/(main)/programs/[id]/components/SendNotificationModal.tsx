"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "notification" | "message";
  programId: string;
  programTitle?: string;
}

export default function SendNotificationModal({
  isOpen,
  onClose,
  type,
  programId,
  programTitle,
}: SendNotificationModalProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = type === "notification" ? "[알림] 보내기" : "[쪽지] 보내기";

  // 모달이 닫힐 때 content 초기화
  useEffect(() => {
    if (!isOpen) {
      setContent("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      showErrorToast("내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const endpoint = type === "message" 
        ? `/api/admin/programs/${programId}/send-notes`
        : `/api/admin/programs/${programId}/send-notifications`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          title: programTitle ? `[${programTitle}] 알림` : "프로그램 알림",
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const successMessage = type === "message" 
          ? result.message || "쪽지가 전송되었습니다."
          : result.message || "알림이 전송되었습니다.";
        showSuccessToast(successMessage);
        setContent("");
        onClose();
      } else {
        const errorMessage = type === "message"
          ? result.message || "쪽지 전송에 실패했습니다."
          : result.message || "알림 전송에 실패했습니다.";
        showErrorToast(errorMessage);
      }
    } catch (error) {
      const errorMessage = type === "message"
        ? "쪽지 전송 중 오류가 발생했습니다."
        : "알림 전송 중 오류가 발생했습니다.";
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent className="">
        <ModalHeader onClose={onClose}>{title}</ModalHeader>

        <ModalBody>
          {/* 정보 테이블 */}
          <div className="flex flex-col items-start self-stretch border border-gray-7">
            {/* 작성자 행 */}
            <div className="flex h-12 items-center self-stretch border-b border-gray-7">
              <div className="flex w-40 items-center gap-2.5 self-stretch bg-gray-7 px-6 py-2.5">
                <span
                  className="font-pretendard text-base font-normal text-gray-2"
                  style={{ letterSpacing: "-0.32px" }}
                >
                  작성자
                </span>
              </div>
              <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
                <span
                  className="font-pretendard text-base font-normal text-gray-1"
                  style={{ letterSpacing: "-0.32px" }}
                >
                  인스크립트 운영자
                </span>
              </div>
            </div>

            {/* 받는 사람 행 */}
            <div className="flex h-12 items-center self-stretch border-b border-gray-7">
              <div className="flex w-40 items-center gap-2.5 self-stretch bg-gray-7 px-6 py-2.5">
                <span
                  className="font-pretendard text-base font-normal text-gray-2"
                  style={{ letterSpacing: "-0.32px" }}
                >
                  받는 사람
                </span>
              </div>
              <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
                <span
                  className="font-pretendard text-base font-normal text-gray-1"
                  style={{ letterSpacing: "-0.32px" }}
                >
                  {"<" + (programTitle || "프로그램") + ">"} 신청자
                </span>
              </div>
            </div>
          </div>

          {/* 입력 영역 */}
          <div
            className="relative flex flex-col items-end self-stretch rounded-lg border border-gray-6"
            style={{
              backgroundColor: "#FAF8F6",
              padding: "20px",
              gap: "84px",
            }}
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="보낼 내용을 입력해주세요"
              className="w-full resize-none border-none bg-transparent font-pretendard text-base font-normal text-gray-1 outline-none"
              style={{
                letterSpacing: "-0.32px",
                lineHeight: "24px",
                color: content ? "#2A2A2A" : "#CCBCAB",
              }}
              rows={3}
            />
            <div className="absolute bottom-5 right-5">
              <svg
                width="12"
                height="8"
                viewBox="0 0 7 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: "rotate(135deg)" }}
              >
                <path
                  d="M6.67466 5.74715C6.71829 6.35472 6.21319 6.85982 5.60562 6.8162L1.02376 6.48723C0.169203 6.42588 -0.217554 5.38851 0.388262 4.7827L4.64116 0.529803C5.24698 -0.0760114 6.28435 0.310745 6.3457 1.1653L6.67466 5.74715Z"
                  fill="#E0E2E7"
                />
              </svg>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              padding: "20px 55px",
              gap: "10px",
              borderRadius: "4px",
            }}
          >
            <span
              className="font-pretendard font-semibold text-white"
              style={{ fontSize: "18px", lineHeight: "24px" }}
            >
              {isSubmitting ? "전송 중..." : "전송"}
            </span>
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

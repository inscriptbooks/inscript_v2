"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";

interface RejectAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorApplicationId: string;
  userEmail: string;
  onSuccess?: () => void;
}

export default function RejectAuthorModal({
  isOpen,
  onClose,
  authorApplicationId,
  userEmail,
  onSuccess,
}: RejectAuthorModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState(false);

  const rejectionReasons = [
    "부적절한 내용",
    "신뢰할 수 없는 정보",
    "저작권 위반",
    "기타",
  ];

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedReason || !rejectionReason) {
      showErrorToast("반려 사유를 모두 입력해주세요.");
      return;
    }

    const response = await fetch("/api/admin/members/author-rejection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authorApplicationId,
        category: selectedReason,
        rejectionReason,
      }),
    });

    if (response.ok) {
      showSuccessToast("작가 신청이 반려되었습니다.");
      onSuccess?.();
      onClose();
    } else {
      showErrorToast("작가 반려에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex w-[520px] flex-col items-center gap-12 rounded-xl bg-white p-11 shadow-[0_0_10px_0_rgba(146,46,0,0.08)]">
        {/* 헤더 */}
        <div className="flex w-full flex-col items-start gap-6">
          <div className="flex w-full items-start justify-between">
            <h2 className="font-pretendard text-xl font-bold leading-6 text-[#202224]">
              반려 처리
            </h2>
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 19L12 12M12 12L19 5M12 12L5 5M12 12L19 19"
                  stroke="#6D6D6D"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex w-full flex-col items-start gap-6">
            {/* 회원ID 테이블 */}
            <div className="flex h-12 w-full items-center border-b border-gray-7">
              <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  회원ID
                </span>
              </div>
              <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                  {userEmail}
                </span>
              </div>
            </div>

            {/* 반려 사유 선택 및 입력 */}
            <div className="flex w-full flex-col items-start gap-3">
              {/* 반려 사유 선택 드롭다운 */}
              <div className="relative w-full">
                <button
                  onClick={() => setIsReasonDropdownOpen(!isReasonDropdownOpen)}
                  className="flex w-full items-center justify-between rounded-md border border-[#EBEBEB] bg-white px-3 py-3"
                >
                  <span className="font-pretendard text-xs font-bold text-primary">
                    {selectedReason || "반려 사유 선택"}
                  </span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className={`transform transition-transform ${isReasonDropdownOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M2.30018 3H7.70033C7.75501 3.00015 7.8086 3.01358 7.85534 3.03884C7.90208 3.06409 7.9402 3.10022 7.9656 3.14334C7.991 3.18645 8.00271 3.23492 7.99947 3.28352C7.99624 3.33211 7.97818 3.37901 7.94724 3.41915L5.24716 6.89201C5.13526 7.036 4.86585 7.036 4.75365 6.89201L2.05357 3.41915C2.02232 3.37909 2.00399 3.33217 2.00058 3.28349C1.99717 3.23481 2.00881 3.18623 2.03423 3.14303C2.05965 3.09982 2.09788 3.06365 2.14477 3.03843C2.19165 3.01322 2.24541 2.99992 2.30018 3Z"
                      fill="#911A00"
                    />
                  </svg>
                </button>

                {/* 드롭다운 메뉴 */}
                {isReasonDropdownOpen && (
                  <div className="absolute top-full z-10 mt-1 w-full rounded-md border border-[#EBEBEB] bg-white shadow-lg">
                    {rejectionReasons.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => {
                          setSelectedReason(reason);
                          setIsReasonDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left font-pretendard text-xs hover:bg-gray-50"
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 반려 사유 입력 텍스트에어리어 */}
              <div className="relative flex w-full flex-col items-end gap-20 rounded-lg border border-gray-6 bg-[#FAF8F6] p-5">
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="반려 처리 하는 사유를 입력해주세요."
                  className="w-full resize-none bg-transparent font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-orange-3 placeholder-orange-3 focus:outline-none"
                  rows={3}
                />
                <svg
                  className="h-2 w-3 rotate-[135deg] fill-[#E0E2E7]"
                  width="7"
                  height="7"
                  viewBox="0 0 7 7"
                  fill="none"
                >
                  <path d="M6.67466 5.74715C6.71829 6.35472 6.21319 6.85982 5.60562 6.8162L1.02376 6.48723C0.169203 6.42588 -0.217554 5.38851 0.388262 4.7827L4.64116 0.529803C5.24698 -0.0760114 6.28435 0.310745 6.3457 1.1653L6.67466 5.74715Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 반려 버튼 */}
        <Button
          onClick={handleSubmit}
          className="flex w-full items-center justify-center gap-2.5 rounded bg-primary px-14 py-5 hover:bg-primary/90"
        >
          <span className="font-pretendard text-lg font-bold leading-6 text-white">
            반려
          </span>
        </Button>
      </div>
    </div>
  );
}

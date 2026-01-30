"use client";

import { Modal } from "@/components/ui/modal";
import { useState } from "react";

export type ReportTargetType = "post" | "memo" | "comment";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  authorName: string;
  content: string;
  onSubmit?: (reason: string) => void;
}

const REPORT_REASONS = [
  "스팸홍보/도배입니다.",
  "음란물입니다.",
  "불법정보를 포함하고 있습니다.",
  "청소년에게 유해한 내용입니다.",
  "욕설/생명경시/혐오/차별적 표현입니다.",
  "개인정보가 노출되었습니다.",
  "불쾌한 표현이 있습니다.",
  "명예훼손 또는 저작권이 침해되었습니다.",
  "불법촬영물 등이 포함되어 있습니다.",
];

const TARGET_TYPE_LABELS: Record<ReportTargetType, string> = {
  post: "게시물",
  memo: "메모",
  comment: "댓글",
};

export default function ReportModal({
  isOpen,
  onClose,
  targetType,
  authorName,
  content,
  onSubmit,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>(
    REPORT_REASONS[0]
  );

  const handleSubmit = () => {
    onSubmit?.(selectedReason);
    onClose();
  };

  const targetLabel = TARGET_TYPE_LABELS[targetType];
  const truncatedContent =
    content.length > 50 ? `${content.slice(0, 50)}...` : content;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="flex w-full h-full md:h-auto md:w-[590px] flex-col items-start gap-10 rounded-[12px] bg-background p-6 px-10">
        <div className="flex w-full md:w-[510px] flex-col items-start gap-10">
          <div className="flex flex-col items-start gap-5 self-stretch">
            <div className="flex flex-col items-center gap-5 self-stretch">
              <div className="flex items-center justify-between self-stretch">
                <h2 className="text-center font-pretendard text-2xl font-bold leading-[150%] text-gray-1">
                  신고하기
                </h2>
                <button onClick={onClose} className="h-6 w-6">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.5 19.1348L12.5 12.1348M12.5 12.1348L19.5 5.13477M12.5 12.1348L5.5 5.13477M12.5 12.1348L19.5 19.1348"
                      stroke="#6D6D6D"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col items-start gap-5 self-stretch">
                <div className="h-px w-full bg-red-3"></div>

                <div className="flex flex-col items-start gap-5 self-stretch">
                  <div className="flex w-full flex-col items-start gap-5">
                    <div className="flex w-full md:w-[140px] items-center justify-between">
                      <span className="font-pretendard text-lg font-bold leading-[150%] text-gray-1">
                        작성자
                      </span>
                      <span className="font-pretendard text-lg font-medium leading-[150%] text-gray-1">
                        {authorName}
                      </span>
                    </div>

                    <div className="flex items-center gap-[46px] self-stretch">
                      <span className="font-pretendard text-lg font-bold leading-[150%] text-gray-1">
                        {targetLabel}
                      </span>
                      <span className="font-pretendard text-lg font-medium leading-[150%] text-gray-1 line-clamp-1">
                        {truncatedContent}
                      </span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-red-3"></div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-[26px]">
              <span className="font-pretendard text-lg font-bold leading-[150%] text-gray-1">
                사유 선택
              </span>

              <div className="flex w-full md:w-[296px] flex-col items-start gap-5">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className="flex items-center gap-5"
                  >
                    {selectedReason === reason ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12.5"
                          cy="12.1348"
                          r="10"
                          fill="#911A00"
                          stroke="#911A00"
                          strokeWidth="2"
                        />
                        <path
                          d="M9 12.6348L11 14.6348L16 9.63477"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12.5"
                          cy="12.1348"
                          r="11.5"
                          stroke="#EBE1DF"
                        />
                      </svg>
                    )}
                    <span
                      className={`font-pretendard text-base font-medium leading-[150%] ${
                        selectedReason === reason
                          ? "text-primary"
                          : "text-gray-2"
                      }`}
                    >
                      {reason}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-[10px] self-stretch rounded bg-primary px-[55px] py-3 font-pretendard text-lg font-bold leading-6 text-white"
          >
            신고하기
          </button>
        </div>
      </div>
    </Modal>
  );
}

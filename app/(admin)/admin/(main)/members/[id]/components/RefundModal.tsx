"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userId: string;
  playTitle: string;
  author: string;
  purchaseDate: string;
}

export default function RefundModal({
  isOpen,
  onClose,
  onConfirm,
  userId,
  playTitle,
  author,
  purchaseDate,
}: RefundModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[600px] rounded-xl bg-white p-11 shadow-[0px_0px_10px_0px_rgba(146,46,0,0.08)]">
        <div className="flex w-full flex-col gap-6">
          {/* 헤더 */}
          <div className="flex w-full items-start justify-between">
            <h2 className="font-pretendard text-xl font-semibold leading-6 text-[#202224]">
              환불 처리
            </h2>
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center"
            >
              <X size={24} className="text-gray-2" />
            </button>
          </div>

          {/* 내용 */}
          <div className="flex w-full flex-col gap-6">
            {/* 정보 테이블 */}
            <div className="flex w-full flex-col">
              {/* 회원ID */}
              <div className="flex h-12 w-full items-center border-b border-gray-7">
                <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                    회원ID
                  </span>
                </div>
                <div className="flex flex-1 items-center px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                    {userId}
                  </span>
                </div>
              </div>

              {/* 구매한 희곡 */}
              <div className="flex h-12 w-full items-center border-b border-gray-7">
                <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                    구매한 희곡
                  </span>
                </div>
                <div className="flex flex-1 items-center px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                    {playTitle} -{" "}
                    {author && author !== "-" ? author : "작가 미지정"}
                  </span>
                </div>
              </div>

              {/* 구매 날짜 */}
              <div className="flex h-12 w-full items-center border-b border-gray-7">
                <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                    구매 날짜
                  </span>
                </div>
                <div className="flex flex-1 items-center px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                    {purchaseDate}
                  </span>
                </div>
              </div>
            </div>

            {/* 환불 하기 버튼 */}
            <Button
              onClick={onConfirm}
              className="flex w-full items-center justify-center rounded bg-primary px-14 py-5 hover:bg-primary/90"
            >
              <span className="font-pretendard text-lg font-semibold leading-6 text-white">
                환불 하기
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SanctionRecord } from "../types";

interface SanctionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sanctionData: SanctionRecord;
  onRelease: (sanctionId: number) => void;
}

export default function SanctionDetailModal({
  isOpen,
  onClose,
  sanctionData,
  onRelease,
}: SanctionDetailModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return dateString;
  };

  const calculatePeriod = () => {
    if (!sanctionData.endDate || !sanctionData.startDate) return "영구";
    const days = Math.ceil(
      (new Date(sanctionData.endDate).getTime() -
        new Date(sanctionData.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return `${days}일`;
  };

  const handleRelease = () => {
    onRelease(sanctionData.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 */}
      <div className="relative flex w-[520px] flex-col items-center gap-[46px] rounded-xl bg-white p-11 shadow-[0_0_10px_0_rgba(146,46,0,0.08)]">
        {/* 헤더 */}
        <div className="flex w-full flex-col items-start gap-6">
          <div className="flex w-full items-start justify-between">
            <h2 className="font-pretendard text-xl font-bold leading-6 text-[#202224]">
              제재 상세 보기
            </h2>
            <button onClick={onClose} className="p-0">
              <X size={24} color="#6D6D6D" strokeWidth={1.6} />
            </button>
          </div>

          {/* 콘텐츠 */}
          <div className="flex w-full flex-col items-start gap-0">
            {/* 정보 테이블 */}
            <div className="flex w-full flex-col">
              {/* 이메일 */}
              <div className="flex h-12 w-full items-center border-b border-gray-7">
                <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                    이메일
                  </span>
                </div>
                <div className="flex h-full flex-1 items-center px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1 truncate">
                    {sanctionData.userEmail}
                  </span>
                </div>
              </div>

              {/* 이름 */}
              <div className="flex h-12 w-full items-center border-b border-gray-7">
                <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                    이름
                  </span>
                </div>
                <div className="flex h-full flex-1 items-center px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                    {sanctionData.userName}
                  </span>
                </div>
              </div>

              {/* 제재 유형 */}
              <div className="flex h-12 w-full items-center border-b border-gray-7">
                <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                    제재 유형
                  </span>
                </div>
                <div className="flex h-full flex-1 items-center px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                    {sanctionData.sanctionType}
                  </span>
                </div>
              </div>

              {/* 기간 */}
              <div className="flex h-12 w-full items-center border-b border-gray-7">
                <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                    기간
                  </span>
                </div>
                <div className="flex h-full flex-1 items-center px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                    {calculatePeriod()}
                  </span>
                </div>
              </div>

              {/* 제재일 */}
              <div className="flex h-12 w-full items-center border-b border-gray-7">
                <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                    제재일
                  </span>
                </div>
                <div className="flex h-full flex-1 items-center px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                    {formatDate(sanctionData.startDate)}
                  </span>
                </div>
              </div>

              {/* 해제일 */}
              <div className="flex h-12 w-full items-center border-b border-gray-7">
                <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                    해제일
                  </span>
                </div>
                <div className="flex h-full flex-1 items-center px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                    {sanctionData.status === "released"
                      ? formatDate(sanctionData.endDate)
                      : "-"}
                  </span>
                </div>
              </div>

              {/* 제재사유 */}
              <div className="flex h-12 w-full items-center border-b border-gray-7">
                <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                    제재사유
                  </span>
                </div>
                <div className="flex h-full flex-1 items-center px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                    {sanctionData.category} - {sanctionData.reason}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 해제하기 버튼 */}
        <Button
          onClick={handleRelease}
          disabled={sanctionData.status === "released"}
          className="flex w-full items-center justify-center gap-2.5 rounded bg-primary px-[55px] py-5 hover:bg-primary/90 disabled:bg-gray-4 disabled:text-gray-6"
        >
          <span className="font-pretendard text-lg font-bold leading-6 text-white">
            {sanctionData.status === "released" ? "해제됨" : "해제하기"}
          </span>
        </Button>
      </div>
    </div>
  );
}

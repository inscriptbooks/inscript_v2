/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronUp } from "lucide-react";
import DateEdit from "@/components/ui/date-edit";
import Calendar from "@/components/icons/Calendar";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";

interface SuspensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
}

const suspensionReasons = [
  "스팸 메시지 발송",
  "부적절한 콘텐츠 게시",
  "욕설 및 비방",
  "악의적 행동",
  "기타",
];

export default function SuspensionModal({
  isOpen,
  onClose,
  memberId,
}: SuspensionModalProps) {
  const [selectedReason, setSelectedReason] = useState("정지 사유 선택");
  const [reasonText, setReasonText] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const startDateRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchMemberEmail = async () => {
      if (memberId && isOpen) {
        try {
          const response = await fetch(`/api/admin/members/${memberId}`);
          const data = await response.json();
          if (response.ok && data.memberData) {
            setMemberEmail(data.memberData.email);
          }
        } catch (error) {
          // Error handling
        }
      }
    };

    fetchMemberEmail();
  }, [memberId, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startDateRef.current &&
        !startDateRef.current.contains(event.target as Node)
      ) {
        setShowStartDatePicker(false);
      }
      if (
        endDateRef.current &&
        !endDateRef.current.contains(event.target as Node)
      ) {
        setShowEndDatePicker(false);
      }
    };

    if (showStartDatePicker || showEndDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStartDatePicker, showEndDatePicker]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/admin/members/penalty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: memberId,
          category: selectedReason,
          reason: reasonText,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        }),
      });

      if (response.ok) {
        showSuccessToast("활동 정지가 등록되었습니다.");
        onClose();
      } else {
        showErrorToast("활동 정지 등록에 실패했습니다.");
      }
    } catch (error) {
      showErrorToast("오류가 발생했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배�� 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 */}
      <div className="relative flex w-[520px] flex-col items-center gap-[46px] rounded-xl bg-white p-11 shadow-[0_0_10px_0_rgba(146,46,0,0.08)]">
        {/* 헤더 */}
        <div className="flex w-full flex-col items-start gap-6">
          <div className="flex w-full items-start justify-between">
            <h2 className="font-pretendard text-xl font-bold leading-6 text-[#202224]">
              활동 정지
            </h2>
            <button onClick={onClose} className="p-0">
              <X size={24} color="#6D6D6D" strokeWidth={1.6} />
            </button>
          </div>

          {/* 콘텐츠 */}
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
                  {memberEmail || memberId}
                </span>
              </div>
            </div>

            {/* 정지 사유 선택 */}
            <div className="flex w-full flex-col items-start gap-3">
              <div className="relative w-full">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex w-full items-center justify-between rounded-md border border-[#EBEBEB] bg-white px-3 py-3"
                >
                  <span
                    className={`font-pretendard text-xs font-bold leading-normal ${
                      selectedReason === "정지 사유 선택"
                        ? "text-primary"
                        : "text-primary"
                    }`}
                  >
                    {selectedReason}
                  </span>
                  <ChevronUp
                    size={10}
                    color="#911A00"
                    className={`transition-transform ${isDropdownOpen ? "rotate-0" : "rotate-180"}`}
                  />
                </button>

                {/* 드롭다운 메뉴 */}
                {isDropdownOpen && (
                  <div className="absolute top-full z-10 mt-1 w-full rounded-md border border-[#EBEBEB] bg-white shadow-lg">
                    {suspensionReasons.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => {
                          setSelectedReason(reason);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left font-pretendard text-xs font-bold text-primary hover:bg-gray-50"
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 사유 입력 텍스트박스 */}
              <div className="relative w-full rounded-lg border border-gray-6 bg-[#FAF8F6] p-5">
                <textarea
                  value={reasonText}
                  onChange={(e) => setReasonText(e.target.value)}
                  placeholder="해당 회원을 정지하려는 사유를 입력해주세요. 해당 회원을 정지하려는 사유를 입력해주세요."
                  className="h-[84px] w-full resize-none bg-transparent font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-orange-3 placeholder-orange-3 focus:outline-none"
                />
                <div
                  className="absolute bottom-2 right-2 h-3 w-2 rotate-[135deg] bg-[#E0E2E7]"
                  style={{
                    clipPath: "polygon(0 100%, 100% 100%, 100% 0)",
                  }}
                />
              </div>

              {/* 제재 기간 선택 */}
              <div className="flex w-full flex-col items-start gap-2">
                <h3 className="font-pretendard text-base font-bold leading-6 text-gray-2">
                  제재 기간 선택
                </h3>
                <div className="flex w-full items-center gap-2.5">
                  {/* 시작일 */}
                  <div className="relative flex-1" ref={startDateRef}>
                    <button
                      onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                      className="flex w-full items-center justify-between rounded-md border border-[#EBEBEB] bg-white p-3 hover:bg-[#FFF5F2]"
                    >
                      <span
                        className={
                          startDate
                            ? "font-pretendard text-xs font-bold text-[#911A00]"
                            : "font-pretendard text-xs font-medium text-[#727272]"
                        }
                      >
                        {formatDate(startDate) || "날짜 입력"}
                      </span>
                      <Calendar size={12} />
                    </button>
                    {showStartDatePicker && (
                      <div className="absolute left-0 top-full z-50 mt-2">
                        <DateEdit
                          value={startDate || new Date()}
                          onChange={setStartDate}
                          onConfirm={(date) => {
                            setStartDate(date);
                            setShowStartDatePicker(false);
                          }}
                          onCancel={() => setShowStartDatePicker(false)}
                        />
                      </div>
                    )}
                  </div>

                  {/* 구분자 */}
                  <span className="font-pretendard text-xs font-bold leading-normal text-[#727272]">
                    -
                  </span>

                  {/* 종료일 */}
                  <div className="relative flex-1" ref={endDateRef}>
                    <button
                      onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                      className="flex w-full items-center justify-between rounded-md border border-[#EBEBEB] bg-white p-3 hover:bg-[#FFF5F2]"
                    >
                      <span
                        className={
                          endDate
                            ? "font-pretendard text-xs font-bold text-[#911A00]"
                            : "font-pretendard text-xs font-medium text-[#727272]"
                        }
                      >
                        {formatDate(endDate) || "날짜 입력"}
                      </span>
                      <Calendar size={12} />
                    </button>
                    {showEndDatePicker && (
                      <div className="absolute left-0 top-full z-50 mt-2">
                        <DateEdit
                          value={endDate || new Date()}
                          onChange={setEndDate}
                          onConfirm={(date) => {
                            setEndDate(date);
                            setShowEndDatePicker(false);
                          }}
                          onCancel={() => setShowEndDatePicker(false)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 활동 정지 버튼 */}
        <Button
          onClick={handleSubmit}
          className="flex w-full items-center justify-center gap-2.5 rounded bg-primary px-[55px] py-5 hover:bg-primary/90"
        >
          <span className="font-pretendard text-lg font-bold leading-6 text-white">
            활동 정지
          </span>
        </Button>
      </div>
    </div>
  );
}

"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import { useState } from "react";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import Image from "next/image";

interface ProgramReservation {
  id: string;
  reservationId: string;
  programName: string;
  programThumbnailUrl?: string;
  programEventDateTime?: string;
  programLocation?: string;
  programCapacity?: number;
  programDescription?: string;
  memberId: string;
  name: string;
  email: string;
  phone: string;
  status: "completed" | "cancelled" | "ended";
  registrationDate: string;
  memberNickname?: string;
}

interface ProgramReservationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ProgramReservation | null;
  onStatusChange?: () => void;
}

export default function ProgramReservationDetailModal({
  isOpen,
  onClose,
  reservation,
  onStatusChange,
}: ProgramReservationDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!reservation) return null;

  const handleCancelReservation = async () => {
    if (reservation.status === "cancelled") {
      showErrorToast("이미 취소된 신청입니다.");
      return;
    }



    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/program-applications/${reservation.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "cancelled" }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        showErrorToast(error.error || "신청 취소에 실패했습니다.");
        return;
      }

      showSuccessToast("신청이 취소되었습니다.");
      onStatusChange?.();
      onClose();
    } catch (error) {
      showErrorToast("신청 취소 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return (
        <div className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[#078D46] bg-[#D9F8D7] px-3 py-1.5 text-sm font-medium text-[#078D46]">
          신청완료
        </div>
      );
    }
    if (status === "cancelled") {
      return (
        <div className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#D65856] px-3 py-1.5 text-sm font-medium text-white">
          취소
        </div>
      );
    }
    return (
      <div className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#E0E0E0] px-3 py-1.5 text-sm font-medium text-gray-1">
        종료
      </div>
    );
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent className="w-[520px]">
        <ModalHeader onClose={onClose} className="gap-6">
          <span className="font-pretendard text-xl font-bold leading-6 text-[#202224]">
            프로그램 예약
          </span>
        </ModalHeader>

        <ModalBody className="gap-6">
          {/* 프로그램 이미지 영역 */}
          <div className="relative h-[300px] w-full overflow-hidden bg-[#D9D9D9]">
            {reservation.programThumbnailUrl ? (
              <Image
                src={reservation.programThumbnailUrl}
                alt={reservation.programName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-pretendard text-[28px] font-medium leading-[150%] tracking-[-0.56px] text-primary">
                  *프로그램 이미지
                </span>
              </div>
            )}
          </div>

          {/* 정보 테이블 */}
          <div className="w-full border border-gray-7">
            {/* 프로그램 */}
            <div className="flex h-12 items-center border-b border-gray-7">
              <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  프로그램
                </span>
              </div>
              <div className="flex flex-1 items-center px-6 py-2.5">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                  {reservation.programName}
                </span>
              </div>
            </div>

            {/* 프로그램 일시 */}
            {reservation.programEventDateTime && (
              <div className="flex h-12 items-center border-b border-gray-7">
                <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                    프로그램 일시
                  </span>
                </div>
                <div className="flex flex-1 items-center px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                    {new Date(reservation.programEventDateTime).toLocaleString(
                      "ko-KR",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* 장소 */}
            {reservation.programLocation && (
              <div className="flex h-12 items-center border-b border-gray-7">
                <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                    장소
                  </span>
                </div>
                <div className="flex flex-1 items-center px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                    {reservation.programLocation}
                  </span>
                </div>
              </div>
            )}

            {/* 신청일시 */}
            <div className="flex h-12 items-center border-b border-gray-7">
              <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  신청일시
                </span>
              </div>
              <div className="flex flex-1 items-center px-6 py-2.5">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                  {reservation.registrationDate}
                </span>
              </div>
            </div>

            {/* 이름 */}
            <div className="flex h-12 items-center border-b border-gray-7">
              <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  이름
                </span>
              </div>
              <div className="flex flex-1 items-center px-6 py-2.5">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                  {reservation.name} 
                </span>
              </div>
            </div>

            {/* 이메일 */}
            <div className="flex h-12 items-center border-b border-gray-7">
              <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  이메일
                </span>
              </div>
              <div className="flex flex-1 items-center px-6 py-2.5">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                  {reservation.email}
                </span>
              </div>
            </div>

            {/* 휴대폰번호 */}
            <div className="flex h-12 items-center border-b border-gray-7">
              <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  휴대폰번호
                </span>
              </div>
              <div className="flex flex-1 items-center px-6 py-2.5">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                  {reservation.phone}
                </span>
              </div>
            </div>

            {/* 상태 */}
            <div className="flex h-12 items-center">
              <div className="flex h-full w-40 items-center bg-gray-7 px-6 py-2.5">
                <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  상태
                </span>
              </div>
              <div className="flex flex-1 items-center px-6 py-2.5">
                {getStatusBadge(reservation.status)}
              </div>
            </div>
          </div>

          {/* 신청 취소 버튼 */}
          <button
            onClick={handleCancelReservation}
            disabled={isLoading || reservation.status === "cancelled"}
            className="flex w-full items-center justify-center gap-2.5 rounded bg-primary px-[55px] py-5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-4"
          >
            <span className="font-pretendard text-lg font-semibold leading-6 text-white">
              {isLoading
                ? "처리 중..."
                : reservation.status === "cancelled"
                  ? "취소됨"
                  : "신청 취소"}
            </span>
          </button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

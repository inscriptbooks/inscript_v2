import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/common";
import { ApplicantData } from "../types";
import SendNotificationModal from "./SendNotificationModal";

interface ApplicantListProps {
  applicants: ApplicantData[];
  totalPages: number;
  programId: string;
  programTitle?: string;
}

export default function ApplicantList({ applicants, totalPages, programId, programTitle }: ApplicantListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"notification" | "message">("notification");

  const handleOpenModal = (type: "notification" | "message") => {
    setModalType(type);
    if (type === "notification") {
      setIsNotificationModalOpen(true);
    } else {
      setIsMessageModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsNotificationModalOpen(false);
    setIsMessageModalOpen(false);
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full items-center justify-between">
        <h2 className="flex-1 text-xl font-bold leading-6 text-gray-1">
          신청자 목록
        </h2>
      </div>

      <div className="flex items-start gap-4">
        <Button
          size="sm"
          className="h-[52px] w-[184px] bg-primary text-white"
          onClick={() => handleOpenModal("notification")}
        >
          알림 보내기
        </Button>
        <Button
          size="sm"
          className="h-[52px] w-[184px] bg-primary text-white"
          onClick={() => handleOpenModal("message")}
        >
          쪽지 보내기
        </Button>
        {/* <Button
          size="sm"
          className="w-[184px] h-[52px] bg-primary text-white"
        >
          메일 보내기
        </Button>
        <Button
          size="sm"
          className="w-[184px] h-[52px] bg-primary text-white"
        >
          문자 보내기
        </Button> */}
      </div>

      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex w-full flex-col items-start bg-white">
          {/* 신청자 테이블 헤더 */}
          <div className="flex w-full items-center justify-between border-b border-gray-7 bg-gray-7 px-6 py-2.5">
            <div className="w-[54px] text-center text-sm font-medium leading-4 text-[#6A6A6A]">
              순번
            </div>
            <div className="w-[214px] text-center text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              신청일시
            </div>
            <div className="w-[190px] text-center text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              닉네임(아이디)
            </div>
            <div className="flex w-[116px] max-w-[116px] items-center justify-center gap-10">
              <div className="flex items-center gap-2.5">
                <span className="w-[116px] max-w-[116px] text-center text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  이름
                </span>
              </div>
            </div>
            <div className="flex w-[180px] max-w-[180px] items-center justify-center gap-10">
              <div className="flex items-center gap-2.5">
                <span className="max-w-[520px] text-center text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  이메일
                </span>
              </div>
            </div>
            <div className="flex w-[114px] max-w-[114px] items-center justify-center gap-10">
              <div className="flex items-center gap-2.5">
                <span className="max-w-[520px] text-center text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  휴대전화
                </span>
              </div>
            </div>
          </div>

          {/* 신청자 리스트 */}
          {applicants.map((applicant, index) => (
            <div
              key={index}
              className="flex w-full items-center justify-between border-b border-gray-7 px-6 py-2.5"
            >
              <div className="w-[54px] flex-shrink-0 text-center text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                {applicant.no}
              </div>
              <div className="flex w-[214px] max-w-[520px] flex-shrink-0 items-center justify-center gap-10">
                <div className="flex items-center justify-center gap-2.5">
                  <span className="h-6 max-h-6 max-w-[200px] flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-center text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                    {applicant.applicationDate}
                  </span>
                </div>
              </div>
              <div className="flex w-[190px] flex-shrink-0 items-center gap-1">
                <div className="h-6 w-6 flex-shrink-0 rounded-full bg-gray-5"></div>
                <span className="text-center text-sm font-medium leading-4 text-[#6A6A6A]">
                  {applicant.nickname}
                </span>
              </div>
              <div className="w-[116px] flex-shrink-0 text-center text-sm font-medium leading-4 text-[#6A6A6A]">
                {applicant.name}
              </div>
              <div className="w-[180px] max-w-[180px] flex-shrink-0 text-center text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                {applicant.email}
              </div>
              <div className="w-[114px] max-w-[114px] flex-shrink-0 text-center text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                {applicant.phone}
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex w-full items-center justify-center gap-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* 모달 */}
      <SendNotificationModal
        isOpen={isNotificationModalOpen || isMessageModalOpen}
        onClose={handleCloseModal}
        type={modalType}
        programId={programId}
        programTitle={programTitle}
      />
    </div>
  );
}

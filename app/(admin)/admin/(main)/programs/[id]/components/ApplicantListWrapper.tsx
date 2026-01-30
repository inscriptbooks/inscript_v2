"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/common";
import { ApplicantData, ApplicationResponse } from "../types";
import SendNotificationModal from "./SendNotificationModal";

interface ApplicantListWrapperProps {
  programId: string;
  programTitle?: string;
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "");
}

function transformApplicationData(
  applications: ApplicationResponse[],
  offset: number
): ApplicantData[] {
  return applications.map((app, index) => ({
    no: offset + index + 1,
    applicationDate: formatDateTime(app.created_at),
    nickname: `${app.users.name || "사용자"} (${app.users.email.split("@")[0]})`,
    name: app.name,
    email: app.email,
    phone: app.phone,
  }));
}

export default function ApplicantListWrapper({
  programId,
  programTitle,
}: ApplicantListWrapperProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [applicants, setApplicants] = useState<ApplicantData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"notification" | "message">(
    "notification"
  );

  const limit = 10;

  useEffect(() => {
    async function fetchApplications() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/admin/programs/${programId}/applications?page=${currentPage}&limit=${limit}`
        );

        if (response.ok) {
          const result = await response.json();
          const offset = (currentPage - 1) * limit;
          setApplicants(
            transformApplicationData(result.data.applications, offset)
          );
          setTotalPages(result.data.pagination.totalPages);
        }
      } catch (error) {
        // 에러 처리
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplications();
  }, [currentPage, programId]);

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

      <div className="flex items-center justify-end gap-4 w-full">

        <Button
          size="sm"
          className="h-[36px] w-[87px] bg-white text-primary border-primary border-1 border hover:bg-white/90"
          
          onClick={() => handleOpenModal("message")}
        >
          쪽지 보내기
        </Button>
                <Button
          size="sm"
          className="h-[36px] w-[87px] bg-primary text-white"
          onClick={() => handleOpenModal("notification")}
        >
          알림 보내기
        </Button>
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
          {isLoading ? (
            <div className="flex w-full items-center justify-center py-10">
              <span className="text-gray-2">로딩 중...</span>
            </div>
          ) : applicants.length === 0 ? (
            <div className="flex w-full items-center justify-center py-10">
              <span className="text-gray-2">신청자가 없습니다.</span>
            </div>
          ) : (
            applicants.map((applicant, index) => (
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
            ))
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex w-full items-center justify-center gap-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
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

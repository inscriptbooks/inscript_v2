"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Hamburger from "@/components/icons/Hamburger";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { AuthorApplicationDetail } from "../../types";
import RejectAuthorModal from "./RejectAuthorModal";

interface AuthorApplicationDetailContentProps {
  data: AuthorApplicationDetail;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: {
      label: "승인대기",
      className: "border border-[#D7825E] bg-[#FBEEE8] text-[#D44F34]",
    },
    approved: {
      label: "승인완료",
      className: "border border-[#B0D5F2] bg-[#F6FBFF] text-[#2581F9]",
    },
    rejected: {
      label: "반려",
      className: "border border-[#EBB9A3] bg-[#FBEEE8] text-[#D44F34]",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div
      className={`flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium ${config.className}`}
    >
      {config.label}
    </div>
  );
};

export default function AuthorApplicationDetailContent({
  data,
}: AuthorApplicationDetailContentProps) {
  const router = useRouter();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleApproveAuthor = async () => {
    const response = await fetch("/api/admin/members/author-approval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authorApplicationId: data.id,
        action: "approve",
      }),
    });

    if (response.ok) {
      showSuccessToast("작가 신청이 승인되었습니다.");
      router.push("/admin/members/author-applications");
      router.refresh();
    } else {
      showErrorToast("작가 승인에 실패했습니다.");
    }
  };

  const handleRejectSuccess = () => {
    router.push("/admin/members/author-applications");
    router.refresh();
  };

  return (
    <div className="bg-transparent p-8">
      <div className="flex w-full flex-col gap-10 rounded bg-white p-11">
        {/* 헤더 */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h1 className="font-pretendard text-2xl font-bold leading-8 text-gray-1">
              작가 신청 정보
            </h1>

            {/* 작가 신청 정보 테이블 */}
            <div className="border border-gray-7">
              {/* 첫 번째 행 */}
              <div className="flex">
                <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-2">
                    작가명
                  </span>
                </div>
                <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {data.authorName}
                  </span>
                </div>
                <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-2">
                    대표작
                  </span>
                </div>
                <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {data.representativeWork}
                  </span>
                </div>
              </div>

              {/* 두 번째 행 */}
              <div className="flex">
                <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-2">
                    키워드
                  </span>
                </div>
                <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                  <div className="flex flex-wrap gap-2">
                    {data.keyword.map((kw, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-gray-6 px-3 py-1 font-pretendard text-sm text-gray-1"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-2">
                    신청일자
                  </span>
                </div>
                <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {data.createdAt}
                  </span>
                </div>
              </div>

              {/* 세 번째 행 */}
              <div className="flex">
                <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-2">
                    소개
                  </span>
                </div>
                <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {data.introduction}
                  </span>
                </div>
                <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-2">
                    인증자료
                  </span>
                </div>
                <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
                  {data.verificationFileUrl !== "-" ? (
                    <a
                      href={data.verificationFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-pretendard text-base font-normal text-primary underline"
                    >
                      파일 보기
                    </a>
                  ) : (
                    <span className="font-pretendard text-base font-normal text-gray-1">
                      -
                    </span>
                  )}
                </div>
              </div>

              {/* 네 번째 행 */}
              <div className="flex">
                <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-2">
                    상태
                  </span>
                </div>
                <div className="flex flex-1 items-center px-6 py-2.5">
                  <StatusBadge status={data.status} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼들 */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.push("/admin/members/author-applications")}
            className="flex h-9 w-[84px] items-center justify-center gap-1.5 rounded border border-gray-4 bg-white hover:bg-gray-6"
          >
            <Hamburger size={16} color="#555555" />
            <span className="font-pretendard text-sm font-bold text-gray-2">
              목록으로
            </span>
          </Button>
          <div className="flex items-center gap-2.5">
            {(data.status === "pending" || data.status === "rejected") && (
              <>
                <Button
                  onClick={() => setIsRejectModalOpen(true)}
                  className="h-9 w-[84px] justify-center rounded bg-gray-4 hover:bg-gray-3"
                >
                  <span className="font-pretendard text-sm font-bold text-white">
                    작가 반려
                  </span>
                </Button>
                <Button
                  onClick={handleApproveAuthor}
                  className="h-9 w-[84px] justify-center rounded bg-primary hover:bg-primary/90"
                >
                  <span className="font-pretendard text-sm font-bold text-white">
                    작가 승인
                  </span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 반려 모달 */}
        <RejectAuthorModal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          authorApplicationId={data.id}
          userEmail={data.userEmail}
          onSuccess={handleRejectSuccess}
        />
      </div>
    </div>
  );
}

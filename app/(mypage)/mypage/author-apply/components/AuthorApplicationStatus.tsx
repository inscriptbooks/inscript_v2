"use client";

import { Button } from "@/components/ui/button";

interface AuthorApplicationStatusProps {
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string | null;
  onReapply?: () => void;
}

export default function AuthorApplicationStatus({
  status,
  rejectionReason,
  onReapply,
}: AuthorApplicationStatusProps) {
  if (status === "pending") {
    return (
      <div className="flex w-full max-w-[600px] flex-col items-center gap-6 rounded-lg border border-gray-4 bg-gray-6 p-8">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-center font-pretendard text-xl font-bold leading-6 text-gray-1">
            작가 회원 신청 검토 중
          </h2>
          <p className="text-center font-pretendard text-base font-normal leading-6 text-gray-2">
            관리자가 신청 내용을 확인하고 있습니다.
            <br />
            승인까지 최대 일주일이 소요될 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="flex w-full max-w-[600px] flex-col items-center gap-6 rounded-lg border border-primary bg-primary/5 p-8">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-center font-pretendard text-xl font-bold leading-6 text-primary">
            작가 회원 등급
          </h2>
          <p className="text-center font-pretendard text-base font-normal leading-6 text-gray-1">
            작가 회원으로 승인되었습니다.
            <br />
            작가 전용 기능을 이용하실 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="flex w-full max-w-[600px] flex-col items-center gap-6 rounded-lg border border-red-500 bg-red-50 p-8">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-center font-pretendard text-xl font-bold leading-6 text-red-600">
            작가 회원 신청 거절
          </h2>
          <p className="text-center font-pretendard text-base font-normal leading-6 text-gray-1">
            신청하신 내용이 승인 기준에 부합하지 않아 거절되었습니다.
            <br />
            자격 요건을 다시 확인하신 후 재신청해 주세요.
          </p>
          {rejectionReason && (
            <div className="w-full rounded-lg border border-red-200 bg-white p-4">
              <p className="mb-2 font-pretendard text-sm font-bold leading-5 text-red-600">
                반려 사유
              </p>
              <p className="whitespace-pre-wrap font-pretendard text-sm font-normal leading-5 text-gray-2">
                {rejectionReason}
              </p>
            </div>
          )}
        </div>
        <Button
          onClick={onReapply}
          className="w-full text-lg font-bold lg:w-[440px]"
        >
          다시 신청하기
        </Button>
      </div>
    );
  }

  return null;
}

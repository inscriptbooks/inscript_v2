"use client";

interface AuthorApplicationStatusProps {
  status: "pending" | "approved" | "rejected";
}

export default function AuthorApplicationStatus({
  status,
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

  return null;
}

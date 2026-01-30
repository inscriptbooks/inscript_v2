import { Button } from "@/components/ui/button";

interface MembershipStatusCardProps {
  userName?: string;
  subscriptionStartDate?: string;
  onCancelClick?: () => void;
}

export function MembershipStatusCard({
  userName = "홍길동",
  subscriptionStartDate = "2025.07.10",
  onCancelClick,
}: MembershipStatusCardProps) {
  return (
    <div className="flex w-full max-w-[484px] flex-col items-start gap-[42px]">
      {/* Header Section */}
      <div className="flex flex-col items-start gap-[26px] self-stretch">
        <h2 className="self-stretch text-center font-pretendard text-[20px] font-semibold leading-6 text-gray-1">
          멤버십
        </h2>

        <div className="flex w-[350px] flex-col items-start gap-5">
          <p className="self-stretch font-pretendard text-[20px] font-semibold leading-6">
            <span className="text-gray-2">{userName}님은 </span>
            <span className="text-primary">인스크립트 멤버십</span>
            <span className="text-gray-2">입니다.</span>
          </p>

          <div className="flex items-center gap-4">
            <span className="font-pretendard text-base font-semibold leading-6 text-gray-2">
              구독 시작일
            </span>
            <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              {subscriptionStartDate}
            </span>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="flex flex-col items-start gap-3 self-stretch rounded bg-gray-7 p-6">
        <h3 className="self-stretch font-pretendard text-lg font-semibold leading-6 text-gray-2">
          멤버십 혜택
        </h3>

        <div className="flex flex-col items-start gap-3 self-stretch">
          <p className="self-stretch font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
            인스크립트 오프라인 프로그램 신청시,
          </p>
          <p className="self-stretch font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
            혜택에 대한 내용을 적을 수 있습니다.
          </p>
          <p className="self-stretch font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
            혜택에 대한 내용을 적을 수 있습니다.
          </p>
        </div>
      </div>

      {/* Cancel Button */}
      <Button
        type="button"
        variant="outline"
        className="flex h-16 items-center justify-center gap-2.5 self-stretch rounded border border-primary bg-background px-[55px] py-5"
        onClick={onCancelClick}
      >
        <span className="font-pretendard text-lg font-semibold leading-6 text-primary">
          멤버십 취소하기
        </span>
      </Button>
    </div>
  );
}

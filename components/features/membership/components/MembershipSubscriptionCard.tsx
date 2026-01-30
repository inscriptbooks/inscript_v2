import { Button } from "@/components/ui/button";

interface MembershipSubscriptionCardProps {
  userName?: string;
  onSubscribeClick?: () => void;
}

export function MembershipSubscriptionCard({
  userName = "홍길동",
  onSubscribeClick,
}: MembershipSubscriptionCardProps) {
  return (
    <div className="flex w-full max-w-[484px] flex-col items-start gap-[42px]">
      <div className="flex flex-col items-start gap-[26px] self-stretch">
        <h2 className="self-stretch text-center font-pretendard text-[20px] font-semibold leading-6 text-gray-1">
          멤버십
        </h2>
        <div className="flex flex-col items-start gap-2 self-stretch">
          <p className="self-stretch font-pretendard text-[20px] font-semibold leading-6 text-gray-2">
            {userName} 님은 아직 인스크립트 멤버십에 가입하지 않으셨습니다.
          </p>
          <p className="self-stretch font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
            인스크립트 멤버십 구독하고 다양한 혜택을 누려보세요. 기다리고
            있을게요.
          </p>
        </div>
      </div>
      <Button
        type="button"
        className="justify-center self-stretch font-pretendard text-lg font-semibold leading-6"
        onClick={onSubscribeClick}
      >
        멤버십 구독하고 혜택 받기
      </Button>
    </div>
  );
}

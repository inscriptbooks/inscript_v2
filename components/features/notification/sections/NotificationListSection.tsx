import { NotificationList } from "@/components/features/notification";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NotificationListSectionProps {
  combinedNotifications: any[];
  onMarkAsRead: (
    notificationId: string | number,
    notificationType: "system" | "post" | "program"
  ) => void;
}

export default function NotificationListSection({
  combinedNotifications,
  onMarkAsRead,
}: NotificationListSectionProps) {
  return (
    <section className="flex w-full max-w-[794px] flex-col items-center gap-5 px-[20px] lg:px-[120px]">
      <NotificationList
        combinedNotifications={combinedNotifications}
        onMarkAsRead={onMarkAsRead}
      />

      <div className="self-stretch text-center font-pretendard text-sm font-normal leading-[130%] text-gray-4">
        알림은 최대 30일까지 보관 가능합니다.
      </div>

      <Link href="/mypage/notification">
        <Button
          variant="default"
          size="sm"
          className="h-[52px] w-[184px] text-lg font-bold"
        >
          알림 설정하기
        </Button>
      </Link>
    </section>
  );
}

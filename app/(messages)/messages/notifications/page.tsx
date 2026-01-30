"use client";

import { Alert } from "@/components/icons";
import Image from "next/image";
import { useNotificationData } from "./hooks/useNotificationData";
import { NotificationList } from "@/components/features/notification";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotificationsPage() {
  const { hasUnreadNotifications, combinedNotifications, handleMarkAsRead } = useNotificationData();

  return (
    <section className="flex w-full flex-col items-center gap-8 pb-[60px]">
      <div className="flex w-full justify-center border-b border-b-primary pb-5 pt-11 lg:pt-20">
        <div className="flex items-center gap-3">
          {hasUnreadNotifications ? (
            <Alert hasNotification={true} size={28} />
          ) : (
            <Image
              src="/images/alert_no_dot.svg"
              alt="알림"
              width={28}
              height={28}
            />
          )}
          <h1 className="font-serif text-xl font-bold text-primary lg:text-[28px]">
            알림
          </h1>
        </div>
      </div>

      <section className="flex w-full max-w-[794px] flex-col items-center gap-5 px-[20px] lg:px-[120px]">
        <NotificationList
          combinedNotifications={combinedNotifications}
          onMarkAsRead={handleMarkAsRead}
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
    </section>
  );
}

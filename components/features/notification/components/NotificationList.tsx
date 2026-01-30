"use client";

import { Like, Comment } from "@/components/icons";
import type { Notification, NewContentNotification } from "../types";

type CombinedNotification =
  | (Notification & { notificationType: "stored" })
  | (NewContentNotification & { notificationType: "new" });

interface NotificationListProps {
  combinedNotifications: CombinedNotification[];
  onMarkAsRead: (
    notificationId: string | number,
    notificationType: "system" | "post" | "program"
  ) => void;
}

export default function NotificationList({
  combinedNotifications,
  onMarkAsRead,
}: NotificationListProps) {
  return (
    <div className="flex flex-col items-start gap-2.5 self-stretch">
      {combinedNotifications.map((notification) => (
        <NotificationItem
          key={
            notification.notificationType === "stored"
              ? `stored-${notification.id}`
              : notification.id
          }
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
}

interface NotificationItemProps {
  notification: CombinedNotification;
  onMarkAsRead: (
    notificationId: string | number,
    notificationType: "system" | "post" | "program"
  ) => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const isStored = notification.notificationType === "stored";
  const isRead = notification.is_read;

  const getIcon = () => {
    switch (notification.type) {
      case "comment":
        return <Comment color="#911A00" />;
      case "like":
        return <Like color="#911A00" />;
      case "program":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2L12.5 7L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7L10 2Z"
              fill="#911A00"
            />
          </svg>
        );
      case "post":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect
              x="3"
              y="3"
              width="14"
              height="14"
              rx="2"
              stroke="#911A00"
              strokeWidth="2"
            />
            <line
              x1="6"
              y1="7"
              x2="14"
              y2="7"
              stroke="#911A00"
              strokeWidth="2"
            />
            <line
              x1="6"
              y1="10"
              x2="14"
              y2="10"
              stroke="#911A00"
              strokeWidth="2"
            />
            <line
              x1="6"
              y1="13"
              x2="11"
              y2="13"
              stroke="#911A00"
              strokeWidth="2"
            />
          </svg>
        );
      case "system":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#911A00" strokeWidth="2" />
            <path
              d="M10 6V10L13 13"
              stroke="#911A00"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const handleClick = () => {
    if (isStored) {
      // system 알림 (id는 uuid)
      if (!isRead) {
        onMarkAsRead(notification.id, "system");
      }
    } else {
      // post 또는 program 알림
      const notificationType = notification.type as "post" | "program";
      // id에서 실제 ID 추출 (예: "post-abc-123-def" -> "abc-123-def")
      // notification.id는 "post-{uuid}" 또는 "program-{uuid}" 형태
      const actualId = notification.id.replace(/^(post|program)-/, "");

      // 읽음 처리
      if (!isRead) {
        onMarkAsRead(actualId, notificationType);
      }

      // 새 창으로 링크 열기
      if (notification.link) {
        window.open(notification.link, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <div
      className={`flex cursor-pointer flex-col items-start gap-1.5 self-stretch rounded-[4px] p-6 ${
        isRead ? "bg-gray-50" : "bg-white"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between self-stretch">
        <div className="flex items-center gap-1">
          {getIcon()}

          <div className="font-pretendard text-base font-bold leading-[150%] text-primary">
            {notification.title}
          </div>
          {!isRead && <div className="ml-2 h-2 w-2 rounded-full bg-primary" />}
        </div>
        <div className="font-pretendard text-sm font-medium leading-4 text-gray-4">
          {formatDate(notification.created_at)}
        </div>
      </div>
      <div className="self-stretch font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-3">
        {notification.message}
      </div>
    </div>
  );
}

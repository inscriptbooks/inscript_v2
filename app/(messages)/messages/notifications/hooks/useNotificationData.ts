import { useEffect, useState } from "react";
import type {
  Notification,
  NewContentNotification,
} from "@/components/features/notification/types";

type CombinedNotification =
  | (Notification & { notificationType: "stored" })
  | (NewContentNotification & { notificationType: "new" });

export function useNotificationData() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newContent, setNewContent] = useState<NewContentNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchNotifications(), fetchNewContent()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      // Error silently handled
    }
  };

  const fetchNewContent = async () => {
    try {
      const response = await fetch("/api/notifications/new-content");
      if (response.ok) {
        const data = await response.json();
        setNewContent(data.newContent || []);
      }
    } catch (error) {
      // Error silently handled
    }
  };

  const handleMarkAsRead = async (
    notificationId: string | number,
    notificationType: "system" | "post" | "program"
  ) => {
    try {
      const response = await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notification_id: notificationId.toString(),
          notification_type: notificationType,
        }),
      });

      if (response.ok) {
        if (notificationType === "system") {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notificationId ? { ...n, is_read: true } : n
            )
          );
        } else {
          setNewContent((prev) =>
            prev.map((n) => {
              const actualId = n.id.replace(/^(post|program)-/, "");
              return actualId === notificationId.toString()
                ? { ...n, is_read: true }
                : n;
            })
          );
        }
      }
    } catch (error) {
      // Error silently handled
    }
  };

  // 저장된 알림과 새 콘텐츠를 통합하고 읽지 않은 것만 표시
  const combinedNotifications: CombinedNotification[] = [
    ...notifications.map((n) => ({
      ...n,
      notificationType: "stored" as const,
    })),
    ...newContent.map((n) => ({ ...n, notificationType: "new" as const })),
  ]
    .filter((n) => !n.is_read)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const hasUnreadNotifications = combinedNotifications.length > 0;

  return {
    combinedNotifications,
    hasUnreadNotifications,
    loading,
    handleMarkAsRead,
  };
}

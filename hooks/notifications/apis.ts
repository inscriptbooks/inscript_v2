import axiosInstance from "@/lib/axios/client";

export interface UnreadNotificationResponse {
  hasUnread: boolean;
  count: number;
}

export const getUnreadNotifications = async (): Promise<UnreadNotificationResponse> => {
  const response = await axiosInstance.get<UnreadNotificationResponse>("/notifications/unread");
  return response.data;
};

import { useQuery } from "@tanstack/react-query";
import { notificationKeys } from "./keys";
import { getUnreadNotifications } from "./apis";

export const useUnreadNotifications = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: getUnreadNotifications,
    refetchInterval: 30000, // 30초마다 자동 갱신
  });

  return {
    hasUnread: data?.hasUnread ?? false,
    count: data?.count ?? 0,
    isLoading,
    error,
    refetch,
  };
};

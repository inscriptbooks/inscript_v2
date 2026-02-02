import { Suspense } from "react";
import NotificationsContent from "./components/NotificationsContent";
import { NotificationsResponse } from "./types";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
    searchQuery?: string;
  }>;
}

async function getNotificationsData(
  searchParams: Record<string, string | undefined>,
): Promise<NotificationsResponse> {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const startDate = searchParams.startDate;
  const endDate = searchParams.endDate;
  const searchQuery = searchParams.searchQuery;

  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());

  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  if (searchQuery) params.set("searchQuery", searchQuery);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`/api/admin/notifications?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      notifications: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        limit: 10,
      },
    };
  }

  return response.json();
}

export default async function AdminNotificationsSendPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const data = await getNotificationsData(params);

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <NotificationsContent initialData={data} />
    </Suspense>
  );
}

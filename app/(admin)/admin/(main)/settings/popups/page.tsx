import { Suspense } from "react";
import PopupsContent from "./components/PopupsContent";
import { PopupsResponse } from "./types";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    searchCategory?: string;
    searchQuery?: string;
  }>;
}

async function getPopupsData(
  searchParams: Record<string, string | undefined>,
): Promise<PopupsResponse> {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const startDate = searchParams.startDate;
  const endDate = searchParams.endDate;
  const status = searchParams.status;
  const searchCategory = searchParams.searchCategory;
  const searchQuery = searchParams.searchQuery;

  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());

  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  if (status) params.set("status", status);
  if (searchCategory) params.set("searchCategory", searchCategory);
  if (searchQuery) params.set("searchQuery", searchQuery);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`/api/admin/popups?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      popups: [],
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

export default async function AdminPopupsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await getPopupsData(params);

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PopupsContent initialData={data} />
    </Suspense>
  );
}

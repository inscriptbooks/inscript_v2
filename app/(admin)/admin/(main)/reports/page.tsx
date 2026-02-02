import { Suspense } from "react";
import ReportsContent from "./components/ReportsContent";
import { ReportsResponse } from "./types";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
    status?: string;
    searchCategory?: string;
    searchQuery?: string;
  }>;
}

async function getReportsData(
  searchParams: Record<string, string | undefined>,
): Promise<ReportsResponse> {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const startDate = searchParams.startDate;
  const endDate = searchParams.endDate;
  const category = searchParams.category;
  const status = searchParams.status;
  const searchCategory = searchParams.searchCategory;
  const searchQuery = searchParams.searchQuery;

  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());

  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  if (category) params.set("category", category);
  if (status) params.set("status", status);
  if (searchCategory) params.set("searchCategory", searchCategory);
  if (searchQuery) params.set("searchQuery", searchQuery);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`/api/admin/reports?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      reports: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        limit: 10,
      },
      statistics: {
        completedCount: 0,
        pendingCount: 0,
        invalidCount: 0,
      },
    };
  }

  return response.json();
}

export default async function AdminReportsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await getReportsData(params);

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ReportsContent initialData={data} />
    </Suspense>
  );
}

import { Suspense } from "react";
import WritersContent from "./components/WritersContent";
import { WritersResponse } from "./types";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    searchCategory?: string;
    searchQuery?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

async function getWritersData(
  searchParams: Record<string, string | undefined>,
): Promise<WritersResponse> {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const startDate = searchParams.startDate;
  const endDate = searchParams.endDate;
  const status = searchParams.status;
  const searchCategory = searchParams.searchCategory;
  const searchQuery = searchParams.searchQuery;
  const sortBy = searchParams.sortBy;
  const sortOrder = searchParams.sortOrder;

  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());

  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  if (status) params.set("status", status);
  if (searchCategory) params.set("searchCategory", searchCategory);
  if (searchQuery) params.set("searchQuery", searchQuery);
  if (sortBy) params.set("sortBy", sortBy);
  if (sortOrder) params.set("sortOrder", sortOrder);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`/api/admin/writers?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      writers: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        limit: 10,
      },
      stats: {
        visibleCount: 0,
        hiddenCount: 0,
      },
    };
  }

  return response.json();
}

export default async function AdminWritersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await getWritersData(params);

  return (
    <Suspense fallback={<div></div>}>
      <WritersContent initialData={data} />
    </Suspense>
  );
}

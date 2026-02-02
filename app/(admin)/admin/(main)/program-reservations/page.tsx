import { Suspense } from "react";
import ApplicationsContent from "./components/ApplicationsContent";
import { ApplicationsResponse } from "./types";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
    visibility?: string;
    status?: string;
    searchCategory?: string;
    searchQuery?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

async function getApplicationsData(
  searchParams: Record<string, string | undefined>
): Promise<ApplicationsResponse> {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const startDate = searchParams.startDate;
  const endDate = searchParams.endDate;
  const visibility = searchParams.visibility;
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
  if (visibility) params.set("visibility", visibility);
  if (status) params.set("status", status);
  if (searchCategory) params.set("searchCategory", searchCategory);
  if (searchQuery) params.set("searchQuery", searchQuery);
  if (sortBy) params.set("sortBy", sortBy);
  if (sortOrder) params.set("sortOrder", sortOrder);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(
    `${baseUrl}/api/admin/program-applications?${params}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return {
      applications: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        limit: 10,
      },
      statistics: {
        completedCount: 0,
        cancelledCount: 0,
        endedCount: 0,
      },
    };
  }

  return response.json();
}

export default async function AdminProgramReservationsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const data = await getApplicationsData(params);

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ApplicationsContent initialData={data} />
    </Suspense>
  );
}

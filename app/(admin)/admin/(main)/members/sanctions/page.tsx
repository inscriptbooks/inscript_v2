import { Suspense } from "react";
import SanctionsContent from "./components/SanctionsContent";
import { SanctionsResponse } from "./types";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
    sanctionType?: string;
    status?: string;
    searchCategory?: string;
    searchQuery?: string;
  }>;
}

async function getSanctionsData(
  searchParams: Record<string, string | undefined>
): Promise<SanctionsResponse> {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const startDate = searchParams.startDate;
  const endDate = searchParams.endDate;
  const sanctionType = searchParams.sanctionType;
  const status = searchParams.status;
  const searchCategory = searchParams.searchCategory;
  const searchQuery = searchParams.searchQuery;

  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());

  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  if (sanctionType) params.set("sanctionType", sanctionType);
  if (status) params.set("status", status);
  if (searchCategory) params.set("searchCategory", searchCategory);
  if (searchQuery) params.set("searchQuery", searchQuery);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/admin/sanctions?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      sanctions: [],
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

export default async function AdminMemberSanctionsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const data = await getSanctionsData(params);

  return (
    <Suspense fallback={<div />}>
      <SanctionsContent initialData={data} />
    </Suspense>
  );
}

import { Suspense } from "react";
import AdminAccountsContent from "./components/AdminAccountsContent";
import { AdminAccountsResponse } from "./types";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchCategory?: string;
    searchQuery?: string;
    status?: string;
    type?: string;
  }>;
}

async function getAdminAccountsData(
  searchParams: Record<string, string | undefined>
): Promise<AdminAccountsResponse> {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const searchCategory = searchParams.searchCategory;
  const searchQuery = searchParams.searchQuery;
  const status = searchParams.status;
  const type = searchParams.type;

  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());

  if (searchCategory) params.set("searchCategory", searchCategory);
  if (searchQuery) params.set("searchQuery", searchQuery);
  if (status) params.set("status", status);
  if (type) params.set("type", type);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/admin/accounts?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      accounts: [],
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

export default async function AdminAccountsPermissionsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const data = await getAdminAccountsData(params);

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AdminAccountsContent initialData={data} />
    </Suspense>
  );
}

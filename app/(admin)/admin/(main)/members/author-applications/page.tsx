import { createClient } from "@/lib/supabase/server";
import AuthorApplicationsContent from "./components/AuthorApplicationsContent";
import { AuthorApplicationsResponse } from "./types";
import { formatKoreanDateTime } from "@/lib/utils/date";

async function getInitialData(): Promise<AuthorApplicationsResponse> {
  const supabase = await createClient();

  const { data, count, error } = await supabase
    .from("author_applications")
    .select(
      `
      id,
      user_id,
      status,
      created_at,
      users!inner (
        id,
        name,
        email
      )
    `,
      { count: "exact" }
    )
    .in("status", ["pending", "rejected"])
    .order("created_at", { ascending: false })
    .range(0, 9);

  if (error) {
    return {
      applications: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        limit: 10,
      },
    };
  }

  const applications = (data || []).map((item, index) => {
    const user = item.users as unknown as {
      id: string;
      name: string;
      email: string;
    };
    return {
      id: item.id,
      no: index + 1,
      userId: item.user_id,
      name: user?.name || "-",
      email: user?.email || "-",
      status: item.status as "pending" | "approved" | "rejected",
      createdAt: formatKoreanDateTime(item.created_at),
    };
  });

  const totalPages = Math.ceil((count || 0) / 10);

  return {
    applications,
    pagination: {
      currentPage: 1,
      totalPages,
      totalCount: count || 0,
      limit: 10,
    },
  };
}

export default async function AuthorApplicationsPage() {
  const initialData = await getInitialData();

  return <AuthorApplicationsContent initialData={initialData} />;
}

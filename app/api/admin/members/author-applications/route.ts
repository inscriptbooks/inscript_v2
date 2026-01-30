import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatKoreanDateTime } from "@/lib/utils/date";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder") || "desc";

  // author_applications 테이블에서 status가 pending 또는 rejected인 데이터 조회
  // users 테이블과 조인하여 이름, 이메일 가져오기
  let query = supabase
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
    .in("status", ["pending", "rejected"]);

  // 정렬 적용
  if (sortBy === "status") {
    query = query.order("status", { ascending: sortOrder === "asc" });
  } else if (sortBy === "created_at") {
    query = query.order("created_at", { ascending: sortOrder === "asc" });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 응답 데이터 포맷팅
  const applications = (data || []).map((item, index) => {
    const user = item.users as unknown as {
      id: string;
      name: string;
      email: string;
    };
    return {
      id: item.id,
      no: offset + index + 1,
      userId: item.user_id,
      name: user?.name || "-",
      email: user?.email || "-",
      status: item.status,
      createdAt: formatKoreanDateTime(item.created_at),
    };
  });

  const totalPages = Math.ceil((count || 0) / limit);

  return NextResponse.json({
    applications,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount: count || 0,
      limit,
    },
  });
}

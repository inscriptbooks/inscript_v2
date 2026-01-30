import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatKoreanDateTime } from "@/lib/utils/date";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const isWriter = searchParams.get("isWriter");
    const status = searchParams.get("status");
    const searchCategory = searchParams.get("searchCategory");
    const searchQuery = searchParams.get("searchQuery");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    // 작가 ID 목록 먼저 조회
    const { data: authorsData } = await supabase.from("authors").select("id");

    const authorIds = new Set(authorsData?.map((a) => a.id) || []);
    const authorIdArray = authorsData?.map((a) => a.id) || [];

    // 기본 쿼리
    let query = supabase.from("users").select(
      `
        id,
        name,
        email,
        auth_provider,
        created_at,
        last_login,
        status,
        admin_memo
      `,
      { count: "exact" }
    );

    // 작가 필터 (DB 레벨에서 필터링)
    if (isWriter === "writer") {
      query = query.in(
        "id",
        authorIdArray.length > 0
          ? authorIdArray
          : ["00000000-0000-0000-0000-000000000000"]
      );
    }

    // 가입일 필터
    if (startDate) {
      query = query.gte("created_at", new Date(startDate).toISOString());
    }
    if (endDate) {
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      query = query.lte("created_at", endDateObj.toISOString());
    }

    // 상태 필터
    if (status && status !== "전체") {
      const statusMap: Record<string, string> = {
        정상: "active",
        활동정지: "suspended",
        블랙리스트: "blacklist",
      };
      const mappedStatus = statusMap[status];
      if (mappedStatus) {
        query = query.eq("status", mappedStatus);
      }
    }

    // 검색 필터
    if (searchQuery && searchQuery.trim()) {
      if (searchCategory === "전체") {
        query = query.or(
          `name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`
        );
      } else if (searchCategory === "이름") {
        query = query.ilike("name", `%${searchQuery}%`);
      } else if (searchCategory === "이메일") {
        query = query.ilike("email", `%${searchQuery}%`);
      }
    }

    // 정렬
    const validSortColumns = ["name", "last_login", "created_at"];
    const sortColumn = validSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";
    const ascending = sortOrder === "asc";
    query = query.order(sortColumn, { ascending });

    // 페이지네이션
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const filteredData = data || [];

    // 응답 데이터 포맷팅
    const signupMethodMap: Record<string, string> = {
      local: "이메일",
      google: "구글",
      kakao: "카카오",
    };

    // status 매핑
    const statusDisplayMap: Record<
      string,
      "normal" | "suspended" | "blacklist"
    > = {
      active: "normal",
      suspended: "suspended",
      blacklist: "blacklist",
    };

    const members = filteredData.map((user, index) => {
      const dbStatus = user.status || "active";
      const displayStatus = statusDisplayMap[dbStatus] || "normal";

      return {
        id: user.id,
        no: offset + index + 1,
        name: user.name || "-",
        email: user.email || "-",
        signupMethod:
          signupMethodMap[user.auth_provider || ""] ||
          user.auth_provider ||
          "-",
        isWriter: authorIds.has(user.id),
        status: displayStatus,
        lastLogin: formatKoreanDateTime(user.last_login),
        joinDate: formatKoreanDateTime(user.created_at),
        adminMemo: user.admin_memo || null,
      };
    });

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      members,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count || 0,
        limit,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

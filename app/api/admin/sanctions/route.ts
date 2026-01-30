import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const sanctionType = searchParams.get("sanctionType");
  const status = searchParams.get("status");
  const searchCategory = searchParams.get("searchCategory");
  const searchQuery = searchParams.get("searchQuery");
  const sortBy = searchParams.get("sortBy") || "created_at";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const offset = (page - 1) * limit;

  // 블랙리스트 데이터 조회
  let blacklistQuery = supabase.from("blacklist").select(
    `
      id,
      user_id,
      category,
      reason,
      start_date,
      end_date,
      created_at,
      users!inner!blacklist_user_id_fkey (
        name,
        email
      )
    `,
    { count: "exact" }
  );

  // 활동정지 데이터 조회
  let penaltyQuery = supabase.from("penalty").select(
    `
      id,
      user_id,
      category,
      reason,
      start_date,
      end_date,
      created_at,
      users!inner!penalty_user_id_fkey (
        name,
        email
      )
    `,
    { count: "exact" }
  );

  // 날짜 필터
  if (startDate) {
    blacklistQuery = blacklistQuery.gte("created_at", startDate);
    penaltyQuery = penaltyQuery.gte("created_at", startDate);
  }
  if (endDate) {
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);
    blacklistQuery = blacklistQuery.lte(
      "created_at",
      endDateTime.toISOString()
    );
    penaltyQuery = penaltyQuery.lte("created_at", endDateTime.toISOString());
  }

  // 검색 필터
  if (searchQuery && searchCategory) {
    const userColumn = searchCategory === "이름" ? "name" : "email";

    // Supabase는 관계형 테이블 필터링을 위해 foreignTable(column) 구문을 지원하지 않으므로,
    // PostgREST의 `foreign_table.column` 직접 참조 필터링을 사용합니다.
    // `select` 절에서 이미 관계를 명시했기 때문에 가능합니다.
    blacklistQuery = blacklistQuery.ilike(
      `users.${userColumn}`,
      `%${searchQuery}%`
    );
    penaltyQuery = penaltyQuery.ilike(
      `users.${userColumn}`,
      `%${searchQuery}%`
    );
  }

  let allSanctions: any[] = [];
  let totalCount = 0;

  // 제재 유형별 조회
  if (!sanctionType || sanctionType === "전체") {
    const [blacklistResult, penaltyResult] = await Promise.all([
      blacklistQuery,
      penaltyQuery,
    ]);

    const blacklistData = blacklistResult.data || [];
    const penaltyData = penaltyResult.data || [];

    allSanctions = [
      ...blacklistData.map((item: any) => ({
        ...item,
        sanctionType: "블랙리스트",
        users: Array.isArray(item.users) ? item.users[0] : item.users,
      })),
      ...penaltyData.map((item: any) => ({
        ...item,
        sanctionType: "활동정지",
        users: Array.isArray(item.users) ? item.users[0] : item.users,
      })),
    ];

    totalCount = (blacklistResult.count || 0) + (penaltyResult.count || 0);
  } else if (sanctionType === "블랙리스트") {
    const blacklistResult = await blacklistQuery;
    allSanctions = (blacklistResult.data || []).map((item: any) => ({
      ...item,
      sanctionType: "블랙리스트",
      users: Array.isArray(item.users) ? item.users[0] : item.users,
    }));
    totalCount = blacklistResult.count || 0;
  } else if (sanctionType === "활동정지") {
    const penaltyResult = await penaltyQuery;
    allSanctions = (penaltyResult.data || []).map((item: any) => ({
      ...item,
      sanctionType: "활동정지",
      users: Array.isArray(item.users) ? item.users[0] : item.users,
    }));
    totalCount = penaltyResult.count || 0;
  }

  // 닉네임 검색 필터는 DB 조회로 대체되었으므로 이 부분은 제거합니다.

  // 상태 필터
  if (status && status !== "전체") {
    const now = new Date();
    allSanctions = allSanctions.filter((sanction) => {
      const endDate = sanction.end_date ? new Date(sanction.end_date) : null;
      const isActive = !endDate || endDate > now;

      if (status === "제재중") {
        return isActive;
      } else if (status === "해제됨") {
        return !isActive;
      }
      return true;
    });
    totalCount = allSanctions.length;
  }

  // 정렬
  const validSortColumns = ["userName", "created_at", "end_date"];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "created_at";
  const isAsc = sortOrder === "asc";

  allSanctions.sort((a, b) => {
    let aVal: any;
    let bVal: any;

    if (sortColumn === "userName") {
      aVal = a.users?.name || "";
      bVal = b.users?.name || "";
      return isAsc
        ? aVal.localeCompare(bVal, "ko")
        : bVal.localeCompare(aVal, "ko");
    } else if (sortColumn === "end_date") {
      aVal = a.end_date ? new Date(a.end_date).getTime() : 0;
      bVal = b.end_date ? new Date(b.end_date).getTime() : 0;
    } else {
      aVal = a.created_at ? new Date(a.created_at).getTime() : 0;
      bVal = b.created_at ? new Date(b.created_at).getTime() : 0;
    }

    return isAsc ? aVal - bVal : bVal - aVal;
  });

  // 페이지네이션
  const paginatedSanctions = allSanctions.slice(offset, offset + limit);

  // 응답 데이터 변환
  const sanctions = paginatedSanctions.map((sanction, index) => {
    const now = new Date();
    const endDate = sanction.end_date ? new Date(sanction.end_date) : null;
    const isActive = !endDate || endDate > now;

    return {
      id: sanction.id,
      userId: sanction.user_id,
      userName: sanction.users?.name || "알 수 없음",
      userEmail: sanction.users?.email || "알 수 없음",
      sanctionType: sanction.sanctionType,
      category: sanction.category,
      reason: sanction.reason,
      startDate: sanction.start_date
        ? new Date(sanction.start_date).toISOString().split("T")[0]
        : "",
      endDate: sanction.end_date
        ? new Date(sanction.end_date).toISOString().split("T")[0]
        : null,
      status: isActive ? "active" : "released",
      createdAt: sanction.created_at
        ? new Date(sanction.created_at).toISOString().split("T")[0]
        : "",
      no: totalCount - (offset + index),
    };
  });

  const totalPages = Math.ceil(totalCount / limit);

  return NextResponse.json({
    sanctions,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
  });
}

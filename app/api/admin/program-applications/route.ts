import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const visibility = searchParams.get("visibility");
  const status = searchParams.get("status");
  const searchCategory = searchParams.get("searchCategory");
  const searchQuery = searchParams.get("searchQuery");
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const offset = (page - 1) * limit;

  let query = supabase.from("program_applications").select(
    `
      id,
      program_id,
      user_id,
      name,
      email,
      phone,
      status,
      created_at,
      programs(title, is_visible, thumbnail_url, event_date_time, location, capacity, description),
      users(name, email)
    `,
    { count: "exact" }
  );

  // 날짜 필터
  if (startDate) {
    query = query.gte("created_at", startDate);
  }
  if (endDate) {
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);
    query = query.lte("created_at", endDateTime.toISOString());
  }

  // 노출 여부 필터
  if (visibility && visibility !== "전체") {
    const isVisible = visibility === "노출";
    query = query.eq("programs.is_visible", isVisible);
  }

  // 상태 필터
  if (status && status !== "전체") {
    if (status === "신청완료") {
      query = query.eq("status", "submitted");
    } else if (status === "취소") {
      query = query.eq("status", "cancelled");
    } else if (status === "종료") {
      query = query.eq("status", "ended");
    } else {
      query = query.eq("status", status);
    }
  }

  // 검색 필터
  if (searchQuery && searchCategory) {
    if (searchCategory === "이름") {
      query = query.ilike("name", `%${searchQuery}%`);
    } else if (searchCategory === "이메일") {
      query = query.ilike("email", `%${searchQuery}%`);
    } else if (searchCategory === "휴대폰번호") {
      query = query.ilike("phone", `%${searchQuery}%`);
    }
  }

  // 프로그램명, 회원ID는 전체 데이터 조회 후 정렬 필요
  const needsFullDataSort = sortBy === "programTitle" || sortBy === "userEmail";

  if (needsFullDataSort) {
    // 전체 데이터 조회 (페이지네이션 없이)
    query = query.order("created_at", { ascending: false });
  } else {
    // DB 레벨 정렬 (등록/신청일)
    query = query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: sortOrder === "asc" });
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 통계 계산
  const statsQuery = supabase
    .from("program_applications")
    .select("status", { count: "exact" });

  if (startDate) {
    statsQuery.gte("created_at", startDate);
  }
  if (endDate) {
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);
    statsQuery.lte("created_at", endDateTime.toISOString());
  }

  const { data: statsData } = await statsQuery;

  const completedCount =
    statsData?.filter((item: any) => item.status === "submitted").length || 0;
  const cancelledCount =
    statsData?.filter((item: any) => item.status === "cancelled").length || 0;
  const endedCount =
    statsData?.filter((item: any) => item.status === "ended").length || 0;

  let applications =
    data?.map((item: any) => ({
      id: item.id,
      program_id: item.program_id,
      program_title: item.programs?.title || "",
      program_thumbnail_url: item.programs?.thumbnail_url || "",
      program_event_date_time: item.programs?.event_date_time || "",
      program_location: item.programs?.location || "",
      program_capacity: item.programs?.capacity || 0,
      program_description: item.programs?.description || "",
      user_id: item.user_id,
      user_email: item.users?.email || "",
      name: item.name,
      email: item.email,
      phone: item.phone,
      status: item.status === "submitted" ? "completed" : item.status,
      created_at: item.created_at,
      user_nickname: item.users?.name || "",
      is_visible: item.programs?.is_visible || false,
    })) || [];

  // 전체 데이터 정렬이 필요한 경우 (프로그램명, 회원ID)
  if (needsFullDataSort) {
    if (sortBy === "programTitle") {
      applications.sort((a: any, b: any) => {
        const result = a.program_title.localeCompare(b.program_title, "ko");
        return sortOrder === "asc" ? result : -result;
      });
    } else if (sortBy === "userEmail") {
      applications.sort((a: any, b: any) => {
        const result = a.user_email.localeCompare(b.user_email, "ko");
        return sortOrder === "asc" ? result : -result;
      });
    }

    // 페이지네이션 적용
    applications = applications.slice(offset, offset + limit);
  }

  return NextResponse.json({
    applications,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
      totalCount: count || 0,
      limit,
    },
    statistics: {
      completedCount,
      cancelledCount,
      endedCount,
    },
  });
}

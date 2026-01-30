import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
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

    const supabase = await createClient();

    // 기본 쿼리 시작
    let query = supabase
      .from("programs")
      .select("*", { count: "exact" })
      .eq("is_deleted", false);

    // 날짜 필터
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    // 노출 여부 필터
    if (visibility && visibility !== "전체") {
      if (visibility === "노출") {
        query = query.eq("is_visible", true);
      } else if (visibility === "비노출") {
        query = query.eq("is_visible", false);
      }
    }

    // 검색 필터
    if (searchQuery && searchCategory) {
      if (searchCategory === "프로그램명") {
        query = query.ilike("title", `%${searchQuery}%`);
      } else if (searchCategory === "행사장소") {
        query = query.ilike("location", `%${searchQuery}%`);
      }
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 정렬 컬럼 매핑 (DB 레벨 정렬 가능한 컬럼)
    const getSortColumn = () => {
      switch (sortBy) {
        case "eventDateTime":
          return "event_date_time";
        case "createdAt":
          return "created_at";
        default:
          return "created_at";
      }
    };

    // 메모수, 스크랩수는 전체 데이터 조회 후 정렬 필요
    const needsFullDataSort =
      sortBy === "memosCount" || sortBy === "bookmarksCount";

    if (needsFullDataSort) {
      // 전체 데이터 조회 (페이지네이션 없이)
      query = query.order("created_at", { ascending: false });
    } else {
      // DB 레벨 정렬
      const sortColumn = getSortColumn();
      query = query
        .range(from, to)
        .order(sortColumn, { ascending: sortOrder === "asc" });
    }

    const { data: programs, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // 통계 데이터 가져오기 (신청기간 기준으로 진행중/종료 구분)
    const { data: statsData } = await supabase
      .from("programs")
      .select("application_start_at, application_end_at")
      .eq("is_deleted", false);

    const now = new Date();
    const progressCount =
      statsData?.filter((p) => {
        const endDate = new Date(p.application_end_at);
        return endDate >= now;
      }).length || 0;
    const endedCount =
      statsData?.filter((p) => {
        const endDate = new Date(p.application_end_at);
        return endDate < now;
      }).length || 0;

    // 각 프로그램의 관련 카운트 가져오기
    let programsWithCounts = await Promise.all(
      (programs || []).map(async (program) => {
        // 메모수 (memos 테이블에서 program_id로 필터)
        const { count: memosCount } = await supabase
          .from("memos")
          .select("*", { count: "exact", head: true })
          .eq("program_id", program.id)
          .eq("is_deleted", false);

        // 스크랩수 (bookmarks 테이블)
        const { count: bookmarksCount } = await supabase
          .from("bookmarks")
          .select("*", { count: "exact", head: true })
          .eq("target_id", program.id)
          .eq("target_type", "program")
          .eq("is_deleted", false);

        return {
          ...program,
          event_date: program.event_date_time,
          event_location: program.location,
          application_start_date: program.application_start_at,
          application_end_date: program.application_end_at,
          status: (() => {
            const now = new Date();
            const startDate = new Date(program.application_start_at);
            const endDate = new Date(program.application_end_at);
            endDate.setHours(23, 59, 59, 999);
            return startDate <= now && now <= endDate ? "진행중" : "종료";
          })(),
          memos_count: memosCount || 0,
          bookmarks_count: bookmarksCount || 0,
        };
      })
    );

    // 전체 데이터 정렬이 필요한 경우 (메모수, 스크랩수)
    if (needsFullDataSort) {
      if (sortBy === "memosCount") {
        programsWithCounts.sort((a, b) => {
          return sortOrder === "asc"
            ? a.memos_count - b.memos_count
            : b.memos_count - a.memos_count;
        });
      } else if (sortBy === "bookmarksCount") {
        programsWithCounts.sort((a, b) => {
          return sortOrder === "asc"
            ? a.bookmarks_count - b.bookmarks_count
            : b.bookmarks_count - a.bookmarks_count;
        });
      }

      // 페이지네이션 적용
      programsWithCounts = programsWithCounts.slice(from, from + limit);
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      programs: programsWithCounts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count || 0,
        limit,
      },
      statistics: {
        progressCount,
        endedCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "프로그램 목록을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

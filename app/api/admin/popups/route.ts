import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const all = searchParams.get("all");

    const supabase = await createClient();

    // 전체 팝업 조회 (관리 페이지용)
    if (all === "true") {
      const { data: popups, error } = await supabase
        .from("popups")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      // 상태 계산
      const now = new Date();
      const popupsWithStatus = (popups || []).map((popup) => {
        let popupStatus: "waiting" | "active" | "ended" = "waiting";

        if (popup.start_date && popup.end_date) {
          const startDate = new Date(popup.start_date);
          const endDate = new Date(popup.end_date);

          if (now < startDate) {
            popupStatus = "waiting";
          } else if (now >= startDate && now <= endDate) {
            popupStatus = "active";
          } else {
            popupStatus = "ended";
          }
        }

        return {
          ...popup,
          status: popupStatus,
        };
      });

      return NextResponse.json({
        success: true,
        data: popupsWithStatus,
      });
    }

    // 페이지네이션된 팝업 조회 (목록 페이지용)
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");
    const searchCategory = searchParams.get("searchCategory");
    const searchQuery = searchParams.get("searchQuery");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // 기본 쿼리 시작
    let query = supabase.from("popups").select("*", { count: "exact" });

    // 등록일 필터
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      query = query.lte("created_at", endDateTime.toISOString());
    }

    // 검색 필터
    if (searchQuery && searchCategory) {
      if (searchCategory === "팝업ID") {
        query = query.eq("id", parseInt(searchQuery));
      } else if (searchCategory === "제목") {
        query = query.ilike("title", `%${searchQuery}%`);
      }
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 정렬 처리 (created_at만 DB에서 직접 정렬, status는 후처리)
    const ascending = sortOrder === "asc";
    if (sortBy === "created_at") {
      query = query.range(from, to).order("created_at", { ascending });
    } else {
      query = query.range(from, to).order("created_at", { ascending: false });
    }

    const { data: popups, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // 상태 계산 (시작일/종료일 기준)
    const now = new Date();
    const popupsWithStatus = (popups || []).map((popup) => {
      let popupStatus: "waiting" | "active" | "ended" = "waiting";

      if (popup.start_date && popup.end_date) {
        const startDate = new Date(popup.start_date);
        const endDate = new Date(popup.end_date);

        if (now < startDate) {
          popupStatus = "waiting";
        } else if (now >= startDate && now <= endDate) {
          popupStatus = "active";
        } else {
          popupStatus = "ended";
        }
      }

      return {
        ...popup,
        status: popupStatus,
      };
    });

    // 상태 필터 적용 (계산된 상태 기준)
    let filteredPopups = popupsWithStatus;
    if (status && status !== "전체") {
      const statusMap: Record<string, string> = {
        대기: "waiting",
        진행중: "active",
        종료: "ended",
      };
      const statusValue = statusMap[status];
      if (statusValue) {
        filteredPopups = popupsWithStatus.filter(
          (popup) => popup.status === statusValue
        );
      }
    }

    // 상태(status) 정렬은 후처리로 수행
    if (sortBy === "status") {
      const statusOrder: Record<string, number> = {
        waiting: 0,
        active: 1,
        ended: 2,
      };
      filteredPopups = [...filteredPopups].sort((a, b) => {
        const orderA = statusOrder[a.status] ?? 3;
        const orderB = statusOrder[b.status] ?? 3;
        return ascending ? orderA - orderB : orderB - orderA;
      });
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      popups: filteredPopups,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count || 0,
        limit,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "팝업 목록을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("popups")
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "팝업 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}

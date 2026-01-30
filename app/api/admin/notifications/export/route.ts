import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const searchQuery = searchParams.get("searchQuery");

    const supabase = await createClient();

    // 기본 쿼리 시작 - system 타입만 조회, 페이지네이션 없이 전체 조회
    let query = supabase
      .from("notifications")
      .select("*")
      .eq("type", "system");

    // 등록일 필터
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      query = query.lte("created_at", endDateTime.toISOString());
    }

    // 내용 검색 필터
    if (searchQuery) {
      query = query.ilike("message", `%${searchQuery}%`);
    }

    query = query.order("created_at", { ascending: false });

    const { data: notifications, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      notifications: notifications || [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "알림 목록을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

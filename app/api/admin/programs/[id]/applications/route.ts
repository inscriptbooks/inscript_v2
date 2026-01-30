import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  try {
    // 신청자 목록 조회 (페이지네이션 포함)
    const { data: applications, error: applicationsError } = await supabase
      .from("program_applications")
      .select(`
        id,
        name,
        email,
        phone,
        created_at,
        user_id,
        users!inner(
          name,
          email
        )
      `)
      .eq("program_id", id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (applicationsError) {
      return NextResponse.json(
        { success: false, message: "신청자 목록 조회 실패" },
        { status: 500 }
      );
    }

    // 전체 신청자 수 조회
    const { count, error: countError } = await supabase
      .from("program_applications")
      .select("*", { count: "exact", head: true })
      .eq("program_id", id);

    if (countError) {
      return NextResponse.json(
        { success: false, message: "신청자 수 조회 실패" },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      success: true,
      data: {
        applications: applications || [],
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: count || 0,
          limit,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

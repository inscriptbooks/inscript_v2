import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    // 프로그램 기본 정보 조회
    const { data: program, error: programError } = await supabase
      .from("programs")
      .select("*")
      .eq("id", id)
      .single();

    if (programError) {
      return NextResponse.json(
        { success: false, message: "프로그램을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 메모 조회 (program_id로 필터링)
    const { data: memos, error: memosError } = await supabase
      .from("memos")
      .select(
        `
        id,
        content,
        like_count,
        comment_count,
        created_at,
        user_id,
        users!inner(
          name,
          email
        )
      `
      )
      .eq("program_id", id)
      .order("created_at", { ascending: false });

    if (memosError) {
      return NextResponse.json(
        { success: false, message: "메모 조회 실패" },
        { status: 500 }
      );
    }

    // 숨김 포함 댓글 수 재집계 (is_deleted=false만 적용)
    const memoIds = (memos || []).map((m) => m.id);
    let commentCounts: Record<string, number> = {};
    if (memoIds.length > 0) {
      const { data: commentRows } = await supabase
        .from("comments")
        .select("memo_id")
        .eq("type", "memo")
        .eq("is_deleted", false)
        .in("memo_id", memoIds);

      commentCounts = {};
      commentRows?.forEach((row: any) => {
        if (row.memo_id) {
          commentCounts[row.memo_id] = (commentCounts[row.memo_id] || 0) + 1;
        }
      });
    }

    const memosWithCounts = (memos || []).map((m) => ({
      ...m,
      comment_count: commentCounts[m.id] || 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        program,
        memos: memosWithCounts,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

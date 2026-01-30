import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  // 메모 가져오기
  const { data: memos, error: memosError } = await supabase
    .from("memos")
    .select("id, type, title, content, created_at")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  if (memosError) {
    return NextResponse.json(
      { error: "메모 조회 실패", details: memosError.message },
      { status: 500 }
    );
  }

  // 댓글 가져오기
  const { data: comments, error: commentsError } = await supabase
    .from("comments")
    .select("id, type, content, created_at")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  if (commentsError) {
    return NextResponse.json(
      { error: "댓글 조회 실패", details: commentsError.message },
      { status: 500 }
    );
  }

  // 활동 데이터 통합
  const activities = [
    ...(memos || []).map((memo) => ({
      id: memo.id,
      type: "메모",
      date: memo.created_at,
      content: memo.title || memo.content?.substring(0, 50) || "",
    })),
    ...(comments || []).map((comment) => ({
      id: comment.id,
      type: "댓글",
      date: comment.created_at,
      content: comment.content?.substring(0, 50) || "",
    })),
  ];

  // 날짜순 정렬
  activities.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 페이지네이션
  const totalCount = activities.length;
  const totalPages = Math.ceil(totalCount / limit);
  const paginatedActivities = activities.slice(offset, offset + limit);

  return NextResponse.json({
    activities: paginatedActivities,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
  });
}

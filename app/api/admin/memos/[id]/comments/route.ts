import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // 메모에 달린 댓글 가져오기
    const { data: comments, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        users!inner(name, email)
      `
      )
      .eq("memo_id", id)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "댓글 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      user_id: comment.user_id,
      author_name: comment.users.name,
      author_email: comment.users.email,
      status: comment.is_visible ? "exposed" : "hidden",
      is_deleted: comment.is_deleted,
    }));

    return NextResponse.json({ comments: formattedComments });
  } catch (error) {
    return NextResponse.json(
      { error: "댓글 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

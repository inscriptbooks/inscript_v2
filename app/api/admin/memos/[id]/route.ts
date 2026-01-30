import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // 메모 정보 가져오기
    const { data: memoData, error: memoError } = await supabase
      .from("memos")
      .select("*")
      .eq("id", id)
      .eq("is_deleted", false)
      .single();

    if (memoError || !memoData) {
      return NextResponse.json(
        { error: "메모를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 사용자 정보 가져오기
    const { data: userData } = await supabase
      .from("users")
      .select("name, email")
      .eq("id", memoData.user_id)
      .single();

    // 대상 정보 가져오기
    let targetData = null;
    let targetTable = "";
    let targetField = "";

    if (memoData.type === "play" && memoData.play_id) {
      targetTable = "plays";
      targetField = "play_id";
      const { data } = await supabase
        .from("plays")
        .select("title")
        .eq("id", memoData.play_id)
        .single();
      targetData = data;
    } else if (memoData.type === "author" && memoData.author_id) {
      targetTable = "authors";
      targetField = "author_id";
      const { data } = await supabase
        .from("authors")
        .select("name")
        .eq("id", memoData.author_id)
        .single();
      targetData = data;
    } else if (memoData.type === "program" && memoData.program_id) {
      targetTable = "programs";
      targetField = "program_id";
      const { data } = await supabase
        .from("programs")
        .select("title")
        .eq("id", memoData.program_id)
        .single();
      targetData = data;
    }

    // 좋아요 수 계산
    const { count: likeCount } = await supabase
      .from("memo_likes")
      .select("*", { count: "exact", head: true })
      .eq("memo_id", id);

    // 댓글 수 계산
    const { count: commentCount } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("memo_id", id)
      .eq("is_deleted", false);

    // 신고 수 계산
    const { count: reportCount } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("target_id", id)
      .eq("target_type", "memo");

    // 대상 타이틀 결정
    let targetTitle = "";
    let targetId = "";
    if (memoData.type === "play" && targetData) {
      targetTitle = (targetData as { title: string }).title || "";
      targetId = memoData.play_id;
    } else if (memoData.type === "author" && targetData) {
      targetTitle = (targetData as { name: string }).name || "";
      targetId = memoData.author_id;
    } else if (memoData.type === "program" && targetData) {
      targetTitle = (targetData as { title: string }).title || "";
      targetId = memoData.program_id;
    }

    const memo = {
      id: memoData.id,
      content: memoData.content,
      title: memoData.title,
      created_at: memoData.created_at,
      user_id: memoData.user_id,
      author_name: userData?.name || "알 수 없음",
      author_email: userData?.email || "",
      type: memoData.type,
      category: memoData.type === "play" ? "희곡" : memoData.type === "author" ? "작가" : "프로그램",
      target_title: targetTitle,
      target_id: targetId,
      status: memoData.is_visible ? "exposed" : "hidden",
      is_visible: memoData.is_visible,
      is_deleted: memoData.is_deleted,
      like_count: likeCount || 0,
      comment_count: commentCount || 0,
      report_count: reportCount || 0,
      play_id: memoData.play_id,
      author_id: memoData.author_id,
      program_id: memoData.program_id,
    };

    return NextResponse.json({ memo });
  } catch (error) {
    return NextResponse.json(
      { error: "메모 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { is_visible } = body;

    if (typeof is_visible !== "boolean") {
      return NextResponse.json(
        { error: "is_visible 값이 유효하지 않습니다." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // memos 테이블의 is_visible 업데이트
    const { error } = await supabase
      .from("memos")
      .update({ is_visible })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "메모 상태 업데이트에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "메모 상태가 업데이트되었습니다.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "메모 상태 업데이트 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // soft delete
    const { error } = await supabase
      .from("memos")
      .update({ is_deleted: true })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "메모 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "메모가 삭제되었습니다.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "메모 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

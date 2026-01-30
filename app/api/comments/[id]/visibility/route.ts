import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema/comments";
import { eq } from "drizzle-orm";

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
        { error: "is_visible must be a boolean" },
        { status: 400 }
      );
    }

    // 현재 로그인한 사용자 확인
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 댓글 조회
    const comment = await db.query.comments.findFirst({
      where: eq(comments.id, id),
      with: {
        user: true,
      },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // 사용자 정보 조회
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    // 작성자 또는 관리자만 수정 가능
    const isAdmin = userData?.role === "admin";
    const isOwner = comment.userId === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // is_visible 업데이트
    await db
      .update(comments)
      .set({
        isVisible: is_visible,
      })
      .where(eq(comments.id, id));

    // 수정된 댓글 조회
    const updatedComment = await db.query.comments.findFirst({
      where: eq(comments.id, id),
      with: {
        user: true,
        memo: {
          with: {
            user: true,
            play: true,
            author: true,
            program: true,
          },
        },
        post: {
          with: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

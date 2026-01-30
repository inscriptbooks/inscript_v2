import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema/comments";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const comment = await db.query.comments.findFirst({
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

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
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
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
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
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // 작성자 확인
    if (comment.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 댓글 수정
    await db
      .update(comments)
      .set({
        content,
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
      { error: "Internal Server Error" },
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
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // 현재 사용자 정보 조회 (role 확인)
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    // 작성자이거나 관리자인 경우에만 삭제 가능
    const isOwner = comment.userId === user.id;
    const isAdmin = currentUser?.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 댓글 삭제
    await db.delete(comments).where(eq(comments.id, id));

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

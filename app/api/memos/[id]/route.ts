import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { memos } from "@/lib/db/schema/memos";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await db.query.memos.findFirst({
      where: and(
        eq(memos.id, id),
        eq(memos.isVisible, true),
        eq(memos.isDeleted, false)
      ),
      with: {
        user: true,
        play: {
          with: {
            author: {
              with: {
                user: true,
              },
            },
          },
        },
        author: true,
        program: true,
      },
    });

    if (!data) {
      return NextResponse.json({ error: "Memo not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "content is required" },
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

    // 메모 존재 여부 및 소유자 확인
    const existingMemo = await db.query.memos.findFirst({
      where: eq(memos.id, id),
    });

    if (!existingMemo) {
      return NextResponse.json({ error: "Memo not found" }, { status: 404 });
    }

    if (existingMemo.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 메모 업데이트
    await db.update(memos).set({ content }).where(eq(memos.id, id));

    // 업데이트된 메모 조회
    const updatedMemo = await db.query.memos.findFirst({
      where: eq(memos.id, id),
      with: {
        user: true,
        play: {
          with: {
            author: {
              with: {
                user: true,
              },
            },
          },
        },
        author: true,
        program: true,
      },
    });

    return NextResponse.json(updatedMemo);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
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

    // 메모 존재 여부 및 소유자 확인
    const existingMemo = await db.query.memos.findFirst({
      where: eq(memos.id, id),
    });

    if (!existingMemo) {
      return NextResponse.json({ error: "Memo not found" }, { status: 404 });
    }

    if (existingMemo.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // CASCADE로 자동 삭제됨:
    // - likes (memo_id FK)
    // - bookmarks (memo_id FK)
    // - comments (memo_id FK)
    await db.delete(memos).where(eq(memos.id, id));

    return NextResponse.json({ message: "Memo deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

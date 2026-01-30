import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { likes } from "@/lib/db/schema/likes";
import { and, eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const memoId = searchParams.get("memoId");
    const postId = searchParams.get("postId");

    // 파라미터 검증
    if (!userId && !memoId && !postId) {
      return NextResponse.json(
        { error: "At least one of userId, memoId, or postId is required" },
        { status: 400 }
      );
    }

    const whereClauses = [];

    if (userId) whereClauses.push(eq(likes.userId, userId));
    if (memoId) whereClauses.push(eq(likes.memoId, memoId));
    if (postId) whereClauses.push(eq(likes.postId, postId));

    const data = await db.query.likes.findMany({
      where: whereClauses.length > 0 ? and(...whereClauses) : undefined,
      with: {
        user: true,
        memo: {
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
        },
        post: {
          with: {
            user: true,
          },
        },
      },
      orderBy: [desc(likes.createdAt)],
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memoId, postId } = body;

    if (!memoId && !postId) {
      return NextResponse.json(
        { error: "Either memoId or postId is required" },
        { status: 400 }
      );
    }

    if (memoId && postId) {
      return NextResponse.json(
        { error: "Cannot like both memo and post" },
        { status: 400 }
      );
    }

    // 현재 로그인한 사용자 가져오기
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    try {
      // 이미 좋아요가 존재하는지 확인
      const existingLike = await db.query.likes.findFirst({
        where: and(
          eq(likes.userId, userId),
          memoId ? eq(likes.memoId, memoId) : eq(likes.postId, postId)
        ),
      });

      if (existingLike) {
        return NextResponse.json(
          { error: "Like already exists" },
          { status: 409 }
        );
      }

      const id = uuidv4();
      const likeData = {
        id,
        type: (memoId ? "memo" : "post") as "memo" | "post",
        userId,
        ...(memoId ? { memoId } : { postId: postId! }),
      };

      await db.insert(likes).values(likeData);

      // 카운트 업데이트는 트리거가 자동으로 처리

      const newLike = await db.query.likes.findFirst({
        where: eq(likes.id, id),
        with: {
          user: true,
          memo: {
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
          },
          post: {
            with: {
              user: true,
            },
          },
        },
      });

      return NextResponse.json(newLike);
    } catch (dbError) {
      if (dbError instanceof Error) {
        // 외래키 제약조건 위반
        if (dbError.message.includes("foreign key constraint")) {
          return NextResponse.json(
            { error: "Referenced memo or post does not exist" },
            { status: 404 }
          );
        }

        // 중복 키 제약조건 위반
        if (dbError.message.includes("duplicate key")) {
          return NextResponse.json(
            { error: "Like already exists" },
            { status: 409 }
          );
        }
      }

      return NextResponse.json(
        { error: "Database operation failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { memoId, postId } = body;

    if (!memoId && !postId) {
      return NextResponse.json(
        { error: "Either memoId or postId is required" },
        { status: 400 }
      );
    }

    // 현재 로그인한 사용자 가져오기
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    try {
      const existingLike = await db.query.likes.findFirst({
        where: and(
          eq(likes.userId, userId),
          memoId ? eq(likes.memoId, memoId) : eq(likes.postId, postId)
        ),
      });

      if (!existingLike) {
        return NextResponse.json({ error: "Like not found" }, { status: 404 });
      }

      await db
        .delete(likes)
        .where(
          and(
            eq(likes.userId, userId),
            memoId ? eq(likes.memoId, memoId) : eq(likes.postId, postId)
          )
        );

      // 카운트 업데이트는 트리거가 자동으로 처리

      return NextResponse.json({ message: "Like deleted successfully" });
    } catch (dbError) {
      if (dbError instanceof Error) {
        // 외래키 제약조건 위반 (이미 삭제된 경우 등)
        if (
          dbError.message.includes("foreign key constraint") ||
          dbError.message.includes("violates")
        ) {
          return NextResponse.json(
            { error: "Referenced memo or post may have been deleted" },
            { status: 404 }
          );
        }
      }

      return NextResponse.json(
        { error: "Database operation failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

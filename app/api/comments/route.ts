import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema/comments";
import { and, eq, desc, count } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memoId = searchParams.get("memoId");
    const postId = searchParams.get("postId");
    const createdById = searchParams.get("createdById");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const page = searchParams.get("page");
    const includeHidden = searchParams.get("includeHidden") === "true";

    let whereCondition = undefined;
    const whereClauses = [];
    
    // includeHidden이 false일 때만 is_visible이 true인 댓글만 반환 (고객 페이지)
    // includeHidden이 true일 때는 모든 댓글 반환 (관리자 페이지)
    if (!includeHidden) {
      whereClauses.push(eq(comments.isVisible, true));
    }
    
    if (memoId) whereClauses.push(eq(comments.memoId, memoId));
    if (postId) whereClauses.push(eq(comments.postId, postId));
    if (createdById) whereClauses.push(eq(comments.userId, createdById));

    if (whereClauses.length > 0) {
      whereCondition = and(...whereClauses);
    }

    // pagination 여부 확인
    const isPaginated = limit || page;

    if (isPaginated) {
      // page 기반 pagination 처리
      const limitNum = limit ? parseInt(limit) : 10;
      const pageNum = page ? parseInt(page) : 1;
      const offsetNum = offset ? parseInt(offset) : (pageNum - 1) * limitNum;

      const [data, [{ value: totalCount }]] = await Promise.all([
        db.query.comments.findMany({
          where: whereCondition,
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
          orderBy: [desc(comments.createdAt), desc(comments.id)],
          limit: limitNum,
          offset: offsetNum,
        }),
        db.select({ value: count() }).from(comments).where(whereCondition),
      ]);

      const totalPages = Math.ceil(totalCount / limitNum);
      const hasMore = pageNum < totalPages;

      return NextResponse.json({
        data,
        meta: {
          totalCount,
          totalPages,
          currentPage: pageNum,
          pageSize: limitNum,
          hasMore,
        },
      });
    }

    // 기본: 전체 데이터 + totalCount 반환
    const [data, [{ value: totalCount }]] = await Promise.all([
      db.query.comments.findMany({
        where: whereCondition,
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
        orderBy: [desc(comments.createdAt), desc(comments.id)],
      }),
      db.select({ value: count() }).from(comments).where(whereCondition),
    ]);

    return NextResponse.json({
      data,
      meta: {
        totalCount,
      },
    });
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
    const { memoId, postId, content } = body;

    // memoId 또는 postId 중 하나만 있어야 함
    if ((!memoId && !postId) || (memoId && postId)) {
      return NextResponse.json(
        { error: "Either memoId or postId is required (but not both)" },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
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
    const id = uuidv4();
    const type = memoId ? "memo" : "post";

    await db.insert(comments).values({
      id,
      type,
      userId,
      memoId: memoId || null,
      postId: postId || null,
      content,
    });

    const newComment = await db.query.comments.findFirst({
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

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

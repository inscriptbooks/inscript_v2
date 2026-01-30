import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { reports } from "@/lib/db/schema/reports";
import { and, eq, desc, count } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memoId = searchParams.get("memoId");
    const postId = searchParams.get("postId");
    const commentId = searchParams.get("commentId");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const page = searchParams.get("page");

    const whereClauses = [];
    if (memoId) whereClauses.push(eq(reports.memoId, memoId));
    if (postId) whereClauses.push(eq(reports.postId, postId));
    if (commentId) whereClauses.push(eq(reports.commentId, commentId));

    const whereCondition =
      whereClauses.length > 0 ? and(...whereClauses) : undefined;

    // pagination 여부 확인
    const isPaginated = limit || page;

    if (isPaginated) {
      // page 기반 pagination 처리
      const limitNum = limit ? parseInt(limit) : 10;
      const pageNum = page ? parseInt(page) : 1;
      const offsetNum = offset ? parseInt(offset) : (pageNum - 1) * limitNum;

      const [data, [{ value: totalCount }]] = await Promise.all([
        db.query.reports.findMany({
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
            comment: {
              with: {
                user: true,
              },
            },
          },
          orderBy: [desc(reports.createdAt), desc(reports.id)],
          limit: limitNum,
          offset: offsetNum,
        }),
        db.select({ value: count() }).from(reports).where(whereCondition),
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
      db.query.reports.findMany({
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
          comment: {
            with: {
              user: true,
            },
          },
        },
        orderBy: [desc(reports.createdAt), desc(reports.id)],
      }),
      db.select({ value: count() }).from(reports).where(whereCondition),
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
    const { memoId, postId, commentId, reason } = body;

    // memoId, postId, commentId 중 정확히 하나만 있어야 함
    const targetCount = [memoId, postId, commentId].filter(Boolean).length;
    if (targetCount !== 1) {
      return NextResponse.json(
        { error: "Exactly one of memoId, postId, or commentId is required" },
        { status: 400 }
      );
    }

    if (!reason) {
      return NextResponse.json(
        { error: "Reason is required" },
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
    const type = memoId ? "memo" : postId ? "post" : "comment";

    await db.insert(reports).values({
      id,
      type,
      userId,
      memoId: memoId || null,
      postId: postId || null,
      commentId: commentId || null,
      reason,
    });

    const newReport = await db.query.reports.findFirst({
      where: eq(reports.id, id),
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
        comment: {
          with: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { likes } from "@/lib/db/schema/likes";
import { eq, desc, count, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const page = searchParams.get("page");

    const userId = user.id;

    // pagination 설정
    const limitNum = limit ? parseInt(limit) : 5;
    const pageNum = page ? parseInt(page) : 1;
    const offsetNum = offset ? parseInt(offset) : (pageNum - 1) * limitNum;

    // likes 테이블에서 memo_id가 있는 것만 가져오기
    const whereClauses = [
      eq(likes.userId, userId),
      eq(likes.type, "memo"),
    ];

    const whereCondition = and(...whereClauses);

    const [data, [{ value: totalCount }]] = await Promise.all([
      db.query.likes.findMany({
        where: whereCondition,
        with: {
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
        },
        orderBy: [desc(likes.createdAt)],
        limit: limitNum,
        offset: offsetNum,
      }),
      db.select({ value: count() }).from(likes).where(whereCondition),
    ]);

    // memo만 추출
    const memos = data
      .filter((like) => like.memo !== null)
      .map((like) => like.memo);

    const totalPages = Math.ceil(totalCount / limitNum);
    const hasMore = pageNum < totalPages;

    return NextResponse.json({
      data: memos,
      meta: {
        totalCount,
        totalPages,
        currentPage: pageNum,
        pageSize: limitNum,
        hasMore,
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

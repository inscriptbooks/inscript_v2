import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { bookmarks } from "@/lib/db/schema/bookmarks";
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
    const page = searchParams.get("page");

    const userId = user.id;

    // pagination 설정
    const limitNum = limit ? parseInt(limit) : 5;
    const pageNum = page ? parseInt(page) : 1;
    const offsetNum = (pageNum - 1) * limitNum;

    const whereCondition = and(
      eq(bookmarks.userId, userId),
      eq(bookmarks.type, "memo")
    );

    const [bookmarkData, [{ value: totalCount }]] = await Promise.all([
      db.query.bookmarks.findMany({
        where: whereCondition,
        with: {
          memo: {
            with: {
              user: true,
              play: true,
              author: true,
              program: true,
            },
          },
        },
        orderBy: [desc(bookmarks.createdAt)],
        limit: limitNum,
        offset: offsetNum,
      }),
      db.select({ value: count() }).from(bookmarks).where(whereCondition),
    ]);

    // memo와 연관된 play의 author 정보를 별도로 가져오기
    const data = await Promise.all(
      bookmarkData.map(async (bookmark) => {
        const memoPlay = bookmark.memo?.play;
        if (!bookmark.memo || !memoPlay) {
          return bookmark;
        }

        const playWithAuthor = await db.query.plays.findFirst({
          where: (plays, { eq }) => eq(plays.id, memoPlay.id),
          with: {
            author: true,
          },
        });

        return {
          ...bookmark,
          memo: {
            ...bookmark.memo,
            play: playWithAuthor || memoPlay,
          },
        };
      })
    );

    // memo 데이터만 추출
    const memos = data
      .filter((bookmark) => bookmark.memo !== null)
      .map((bookmark) => bookmark.memo);

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

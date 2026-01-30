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
      eq(bookmarks.type, "play")
    );

    const [data, [{ value: totalCount }]] = await Promise.all([
      db.query.bookmarks.findMany({
        where: whereCondition,
        with: {
          play: {
            with: {
              author: {
                with: {
                  user: true,
                },
              },
            },
          },
        },
        orderBy: [desc(bookmarks.createdAt)],
        limit: limitNum,
        offset: offsetNum,
      }),
      db.select({ value: count() }).from(bookmarks).where(whereCondition),
    ]);

    // play 데이터만 추출
    const plays = data
      .filter((bookmark) => bookmark.play !== null)
      .map((bookmark) => bookmark.play);

    const totalPages = Math.ceil(totalCount / limitNum);
    const hasMore = pageNum < totalPages;

    return NextResponse.json({
      data: plays,
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

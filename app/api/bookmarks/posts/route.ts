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
    const type = searchParams.get("type"); // recruit, qna, market, promotion

    const userId = user.id;

    // pagination 설정
    const limitNum = limit ? parseInt(limit) : 5;
    const pageNum = page ? parseInt(page) : 1;
    const offsetNum = (pageNum - 1) * limitNum;

    const whereCondition = and(
      eq(bookmarks.userId, userId),
      eq(bookmarks.type, "post")
    );

    const [data, [{ value: totalCount }]] = await Promise.all([
      db.query.bookmarks.findMany({
        where: whereCondition,
        with: {
          post: {
            with: {
              user: true,
            },
          },
        },
        orderBy: [desc(bookmarks.createdAt)],
        limit: limitNum,
        offset: offsetNum,
      }),
      db.select({ value: count() }).from(bookmarks).where(whereCondition),
    ]);

    // post 데이터만 추출하고, type 필터링 (optional)
    let posts = data
      .filter((bookmark) => bookmark.post !== null)
      .map((bookmark) => bookmark.post!);

    if (type) {
      posts = posts.filter((post) => post.type === type);
    }

    const totalPages = Math.ceil(totalCount / limitNum);
    const hasMore = pageNum < totalPages;

    return NextResponse.json({
      data: posts,
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

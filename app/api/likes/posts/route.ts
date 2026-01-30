import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { likes } from "@/lib/db/schema/likes";
import { posts } from "@/lib/db/schema/posts";
import { users } from "@/lib/db/schema/users";
import { eq, desc, count, and, isNotNull } from "drizzle-orm";
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

    // likes 테이블에서 post_id가 있는 것만 가져오기
    if (type) {
      // type 필터링이 필요한 경우 - 조인하여 효율적으로 조회
      const whereCondition = and(
        eq(likes.userId, userId),
        eq(likes.type, "post"),
        eq(posts.type, type),
        isNotNull(likes.postId)
      );

      const [likedPostsData, typeFilteredCount] = await Promise.all([
        db
          .select()
          .from(likes)
          .innerJoin(posts, eq(likes.postId, posts.id))
          .innerJoin(users, eq(posts.userId, users.id))
          .where(whereCondition)
          .orderBy(desc(likes.createdAt))
          .limit(limitNum)
          .offset(offsetNum),
        db
          .select({ value: count() })
          .from(likes)
          .innerJoin(posts, eq(likes.postId, posts.id))
          .where(whereCondition),
      ]);

      // post와 user 데이터 결합
      const postsData = likedPostsData.map((row) => ({
        ...row.posts,
        user: row.users,
      }));

      const totalCount = typeFilteredCount[0]?.value || 0;
      const totalPages = Math.ceil(totalCount / limitNum);
      const hasMore = pageNum < totalPages;

      return NextResponse.json({
        data: postsData,
        meta: {
          totalCount,
          totalPages,
          currentPage: pageNum,
          pageSize: limitNum,
          hasMore,
        },
      });
    } else {
      // type 필터링이 없는 경우
      const whereCondition = and(
        eq(likes.userId, userId),
        eq(likes.type, "post"),
        isNotNull(likes.postId)
      );

      const [data, [{ value: totalCount }]] = await Promise.all([
        db
          .select()
          .from(likes)
          .innerJoin(posts, eq(likes.postId, posts.id))
          .innerJoin(users, eq(posts.userId, users.id))
          .where(whereCondition)
          .orderBy(desc(likes.createdAt))
          .limit(limitNum)
          .offset(offsetNum),
        db.select({ value: count() }).from(likes).where(whereCondition),
      ]);

      // post와 user 데이터 결합
      const postsData = data.map((row) => ({
        ...row.posts,
        user: row.users,
      }));

      const totalPages = Math.ceil(totalCount / limitNum);
      const hasMore = pageNum < totalPages;

      return NextResponse.json({
        data: postsData,
        meta: {
          totalCount,
          totalPages,
          currentPage: pageNum,
          pageSize: limitNum,
          hasMore,
        },
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { authors, authorRequestStatusEnum } from "@/lib/db/schema/authors";
import { and, eq, or, ilike, sql, asc, count } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestStatus = searchParams.get("requestStatus");
    const keyword = searchParams.get("keyword");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const page = searchParams.get("page");

    const whereClauses = [];
    if (requestStatus)
      whereClauses.push(
        eq(
          authors.requestStatus,
          requestStatus as (typeof authorRequestStatusEnum.enumValues)[number]
        )
      );

    if (keyword) {
      whereClauses.push(
        or(
          ilike(authors.authorName, `%${keyword}%`),
          sql`EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(${authors.keyword}) AS elem
            WHERE elem ILIKE ${`%${keyword}%`}
          )`
        )
      );
    }

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
        db.query.authors.findMany({
          where: whereCondition,
          with: {
            user: true,
          },
          orderBy: [asc(authors.authorName)],
          limit: limitNum,
          offset: offsetNum,
        }),
        db.select({ value: count() }).from(authors).where(whereCondition),
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
      db.query.authors.findMany({
        where: whereCondition,
        with: {
          user: true,
        },
        orderBy: [asc(authors.authorName)],
      }),
      db.select({ value: count() }).from(authors).where(whereCondition),
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

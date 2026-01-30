import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  plays,
  applyStatusEnum,
  publicStatusEnum,
} from "@/lib/db/schema/plays";
import { playLogs } from "@/lib/db/schema/logs";
import { and, eq, or, ilike, sql, desc, count } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get("authorId");
    const createdById = searchParams.get("createdById");
    const publicStatus = searchParams.get("publicStatus");
    const applyStatus = searchParams.get("applyStatus");
    const keyword = searchParams.get("keyword");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const page = searchParams.get("page");

    const whereClauses = [eq(plays.isDeleted, false)];
    if (authorId) whereClauses.push(eq(plays.authorId, authorId));
    if (createdById) whereClauses.push(eq(plays.createdById, createdById));
    if (publicStatus)
      whereClauses.push(
        eq(
          plays.publicStatus,
          publicStatus as (typeof publicStatusEnum.enumValues)[number]
        )
      );
    if (applyStatus)
      whereClauses.push(
        eq(
          plays.applyStatus,
          applyStatus as (typeof applyStatusEnum.enumValues)[number]
        )
      );

    if (keyword) {
      const keywordCondition = or(
        ilike(plays.title, `%${keyword}%`),
        sql`EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(${plays.keyword}) AS elem
          WHERE elem ILIKE ${`%${keyword}%`}
        )`,
        sql`EXISTS (
          SELECT 1 FROM authors
          WHERE authors.id = ${plays.authorId}
          AND (
            authors.author_name ILIKE ${`%${keyword}%`}
            OR authors.author_name_en ILIKE ${`%${keyword}%`}
          )
        )`
      );
      if (keywordCondition) {
        whereClauses.push(keywordCondition);
      }
    }

    const whereCondition = and(...whereClauses);

    // pagination 여부 확인
    const isPaginated = limit || page;

    if (isPaginated) {
      // page 기반 pagination 처리
      const limitNum = limit ? parseInt(limit) : 10;
      const pageNum = page ? parseInt(page) : 1;
      const offsetNum = offset ? parseInt(offset) : (pageNum - 1) * limitNum;

      const [data, [{ value: totalCount }]] = await Promise.all([
        db.query.plays.findMany({
          where: whereCondition,
          with: {
            author: {
              with: {
                user: true,
              },
            },
          },
          orderBy: [desc(plays.createdAt), desc(plays.id)],
          limit: limitNum,
          offset: offsetNum,
        }),
        db.select({ value: count() }).from(plays).where(whereCondition),
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
      db.query.plays.findMany({
        where: whereCondition,
        with: {
          author: {
            with: {
              user: true,
            },
          },
        },
        orderBy: [desc(plays.createdAt), desc(plays.id)],
      }),
      db.select({ value: count() }).from(plays).where(whereCondition),
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
    const {
      title,
      author,
      line1,
      line2,
      line3,
      year,
      country,
      keyword,
      plot,
      femaleCharacterCount,
      maleCharacterCount,
      characterList,
      publicStatus,
      publicHistory,
      // 판매 관련
      salesStatus,
      price,
      attachmentUrl,
      attachmentName,
      attachmentPath,
    } = body;

    if (!title || !author || !plot || !keyword) {
      return NextResponse.json(
        { error: "title, author, plot, and keyword are required" },
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

    const id = uuidv4();

    // 희곡 등록
    await db.insert(plays).values({
      id,
      createdById: user.id,
      title,
      authorId: author === "NONE" ? null : author,
      line1: line1 || null,
      line2: line2 || null,
      line3: line3 || null,
      year: year || null,
      country: country || null,
      keyword: keyword || [],
      summary: plot,
      femaleCharacterCount: femaleCharacterCount || null,
      maleCharacterCount: maleCharacterCount || null,
      characterList: characterList || [],
      publicStatus: publicStatus || null,
      publicHistory: publicHistory || null,
      // 판매 관련 저장
      salesStatus: salesStatus || "판매 안 함",
      price: price ? parseInt(String(price), 10) : null,
      attachmentUrl: attachmentUrl || null,
      attachmentName: attachmentName || null,
      attachmentPath: attachmentPath || null,
      applyStatus: "applied", // 신청완료 상태
      isVisible: false,
    });

    // play_logs 테이블에 신청등록 이벤트 기록
    try {
      await db.insert(playLogs).values({
        playId: id,
        userId: user.id,
        eventType: "신청등록",
      });
    } catch (logError) {
      // 로그 기록 실패해도 희곡 등록은 성공으로 처리
      console.warn("Failed to create play log:", logError);
    }

    const newPlay = await db.query.plays.findFirst({
      where: eq(plays.id, id),
      with: {
        createdBy: true,
        author: {
          with: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(newPlay, { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "희곡 등록 중 오류가 발생했습니다";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { memos } from "@/lib/db/schema/memos";
import { authors } from "@/lib/db/schema/authors";
import { and, eq, desc, ilike, count, SQL } from "drizzle-orm";
import { MemoType } from "@/models/memo";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const playId = searchParams.get("playId");
    const authorId = searchParams.get("authorId");
    const programId = searchParams.get("programId");
    const createdById = searchParams.get("createdById");
    const keyword = searchParams.get("keyword");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const page = searchParams.get("page");

    const whereClauses = [];
    // 기본적으로 is_visible이 true이고 is_deleted가 false인 것만 가져오기
    whereClauses.push(eq(memos.isVisible, true));
    whereClauses.push(eq(memos.isDeleted, false));
    if (type) whereClauses.push(eq(memos.type, type as MemoType));
    if (playId) whereClauses.push(eq(memos.playId, playId));
    if (authorId) whereClauses.push(eq(memos.authorId, authorId));
    if (programId) whereClauses.push(eq(memos.programId, programId));
    if (createdById) whereClauses.push(eq(memos.userId, createdById));
    if (keyword) whereClauses.push(ilike(memos.content, `%${keyword}%`));

    const whereCondition =
      whereClauses.length > 0 ? and(...whereClauses) : undefined;

    // 기본 정렬: 좋아요순
    const orderByField: SQL = desc(memos.likeCount);

    // pagination 여부 확인
    const isPaginated = limit || page;

    if (isPaginated) {
      // page 기반 pagination 처리
      const limitNum = limit ? parseInt(limit) : 10;
      const pageNum = page ? parseInt(page) : 1;
      const offsetNum = offset ? parseInt(offset) : (pageNum - 1) * limitNum;

      const [data, [{ value: totalCount }]] = await Promise.all([
        db.query.memos.findMany({
          where: whereCondition,
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
          orderBy: [orderByField, desc(memos.id)],
          limit: limitNum,
          offset: offsetNum,
        }),
        db.select({ value: count() }).from(memos).where(whereCondition),
      ]);

      const totalPages = Math.ceil(Number(totalCount) / limitNum);
      const hasMore = pageNum < totalPages;

      return NextResponse.json({
        data,
        meta: {
          totalCount: Number(totalCount),
          totalPages,
          currentPage: pageNum,
          pageSize: limitNum,
          hasMore,
        },
      });
    }

    // 기본: 전체 데이터 + totalCount 반환
    const [data, [{ value: totalCount }]] = await Promise.all([
      db.query.memos.findMany({
        where: whereCondition,
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
        orderBy: [orderByField, desc(memos.id)],
      }),
      db.select({ value: count() }).from(memos).where(whereCondition),
    ]);

    return NextResponse.json({
      data,
      meta: {
        totalCount: Number(totalCount),
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
    const { type, content, playId, authorId, programId } = body;

    if (!type || !content) {
      return NextResponse.json(
        { error: "type and content are required" },
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

    // type에 따라 필수 필드 검증
    if (type === "play" && !playId) {
      return NextResponse.json(
        { error: "playId is required for play memo" },
        { status: 400 }
      );
    }
    if (type === "author" && !authorId) {
      return NextResponse.json(
        { error: "authorId is required for author memo" },
        { status: 400 }
      );
    }
    if (type === "program" && !programId) {
      return NextResponse.json(
        { error: "programId is required for program memo" },
        { status: 400 }
      );
    }

    // 작가 타입인 경우 title 생성을 위해 작가 정보 가져오기
    let title: string | null = null;
    if (type === "author" && authorId) {
      const author = await db.query.authors.findFirst({
        where: eq(authors.id, authorId),
      });
      if (author) {
        title = `${author.authorName}에게`;
      }
    }

    const id = uuidv4();
    await db.insert(memos).values({
      id,
      type: type as MemoType,
      userId,
      content,
      title,
      playId: type === "play" ? playId : null,
      authorId: type === "author" ? authorId : null,
      programId: type === "program" ? programId : null,
    });

    const newMemo = await db.query.memos.findFirst({
      where: eq(memos.id, id),
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
    });

    return NextResponse.json(newMemo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

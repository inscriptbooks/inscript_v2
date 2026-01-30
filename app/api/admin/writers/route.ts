import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { authors } from "@/lib/db/schema/authors";
import { users } from "@/lib/db/schema/users";
import { plays } from "@/lib/db/schema/plays";
import { memos } from "@/lib/db/schema/memos";
import { bookmarks } from "@/lib/db/schema/bookmarks";
import {
  and,
  eq,
  or,
  ilike,
  sql,
  desc,
  asc,
  count,
  gte,
  lte,
} from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");
    const searchCategory = searchParams.get("searchCategory");
    const searchQuery = searchParams.get("searchQuery");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    const whereClauses = [];

    // 기본적으로 삭제되지 않은 작가만 조회
    whereClauses.push(eq(authors.isDeleted, false));

    // 가입일 필터
    if (startDate) {
      whereClauses.push(gte(authors.createdAt, new Date(startDate)));
    }
    if (endDate) {
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      whereClauses.push(lte(authors.createdAt, endDateObj));
    }

    // 상태 필터 (is_visible 기반)
    if (status && status !== "전체") {
      if (status === "노출중") {
        whereClauses.push(eq(authors.isVisible, true));
      } else if (status === "미노출중") {
        whereClauses.push(eq(authors.isVisible, false));
      }
    }

    // 검색 필터
    if (searchQuery) {
      if (searchCategory === "작가명") {
        whereClauses.push(
          or(
            ilike(authors.authorName, `%${searchQuery}%`),
            ilike(authors.authorNameEn, `%${searchQuery}%`)
          )
        );
      } else if (searchCategory === "대표작") {
        whereClauses.push(ilike(authors.featuredWork, `%${searchQuery}%`));
      }
    }

    const whereCondition =
      whereClauses.length > 0 ? and(...whereClauses) : undefined;

    // 통계 데이터 조회 (삭제되지 않은 작가만, is_visible 기반)
    const [visibleStats, hiddenStats] = await Promise.all([
      db
        .select({ value: count() })
        .from(authors)
        .where(and(eq(authors.isVisible, true), eq(authors.isDeleted, false))),
      db
        .select({ value: count() })
        .from(authors)
        .where(and(eq(authors.isVisible, false), eq(authors.isDeleted, false))),
    ]);

    // 정렬 함수
    const getOrderBy = () => {
      if (sortBy === "createdAt") {
        return sortOrder === "asc"
          ? [asc(authors.createdAt)]
          : [desc(authors.createdAt)];
      }
      // 기본 정렬: 등록일 내림차순
      return [desc(authors.createdAt)];
    };

    // 작가명, 작품수, 메모수, 스크랩수 정렬은 전체 데이터 조회 후 처리
    const needsFullDataSort =
      sortBy === "authorName" ||
      sortBy === "worksCount" ||
      sortBy === "memosCount" ||
      sortBy === "scrapsCount";

    // 데이터 조회
    const [data, [{ value: totalCount }]] = await Promise.all([
      db.query.authors.findMany({
        where: whereCondition,
        with: {
          user: true,
        },
        orderBy: needsFullDataSort ? [desc(authors.createdAt)] : getOrderBy(),
        limit: needsFullDataSort ? undefined : limit,
        offset: needsFullDataSort ? undefined : offset,
      }),
      db.select({ value: count() }).from(authors).where(whereCondition),
    ]);

    // 각 작가의 작품수, 메모수, 스크랩수 조회
    let writersData = await Promise.all(
      data.map(async (author) => {
        const [worksCountResult, memosCountResult, scrapsCountResult] =
          await Promise.all([
            db
              .select({ value: count() })
              .from(plays)
              .where(
                and(eq(plays.authorId, author.id), eq(plays.isDeleted, false))
              ),
            db
              .select({ value: count() })
              .from(memos)
              .where(eq(memos.authorId, author.id)),
            db
              .select({ value: count() })
              .from(bookmarks)
              .where(
                and(
                  eq(bookmarks.authorId, author.id),
                  eq(bookmarks.type, "author")
                )
              ),
          ]);

        return {
          id: author.id,
          writerId: author.id.substring(0, 8).toUpperCase(),
          name: author.authorName || "작가 미지정",
          email: author.user?.email || "-",
          representative: author.featuredWork || "대표작 미등록",
          genre: null,
          keywords: Array.isArray(author.keyword) ? author.keyword : [],
          status: author.isVisible ? "노출중" : "미노출중",
          registeredAt: author.createdAt?.toISOString().split("T")[0] || "",
          worksCount: worksCountResult[0]?.value || 0,
          memosCount: memosCountResult[0]?.value || 0,
          scrapsCount: scrapsCountResult[0]?.value || 0,
        };
      })
    );

    // 전체 데이터 정렬이 필요한 경우
    if (needsFullDataSort) {
      if (sortBy === "authorName") {
        writersData.sort((a, b) => {
          // "작가 미지정"은 오름차순일 때 맨 뒤, 내림차순일 때 맨 앞
          const aIsUnassigned = a.name === "작가 미지정";
          const bIsUnassigned = b.name === "작가 미지정";

          if (aIsUnassigned && !bIsUnassigned)
            return sortOrder === "asc" ? 1 : -1;
          if (!aIsUnassigned && bIsUnassigned)
            return sortOrder === "asc" ? -1 : 1;
          if (aIsUnassigned && bIsUnassigned) return 0;

          const result = a.name.localeCompare(b.name, "ko");
          return sortOrder === "asc" ? result : -result;
        });
      } else if (sortBy === "worksCount") {
        writersData.sort((a, b) => {
          return sortOrder === "asc"
            ? a.worksCount - b.worksCount
            : b.worksCount - a.worksCount;
        });
      } else if (sortBy === "memosCount") {
        writersData.sort((a, b) => {
          return sortOrder === "asc"
            ? a.memosCount - b.memosCount
            : b.memosCount - a.memosCount;
        });
      } else if (sortBy === "scrapsCount") {
        writersData.sort((a, b) => {
          return sortOrder === "asc"
            ? a.scrapsCount - b.scrapsCount
            : b.scrapsCount - a.scrapsCount;
        });
      }

      // 페이지네이션 적용
      writersData = writersData.slice(offset, offset + limit);
    }

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      writers: writersData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
      stats: {
        visibleCount: visibleStats[0]?.value || 0,
        hiddenCount: hiddenStats[0]?.value || 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch writers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      koreanName,
      englishName,
      featuredWork,
      keywords,
      introduction,
      visibility,
    } = body;

    // 필수 필드 검증
    if (!koreanName || !englishName || !keywords || !introduction) {
      return NextResponse.json(
        { success: false, message: "필수 항목을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // 현재 로그인한 사용자 정보 가져오기 (관리자 권한 확인용)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    // 작가명 중복 체크 (한글명 또는 영문명)
    const { data: existingAuthor } = await supabase
      .from("authors")
      .select("id")
      .or(`author_name.eq.${koreanName},author_name_en.eq.${englishName}`)
      .single();

    if (existingAuthor) {
      return NextResponse.json(
        { success: false, message: "이미 등록된 작가명입니다." },
        { status: 400 }
      );
    }

    // 1. 먼저 users 테이블에 작가용 계정 생성 (임시 이메일 사용)
    const tempEmail = `${englishName.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}@author.temp`;

    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert({
        email: tempEmail,
        name: koreanName,
        name_en: englishName,
        role: "author",
        auth_provider: "local",
        status: "active",
      })
      .select()
      .single();

    if (userError || !newUser) {
      return NextResponse.json(
        {
          success: false,
          message: "작가 계정 생성에 실패했습니다.",
          error: userError?.message,
        },
        { status: 500 }
      );
    }

    // 2. authors 테이블에 작가 정보 등록 (생성된 user.id 사용)
    const { data, error } = await supabase
      .from("authors")
      .insert({
        id: newUser.id,
        author_name: koreanName,
        author_name_en: englishName,
        keyword: keywords,
        description: introduction,
        featured_work: featuredWork || "",
        is_visible: visibility === "노출",
        request_status: "approved",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "작가 등록에 실패했습니다.",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "작가가 등록되었습니다.",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "작가 등록 중 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

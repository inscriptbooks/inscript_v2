import { NextResponse, NextRequest } from "next/server";
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
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    // Supabase로 정렬 처리 (작가명, 메모수 포함 모든 정렬을 DB에서 처리)
    const supabase = await createClient();

    // 정렬 컬럼 매핑
    const getSortColumn = () => {
      switch (sortBy) {
        case "title":
          return "title";
        case "authorName":
          return "author_name";
        case "viewCount":
          return "view_count";
        case "bookmarkCount":
          return "bookmark_count";
        case "memosCount":
          return "memos_count";
        case "createdAt":
        default:
          return "created_at";
      }
    };

    // 기본 쿼리 구성
    let query = supabase
      .from("plays")
      .select(
        `
        id,
        title,
        created_at,
        apply_status,
        keyword,
        view_count,
        bookmark_count,
        authors!left (
          author_name
        )
      `,
        { count: "exact" }
      )
      .eq("is_deleted", false);

    // 필터 적용
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      query = query.lte("created_at", endDateObj.toISOString());
    }
    if (status && status !== "전체") {
      const statusMap: Record<string, string> = {
        노출중: "accepted",
        비공개: "unpublished",
        승인대기: "applied",
        반려: "rejected",
      };
      if (statusMap[status]) {
        query = query.eq("apply_status", statusMap[status]);
      }
    }
    if (searchQuery) {
      if (searchCategory === "작품명") {
        query = query.ilike("title", `%${searchQuery}%`);
      }
      // 작가명, 키워드 검색은 전체 데이터 조회 후 필터링
    }

    // 필터 조건 저장 (작가명/메모수 정렬 시 재사용)
    const filterConditions = {
      startDate,
      endDate,
      status,
      searchCategory,
      searchQuery,
    };

    // 메모 카운트 조회
    const { data: memoCounts } = await supabase
      .from("memos")
      .select("play_id")
      .eq("type", "play");

    const memoCountMap = new Map<string, number>();
    if (memoCounts) {
      memoCounts.forEach((m) => {
        if (m.play_id) {
          memoCountMap.set(m.play_id, (memoCountMap.get(m.play_id) || 0) + 1);
        }
      });
    }

    // 작가명 또는 키워드 검색이 있는 경우 전체 데이터를 조회해야 함
    const needsFullDataFetch =
      (searchQuery &&
        (searchCategory === "작가명" || searchCategory === "키워드")) ||
      sortBy === "authorName" ||
      sortBy === "memosCount";

    let playsWithMemos: any[] = [];
    let actualTotalCount = 0;

    if (needsFullDataFetch) {
      // 전체 데이터 조회 후 필터링 및 정렬
      let allQuery = supabase
        .from("plays")
        .select(
          `
          id,
          title,
          created_at,
          apply_status,
          keyword,
          view_count,
          bookmark_count,
          authors!left (
            author_name
          )
        `,
          { count: "exact" }
        )
        .eq("is_deleted", false);

      // 필터 적용
      if (filterConditions.startDate) {
        allQuery = allQuery.gte("created_at", filterConditions.startDate);
      }
      if (filterConditions.endDate) {
        const endDateObj = new Date(filterConditions.endDate);
        endDateObj.setHours(23, 59, 59, 999);
        allQuery = allQuery.lte("created_at", endDateObj.toISOString());
      }
      if (filterConditions.status && filterConditions.status !== "전체") {
        const statusMap: Record<string, string> = {
          노출중: "accepted",
          비공개: "unpublished",
          승인대기: "applied",
          반려: "rejected",
        };
        if (statusMap[filterConditions.status]) {
          allQuery = allQuery.eq(
            "apply_status",
            statusMap[filterConditions.status]
          );
        }
      }
      if (
        filterConditions.searchQuery &&
        filterConditions.searchCategory === "작품명"
      ) {
        allQuery = allQuery.ilike("title", `%${filterConditions.searchQuery}%`);
      }

      const { data: allData, error } = await allQuery;

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (allData) {
        let allPlaysWithMemos = allData.map((play: any) => ({
          id: play.id,
          title: play.title || "-",
          author: play.authors?.author_name || "작가 미지정",
          created_at: play.created_at || "",
          apply_status: play.apply_status,
          keyword: play.keyword,
          view_count: play.view_count || 0,
          bookmark_count: play.bookmark_count || 0,
          memos_count: memoCountMap.get(play.id) || 0,
        }));

        // 작가명 검색 필터
        if (
          filterConditions.searchQuery &&
          filterConditions.searchCategory === "작가명"
        ) {
          const searchLower = filterConditions.searchQuery.toLowerCase();
          allPlaysWithMemos = allPlaysWithMemos.filter((play) =>
            play.author.toLowerCase().includes(searchLower)
          );
        }

        // 키워드 검색 필터
        if (
          filterConditions.searchQuery &&
          filterConditions.searchCategory === "키워드"
        ) {
          const searchLower = filterConditions.searchQuery.toLowerCase();
          allPlaysWithMemos = allPlaysWithMemos.filter((play) => {
            if (!play.keyword || !Array.isArray(play.keyword)) return false;
            return play.keyword.some((tag: string) =>
              tag.toLowerCase().includes(searchLower)
            );
          });
        }

        // 정렬
        if (sortBy === "authorName") {
          allPlaysWithMemos.sort((a, b) => {
            const aIsUnassigned = a.author === "작가 미지정";
            const bIsUnassigned = b.author === "작가 미지정";

            if (aIsUnassigned && !bIsUnassigned)
              return sortOrder === "asc" ? 1 : -1;
            if (!aIsUnassigned && bIsUnassigned)
              return sortOrder === "asc" ? -1 : 1;
            if (aIsUnassigned && bIsUnassigned) return 0;

            const result = a.author.localeCompare(b.author, "ko");
            return sortOrder === "asc" ? result : -result;
          });
        } else if (sortBy === "memosCount") {
          allPlaysWithMemos.sort((a, b) => {
            return sortOrder === "asc"
              ? a.memos_count - b.memos_count
              : b.memos_count - a.memos_count;
          });
        } else {
          // 기본 정렬
          const sortColumn = getSortColumn();
          allPlaysWithMemos.sort((a, b) => {
            const key =
              sortColumn === "author_name"
                ? "author"
                : sortColumn === "view_count"
                  ? "view_count"
                  : sortColumn === "bookmark_count"
                    ? "bookmark_count"
                    : sortColumn === "created_at"
                      ? "created_at"
                      : "title";

            let aValue: any = a[key as keyof typeof a];
            let bValue: any = b[key as keyof typeof b];

            if (sortColumn === "created_at") {
              aValue = new Date(aValue).getTime();
              bValue = new Date(bValue).getTime();
            } else if (typeof aValue === "string") {
              return sortOrder === "asc"
                ? aValue.localeCompare(bValue, "ko")
                : bValue.localeCompare(aValue, "ko");
            }

            return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
          });
        }

        actualTotalCount = allPlaysWithMemos.length;
        playsWithMemos = allPlaysWithMemos.slice(offset, offset + limit);
      }
    } else {
      // 작품명 검색만 있거나 검색이 없는 경우 - Supabase에서 직접 처리
      const sortColumn = getSortColumn();
      const {
        data: sortedData,
        count,
        error,
      } = await query
        .order(sortColumn, { ascending: sortOrder === "asc" })
        .range(offset, offset + limit - 1);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      actualTotalCount = count || 0;

      if (sortedData) {
        playsWithMemos = sortedData.map((play: any) => ({
          id: play.id,
          title: play.title || "-",
          author: play.authors?.author_name || "작가 미지정",
          created_at: play.created_at || "",
          apply_status: play.apply_status,
          keyword: play.keyword,
          view_count: play.view_count || 0,
          bookmark_count: play.bookmark_count || 0,
          memos_count: memoCountMap.get(play.id) || 0,
        }));
      }
    }

    // status 매핑
    const statusDisplayMap: Record<string, string> = {
      applied: "승인대기",
      review: "검토중",
      accepted: "노출중",
      rejected: "반려",
    };

    const playsData = playsWithMemos.map((play) => ({
      id: play.id,
      title: play.title,
      author: play.author,
      created_at: play.created_at,
      status: statusDisplayMap[play.apply_status] || play.apply_status,
      tags: Array.isArray(play.keyword) ? play.keyword : [],
      views_count: play.view_count,
      memos_count: play.memos_count,
      bookmarks_count: play.bookmark_count,
    }));

    const totalPages = Math.ceil((actualTotalCount || 0) / limit);

    return NextResponse.json({
      plays: playsData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: actualTotalCount,
        limit,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch plays",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

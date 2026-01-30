import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const searchCategory = searchParams.get("searchCategory");
    const searchQuery = searchParams.get("searchQuery");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const supabase = await createClient();

    // 카테고리 매핑 (UI 표시명 -> DB type 값)
    const categoryTypeMap: Record<string, string> = {
      함께하기: "recruit",
      거래: "market",
      홍보하기: "qna",
      인크소식: "news",
      작가커뮤니티: "author",
    };

    // 역매핑 (DB type 값 -> UI 표시명)
    const typeCategoryMap: Record<string, string> = {
      recruit: "함께하기",
      market: "거래",
      qna: "홍보하기",
      news: "인크소식",
      author: "작가커뮤니티",
    };

    // 기본 쿼리 시작 - posts 테이블과 users 테이블 조인
    // is_deleted가 false인 것만 조회
    let query = supabase
      .from("posts")
      .select(
        `
        *,
        users!posts_user_id_users_id_fk (
          name,
          email
        )
      `,
        { count: "exact" }
      )
      .eq("is_deleted", false);

    // 작성일시 필터 (가입일 -> 작성일시로 변경)
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      // endDate는 해당 날짜의 23:59:59까지 포함
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      query = query.lte("created_at", endDateTime.toISOString());
    }

    // 카테고리 필터 - UI 표시명을 DB type 값으로 변환
    if (category && category !== "전체") {
      const typeValue = categoryTypeMap[category];
      if (typeValue) {
        query = query.eq("type", typeValue);
      }
    }

    // 상태 필터 - is_visible 기준
    if (status && status !== "전체") {
      if (status === "노출중") {
        query = query.eq("is_visible", true);
      } else if (status === "비공개") {
        query = query.eq("is_visible", false);
      }
    }

    // 검색 필터
    if (searchQuery && searchCategory) {
      if (searchCategory === "제목") {
        query = query.ilike("title", `%${searchQuery}%`);
      } else if (searchCategory === "작성자") {
        // 작성자는 users 테이블의 name으로 검색
        // Supabase에서는 조인된 테이블 검색이 제한적이므로
        // 먼저 users에서 검색 후 user_id로 필터링
        const { data: users } = await supabase
          .from("users")
          .select("id")
          .ilike("name", `%${searchQuery}%`);

        if (users && users.length > 0) {
          const userIds = users.map((u) => u.id);
          query = query.in("user_id", userIds);
        } else {
          // 검색 결과가 없으면 빈 배열 반환
          return NextResponse.json({
            posts: [],
            pagination: {
              currentPage: 1,
              totalPages: 0,
              totalCount: 0,
              limit: limit,
            },
            statistics: {
              exposedCount: 0,
              hiddenCount: 0,
            },
          });
        }
      }
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 신고수는 전체 데이터 조회 후 정렬 필요 (현재 report_count는 0으로 고정)
    const needsFullDataSort = sortBy === "reportCount";

    // 정렬 컬럼 매핑 (DB 레벨 정렬 가능한 컬럼)
    const getSortColumn = () => {
      switch (sortBy) {
        case "likeCount":
          return "like_count";
        case "commentCount":
          return "comment_count";
        case "createdAt":
          return "created_at";
        default:
          return "created_at";
      }
    };

    if (needsFullDataSort) {
      // 전체 데이터 조회 (페이지네이션 없이)
      query = query.order("created_at", { ascending: false });
    } else {
      // DB 레벨 정렬
      const sortColumn = getSortColumn();
      query = query
        .range(from, to)
        .order(sortColumn, { ascending: sortOrder === "asc" });
    }

    const { data: posts, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // 통계 데이터 가져오기 - is_deleted가 false인 것만
    const { data: statsData } = await supabase
      .from("posts")
      .select("is_visible")
      .eq("is_deleted", false);

    const exposedCount =
      statsData?.filter((p) => p.is_visible === true).length || 0;
    const hiddenCount =
      statsData?.filter((p) => p.is_visible === false).length || 0;

    // 각 게시글의 신고 수 가져오기 (reports 테이블이 있다고 가정)
    let postsWithDetails = await Promise.all(
      (posts || []).map(async (post) => {
        // 신고 수 계산 - reports 테이블 구조에 따라 수정 필요
        // 현재는 0으로 설정
        const reportCount = 0;

        return {
          id: post.id,
          title: post.title,
          content: post.content,
          category: typeCategoryMap[post.type] || post.type,
          type: post.type,
          user_id: post.user_id,
          author_name: post.users?.name || "알 수 없음",
          author_username: post.users?.email || "",
          status: post.is_visible ? "exposed" : "hidden",
          like_count: post.like_count || 0,
          comment_count: post.comment_count || 0,
          report_count: reportCount,
          view_count: post.view_count || 0,
          created_at: post.created_at,
          updated_at: post.updated_at,
        };
      })
    );

    // 전체 데이터 정렬이 필요한 경우 (신고수)
    if (needsFullDataSort) {
      if (sortBy === "reportCount") {
        postsWithDetails.sort((a, b) => {
          return sortOrder === "asc"
            ? a.report_count - b.report_count
            : b.report_count - a.report_count;
        });
      }

      // 페이지네이션 적용
      postsWithDetails = postsWithDetails.slice(from, from + limit);
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      posts: postsWithDetails,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count || 0,
        limit,
      },
      statistics: {
        exposedCount,
        hiddenCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "커뮤니티 목록을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

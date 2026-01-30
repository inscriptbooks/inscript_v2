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
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const supabase = await createClient();

    // 카테고리 매핑 (UI 표시명 -> DB type 값)
    const categoryTypeMap: Record<string, string> = {
      댓글: "comment",
      게시물: "post",
      메모: "memo",
    };

    // 기본 쿼리 시작 - reports 테이블과 users 테이블 조인
    let query = supabase.from("reports").select(
      `
        *,
        users!reports_user_id_fkey (
          name,
          email
        )
      `,
      { count: "exact" }
    );

    // 신고일시 필터
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

    // 상태 필터 - is_complete 기준
    if (status && status !== "전체") {
      if (status === "처리완료") {
        query = query.eq("is_complete", true);
      } else if (status === "대기중") {
        query = query.eq("is_complete", false);
      }
      // "무효"는 별도 처리 필요 (현재 DB에 해당 필드 없음)
    }

    // 검색 필터
    if (searchQuery && searchCategory) {
      if (searchCategory === "신고자") {
        // 신고자는 users 테이블의 name으로 검색
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
            reports: [],
            pagination: {
              currentPage: 1,
              totalPages: 0,
              totalCount: 0,
              limit: limit,
            },
            statistics: {
              completedCount: 0,
              pendingCount: 0,
              invalidCount: 0,
            },
          });
        }
      } else if (searchCategory === "내용") {
        // 내용 검색: 신고 대상의 제목/내용 검색
        // 게시물 검색
        const { data: posts } = await supabase
          .from("posts")
          .select("id")
          .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);

        // 메모 검색
        const { data: memos } = await supabase
          .from("memos")
          .select("id")
          .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);

        const postIds = posts?.map((p) => p.id) || [];
        const memoIds = memos?.map((m) => m.id) || [];

        if (postIds.length === 0 && memoIds.length === 0) {
          // 검색 결과가 없으면 빈 배열 반환
          return NextResponse.json({
            reports: [],
            pagination: {
              currentPage: 1,
              totalPages: 0,
              totalCount: 0,
              limit: limit,
            },
            statistics: {
              completedCount: 0,
              pendingCount: 0,
              invalidCount: 0,
            },
          });
        }

        // post_id 또는 memo_id가 검색 결과에 포함된 신고만 필터링
        if (postIds.length > 0 && memoIds.length > 0) {
          query = query.or(
            `post_id.in.(${postIds.join(",")}),memo_id.in.(${memoIds.join(",")})`
          );
        } else if (postIds.length > 0) {
          query = query.in("post_id", postIds);
        } else if (memoIds.length > 0) {
          query = query.in("memo_id", memoIds);
        }
      }
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 정렬 처리
    const validSortColumns = ["created_at", "is_complete"];
    const sortColumn = validSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";
    const ascending = sortOrder === "asc";

    query = query.range(from, to).order(sortColumn, { ascending });

    const { data: reports, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // 통계 데이터 가져오기
    const { data: statsData } = await supabase
      .from("reports")
      .select("is_complete");

    const completedCount =
      statsData?.filter((r) => r.is_complete === true).length || 0;
    const pendingCount =
      statsData?.filter((r) => r.is_complete === false).length || 0;
    const invalidCount = 0; // 현재 DB에 무효 상태 필드가 없음

    // 각 신고의 상세 정보 가져오기
    const reportsWithDetails = await Promise.all(
      (reports || []).map(async (report) => {
        let category = "";
        let targetId = "";
        let contentPreview = "";
        let authorEmail = "";
        let authorName = "";

        // 신고 대상 정보 가져오기
        if (report.type === "post" && report.post_id) {
          const { data: post } = await supabase
            .from("posts")
            .select(
              `
              id, 
              title, 
              content,
              user_id
            `
            )
            .eq("id", report.post_id)
            .single();

          if (post) {
            category = "게시물";
            targetId = post.id.slice(0, 8);
            contentPreview = post.title || post.content?.slice(0, 50) || "";

            // 작성자 정보 가져오기
            const { data: author } = await supabase
              .from("users")
              .select("email, name")
              .eq("id", post.user_id)
              .single();

            authorEmail = author?.email || "";
            authorName = author?.name || "";
          }
        } else if (report.type === "memo" && report.memo_id) {
          const { data: memo } = await supabase
            .from("memos")
            .select(
              `
              id, 
              title, 
              content,
              user_id
            `
            )
            .eq("id", report.memo_id)
            .single();

          if (memo) {
            category = "메모";
            targetId = memo.id.slice(0, 8);
            contentPreview = memo.title || memo.content?.slice(0, 50) || "";

            // 작성자 정보 가져오기
            const { data: author } = await supabase
              .from("users")
              .select("email, name")
              .eq("id", memo.user_id)
              .single();

            authorEmail = author?.email || "";
            authorName = author?.name || "";
          }
        } else if (report.type === "comment" && report.comment_id) {
          const { data: comment } = await supabase
            .from("comments")
            .select(
              `
              id, 
              content,
              user_id
            `
            )
            .eq("id", report.comment_id)
            .single();

          if (comment) {
            category = "댓글";
            targetId = comment.id.slice(0, 8);
            contentPreview = comment.content?.slice(0, 50) || "";

            // 작성자 정보 가져오기
            const { data: author } = await supabase
              .from("users")
              .select("email, name")
              .eq("id", comment.user_id)
              .single();

            authorEmail = author?.email || "";
            authorName = author?.name || "";
          }
        }

        // 상태 결정 (is_complete 기준)
        let status: "submitted" | "approved" | "rejected" = "submitted";
        if (report.is_complete === "approved") {
          status = "approved";
        } else if (report.is_complete === "rejected") {
          status = "rejected";
        } else if (report.is_complete === "submitted") {
          status = "submitted";
        }

        return {
          id: report.id,
          type: report.type,
          user_id: report.user_id,
          reporter_name: report.users?.name || "알 수 없음",
          reporter_email: report.users?.email || "",
          memo_id: report.memo_id,
          post_id: report.post_id,
          reason: report.reason,
          created_at: report.created_at,
          is_complete: report.is_complete,
          category: category,
          target_id: targetId,
          author_email: authorEmail,
          author_name: authorName,
          content_preview: contentPreview,
          status: status,
        };
      })
    );

    // 신고자(reporter_name) 정렬은 후처리로 수행
    let sortedReports = reportsWithDetails;
    if (sortBy === "reporter_name") {
      sortedReports = [...reportsWithDetails].sort((a, b) => {
        const nameA = a.reporter_name || "";
        const nameB = b.reporter_name || "";
        const comparison = nameA.localeCompare(nameB, "ko");
        return ascending ? comparison : -comparison;
      });
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      reports: sortedReports,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count || 0,
        limit,
      },
      statistics: {
        completedCount,
        pendingCount,
        invalidCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "신고 목록을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

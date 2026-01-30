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
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const supabase = await createClient();

    // 카테고리 매핑 (UI 표시명 -> DB post type 값)
    const categoryToPostTypeMap: Record<string, string> = {
      인크소식: "news",
      함께하기: "recruit",
      사고팔기: "market",
      홍보하기: "promotion",
      얘기하기: "qna",
      "작가 커뮤니티": "author",
    };

    // DB post type -> UI 표시명 매핑
    const postTypeToDisplayMap: Record<string, string> = {
      news: "인크소식",
      recruit: "함께하기",
      market: "사고팔기",
      promotion: "홍보하기",
      qna: "얘기하기",
      author: "작가 커뮤니티",
    };

    // 기본 쿼리 시작 - comments 테이블과 users 테이블 조인
    // is_deleted가 false이고 type이 post인 것만 조회 (memo 타입 제외)
    let query = supabase
      .from("comments")
      .select(
        `
        *,
        users!comments_user_id_users_id_fk (
          name,
          email
        )
      `,
        { count: "exact" }
      )
      .eq("is_deleted", false)
      .eq("type", "post");

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

    // 카테고리 필터 - 커뮤니티 상세 카테고리 기반
    if (category && category !== "전체") {
      const postType = categoryToPostTypeMap[category];
      if (postType) {
        // post_id로 posts 테이블 조인하여 특정 post type 필터링
        const { data: filteredPosts } = await supabase
          .from("posts")
          .select("id")
          .eq("type", postType);

        if (filteredPosts && filteredPosts.length > 0) {
          const postIds = filteredPosts.map((p) => p.id);
          query = query.in("post_id", postIds);
        } else {
          // 해당 카테고리의 게시글이 없으면 빈 결과 반환
          return NextResponse.json({
            comments: [],
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
      if (searchCategory === "내용") {
        query = query.ilike("content", `%${searchQuery}%`);
      } else if (searchCategory === "작성자") {
        // 작성자는 users 테이블의 name으로 검색
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
            comments: [],
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

    // 정렬 적용 (작성일시만 지원)
    const isAscending = sortOrder === "asc";
    query = query
      .range(from, to)
      .order("created_at", { ascending: isAscending });

    const { data: comments, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // 통계 데이터 가져오기 - is_deleted가 false이고 type이 post인 것만
    const { data: statsData } = await supabase
      .from("comments")
      .select("is_visible")
      .eq("is_deleted", false)
      .eq("type", "post");

    const exposedCount =
      statsData?.filter((c) => c.is_visible === true).length || 0;
    const hiddenCount =
      statsData?.filter((c) => c.is_visible === false).length || 0;

    // 각 댓글의 원문 정보와 좋아요/신고 수 가져오기
    const commentsWithDetails = await Promise.all(
      (comments || []).map(async (comment) => {
        let originalTitle = "";
        let category = "";
        let postType = "";
        let memoType = "";
        let playId = "";
        let authorId = "";
        let programId = "";

        // 댓글이 달린 원문 정보 가져오기
        if (comment.type === "post" && comment.post_id) {
          const { data: post } = await supabase
            .from("posts")
            .select("title, type")
            .eq("id", comment.post_id)
            .single();

          if (post) {
            originalTitle = post.title;
            postType = post.type;
            // post type을 카테고리로 변환
            category = postTypeToDisplayMap[post.type] || "커뮤니티";
          }
        } else if (comment.type === "memo" && comment.memo_id) {
          const { data: memo } = await supabase
            .from("memos")
            .select("title, type, play_id, author_id, program_id")
            .eq("id", comment.memo_id)
            .single();

          if (memo) {
            originalTitle = memo.title || "제목 없음";
            memoType = memo.type;
            playId = memo.play_id || "";
            authorId = memo.author_id || "";
            programId = memo.program_id || "";
            // memo type을 카테고리로 변환
            const memoTypeMap: Record<string, string> = {
              play: "희곡",
              writer: "작가",
              program: "프로그램",
              author: "작가",
            };
            category = memoTypeMap[memo.type] || "희곡";
          }
        }

        // 좋아요 수 계산
        const { count: likeCount } = await supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("comment_id", comment.id);

        // 신고 수 계산
        const { count: reportCount } = await supabase
          .from("reports")
          .select("*", { count: "exact", head: true })
          .eq("comment_id", comment.id);

        return {
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          user_id: comment.user_id,
          author_name: comment.users?.name || "알 수 없음",
          author_email: comment.users?.email || "",
          type: comment.type,
          category: category,
          original_title: originalTitle,
          status: comment.is_visible ? "exposed" : "hidden",
          is_deleted: comment.is_deleted,
          like_count: likeCount || 0,
          report_count: reportCount || 0,
          post_id: comment.post_id,
          memo_id: comment.memo_id,
          post_type: postType,
          memo_type: memoType,
          play_id: playId,
          author_id: authorId,
          program_id: programId,
        };
      })
    );

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      comments: commentsWithDetails,
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
      { success: false, error: "댓글 목록을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

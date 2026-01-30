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
    const visibility = searchParams.get("visibility");
    const searchCategory = searchParams.get("searchCategory");
    const searchQuery = searchParams.get("searchQuery");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const supabase = await createClient();
    const isAscending = sortOrder === "asc";
    const needsFullScan = sortBy === "likeCount" || sortBy === "commentCount";

    // 기본 쿼리 빌더
    const buildBaseQuery = () => {
      let query = supabase
        .from("memos")
        .select(
          `
          *,
          users!memos_user_id_users_id_fk (
            name,
            email
          )
        `,
          { count: "exact" }
        )
        .eq("is_deleted", false);

      // 등록일시 필터
      if (startDate) {
        query = query.gte("created_at", startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query = query.lte("created_at", endDateTime.toISOString());
      }

      // 노출 여부 필터
      if (visibility && visibility !== "전체") {
        if (visibility === "노출중") {
          query = query.eq("is_visible", true);
        } else if (visibility === "비공개") {
          query = query.eq("is_visible", false);
        }
      }

      // 구분 필터
      if (category && category !== "전체") {
        if (category === "희곡") {
          query = query.eq("type", "play");
        } else if (category === "작가") {
          query = query.or("type.eq.author,type.eq.writer");
        } else if (category === "프로그램") {
          query = query.eq("type", "program");
        }
      }

      return query;
    };

    // 검색 필터용 IDs 조회
    let userIds: string[] | null = null;
    let targetIds: {
      playIds: string[];
      authorIds: string[];
      programIds: string[];
    } | null = null;

    if (searchQuery && searchCategory === "작성자") {
      const { data: users } = await supabase
        .from("users")
        .select("id")
        .ilike("name", `%${searchQuery}%`);

      if (!users || users.length === 0) {
        return NextResponse.json({
          memos: [],
          pagination: { currentPage: 1, totalPages: 0, totalCount: 0, limit },
          statistics: { exposedCount: 0, hiddenCount: 0 },
        });
      }
      userIds = users.map((u) => u.id);
    } else if (searchQuery && searchCategory === "대상") {
      // 희곡, 작가, 프로그램에서 검색
      const [{ data: plays }, { data: authors }, { data: programs }] =
        await Promise.all([
          supabase
            .from("plays")
            .select("id")
            .ilike("title", `%${searchQuery}%`),
          supabase
            .from("authors")
            .select("id")
            .ilike("name", `%${searchQuery}%`),
          supabase
            .from("programs")
            .select("id")
            .ilike("title", `%${searchQuery}%`),
        ]);

      const playIds = plays?.map((p) => p.id) || [];
      const authorIds = authors?.map((a) => a.id) || [];
      const programIds = programs?.map((p) => p.id) || [];

      if (
        playIds.length === 0 &&
        authorIds.length === 0 &&
        programIds.length === 0
      ) {
        return NextResponse.json({
          memos: [],
          pagination: { currentPage: 1, totalPages: 0, totalCount: 0, limit },
          statistics: { exposedCount: 0, hiddenCount: 0 },
        });
      }

      targetIds = { playIds, authorIds, programIds };
    }

    // 통계 데이터 (병렬)
    const [{ count: exposedCount }, { count: hiddenCount }] = await Promise.all(
      [
        supabase
          .from("memos")
          .select("*", { count: "exact", head: true })
          .eq("is_deleted", false)
          .eq("is_visible", true),
        supabase
          .from("memos")
          .select("*", { count: "exact", head: true })
          .eq("is_deleted", false)
          .eq("is_visible", false),
      ]
    );

    // 메모 상세 정보 가져오기 함수
    const getMemoDetails = async (memo: any) => {
      let targetTitle = "";
      let category = "";

      if (memo.type === "play" && memo.play_id) {
        const { data: play } = await supabase
          .from("plays")
          .select("title")
          .eq("id", memo.play_id)
          .single();
        if (play) {
          targetTitle = play.title;
          category = "희곡";
        }
      } else if (
        (memo.type === "writer" || memo.type === "author") &&
        memo.author_id
      ) {
        const { data: author } = await supabase
          .from("authors")
          .select("author_name")
          .eq("id", memo.author_id)
          .single();
        if (author) {
          targetTitle = author.author_name;
          category = "작가";
        }
      } else if (memo.type === "program" && memo.program_id) {
        const { data: program } = await supabase
          .from("programs")
          .select("title")
          .eq("id", memo.program_id)
          .single();
        if (program) {
          targetTitle = program.title;
          category = "프로그램";
        }
      }

      const [{ count: likeCount }, { count: commentCount }] = await Promise.all(
        [
          supabase
            .from("likes")
            .select("*", { count: "exact", head: true })
            .eq("memo_id", memo.id),
          supabase
            .from("comments")
            .select("*", { count: "exact", head: true })
            .eq("memo_id", memo.id)
            .eq("type", "memo")
            .eq("is_deleted", false),
        ]
      );

      return {
        id: memo.id,
        content: memo.content,
        title: memo.title,
        created_at: memo.created_at,
        user_id: memo.user_id,
        author_name: memo.users?.name || "알 수 없음",
        author_email: memo.users?.email || "",
        type: memo.type,
        category,
        target_title: targetTitle,
        status: memo.is_visible ? "exposed" : "hidden",
        is_deleted: memo.is_deleted,
        like_count: likeCount || 0,
        comment_count: commentCount || 0,
        report_count: 0,
        play_id: memo.play_id,
        author_id: memo.author_id,
        program_id: memo.program_id,
      };
    };

    let resultMemos: any[];
    let totalCount: number;

    if (needsFullScan) {
      // 좋아요/댓글 정렬: 전체 조회 후 정렬 → 페이지네이션
      let query = buildBaseQuery();
      if (searchQuery && searchCategory === "메모내용") {
        query = query.ilike("content", `%${searchQuery}%`);
      } else if (userIds) {
        query = query.in("user_id", userIds);
      } else if (targetIds) {
        // 대상 검색: play_id, author_id, program_id 중 하나라도 일치하면 포함
        const conditions = [];
        if (targetIds.playIds.length > 0) {
          conditions.push(`play_id.in.(${targetIds.playIds.join(",")})`);
        }
        if (targetIds.authorIds.length > 0) {
          conditions.push(`author_id.in.(${targetIds.authorIds.join(",")})`);
        }
        if (targetIds.programIds.length > 0) {
          conditions.push(`program_id.in.(${targetIds.programIds.join(",")})`);
        }
        if (conditions.length > 0) {
          query = query.or(conditions.join(","));
        }
      }
      query = query.order("created_at", { ascending: false });

      const { data: allMemos, error } = await query;
      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      // 전체 데이터 상세 조회
      const allMemosWithDetails = await Promise.all(
        (allMemos || []).map(getMemoDetails)
      );

      // 정렬
      if (sortBy === "likeCount") {
        allMemosWithDetails.sort((a, b) =>
          isAscending
            ? a.like_count - b.like_count
            : b.like_count - a.like_count
        );
      } else if (sortBy === "commentCount") {
        allMemosWithDetails.sort((a, b) =>
          isAscending
            ? a.comment_count - b.comment_count
            : b.comment_count - a.comment_count
        );
      }

      // 페이지네이션
      totalCount = allMemosWithDetails.length;
      const from = (page - 1) * limit;
      resultMemos = allMemosWithDetails.slice(from, from + limit);
    } else {
      // 등록일시 정렬: DB 레벨 페이지네이션 (빠름)
      let query = buildBaseQuery();
      if (searchQuery && searchCategory === "메모내용") {
        query = query.ilike("content", `%${searchQuery}%`);
      } else if (userIds) {
        query = query.in("user_id", userIds);
      } else if (targetIds) {
        // 대상 검색: play_id, author_id, program_id 중 하나라도 일치하면 포함
        const conditions = [];
        if (targetIds.playIds.length > 0) {
          conditions.push(`play_id.in.(${targetIds.playIds.join(",")})`);
        }
        if (targetIds.authorIds.length > 0) {
          conditions.push(`author_id.in.(${targetIds.authorIds.join(",")})`);
        }
        if (targetIds.programIds.length > 0) {
          conditions.push(`program_id.in.(${targetIds.programIds.join(",")})`);
        }
        if (conditions.length > 0) {
          query = query.or(conditions.join(","));
        }
      }

      const from = (page - 1) * limit;
      query = query.range(from, from + limit - 1).order("created_at", {
        ascending: sortBy === "createdAt" ? isAscending : false,
      });

      const { data: memos, error, count } = await query;
      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      totalCount = count || 0;
      resultMemos = await Promise.all((memos || []).map(getMemoDetails));
    }

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      memos: resultMemos,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
      statistics: {
        exposedCount: exposedCount || 0,
        hiddenCount: hiddenCount || 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "메모 목록을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface DataItem {
  created_at: string;
  user_id?: string;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;
  
  const memberType = searchParams.get("memberType") || "일반회원";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "시작일과 종료일이 필요합니다." },
      { status: 400 }
    );
  }

  const isAuthor = memberType === "작가회원";

  try {
    // 날짜 범위 생성 (12개 기간)
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Program Applications 데이터
    const { data: programsData, error: programsError } = await supabase
      .from("program_applications")
      .select("created_at, user_id")
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString());

    if (programsError) {
      return NextResponse.json(
        { error: "프로그램 신청 데이터 조회 실패", details: programsError.message },
        { status: 500 }
      );
    }

    // 사용자 role 정보 가져오기
    const userIds = [
      ...new Set([
        ...(programsData?.map((p) => p.user_id).filter(Boolean) || []),
      ]),
    ];

    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, role")
      .in("id", userIds);

    if (usersError) {
      return NextResponse.json(
        { error: "사용자 데이터 조회 실패", details: usersError.message },
        { status: 500 }
      );
    }

    const userRoleMap = new Map(
      usersData?.map((u) => [u.id, u.role]) || []
    );

    // Program Applications 필터링
    const filteredPrograms = programsData?.filter((p) => {
      const role = userRoleMap.get(p.user_id);
      return isAuthor ? role === "author" : role !== "author";
    }) || [];

    // Memos 데이터
    const { data: memosData, error: memosError } = await supabase
      .from("memos")
      .select("created_at, user_id")
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString());

    if (memosError) {
      return NextResponse.json(
        { error: "메모 데이터 조회 실패", details: memosError.message },
        { status: 500 }
      );
    }

    // Memos user role 정보
    const memoUserIds = [
      ...new Set(memosData?.map((m) => m.user_id).filter(Boolean) || []),
    ];

    const { data: memoUsersData, error: memoUsersError } = await supabase
      .from("users")
      .select("id, role")
      .in("id", memoUserIds);

    if (memoUsersError) {
      return NextResponse.json(
        { error: "메모 사용자 데이터 조회 실패", details: memoUsersError.message },
        { status: 500 }
      );
    }

    const memoUserRoleMap = new Map(
      memoUsersData?.map((u) => [u.id, u.role]) || []
    );

    const filteredMemos = memosData?.filter((m) => {
      const role = memoUserRoleMap.get(m.user_id);
      return isAuthor ? role === "author" : role !== "author";
    }) || [];

    // Plays 데이터 - created_by_id를 통해 사용자 정보 조회
    const { data: playsData, error: playsError } = await supabase
      .from("plays")
      .select("created_at, created_by_id")
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString());

    if (playsError) {
      return NextResponse.json(
        { error: "희곡 데이터 조회 실패", details: playsError.message },
        { status: 500 }
      );
    }

    // Plays user role 정보
    const playUserIds = [
      ...new Set(playsData?.map((p: any) => p.created_by_id).filter(Boolean) || []),
    ];

    const { data: playUsersData, error: playUsersError } = await supabase
      .from("users")
      .select("id, role")
      .in("id", playUserIds);

    if (playUsersError) {
      return NextResponse.json(
        { error: "희곡 사용자 데이터 조회 실패", details: playUsersError.message },
        { status: 500 }
      );
    }

    const playUserRoleMap = new Map(
      playUsersData?.map((u) => [u.id, u.role]) || []
    );

    const filteredPlays = playsData?.filter((p: any) => {
      const role = playUserRoleMap.get(p.created_by_id);
      return isAuthor ? role === "author" : role !== "author";
    }).map((p: any) => ({ created_at: p.created_at, user_id: p.created_by_id })) || [];

    // Posts 데이터
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("created_at, user_id")
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString());

    if (postsError) {
      return NextResponse.json(
        { error: "게시글 데이터 조회 실패", details: postsError.message },
        { status: 500 }
      );
    }

    // Posts user role 정보
    const postUserIds = [
      ...new Set(postsData?.map((p) => p.user_id).filter(Boolean) || []),
    ];

    const { data: postUsersData, error: postUsersError } = await supabase
      .from("users")
      .select("id, role")
      .in("id", postUserIds);

    if (postUsersError) {
      return NextResponse.json(
        { error: "게시글 사용자 데이터 조회 실패", details: postUsersError.message },
        { status: 500 }
      );
    }

    const postUserRoleMap = new Map(
      postUsersData?.map((u) => [u.id, u.role]) || []
    );

    const filteredPosts = postsData?.filter((p) => {
      const role = postUserRoleMap.get(p.user_id);
      return isAuthor ? role === "author" : role !== "author";
    }) || [];

    return NextResponse.json({
      programs: filteredPrograms,
      memos: filteredMemos,
      plays: filteredPlays,
      posts: filteredPosts,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

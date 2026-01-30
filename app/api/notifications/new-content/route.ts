import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// 최근 7일 이내 새로운 게시글과 프로그램 조회
export async function GET(request: Request) {
  const supabase = await createClient();

  // 현재 로그인한 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 사용자의 알림 설정 조회
  const { data: notificationSettings } = await supabase
    .from("notifications_settings")
    .select("new_posts, new_programs")
    .eq("user_id", user.id)
    .single();

  // 알림 설정이 없거나 모두 OFF면 빈 배열 반환
  if (!notificationSettings || (!notificationSettings.new_posts && !notificationSettings.new_programs)) {
    return NextResponse.json({ newContent: [] });
  }

  // 7일 전 날짜 계산
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoISO = sevenDaysAgo.toISOString();

  // URL에서 쿼리 파라미터 가져오기
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");

  let newPosts: any[] = [];
  let newPrograms: any[] = [];

  // 새 게시글 알림이 ON인 경우에만 조회 (최근 7일)
  if (notificationSettings.new_posts) {
    const { data, error: postsError } = await supabase
      .from("posts")
      .select(
        `
        id,
        title,
        created_at,
        type,
        category,
        user:user_id(id, name, thumbnail)
      `
      )
      .eq("is_visible", true)
      .eq("is_deleted", false)
      .gte("created_at", sevenDaysAgoISO)
      .order("created_at", { ascending: false })
      .limit(limit);

    newPosts = data || [];
    if (postsError) {
      return NextResponse.json({ error: postsError.message }, { status: 500 });
    }
  }

  // 새 프로그램 알림이 ON인 경우에만 조회 (최근 7일)
  if (notificationSettings.new_programs) {
    const { data, error: programsError } = await supabase
      .from("programs")
      .select(
        `
        id,
        title,
        created_at,
        event_date_time,
        location,
        thumbnail_url
      `
      )
      .eq("is_visible", true)
      .eq("is_deleted", false)
      .gte("created_at", sevenDaysAgoISO)
      .order("created_at", { ascending: false })
      .limit(limit);

    newPrograms = data || [];
    if (programsError) {
      return NextResponse.json({ error: programsError.message }, { status: 500 });
    }
  }

  // 사용자가 읽은 알림 조회
  const { data: readNotifications } = await supabase
    .from("notifications_reads")
    .select("notification_id, notification_type")
    .eq("user_id", user.id);

  // notification_type별로 읽은 ID 세트 생성
  const readPostIds = new Set(
    readNotifications
      ?.filter((r) => r.notification_type === "post")
      .map((r) => r.notification_id) || []
  );
  const readProgramIds = new Set(
    readNotifications
      ?.filter((r) => r.notification_type === "program")
      .map((r) => r.notification_id) || []
  );

  // 게시글과 프로그램을 통합하여 알림 형태로 변환
  const newContent = [
    ...(newPosts || []).map((post) => ({
      id: `post-${post.id}`,
      type: "post" as const,
      title: "새 게시글",
      message: `새로운 게시글이 등록되었습니다: "${post.title}"`,
      created_at: post.created_at,
      link: `/community/${post.type}/${post.id}`,
      is_read: readPostIds.has(post.id),
      metadata: {
        post_id: post.id,
        post_title: post.title,
        post_type: post.type,
        post_category: post.category,
        author: post.user,
      },
    })),
    ...(newPrograms || []).map((program) => ({
      id: `program-${program.id}`,
      type: "program" as const,
      title: "새 프로그램",
      message: `새로운 프로그램이 등록되었습니다: "${program.title}"`,
      created_at: program.created_at,
      link: `/program/${program.id}`,
      is_read: readProgramIds.has(program.id),
      metadata: {
        program_id: program.id,
        program_title: program.title,
        event_date_time: program.event_date_time,
        location: program.location,
        thumbnail_url: program.thumbnail_url,
      },
    })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);

  return NextResponse.json({ newContent });
}

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  // 현재 로그인한 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. notifications 테이블에서 읽지 않은 알림 개수 조회
  const { count: notificationCount, error: notificationError } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (notificationError) {
    return NextResponse.json({ error: notificationError.message }, { status: 500 });
  }

  // 2. 사용자의 알림 설정 조회
  const { data: notificationSettings } = await supabase
    .from("notifications_settings")
    .select("new_posts, new_programs")
    .eq("user_id", user.id)
    .single();

  let newContentUnreadCount = 0;

  // 알림 설정이 있고 하나라도 ON이면 새 콘텐츠 확인
  if (notificationSettings && (notificationSettings.new_posts || notificationSettings.new_programs)) {
    // 7일 전 날짜 계산
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoISO = sevenDaysAgo.toISOString();

    // 사용자가 읽은 알림 조회
    const { data: readNotifications } = await supabase
      .from("notifications_reads")
      .select("notification_id, notification_type")
      .eq("user_id", user.id);

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

    // 새 게시글 중 읽지 않은 것 개수
    if (notificationSettings.new_posts) {
      const { data: newPosts } = await supabase
        .from("posts")
        .select("id")
        .eq("is_visible", true)
        .eq("is_deleted", false)
        .gte("created_at", sevenDaysAgoISO);

      const unreadPosts = (newPosts || []).filter(post => !readPostIds.has(post.id));
      newContentUnreadCount += unreadPosts.length;
    }

    // 새 프로그램 중 읽지 않은 것 개수
    if (notificationSettings.new_programs) {
      const { data: newPrograms } = await supabase
        .from("programs")
        .select("id")
        .eq("is_visible", true)
        .eq("is_deleted", false)
        .gte("created_at", sevenDaysAgoISO);

      const unreadPrograms = (newPrograms || []).filter(program => !readProgramIds.has(program.id));
      newContentUnreadCount += unreadPrograms.length;
    }
  }

  const totalUnreadCount = (notificationCount ?? 0) + newContentUnreadCount;

  return NextResponse.json({ 
    hasUnread: totalUnreadCount > 0, 
    count: totalUnreadCount 
  });
}

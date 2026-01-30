import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

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
    .select("*")
    .eq("user_id", user.id)
    .single();

  // URL에서 쿼리 파라미터 가져오기
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  const unreadOnly = searchParams.get("unread_only") === "true";

  // 개인 알림 조회 (user_id가 일치하는 알림)
  const { data: personalNotifications, error: personalError } = await supabase
    .from("notifications")
    .select(
      `
      *,
      author:author_id(id, name, thumbnail),
      memo:memo_id(id, title, content),
      post:post_id(id, title, type, category)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // 시스템 알림 조회 (user_id가 null인 알림, 최근 7일)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { data: systemNotifications, error: systemError } = await supabase
    .from("notifications")
    .select("*")
    .eq("type", "system")
    .is("user_id", null)
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: false });

  if (personalError || systemError) {
    return NextResponse.json(
      { error: personalError?.message || systemError?.message },
      { status: 500 }
    );
  }

  // 개인 알림과 시스템 알림 통합
  const notifications = [...(personalNotifications || []), ...(systemNotifications || [])];

  // 사용자가 읽은 system 알림 조회
  const { data: readNotifications } = await supabase
    .from("notifications_reads")
    .select("notification_id, notification_type")
    .eq("user_id", user.id)
    .eq("notification_type", "system");

  // notification_id는 uuid 타입
  const readSet = new Set(
    readNotifications?.map((r) => r.notification_id) || []
  );

  // 알림 설정에 따라 필터링
  let filteredNotifications = notifications || [];
  
  if (notificationSettings) {
    filteredNotifications = notifications?.filter((notification) => {
      // 메모 댓글
      if (notification.type === "comment" && notification.memo_id) {
        return notificationSettings.memo_comments;
      }
      // 메모 좋아요
      if (notification.type === "like" && notification.memo_id) {
        return notificationSettings.memo_likes;
      }
      // 게시글 댓글
      if (notification.type === "comment" && notification.post_id) {
        return notificationSettings.post_comments;
      }
      // 게시글 좋아요
      if (notification.type === "like" && notification.post_id) {
        return notificationSettings.post_likes;
      }
      // 프로그램 메모 리마인더 (title로 구분)
      if (notification.title?.includes("프로그램") && notification.title?.includes("메모")) {
        return notificationSettings.program_memo_reminder;
      }
      // 기타 알림은 기본적으로 표시
      return true;
    }) || [];
  }

  // 읽음 여부 추가 (id는 uuid이므로 직접 비교)
  const notificationsWithReadStatus = filteredNotifications.map((notification) => ({
    ...notification,
    is_read: readSet.has(notification.id),
  }));

  return NextResponse.json({ notifications: notificationsWithReadStatus });
}

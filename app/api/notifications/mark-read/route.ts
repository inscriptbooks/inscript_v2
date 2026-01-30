import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// 알림 읽음 처리 (notifications_reads 테이블에 레코드 추가)
export async function POST(request: Request) {
  const supabase = await createClient();

  // 현재 로그인한 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { notification_id, notification_type } = body;

    if (!notification_id || !notification_type) {
      return NextResponse.json(
        { error: "notification_id와 notification_type이 필요합니다." },
        { status: 400 }
      );
    }

    // notification_type 검증
    if (!["system", "post", "program"].includes(notification_type)) {
      return NextResponse.json(
        { error: "유효하지 않은 notification_type입니다." },
        { status: 400 }
      );
    }

    // notifications_reads 테이블에 레코드 추가 (중복 시 무시)
    // notification_id는 uuid 타입
    const { error } = await supabase.from("notifications_reads").upsert(
      {
        user_id: user.id,
        notification_id: notification_id, // uuid 그대로 사용
        notification_type,
      },
      {
        onConflict: "user_id,notification_id,notification_type",
        ignoreDuplicates: true,
      }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "읽음 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

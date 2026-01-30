import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// 알림 읽음 처리 (system 알림용)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  // 현재 로그인한 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // notifications 테이블에서 알림 확인
  const { data: notification, error: notificationError } = await supabase
    .from("notifications")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (notificationError || !notification) {
    return NextResponse.json({ error: "알림을 찾을 수 없습니다." }, { status: 404 });
  }

  // notifications_reads 테이블에 레코드 추가 (id는 이제 uuid)
  const { error } = await supabase.from("notifications_reads").upsert(
    {
      user_id: user.id,
      notification_id: id, // uuid 그대로 사용
      notification_type: "system",
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
}

// 알림 삭제
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  // 현재 로그인한 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 알림 삭제
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

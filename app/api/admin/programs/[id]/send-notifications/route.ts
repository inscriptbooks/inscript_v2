import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { title, message } = body;

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { success: false, message: "알림 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    // 현재 로그인한 사용자 정보 가져오기 (운영자)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    // 해당 프로그램의 모든 신청자 user_id 가져오기
    const { data: applications, error: applicationsError } = await supabase
      .from("program_applications")
      .select("user_id")
      .eq("program_id", id);

    if (applicationsError) {
      return NextResponse.json(
        { success: false, message: "신청자 목록 조회 실패" },
        { status: 500 }
      );
    }

    if (!applications || applications.length === 0) {
      return NextResponse.json(
        { success: false, message: "신청자가 없습니다." },
        { status: 400 }
      );
    }

    // 각 신청자에게 알림 전송
    const notificationsToInsert = applications.map((app) => ({
      user_id: app.user_id,
      type: "program",
      title: title || "프로그램 알림",
      message: message.trim(),
      is_read: false,
      author_id: user.id,
    }));

    const { error: insertError } = await supabase
      .from("notifications")
      .insert(notificationsToInsert);

    if (insertError) {
      return NextResponse.json(
        { success: false, message: "알림 전송에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${applications.length}명에게 알림을 전송했습니다.`,
      data: {
        recipientCount: applications.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

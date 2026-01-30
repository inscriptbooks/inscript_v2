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
    const { message } = body;

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { success: false, message: "메시지 내용을 입력해주세요." },
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

    // 각 신청자에게 쪽지 전송
    const notesToInsert = applications.map((app) => ({
      sender_id: user.id,
      receiver_id: app.user_id,
      message: message.trim(),
      is_read: false,
    }));

    const { error: insertError } = await supabase
      .from("notes")
      .insert(notesToInsert);

    if (insertError) {
      return NextResponse.json(
        { success: false, message: "쪽지 전송에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${applications.length}명에게 쪽지를 전송했습니다.`,
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

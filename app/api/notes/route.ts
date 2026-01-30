import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // 현재 로그인한 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    // 받은 쪽지 조회 (sender 정보 포함, 자기 자신이 보낸 쪽지는 제외)
    const { data, error } = await supabase
      .from("notes")
      .select(
        `
        *,
        sender:sender_id (
          id,
          name,
          email,
          thumbnail
        )
      `
      )
      .eq("receiver_id", user.id)
      .neq("sender_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "쪽지 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "쪽지 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { receiver_id, message } = body;

    // 현재 로그인한 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다. 다시 로그인해주세요." },
        { status: 401 }
      );
    }

    // 필수 필드 검증
    if (!receiver_id || !message) {
      return NextResponse.json(
        { error: "수신자와 메시지는 필수입니다." },
        { status: 400 }
      );
    }

    // 메시지 길이 검증
    if (message.trim().length === 0) {
      return NextResponse.json(
        { error: "메시지 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    // 자기 자신에게 쪽지 보내기 방지
    if (user.id === receiver_id) {
      return NextResponse.json(
        { error: "자기 자신에게 쪽지를 보낼 수 없습니다." },
        { status: 400 }
      );
    }

    // 쪽지 생성 (외래키 제약조건이 수신자 존재 여부를 자동으로 검증)
    const { data, error } = await supabase
      .from("notes")
      .insert({
        sender_id: user.id,
        receiver_id,
        message: message.trim(),
      })
      .select()
      .single();

    if (error) {
      // 외래키 제약조건 위반 (존재하지 않는 사용자)
      if (error.code === "23503") {
        return NextResponse.json(
          { error: "존재하지 않는 사용자입니다." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "쪽지 전송에 실패했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "쪽지 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500 }
    );
  }
}

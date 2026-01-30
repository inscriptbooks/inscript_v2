import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, nickname, phone, agreeMarketing } = body;

    // 필수 필드 검증
    if (!email || !password || !nickname || !phone) {
      return NextResponse.json(
        { error: "필수 정보를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 닉네임 중복 검사
    const { data: existing, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("name", nickname)
      .limit(1);

    if (checkError) {
      return NextResponse.json(
        { error: "닉네임 중복 확인 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { error: "이미 사용 중인 닉네임입니다." },
        { status: 400 }
      );
    }

    // Supabase Auth에 사용자 등록
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
          phone,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "회원가입에 실패했습니다." },
        { status: 500 }
      );
    }

    // public.users row는 Supabase Auth 트리거(handle_new_user)가 생성합니다.
    // 알림 기본설정만 생성 (실패해도 회원가입은 성공 처리)
    const { error: settingsError } = await supabase
      .from("notifications_settings")
      .insert({
        user_id: authData.user.id,
        memo_comments: true,
        memo_likes: true,
        new_posts: true,
        post_comments: true,
        post_likes: true,
        new_programs: true,
        program_memo_reminder: true,
      });

    if (settingsError) {
      // no-op
    }

    return NextResponse.json(
      {
        message: "회원가입이 완료되었습니다.",
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

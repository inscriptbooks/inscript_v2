import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "이메일을 입력해주세요" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Supabase의 resetPasswordForEmail 메서드를 사용하여 비밀번호 재설정 이메일 전송
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
    });

    if (error) {
      return NextResponse.json(
        { error: "비밀번호 재설정 메일 전송에 실패했습니다" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "비밀번호 재설정 링크가 이메일로 전송되었습니다" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

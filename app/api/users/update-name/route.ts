import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { name } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "닉네임을 입력해주세요" },
        { status: 400 }
      );
    }

    // 현재 로그인한 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다" },
        { status: 401 }
      );
    }

    // 사용자 정보 조회 (마지막 닉네임 변경 시간 확인)
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("nickname_updated_at")
      .eq("id", user.id)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: "사용자 정보 조회 중 오류가 발생했습니다" },
        { status: 500 }
      );
    }

    // 월 1회 변경 제한 체크
    if (userData?.nickname_updated_at) {
      const lastUpdated = new Date(userData.nickname_updated_at);
      const now = new Date();

      // 마지막 변경일로부터 1개월이 지났는지 확인
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      if (lastUpdated > oneMonthAgo) {
        return NextResponse.json(
          { error: "월 1회까지 변경 가능합니다" },
          { status: 400 }
        );
      }
    }

    // 닉네임 중복 체크 (본인 제외)
    const { data: existing, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("name", name.trim())
      .neq("id", user.id)
      .limit(1);

    if (checkError) {
      return NextResponse.json(
        { error: "중복 확인 중 오류가 발생했습니다" },
        { status: 500 }
      );
    }

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { error: "이미 사용 중인 닉네임입니다" },
        { status: 400 }
      );
    }

    // users 테이블에서 name과 nickname_updated_at 업데이트
    const { error: updateError } = await supabase
      .from("users")
      .update({
        name: name.trim(),
        nickname_updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "닉네임 변경 중 오류가 발생했습니다" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "닉네임이 성공적으로 변경되었습니다" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

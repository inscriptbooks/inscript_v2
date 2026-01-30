import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, category, reason, startDate, endDate } =
      await request.json();
    const supabase = await createClient();

    // penalty 테이블에 데이터 삽입
    const { data, error } = await supabase
      .from("penalty")
      .insert({
        user_id: userId,
        category,
        reason,
        start_date: startDate,
        end_date: endDate,
      })
      .select();

    if (error) {
      return NextResponse.json(
        { error: "제재 정보 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    // users 테이블의 status를 suspended로 업데이트
    const { error: updateError } = await supabase
      .from("users")
      .update({ status: "suspended" })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: "회원 상태 업데이트에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "제재 정보 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}

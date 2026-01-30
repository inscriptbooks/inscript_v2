import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, category, reason, startDate, endDate } =
      await request.json();
    const supabase = await createClient();

    // 현재 사용자의 상태 확인
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("status")
      .eq("id", userId)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: "사용자 정보 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    // blacklist 테이블에 데이터 삽입
    const { data, error } = await supabase
      .from("blacklist")
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
        { error: "블랙리스트 정보 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    // suspended 상태가 아닐 때만 blacklist로 업데이트
    if (userData.status !== "suspended") {
      const { error: updateError } = await supabase
        .from("users")
        .update({ status: "blacklist" })
        .eq("id", userId);

      if (updateError) {
        return NextResponse.json(
          { error: "회원 상태 업데이트에 실패했습니다." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "블랙리스트 정보 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}

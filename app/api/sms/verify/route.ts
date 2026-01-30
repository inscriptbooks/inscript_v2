import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { phone_number, code } = await request.json();

    if (!phone_number || !code) {
      return NextResponse.json(
        { success: false, message: "전화번호와 인증번호가 필요합니다." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 가장 최근의 인증번호 조회
    const { data, error: selectError } = await supabase
      .from("sms")
      .select("*")
      .eq("phone_number", phone_number)
      .eq("code", code)
      .eq("is_verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (selectError || !data) {
      return NextResponse.json(
        { success: false, message: "인증번호가 일치하지 않습니다." },
        { status: 400 }
      );
    }

    // 만료 시간 확인
    const expiryTime = new Date(data.expiry_at).getTime();
    const now = Date.now();

    if (now > expiryTime) {
      return NextResponse.json(
        { success: false, message: "인증번호가 만료되었습니다." },
        { status: 400 }
      );
    }

    // 인증번호 검증 완료 처리
    const { error: updateError } = await supabase
      .from("sms")
      .update({ is_verified: true })
      .eq("id", data.id);

    if (updateError) {
      return NextResponse.json(
        { 
          success: false, 
          message: "인증 처리 중 오류가 발생했습니다.",
          error: updateError.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "인증번호가 확인되었습니다.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

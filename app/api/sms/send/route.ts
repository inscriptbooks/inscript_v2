import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { phone_number } = await request.json();

    if (!phone_number) {
      return NextResponse.json(
        { success: false, message: "전화번호가 필요합니다." },
        { status: 400 }
      );
    }

    // 6자리 인증번호 생성
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // 3분 후 만료 시간 설정
    const expiryAt = new Date(Date.now() + 3 * 60 * 1000);

    const supabase = await createClient();

    // SMS 테이블에 인증번호 저장
    const { error: insertError } = await supabase.from("sms").insert({
      code: verificationCode,
      phone_number: phone_number,
      expiry_at: expiryAt.toISOString(),
    });

    if (insertError) {
      return NextResponse.json(
        {
          success: false,
          message: "인증번호 저장 중 오류가 발생했습니다.",
          error: insertError.message,
        },
        { status: 500 }
      );
    }

    // Supabase Edge Function으로 SMS 발송 요청
    const { data: functionData, error: functionError } = await supabase.functions.invoke(
      "send-sms-ncp",
      {
        body: {
          phone_number: phone_number,
          cert_code: verificationCode,
        },
      }
    );

    if (functionError) {
      return NextResponse.json(
        {
          success: false,
          message: "문자 발송에 실패했습니다.",
          error: functionError.message,
        },
        { status: 500 }
      );
    }

    // Edge Function 응답 확인
    if (functionData?.ok === true) {
      return NextResponse.json({
        success: true,
        message: "인증번호가 발송되었습니다.",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "문자 발송에 실패했습니다.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

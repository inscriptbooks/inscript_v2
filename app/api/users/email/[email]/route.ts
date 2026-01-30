import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const { email } = await params;
  const emailAddress = decodeURIComponent(email || "").trim();

  if (!emailAddress) {
    return NextResponse.json(
      { available: false, error: "이메일을 입력해주세요." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailAddress)) {
    return NextResponse.json(
      { available: false, error: "올바른 이메일 형식이 아닙니다." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", emailAddress)
    .limit(1);

  if (error) {
    return NextResponse.json(
      { available: false, error: "중복 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  const exists = Array.isArray(data) && data.length > 0;

  return NextResponse.json({ available: !exists }, { status: 200 });
}

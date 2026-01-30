import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) {
  const { nickname } = await params;
  const name = decodeURIComponent(nickname || "").trim();

  if (!name || name.length < 2) {
    return NextResponse.json(
      { available: false, error: "닉네임은 2자 이상 입력해주세요." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("name", name)
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

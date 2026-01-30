import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const url = new URL(request.url);
  const playId = String(url.searchParams.get("playId") || "").trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "인증되지 않은 사용자입니다." },
      { status: 401 }
    );
  }

  if (!playId) {
    return NextResponse.json(
      { error: "playId가 필요합니다." },
      { status: 400 }
    );
  }

  // payment_items에 구매 기록이 있는지 확인
  // 환불된 경우 payment_items에서 삭제되므로 재구매 가능
  const { data } = await supabase
    .from("payment_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("play_id", playId)
    .maybeSingle();

  return NextResponse.json({ purchased: !!data });
}

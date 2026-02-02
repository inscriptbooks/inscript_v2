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
      { status: 401 },
    );
  }

  if (!playId) {
    return NextResponse.json(
      { error: "playId가 필요합니다." },
      { status: 400 },
    );
  }

  // payment_items에 구매 기록이 있는지 확인
  // 환불된 경우 payment_items에서 삭제되므로 재구매 가능
  // 14일 지난 경우에도 재구매 가능 (약관 제3조)
  const { data } = await supabase
    .from("payment_items")
    .select("id, order_id")
    .eq("user_id", user.id)
    .eq("play_id", playId)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ purchased: false });
  }

  // 14일(2주) 경과 여부 확인
  const { data: paymentData } = await supabase
    .from("payments")
    .select("approved_at, created_at")
    .eq("order_id", data.order_id)
    .eq("user_id", user.id)
    .single();

  if (paymentData) {
    const purchaseDate = paymentData.approved_at || paymentData.created_at;
    if (purchaseDate) {
      const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
      const purchaseTime = new Date(purchaseDate).getTime();
      const now = Date.now();
      if (now - purchaseTime > FOURTEEN_DAYS_MS) {
        // 14일 지났으면 재구매 가능
        return NextResponse.json({ purchased: false });
      }
    }
  }

  return NextResponse.json({ purchased: true });
}

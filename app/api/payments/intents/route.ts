import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "인증되지 않은 사용자입니다." },
      { status: 401 }
    );
  }

  let body: any = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문을 읽을 수 없습니다." },
      { status: 400 }
    );
  }

  const orderId = String(body?.orderId || "").trim();
  const playIdsRaw = Array.isArray(body?.playIds) ? body.playIds : [];
  const amount = Number(body?.amount);
  const agreeRefundTerms = Boolean(body?.agreeRefundTerms);

  if (!orderId || !Number.isFinite(amount) || !playIdsRaw.length) {
    return NextResponse.json(
      { error: "요청 값이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  const playIds = Array.from(
    new Set(
      playIdsRaw.map((v: any) => String(v)).filter((v: string) => v.length > 0)
    )
  );

  const { error } = await supabase.from("payment_intents").upsert(
    [
      {
        order_id: orderId,
        user_id: user.id,
        play_ids: playIds,
        amount: amount,
        agree_refund_terms: agreeRefundTerms,
      },
    ],
    { onConflict: "order_id" }
  );

  if (error) {
    return NextResponse.json(
      { error: "결제 준비에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

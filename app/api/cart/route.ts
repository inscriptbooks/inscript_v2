import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/cart - 현재 사용자 장바구니 목록
export async function GET(_request: NextRequest) {
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

  const { data, error } = await supabase
    .from("cart_items")
    .select("id, play_id, title, author, price, created_at, selected")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "장바구니를 불러오지 못했습니다." },
      { status: 500 }
    );
  }

  const cartItems = data || [];

  // 구매한 희곡 중 다운로드 기간이 만료되지 않은 것만 필터링
  // 환불된 항목: is_refunded = true인 경우 재구매 가능하므로 제외
  const { data: paidRows } = await supabase
    .from("payment_items")
    .select("play_id, order_id, is_refunded")
    .eq("user_id", user.id)
    .or("is_refunded.is.null,is_refunded.eq.false");

  // 구매일시 조회를 위해 order_id 수집
  const orderIds = Array.from(
    new Set((paidRows || []).map((r: any) => r.order_id))
  );

  let validPaidPlayIds = new Set<string>();

  if (orderIds.length > 0) {
    const { data: paymentRows } = await supabase
      .from("payments")
      .select("order_id, approved_at, created_at")
      .in("order_id", orderIds);

    const orderDateMap = new Map<string, Date>();
    (paymentRows || []).forEach((p: any) => {
      const date = new Date(p.approved_at || p.created_at);
      orderDateMap.set(p.order_id, date);
    });

    const now = new Date();
    const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;

    // 다운로드 기간이 만료되지 않은 희곡만 필터링 대상
    (paidRows || []).forEach((r: any) => {
      const purchaseDate = orderDateMap.get(r.order_id);
      if (purchaseDate) {
        const isExpired = now.getTime() - purchaseDate.getTime() > twoWeeksInMs;
        if (!isExpired) {
          validPaidPlayIds.add(String(r.play_id));
        }
      }
    });
  }

  let filtered = cartItems.filter(
    (it: any) => !validPaidPlayIds.has(String(it.play_id))
  );

  // 과거 결제로 payment_items가 비어있는 경우 대비: payments.order_name 기반 보정 필터
  const { data: payRows } = await supabase
    .from("payments")
    .select("order_name")
    .eq("user_id", user.id);

  if (Array.isArray(payRows) && payRows.length) {
    const exactTitles = new Set<string>();
    const baseTitles = new Set<string>();
    for (const pr of payRows) {
      const name = String(pr.order_name || "").trim();
      if (!name) continue;
      exactTitles.add(name);
      const idx = name.indexOf(" 외 ");
      if (idx > 0) baseTitles.add(name.slice(0, idx));
    }
    filtered = filtered.filter((it: any) => {
      const t = String(it.title || "").trim();
      if (!t) return true;
      if (exactTitles.has(t)) return false;
      if (baseTitles.has(t)) return false;
      return true;
    });
  }

  return NextResponse.json({ success: true, items: filtered });
}

// POST /api/cart - 장바구니에 아이템 추가
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

  const body = await request.json();
  const { playId, title, author, price } = body || {};

  if (!playId || !title || !author || typeof price !== "number") {
    return NextResponse.json(
      { error: "요청 값이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  // 구매 이력 확인: payment_items에 있으면 구매한 것으로 판단
  // 환불된 항목: is_refunded = true인 경우 재구매 가능
  // 다운로드 기간 만료(2주 경과) 시 재구매 가능
  const { data: purchasedRow } = await supabase
    .from("payment_items")
    .select("id, order_id, is_refunded")
    .eq("user_id", user.id)
    .eq("play_id", String(playId))
    .maybeSingle();

  // 환불된 항목: 재구매 가능하므로 체크 스킵
  if (purchasedRow && (purchasedRow as any).is_refunded !== true) {
    // 구매일시 확인을 위해 payments 테이블 조회
    const { data: paymentRow } = await supabase
      .from("payments")
      .select("approved_at, created_at")
      .eq("order_id", purchasedRow.order_id)
      .maybeSingle();

    if (paymentRow) {
      const purchaseDate = new Date(
        paymentRow.approved_at || paymentRow.created_at
      );
      const now = new Date();
      const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;
      const isExpired = now.getTime() - purchaseDate.getTime() > twoWeeksInMs;

      // 다운로드 기간이 만료되지 않았으면 재구매 불가
      if (!isExpired) {
        return NextResponse.json(
          { error: "이미 구매한 희곡입니다." },
          { status: 409 }
        );
      }
      // 만료된 경우 재구매 가능하므로 계속 진행
    } else {
      // payments 정보가 없으면 안전하게 재구매 불가 처리
      return NextResponse.json(
        { error: "이미 구매한 희곡입니다." },
        { status: 409 }
      );
    }
  }

  // Prevent duplicate add: if same play already exists for this user, return 409
  const { data: existing, error: existingError } = await supabase
    .from("cart_items")
    .select("id")
    .eq("play_id", String(playId))
    .limit(1);

  if (!existingError && Array.isArray(existing) && existing.length > 0) {
    return NextResponse.json(
      { error: "이미 담긴 희곡입니다." },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      user_id: user.id,
      play_id: String(playId),
      title: String(title),
      author: String(author),
      price: Math.max(0, Number(price)),
    })
    .select("id, play_id, title, author, price, created_at, selected")
    .single();

  if (error) {
    const code = (error as any)?.code;
    if (code === "23505") {
      return NextResponse.json(
        { error: "이미 담긴 희곡입니다." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "장바구니에 추가하지 못했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, item: data });
}

// DELETE /api/cart - 선택된 아이템 삭제 (body: { ids: string[] })
export async function DELETE(request: NextRequest) {
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

  const body = await request.json();
  const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];

  if (!ids.length) {
    return NextResponse.json(
      { error: "삭제할 항목이 없습니다." },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("cart_items").delete().in("id", ids);

  if (error) {
    return NextResponse.json(
      { error: "장바구니 항목 삭제에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

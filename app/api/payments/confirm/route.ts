import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PaymentRow } from "@/app/api/payments/types";

async function finalizeOrder(userId: string, orderId: string) {
  const supabase = await createClient();
  const { data: intent } = await supabase
    .from("payment_intents")
    .select("play_ids, amount")
    .eq("order_id", orderId)
    .eq("user_id", userId)
    .maybeSingle();
  const playIds: string[] = Array.isArray(intent?.play_ids)
    ? (intent?.play_ids as string[])
    : [];
  if (!playIds.length) {
    return;
  }
  const { data: cartRows } = await supabase
    .from("cart_items")
    .select("id, play_id, price, title, author")
    .eq("user_id", userId)
    .in("play_id", playIds);

  // plays 테이블에서 가격, 제목, 작가 정보 조회 (authors 테이블 조인)
  const { data: playRows } = await supabase
    .from("plays")
    .select("id, title, price, author_id, authors(author_name)")
    .in("id", playIds);
  const priceMap = new Map<string, number>();
  const titleMap = new Map<string, string>();
  const authorMap = new Map<string, string>();

  // plays 테이블에서 가격, 제목, 작가 정보 설정
  for (const pr of playRows || []) {
    const pid = String(pr.id);
    if ((pr as any).price) priceMap.set(pid, Number((pr as any).price));
    if ((pr as any).title) titleMap.set(pid, String((pr as any).title));
    // authors 테이블에서 조인한 작가명 설정
    const authorName = (pr as any).authors?.author_name;
    if (authorName) authorMap.set(pid, String(authorName));
  }

  // cart_items가 있으면 우선 사용 (author 정보 포함)
  for (const r of cartRows || []) {
    if (r.title) titleMap.set(String(r.play_id), String(r.title));
    if (r.author) authorMap.set(String(r.play_id), String(r.author));
    // cart_items의 price가 있으면 우선 사용
    if (r.price) priceMap.set(String(r.play_id), Number(r.price));
  }
  const items = playIds.map((pid) => ({
    order_id: orderId,
    user_id: userId,
    play_id: String(pid),
    price: priceMap.get(String(pid)) || 0,
    title: titleMap.get(String(pid)) || null,
    author: authorMap.get(String(pid)) || null,
  }));
  if (items.length) {
    await supabase
      .from("payment_items")
      .upsert(items, { onConflict: "user_id,play_id,order_id" });
    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .in("play_id", playIds);
  }
}

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

  const paymentKey = String(body?.paymentKey || "").trim();
  const orderId = String(body?.orderId || "").trim();
  const amount = Number(body?.amount);

  if (!paymentKey || !orderId || !Number.isFinite(amount)) {
    return NextResponse.json(
      { error: "요청 값이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "결제 설정이 완료되지 않았습니다. (secretKey)" },
      { status: 500 }
    );
  }
  // 1) 이미 저장된 결제면 그대로 반환 (멱등)
  const { data: existing } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await finalizeOrder(user.id, orderId);
    return NextResponse.json({ success: true, payment: existing });
  }

  // 2) 토스 결제 승인
  const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
  const confirmRes = await fetch(
    "https://api.tosspayments.com/v1/payments/confirm",
    {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
      cache: "no-store",
    }
  );

  const confirmData: any = await confirmRes.json().catch(() => ({}));
  if (!confirmRes.ok) {
    const message =
      (confirmData as any)?.message || "결제 승인에 실패했습니다.";
    const code = (confirmData as any)?.code;
    return NextResponse.json({ error: message, code }, { status: 400 });
  }

  // 3) DB 저장
  const { data: intent } = await supabase
    .from("payment_intents")
    .select("agree_refund_terms")
    .eq("order_id", orderId)
    .maybeSingle();

  const toInsert: Omit<PaymentRow, "id" | "created_at" | "updated_at"> = {
    user_id: user.id,
    order_id: orderId,
    payment_key: paymentKey,
    status: String(confirmData?.status || "PAID"),
    amount:
      typeof confirmData?.totalAmount === "number"
        ? confirmData.totalAmount
        : amount,
    order_name: confirmData?.orderName ?? null,
    method: (confirmData?.method || confirmData?.paymentMethod) ?? null,
    approved_at: confirmData?.approvedAt
      ? new Date(confirmData.approvedAt).toISOString()
      : null,
    card_company: confirmData?.card?.company ?? null,
    card_number_masked: confirmData?.card?.number ?? null,
    receipt_url: confirmData?.receipt?.url ?? null,
    raw: confirmData ?? {},
    agree_refund_terms: !!intent?.agree_refund_terms,
  };

  const { data: inserted, error: insertError } = await supabase
    .from("payments")
    .insert(toInsert)
    .select("*")
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "결제 정보 저장에 실패했습니다." },
      { status: 500 }
    );
  }

  await finalizeOrder(user.id, orderId);
  return NextResponse.json({ success: true, payment: inserted });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const url = new URL(request.url);
  const paymentKey = String(url.searchParams.get("paymentKey") || "").trim();
  const orderId = String(url.searchParams.get("orderId") || "").trim();
  const amount = Number(url.searchParams.get("amount"));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fail = (message: string, code?: string) =>
    NextResponse.redirect(
      new URL(
        `/play/checkout/fail?message=${encodeURIComponent(message)}${
          code ? `&code=${encodeURIComponent(code)}` : ""
        }`,
        url.origin
      )
    );

  if (!user) {
    return fail("인증되지 않은 사용자입니다.");
  }

  if (!paymentKey || !orderId || !Number.isFinite(amount)) {
    return fail("결제 정보가 올바르지 않습니다.");
  }

  // 멱등 처리: 이미 있으면 바로 성공 리다이렉트
  const { data: existing } = await supabase
    .from("payments")
    .select("id")
    .eq("order_id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) {
    await finalizeOrder(user.id, orderId);
    return NextResponse.redirect(
      new URL(
        `/play/checkout/success?orderId=${encodeURIComponent(orderId)}`,
        url.origin
      )
    );
  }

  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    return fail("결제 설정이 완료되지 않았습니다. (secretKey)");
  }

  const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
  const res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
    cache: "no-store",
  });

  const data: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data as any)?.message || "결제 승인에 실패했습니다.";
    const code = (data as any)?.code;
    return fail(message, code);
  }

  const { data: data_intent } = await supabase
    .from("payment_intents")
    .select("agree_refund_terms")
    .eq("order_id", orderId)
    .maybeSingle();

  const toInsert: Omit<PaymentRow, "id" | "created_at" | "updated_at"> = {
    user_id: user.id,
    order_id: orderId,
    payment_key: paymentKey,
    status: String(data?.status || "PAID"),
    amount: typeof data?.totalAmount === "number" ? data.totalAmount : amount,
    order_name: data?.orderName ?? null,
    method: (data?.method || data?.paymentMethod) ?? null,
    approved_at: data?.approvedAt
      ? new Date(data.approvedAt).toISOString()
      : null,
    card_company: data?.card?.company ?? null,
    card_number_masked: data?.card?.number ?? null,
    receipt_url: data?.receipt?.url ?? null,
    raw: data ?? {},
    agree_refund_terms: !!data_intent?.agree_refund_terms,
  };

  const { error } = await supabase.from("payments").insert(toInsert);
  if (error) {
    return fail("결제 정보 저장에 실패했습니다.");
  }

  await finalizeOrder(user.id, orderId);
  return NextResponse.redirect(
    new URL(
      `/play/checkout/success?orderId=${encodeURIComponent(orderId)}`,
      url.origin
    )
  );
}

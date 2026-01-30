import { NextResponse, NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const body = await request.json();
    const { userId, playId, orderId } = body;

    if (!userId || !playId || !orderId) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 구매 항목 확인
    const { data: purchaseItem, error: purchaseError } = await supabase
      .from("payment_items")
      .select("*")
      .eq("user_id", userId)
      .eq("play_id", playId)
      .eq("order_id", orderId)
      .single();

    if (purchaseError || !purchaseItem) {
      return NextResponse.json(
        { error: "구매 내역을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 결제 정보 조회
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("payment_key, amount, status, raw")
      .eq("order_id", orderId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: "결제 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 토스페이먼츠 결제 취소 API 호출
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "결제 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
    const cancelReason = `관리자 환불 처리 - ${purchaseItem.title}`;

    // 부분 취소: 해당 희곡의 가격만큼만 취소
    // payment_items.price가 0이면 payments.amount 사용
    const cancelAmount =
      purchaseItem.price && purchaseItem.price > 0
        ? purchaseItem.price
        : payment.amount;

    // 토스페이먼츠 API에서 최신 결제 정보 조회
    const paymentInfoRes = await fetch(
      `https://api.tosspayments.com/v1/payments/${payment.payment_key}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
        },
        cache: "no-store",
      }
    );

    let cancelableAmount = payment.amount ?? 0;
    if (paymentInfoRes.ok) {
      const paymentInfo: any = await paymentInfoRes.json().catch(() => ({}));
      cancelableAmount = paymentInfo?.cancelableAmount ?? payment.amount ?? 0;
    }

    if (cancelAmount > cancelableAmount) {
      return NextResponse.json(
        {
          error: `취소 가능한 금액(${cancelableAmount}원)보다 요청 금액(${cancelAmount}원)이 큽니다.`,
          code: "NOT_CANCELABLE_AMOUNT",
        },
        { status: 400 }
      );
    }

    const cancelRes = await fetch(
      `https://api.tosspayments.com/v1/payments/${payment.payment_key}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancelReason,
          cancelAmount,
        }),
        cache: "no-store",
      }
    );

    const cancelData: any = await cancelRes.json().catch(() => ({}));

    if (!cancelRes.ok) {
      const message =
        cancelData?.message || "토스페이먼츠 결제 취소에 실패했습니다.";
      return NextResponse.json(
        { error: message, code: cancelData?.code },
        { status: 400 }
      );
    }

    // DB에서 구매 항목 삭제
    const { error: deleteError } = await supabase
      .from("payment_items")
      .delete()
      .eq("user_id", userId)
      .eq("play_id", playId)
      .eq("order_id", orderId);

    if (deleteError) {
      return NextResponse.json(
        { error: "구매 항목 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    // 다운로드 이력도 삭제 (있다면)
    await supabase
      .from("play_downloads")
      .delete()
      .eq("user_id", userId)
      .eq("play_id", playId)
      .eq("order_id", orderId);

    // payments 테이블의 status 업데이트 (취소된 경우)
    if (cancelData?.status) {
      await supabase
        .from("payments")
        .update({
          status: cancelData.status,
          raw: cancelData,
        })
        .eq("order_id", orderId);
    }

    return NextResponse.json({
      success: true,
      message: "환불 처리가 완료되었습니다.",
      cancelData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "환불 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

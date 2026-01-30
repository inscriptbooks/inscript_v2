import { NextResponse, NextRequest } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { formatKoreanDateTime, formatKoreanDate } from "@/lib/utils/date";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceClient();

    // 회원 정보 조회
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select(
        "id, name, email, phone, auth_provider, created_at, last_login, status, admin_memo"
      )
      .eq("id", id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: "회원을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 작가 정보 확인
    const { data: authorData } = await supabase
      .from("authors")
      .select("id, name, major_work")
      .eq("id", id)
      .single();

    // 작가 신청 정보 조회 (writer_applications - 레거시)
    const { data: writerApplicationData } = await supabase
      .from("writer_applications")
      .select("id, author_name, major_work, document_url, created_at, status")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // 작가 신청 정보 조회 (author_applications - 실제 테이블)
    const { data: authorApplicationData } = await supabase
      .from("author_applications")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // 제재 이력 조회 (penalty 테이블)
    const { data: penaltyData } = await supabase
      .from("penalty")
      .select("id, category, reason, start_date, end_date, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    // 블랙리스트 이력 조회 (blacklist 테이블)
    const { data: blacklistData } = await supabase
      .from("blacklist")
      .select("id, category, reason, start_date, end_date, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    // 응답 데이터 포맧팅
    const signupMethodMap: Record<string, string> = {
      local: "이메일",
      google: "구글",
      kakao: "카카오",
    };

    const statusMap: Record<string, string> = {
      active: "normal",
      suspended: "suspended",
      blacklist: "blacklist",
    };

    const memberData = {
      id: userData.id,
      email: userData.email || "-",
      nickname: userData.name || "-",
      signupMethod:
        signupMethodMap[userData.auth_provider || ""] ||
        userData.auth_provider ||
        "-",
      memberType: authorData ? "작가" : "일반",
      status: statusMap[userData.status] || "normal",
      lastLogin: formatKoreanDateTime(userData.last_login),
      joinDate: formatKoreanDateTime(userData.created_at),
      adminMemo: userData.admin_memo || "",
      phone: userData.phone || "-",
    };

    const writerApplication = writerApplicationData
      ? {
          writerName: writerApplicationData.author_name || "-",
          majorWork: writerApplicationData.major_work || "-",
          document: writerApplicationData.document_url || "-",
          applicationDate: formatKoreanDateTime(
            writerApplicationData.created_at
          ),
          status: writerApplicationData.status || "pending",
        }
      : null;

    const authorApplication = authorApplicationData
      ? {
          id: authorApplicationData.id,
          authorName: authorApplicationData.author_name || "-",
          representativeWork: authorApplicationData.representative_work || "-",
          verificationFileUrl:
            authorApplicationData.verification_file_url || "-",
          keyword: authorApplicationData.keyword || [],
          introduction: authorApplicationData.introduction || "-",
          status: authorApplicationData.status || "pending",
          rejectionReason: authorApplicationData.rejection_reason,
          createdAt: formatKoreanDateTime(authorApplicationData.created_at),
          updatedAt: formatKoreanDateTime(authorApplicationData.updated_at),
          reviewedAt: authorApplicationData.reviewed_at
            ? formatKoreanDateTime(authorApplicationData.reviewed_at)
            : null,
        }
      : null;

    // penalty와 blacklist 데이터 병합
    const penaltyHistory = (penaltyData || []).map((penalty) => ({
      type: "활동정지" as const,
      category: penalty.category || "-",
      reason: penalty.reason || "-",
      startDate: formatKoreanDate(penalty.start_date),
      endDate: formatKoreanDate(penalty.end_date),
      date: formatKoreanDate(penalty.created_at),
      createdAt: penalty.created_at,
    }));

    const blacklistHistory = (blacklistData || []).map((blacklist) => ({
      type: "블랙리스트" as const,
      category: blacklist.category || "-",
      reason: blacklist.reason || "-",
      startDate: formatKoreanDate(blacklist.start_date),
      endDate: formatKoreanDate(blacklist.end_date),
      date: formatKoreanDate(blacklist.created_at),
      createdAt: blacklist.created_at,
    }));

    // 두 배열을 병합하고 생성일 기준으로 정렬
    const combinedHistory = [...penaltyHistory, ...blacklistHistory].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // NO 번호 추가 및 createdAt 제거
    const sanctionHistory = combinedHistory.map((item, index) => {
      const { createdAt, ...rest } = item;
      return {
        no: index + 1,
        ...rest,
      };
    });

    // 희곡 구매 이력 조회
    const { data: paymentItems, error: paymentItemsError } = await supabase
      .from("payment_items")
      .select("order_id, play_id, price, title, author, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    // 다운로드 이력 조회
    const { data: downloadData } = await supabase
      .from("play_downloads")
      .select("play_id, order_id")
      .eq("user_id", id);

    const downloadMap = new Map<string, boolean>();
    (downloadData || []).forEach((d) => {
      downloadMap.set(`${d.order_id}_${d.play_id}`, true);
    });

    // payments 테이블에서 amount 조회 (price가 0원일 때 보정용)
    const orderIds = Array.from(
      new Set((paymentItems || []).map((item) => item.order_id))
    );

    const paymentAmountMap = new Map<string, number>();
    if (orderIds.length > 0) {
      const { data: paymentsData } = await supabase
        .from("payments")
        .select("order_id, amount")
        .in("order_id", orderIds);

      (paymentsData || []).forEach((p) => {
        if (p.amount) paymentAmountMap.set(p.order_id, Number(p.amount));
      });
    }

    // 구매 이력과 결제 정보 병합
    const purchaseHistory = (paymentItems || []).map((item, index) => {
      const itemPrice = item.price || 0;
      const paymentAmount = paymentAmountMap.get(item.order_id) || 0;
      const finalPrice = itemPrice > 0 ? itemPrice : paymentAmount;

      return {
        no: index + 1,
        purchaseDate: formatKoreanDateTime(item.created_at),
        playTitle: item.title || "-",
        author: item.author || "-",
        price: finalPrice,
        isDownloaded:
          downloadMap.has(`${item.order_id}_${item.play_id}`) || false,
        orderId: item.order_id,
        playId: item.play_id,
      };
    });

    return NextResponse.json({
      memberData,
      writerApplication,
      authorApplication,
      sanctionHistory,
      purchaseHistory,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "회원 정보 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

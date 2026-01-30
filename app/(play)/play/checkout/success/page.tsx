"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader, ConfirmDialog } from "@/components/common";
import { formatKoreanDate } from "@/lib/utils/date";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import type { PaymentRow } from "@/app/api/payments/types";
import PurchaseDownloadList, {
  type PurchaseDownloadItem,
} from "@/components/common/PurchaseDownloadList";

interface PurchaseInfo {
  title: string;
  author: string;
  purchaseDate: string;
  price: number;
  playId?: string;
}

function PurchaseSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [downloadItems, setDownloadItems] = useState<
    PurchaseDownloadItem[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PurchaseDownloadItem | null>(
    null
  );

  useEffect(() => {
    const loadPayment = async () => {
      const orderId = searchParams.get("orderId");
      if (!orderId) {
        showErrorToast("결제 정보가 올바르지 않습니다.");
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      // 클라이언트 세션 준비를 보장 (리다이렉트 직후 세션 로딩 지연 대비)
      await supabase.auth.getSession();

      // 결제 레코드가 반영되기까지 짧은 지연이 있을 수 있어, 짧게 재시도
      let fetched: PaymentRow | null = null;
      for (let i = 0; i < 5; i += 1) {
        const { data } = await supabase
          .from("payments")
          .select("*")
          .eq("order_id", orderId)
          .maybeSingle();
        if (data) {
          fetched = data as PaymentRow;
          break;
        }
        await new Promise((r) => setTimeout(r, 300));
      }

      if (!fetched) {
        showErrorToast("결제 정보를 불러오지 못했습니다.");
        router.push(
          "/play/checkout/fail?message=" +
            encodeURIComponent("결제 정보를 불러오지 못했습니다.")
        );
        return;
      }

      const p = fetched as PaymentRow;
      const purchaseDate = formatKoreanDate(p.approved_at || p.created_at);

      // 주문에 속한 개별 항목을 조회 (payment_items → plays 조인)
      const { data: itemRows } = await supabase
        .from("payment_items")
        .select("play_id, price, title, author")
        .eq("order_id", orderId);

      // 다운로드 이력 조회
      const { data: downloadData } = await supabase
        .from("play_downloads")
        .select("play_id, order_id")
        .eq("order_id", orderId);

      const downloadMap = new Map<string, boolean>();
      (downloadData || []).forEach((d) => {
        downloadMap.set(`${d.order_id}_${d.play_id}`, true);
      });

      let items: PurchaseDownloadItem[] = [];
      const ids = (itemRows || []).map((r: any) => String(r.play_id));
      if (ids.length > 0) {
        // plays 테이블에서 title과 price 조회
        const { data: playRows } = await supabase
          .from("plays")
          .select("id, title, price")
          .in("id", ids);
        const playMap = new Map<string, { title?: string; price?: number }>();
        for (const pr of playRows || []) {
          playMap.set(String(pr.id), {
            title: (pr as any).title as string | undefined,
            price: (pr as any).price as number | undefined,
          });
        }
        items = (itemRows || []).map((row: any) => {
          const pid = String(row.play_id);
          const meta = playMap.get(pid);
          // payment_items.price가 0이면 plays.price 사용
          const itemPrice = Number(row.price) || 0;
          const finalPrice = itemPrice > 0 ? itemPrice : meta?.price || 0;
          return {
            id: `${orderId}_${pid}`,
            playId: pid,
            playTitle: String(
              row.title || meta?.title || p.order_name || "주문 상품"
            ),
            author: String(row.author || ""),
            purchaseDate,
            purchasedAt: p.approved_at || p.created_at,
            price: finalPrice,
            isDownloaded: downloadMap.has(`${orderId}_${pid}`) || false,
            orderId: orderId,
          };
        });
      } else {
        // 보정: payment_items가 없으면 결제 레코드 기반 단일 항목으로 표시
        items = [
          {
            id: `order_${orderId}`,
            playId: "",
            playTitle: p.order_name || "주문 상품",
            author: "",
            purchaseDate,
            purchasedAt: p.approved_at || p.created_at,
            price: p.amount,
            isDownloaded: false,
            orderId: orderId,
          },
        ];
      }

      setDownloadItems(items);
      showSuccessToast("결제가 완료되었습니다.");
      setIsLoading(false);
    };

    loadPayment();
  }, [searchParams, router]);

  const handleDownloadClick = (item: PurchaseDownloadItem) => {
    if (item.isDownloaded) {
      handleDownload(item);
    } else {
      setSelectedItem(item);
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirmDownload = async () => {
    if (!selectedItem) return;

    setConfirmDialogOpen(false);
    await handleDownload(selectedItem);
  };

  const handleDownload = async (item: PurchaseDownloadItem) => {
    try {
      setDownloadingId(item.id);

      const response = await fetch("/api/purchases/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playId: item.playId,
          orderId: item.orderId,
        }),
      });

      if (!response.ok) {
        showErrorToast("다운로드 중 오류가 발생했습니다.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${item.playTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccessToast(`${item.playTitle} 다운로드를 시작합니다.`);

      setDownloadItems((prev) =>
        (prev || []).map((p) =>
          p.id === item.id ? { ...p, isDownloaded: true } : p
        )
      );
    } catch (_e) {
      showErrorToast("다운로드 중 오류가 발생했습니다.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(250,248,246,0.8)]">
        <Loader size="md" />
      </div>
    );
  }

  if (!downloadItems) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <p className="font-pretendard text-base text-gray-2">
          구매 정보를 불러올 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1 flex-col">
      {/* Title Section */}
      <div className="full-bleed flex items-start justify-center border-b border-primary px-[20px] pb-5 pt-10 lg:px-[120px] lg:pb-5 lg:pt-20">
        <h1 className="font-serif text-[28px] font-bold leading-8 text-primary">
          희곡 구매하기
        </h1>
      </div>

      {/* Main Content */}
      <div className="mx-auto flex w-full max-w-[600px] flex-col gap-7 px-[20px] py-[72px]">
        {/* Heading and Description */}
        <div className="flex flex-col items-start justify-center gap-[10px]">
          <h2 className="font-pretendard text-[20px] font-semibold leading-6 text-gray-1">
            희곡 다운로드하기
          </h2>
          <p className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
            결제한 희곡은 2주 안에 '마이페이지 &gt; 구매내역' 에서 다시 다운로드
            하실 수 있습니다.
          </p>
        </div>

        {/* Purchase Details List (공통 컴포넌트) */}
        <PurchaseDownloadList
          items={downloadItems}
          onDownload={handleDownloadClick}
          downloadingId={downloadingId}
        />
      </div>

      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmDownload}
        title="다운로드 확인"
        message="다운로드 시 환불이 불가합니다. 계속하시겠습니까?"
        confirmText="확인"
        cancelText="취소"
      />
    </div>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(250,248,246,0.8)]">
          <Loader size="md" />
        </div>
      }
    >
      <PurchaseSuccessContent />
    </Suspense>
  );
}

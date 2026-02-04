"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, ConfirmDialog } from "@/components/common";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import type { PurchaseItem } from "../types";
import PurchaseDownloadList, {
  type PurchaseDownloadItem,
} from "@/components/common/PurchaseDownloadList";

interface PurchaseListProps {
  initialPurchases: PurchaseItem[];
}

export default function PurchaseList({ initialPurchases }: PurchaseListProps) {
  const [purchases, setPurchases] = useState<PurchaseItem[]>(
    initialPurchases || [],
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(
    null,
  );

  const handleDownloadClick = (purchase: PurchaseItem) => {
    if (purchase.isDownloaded) {
      handleDownload(purchase);
    } else {
      setSelectedPurchase(purchase);
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirmDownload = async () => {
    if (!selectedPurchase) return;

    setConfirmDialogOpen(false);
    await handleDownload(selectedPurchase);
  };

  const handleDownload = async (purchase: PurchaseItem) => {
    try {
      setDownloadingId(purchase.id);

      const response = await fetch("/api/purchases/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playId: purchase.playId,
          orderId: purchase.orderId,
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
      link.download = `${purchase.playTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccessToast(`${purchase.playTitle} 다운로드를 시작합니다.`);

      setPurchases((prev) =>
        prev.map((p) =>
          p.id === purchase.id ? { ...p, isDownloaded: true } : p,
        ),
      );
    } catch (_e) {
      showErrorToast("다운로드 중 오류가 발생했습니다.");
    } finally {
      setDownloadingId(null);
    }
  };

  const mapped: PurchaseDownloadItem[] = (purchases || []).map((p) => ({
    id: p.id,
    playId: p.playId,
    playTitle: p.playTitle,
    author: p.author,
    purchaseDate: p.purchaseDate,
    purchasedAt: p.purchasedAt,
    price: p.price,
    isDownloaded: p.isDownloaded,
    orderId: p.orderId,
    isRefunded: p.isRefunded,
  }));

  const handleDownloadCommon = async (item: PurchaseDownloadItem) => {
    return handleDownloadClick({
      id: item.id,
      playId: item.playId,
      playTitle: item.playTitle,
      author: item.author || "",
      purchaseDate: item.purchaseDate,
      price: item.price,
      isDownloaded: item.isDownloaded,
      orderId: item.orderId,
    });
  };

  if (!purchases || purchases.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-[600px] flex-col gap-8 py-10">
        <h2 className="font-pretendard text-lg font-semibold leading-6 text-gray-1 lg:text-xl">
          구매 내역
        </h2>
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
          <p className="font-pretendard text-base text-gray-3">
            구매한 희곡이 없습니다.
          </p>
          <Button
            onClick={() => (window.location.href = "/play")}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            희곡 둘러보기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-col gap-7">
      <div className="flex flex-col items-start justify-center gap-[10px]">
        <h1 className="font-pretendard text-[20px] font-semibold leading-6 text-gray-1">
          구매 목록
        </h1>
        <p className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
          구매한 희곡은 2주 안에 다운로드 하실 수 있습니다.
        </p>
      </div>

      <PurchaseDownloadList
        items={mapped}
        onDownload={handleDownloadCommon}
        downloadingId={downloadingId}
      />

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

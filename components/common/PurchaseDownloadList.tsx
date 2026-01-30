"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common";

export interface PurchaseDownloadItem {
  id: string;
  playId: string;
  playTitle: string;
  author?: string;
  purchaseDate: string;
  purchasedAt?: string; // ISO 날짜 문자열
  price: number;
  isDownloaded?: boolean;
  orderId?: string;
}

interface PurchaseDownloadListProps {
  items: PurchaseDownloadItem[];
  onDownload: (item: PurchaseDownloadItem) => void;
  downloadingId?: string | null;
}

export default function PurchaseDownloadList({
  items,
  onDownload,
  downloadingId,
}: PurchaseDownloadListProps) {
  // 다운로드 기간 만료 여부 확인 (구매 후 2주)
  const isDownloadExpired = (purchasedAt?: string): boolean => {
    if (!purchasedAt) return false;

    const purchaseDate = new Date(purchasedAt);
    const now = new Date();
    const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;

    return now.getTime() - purchaseDate.getTime() > twoWeeksInMs;
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-start gap-[18px]">
      {items.map((purchase) => (
        <div
          key={purchase.id}
          className="flex w-full items-end justify-between gap-4 rounded bg-gray-7 px-6 py-4"
        >
          <div className="flex flex-1 flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="font-pretendard text-base font-semibold leading-[150%] text-gray-3">
                {purchase.playTitle}
                {purchase.author ? ` - ${purchase.author}` : ""}
              </span>
              {purchase.isDownloaded && (
                <span className="font-pretendard text-xs font-semibold leading-5 text-primary">
                  환불 불가
                </span>
              )}
            </div>
            <span className="font-pretendard text-sm font-normal leading-5 tracking-[-0.28px] text-gray-3">
              구매 일자: {purchase.purchaseDate}
            </span>
            <span className="font-pretendard text-sm font-normal leading-5 tracking-[-0.28px] text-gray-3">
              구매 가격: {purchase.price.toLocaleString()}원
            </span>
          </div>

          <Button
            onClick={() => onDownload(purchase)}
            className="w-[118.88px] flex items-center justify-center gap-[10px] rounded bg-primary px-4 py-3 font-pretendard text-base font-medium leading-5 text-white hover:bg-primary/90 disabled:bg-gray-4 disabled:text-gray-2 disabled:cursor-not-allowed"
            disabled={
              downloadingId === purchase.id ||
              isDownloadExpired(purchase.purchasedAt)
            }
          >
            {downloadingId === purchase.id ? (
              <span className="flex items-center gap-2">
                <Loader size="sm" />
              </span>
            ) : isDownloadExpired(purchase.purchasedAt) ? (
              "다운로드 만료"
            ) : (
              "희곡 다운로드"
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}

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
  isRefunded?: boolean; // 환불 완료 여부
}

interface PurchaseDownloadListProps {
  items: PurchaseDownloadItem[];
  onDownload: (item: PurchaseDownloadItem) => void;
  downloadingId?: string | null;
}

// 버튼 상태 타입 정의
type ButtonStatus =
  | "downloading" // 다운로드 중
  | "refunded" // 환불 완료 (재구매 가능)
  | "expired" // 기간 만료 (재구매 가능)
  | "unavailable" // 다운로드 불가 (playId 없음)
  | "available"; // 다운로드 가능

// 버튼 상태별 텍스트 매핑
const BUTTON_TEXT: Record<ButtonStatus, string> = {
  downloading: "", // 로딩 스피너로 대체
  refunded: "환불 완료",
  expired: "기간 만료",
  unavailable: "다운로드 불가",
  available: "희곡 다운로드",
};

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

  // 버튼 상태 결정 함수
  const getButtonStatus = (
    purchase: PurchaseDownloadItem,
    isDownloading: boolean,
  ): ButtonStatus => {
    if (isDownloading) return "downloading";
    if (purchase.isRefunded) return "refunded"; // 환불된 항목
    if (isDownloadExpired(purchase.purchasedAt)) return "expired"; // 기간 만료
    if (!purchase.playId) return "unavailable"; // playId 없음
    return "available";
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
                {` - ${purchase.author || "작가 미지정"}`}
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

          {(() => {
            const isDownloading = downloadingId === purchase.id;
            const status = getButtonStatus(purchase, isDownloading);
            const isDisabled = status !== "available";

            return (
              <Button
                onClick={() => onDownload(purchase)}
                className="w-[118.88px] flex items-center justify-center gap-[10px] rounded bg-primary px-4 py-3 font-pretendard text-base font-medium leading-5 text-white hover:bg-primary/90 disabled:bg-gray-4 disabled:text-gray-2 disabled:cursor-not-allowed"
                disabled={isDisabled}
              >
                {/* 다운로드 중: 로딩 스피너 표시 */}
                {status === "downloading" && (
                  <span className="flex items-center gap-2">
                    <Loader size="sm" />
                  </span>
                )}
                {/* 버튼 비활성화 상태 */}
                {/* 환불된 항목: 재구매 가능 */}
                {status === "refunded" && BUTTON_TEXT.refunded}
                {/* 기간 만료: 재구매 가능 */}
                {status === "expired" && BUTTON_TEXT.expired}
                {/* playId 없음 등 기타 예외 처리시 뜨는 문구: 다운로드 불가 */}
                {status === "unavailable" && BUTTON_TEXT.unavailable}

                {/* 버튼 활성화 상태 */}
                {/* 다운로드 가능 */}
                {status === "available" && BUTTON_TEXT.available}
              </Button>
            );
          })()}
        </div>
      ))}
    </div>
  );
}

"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface PlayPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  playTitle: string;
  playAuthor: string;
  price: number;
  type?: "purchase" | "cart";
  onPurchase?: () => void;
  onAddToCart?: () => void;
  onContinueBrowsing?: () => void;
  onGoToCart?: () => void;
}

export default function PlayPurchaseModal({
  isOpen,
  onClose,
  playTitle,
  playAuthor,
  price,
  type = "purchase",
  onPurchase,
  onAddToCart,
  onContinueBrowsing,
  onGoToCart,
}: PlayPurchaseModalProps) {
  const handlePurchase = () => {
    onPurchase?.();
  };

  const handleAddToCart = () => {
    onAddToCart?.();
  };

  const handleContinueBrowsing = () => {
    onContinueBrowsing?.();
    onClose();
  };

  const handleGoToCart = () => {
    onGoToCart?.();
  };

  const isPurchaseType = type === "purchase";
  const isCartType = type === "cart";

  return (
    <Modal open={isOpen} onClose={onClose} type="default">
      <div className="flex w-[335px] flex-col items-center gap-10 rounded-xl bg-white p-8 shadow-[0_0_10px_0_rgba(146,46,0,0.08)] lg:w-[404px] lg:gap-[46px] lg:p-11">
        <div className="flex w-full flex-col items-start gap-3">
          <div className="flex w-full items-start justify-between">
            <h2 className="font-pretendard text-xl font-semibold leading-6 text-[#202224]">
              {isPurchaseType ? "희곡 구매" : "장바구니 담기"}
            </h2>
            <button onClick={onClose} className="text-gray-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 19L12 12M12 12L19 5M12 12L5 5M12 12L19 19"
                  stroke="#6D6D6D"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex w-full flex-col items-start gap-6">
            {isCartType && (
              <p className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                아래의 희곡이 장바구니에 담겼습니다.
              </p>
            )}

            {/* Play Info Display */}
            <div className="flex w-full flex-col items-start gap-10 rounded-lg border border-gray-6 bg-background px-5 py-5 lg:gap-[84px]">
              <p className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                {playTitle} - {playAuthor}
              </p>
            </div>

            {/* Price Display */}
            <div className="flex h-6 w-full items-center justify-end">
              <p className="text-right font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                가격: {price.toLocaleString()}원
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full flex-col items-start gap-3">
              {isPurchaseType ? (
                <>
                  <Button
                    onClick={handlePurchase}
                    className="h-auto w-full rounded bg-primary px-8 py-4 font-pretendard text-lg font-semibold leading-6 text-white hover:bg-primary/90 lg:px-[55px] lg:py-5"
                  >
                    바로 구매하기
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className="h-auto w-full rounded border border-primary bg-transparent px-8 py-4 font-pretendard text-lg font-semibold leading-6 text-primary hover:bg-primary/5 lg:px-[55px] lg:py-5"
                  >
                    장바구니 담기
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleContinueBrowsing}
                    className="h-auto w-full rounded bg-primary px-8 py-4 font-pretendard text-lg font-semibold leading-6 text-white hover:bg-primary/90 lg:px-[55px] lg:py-5"
                  >
                    계속 둘러보기
                  </Button>
                  <Button
                    onClick={handleGoToCart}
                    variant="outline"
                    className="h-auto w-full rounded border border-primary bg-transparent px-8 py-4 font-pretendard text-lg font-semibold leading-6 text-primary hover:bg-primary/5 lg:px-[55px] lg:py-5"
                  >
                    장바구니 보러가기
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

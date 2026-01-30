"use client";

import { CheckCircle } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlayPurchaseListSectionProps } from "./types";

export default function PlayPurchaseListSection({
  heading = "희곡 목록",
  items,
  onToggleItem,
  totalPrice,
  onCheckout,
  agreeRefundTerms,
  onToggleRefundTerms,
  onShowRefundTerms,
  isCheckoutDisabled = false,
  checkoutButtonLabel = "결제하기",
  deleteAction,
  className,
}: PlayPurchaseListSectionProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[600px] flex-col gap-8 px-[20px] py-10 lg:gap-10 lg:py-[60px]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-pretendard text-lg font-semibold leading-6 text-gray-1 lg:text-xl">
          {heading}
        </h2>
        {deleteAction ? (
          <button
            type="button"
            onClick={deleteAction.onClick}
            className="flex items-center gap-1 font-pretendard text-[16px] font-regular leading-6 tracking-[-0.02em] text-gray-3"
          >
            {deleteAction.icon}
            {deleteAction.label}
          </button>
        ) : null}
      </div>

      <div className="flex w-full flex-col gap-4 lg:gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex w-full flex-col gap-3 rounded-lg bg-[#F3F2F0] px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-5"
          >
            <div className="flex items-start gap-3 lg:items-center lg:gap-4">
              <div className="pt-0.5 lg:pt-0">
                <CheckCircle
                  checked={item.selected}
                  onChange={() => onToggleItem(item.id)}
                />
              </div>
              <span
                className={cn(
                  "flex-1 font-pretendard text-[16px] font-medium leading-6 tracking-[-0.28px] lg:text-base lg:tracking-[-0.32px]",
                  item.selected ? "text-primary" : "text-gray-2"
                )}
              >
                {item.title} - {item.author}
              </span>
            </div>
            <span
              className={cn(
                "pl-[34px] font-pretendard text-[16px] font-medium leading-6 tracking-[-0.28px] lg:pl-0 lg:text-base lg:tracking-[-0.32px]",
                item.selected ? "text-primary" : "text-gray-2"
              )}
            >
              {item.price.toLocaleString()}원
            </span>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col items-end gap-2">
        <h2 className="font-pretendard text-lg font-semibold leading-6 text-gray-1 lg:text-xl">
          총 결제 가격
        </h2>
        <span className="font-pretendard text-[16px] font-regular leading-6 -tracking-[0.02em] text-gray-2">
          {totalPrice.toLocaleString()}원
        </span>
      </div>

      {onToggleRefundTerms && (
        <div className="flex w-full flex-col items-center gap-2 pt-4">
          <div className="flex items-center justify-between w-full max-w-[600px] py-2">
            <div className="flex items-center gap-2">
              <CheckCircle
                checked={agreeRefundTerms || false}
                onChange={onToggleRefundTerms}
              />
              <span
                className={cn(
                  "text-sm font-medium leading-5 lg:text-base",
                  agreeRefundTerms ? "text-primary" : "text-gray-3"
                )}
              >
                [필수] 디지털 콘텐츠 이용 및 환불 규정에 동의합니다.
              </span>
            </div>
            <button
              type="button"
              onClick={onShowRefundTerms}
              className="shrink-0 text-sm font-medium leading-4 tracking-[-0.28px] text-orange-2"
            >
              약관보기
            </button>
          </div>
        </div>
      )}

      <div className="flex w-full justify-center">
        <Button
          onClick={onCheckout}
          variant="outline"
          disabled={isCheckoutDisabled}
          className="h-auto w-full max-w-[600px] rounded border border-primary bg-transparent px-8 py-4 font-pretendard text-base font-semibold leading-6 text-primary lg:hover:bg-primary lg:hover:text-white disabled:opacity-50 lg:px-[55px] lg:py-5 lg:text-lg"
        >
          {checkoutButtonLabel}
        </Button>
      </div>
    </div>
  );
}

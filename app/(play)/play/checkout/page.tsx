"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader, PlayPurchaseListSection } from "@/components/common";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import RefundTermsContent from "@/components/forms/RefundTermsContent";
import { showErrorToast } from "@/components/ui/toast";
import { getTossClient } from "@/components/lib/toss";
import { v4 as uuidv4 } from "uuid";

interface CheckoutItem {
  id: string;
  title: string;
  author: string;
  price: number;
  selected: boolean;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [agreeRefundTerms, setAgreeRefundTerms] = useState(false);
  const [showRefundTermsModal, setShowRefundTermsModal] = useState(false);

  useEffect(() => {
    const playId = searchParams.get("playId");
    const title = searchParams.get("title");
    const author = searchParams.get("author");
    const price = searchParams.get("price");

    if (playId && title && author && price) {
      setItems([
        {
          id: playId,
          title: decodeURIComponent(title),
          author: decodeURIComponent(author),
          price: parseInt(price),
          selected: true,
        },
      ]);
    }
    setIsLoading(false);
  }, [searchParams]);

  const toggleItemSelection = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectedItems = items.filter((item) => item.selected);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      showErrorToast("결제할 희곡을 선택해주세요.");
      return;
    }

    if (!agreeRefundTerms) {
      showErrorToast("디지털 콘텐츠 이용 및 환불 규정에 동의해주세요.");
      return;
    }

    try {
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      if (!clientKey) {
        showErrorToast("결제 설정이 완료되지 않았습니다. (clientKey)");
        return;
      }

      const toss = await getTossClient(clientKey);
      if (!toss) {
        showErrorToast("결제 모듈을 불러오지 못했습니다.");
        return;
      }

      const payment = toss.payment({ customerKey: uuidv4() });

      const orderId = `order_${uuidv4()}`;
      const orderName =
        selectedItems.length === 1
          ? `${selectedItems[0].title}`
          : `${selectedItems[0].title} 외 ${selectedItems.length - 1}건`;

      // 사전 Intent 저장 (단건/복수 공통)
      const playIds = selectedItems.map((it) => it.id);
      const intentRes = await fetch("/api/payments/intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          playIds,
          amount: totalPrice,
          agreeRefundTerms,
        }),
      });
      if (!intentRes.ok) {
        const msg = (await intentRes.json().catch(() => ({})))?.error;
        showErrorToast(msg || "결제 준비 중 오류가 발생했습니다.");
        return;
      }

      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: totalPrice },
        orderId,
        orderName: orderName.slice(0, 100),
        successUrl: `${window.location.origin}/api/payments/confirm`,
        failUrl: `${window.location.origin}/play/checkout/fail`,
      });
    } catch (_e) {
      showErrorToast("결제 요청 중 문제가 발생했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(250,248,246,0.8)]">
        <Loader size="md" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1 flex-col">
      {/* Title Section */}
      <div className="full-bleed mt-11 flex justify-center border-b border-primary lg:mt-20">
        <span className="mb-5 font-serif text-xl font-bold text-primary lg:text-[28px]">
          희곡 구매하기
        </span>
      </div>

      <PlayPurchaseListSection
        items={items}
        onToggleItem={toggleItemSelection}
        totalPrice={totalPrice}
        onCheckout={handleCheckout}
        agreeRefundTerms={agreeRefundTerms}
        onToggleRefundTerms={setAgreeRefundTerms}
        onShowRefundTerms={() => setShowRefundTermsModal(true)}
        isCheckoutDisabled={selectedItems.length === 0}
      />

      {/* 환불 규정 모달 */}
      <Modal
        open={showRefundTermsModal}
        onClose={() => setShowRefundTermsModal(false)}
      >
        <ModalContent className="max-h-[80vh] w-[90vw] max-w-[600px]">
          <ModalHeader onClose={() => setShowRefundTermsModal(false)}>
            디지털 콘텐츠 이용 및 환불 규정
          </ModalHeader>
          <ModalBody className="max-h-[50vh] overflow-y-auto">
            <RefundTermsContent />
          </ModalBody>
          <ModalFooter className="justify-end gap-3">
            <Button
              type="button"
              variant="default"
              onClick={() => setShowRefundTermsModal(false)}
              className="h-10 w-12"
            >
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(250,248,246,0.8)]">
          <Loader size="md" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

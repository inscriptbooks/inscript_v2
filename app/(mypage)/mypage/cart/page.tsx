"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CartDeleteModal,
  Loader,
  PlayPurchaseListSection,
  type PlayPurchaseListItem,
} from "@/components/common";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import RefundTermsContent from "@/components/forms/RefundTermsContent";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { Trash2 } from "lucide-react";
import { getTossClient } from "@/components/lib/toss";
import { v4 as uuidv4 } from "uuid";

// NOTE: 서버에서 실제 장바구니 항목을 불러옵니다.

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<PlayPurchaseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [agreeRefundTerms, setAgreeRefundTerms] = useState(false);
  const [showRefundTermsModal, setShowRefundTermsModal] = useState(false);
  const [itemsPendingDeletion, setItemsPendingDeletion] = useState<
    PlayPurchaseListItem[]
  >([]);
  const [idToPlayId, setIdToPlayId] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/cart", { cache: "no-store" });
        if (!res.ok) {
          if (!mounted) return;
          setItems([]);
          return;
        }
        const json = (await res.json()) as { items: any[] };
        if (!mounted) return;
        const mapped: PlayPurchaseListItem[] = (json.items || []).map((it) => ({
          id: it.id,
          title: it.title,
          author: it.author,
          price: it.price,
          selected: Boolean(it.selected),
        }));
        const mapPlayIds: Record<string, string> = {};
        for (const it of json.items || []) {
          mapPlayIds[String(it.id)] = String(it.play_id || "");
        }
        setItems(mapped);
        setIdToPlayId(mapPlayIds);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleItemSelection = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectedItems = useMemo(
    () => items.filter((item) => item.selected),
    [items]
  );

  const handleDelete = () => {
    if (selectedItems.length === 0) {
      showErrorToast("삭제할 희곡을 선택해주세요.");
      return;
    }

    setItemsPendingDeletion(selectedItems);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemsPendingDeletion.length) {
      setIsDeleteModalOpen(false);
      return;
    }

    const ids = itemsPendingDeletion.map((item) => item.id);

    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    if (!res.ok) {
      const errorMessage =
        (await res.json().catch(() => ({})))?.error || "삭제에 실패했습니다.";
      showErrorToast(errorMessage);
      return;
    }

    setItems((prev) => prev.filter((item) => !ids.includes(item.id)));
    setItemsPendingDeletion([]);
    showSuccessToast("선택한 희곡이 장바구니에서 삭제되었습니다.");
  };

  const handleCheckout = async () => {
    const selectedItems = items.filter((item) => item.selected);
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

      const amountValue = selectedItems.reduce(
        (sum, item) => sum + item.price,
        0
      );

      const playIds = selectedItems
        .map((si) => idToPlayId[si.id])
        .filter((v): v is string => Boolean(v));

      const intentRes = await fetch("/api/payments/intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          playIds,
          amount: amountValue,
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
        amount: { currency: "KRW", value: amountValue },
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

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  if (!isLoading && items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-[600px] flex-col gap-8 px-[20px] py-10 lg:gap-10 lg:py-[60px]">
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
          <p className="text-gray-3">장바구니가 비어있습니다.</p>
          <Button
            onClick={() => router.push("/play")}
            variant="outline"
            className="text-primary"
          >
            희곡 둘러보기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PlayPurchaseListSection
        items={items}
        onToggleItem={toggleItemSelection}
        totalPrice={totalPrice}
        onCheckout={handleCheckout}
        agreeRefundTerms={agreeRefundTerms}
        onToggleRefundTerms={setAgreeRefundTerms}
        onShowRefundTerms={() => setShowRefundTermsModal(true)}
        isCheckoutDisabled={selectedItems.length === 0}
        deleteAction={{
          label: "삭제하기",
          onClick: handleDelete,
          icon: <Trash2 size={24} className="text-gray-3" />,
        }}
      />
      <CartDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemsPendingDeletion([]);
        }}
        items={itemsPendingDeletion.map(({ id, title, author }) => ({
          id,
          title,
          author,
        }))}
        onConfirmDelete={handleConfirmDelete}
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
    </>
  );
}

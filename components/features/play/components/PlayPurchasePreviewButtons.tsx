"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/hooks/auth/queries";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/components/ui/toast";
import PdfPreviewModal from "./PdfPreviewModal";
import { PlayPurchaseModal } from "@/components/common/Modal";
import { Loader } from "@/components/common";

interface PlayPurchasePreviewButtonsProps {
  playId: string;
  playTitle: string;
  authorName: string;
  price: number | null | undefined;
  attachmentUrl: string | null | undefined;
  attachmentName: string | null | undefined;
  attachmentPath: string | null | undefined;
}

export default function PlayPurchasePreviewButtons({
  playId,
  playTitle,
  authorName,
  price,
  attachmentUrl,
  attachmentName,
  attachmentPath,
}: PlayPurchasePreviewButtonsProps) {
  const router = useRouter();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const { authUser } = useAuthSession();

  const ensureNotPurchased = async (): Promise<boolean> => {
    try {
      const res = await fetch(
        `/api/purchases/has?playId=${encodeURIComponent(playId)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );
      if (res.status === 401) {
        showErrorToast("로그인이 필요합니다.");
        return false;
      }
      const json = await res.json().catch(() => ({}));
      if (json?.purchased) {
        showErrorToast("이미 구매한 희곡입니다.");
        return false;
      }
      return true;
    } catch (_e) {
      return true;
    }
  };

  const handlePurchaseClick = async () => {
    if (!authUser) {
      showErrorToast("로그인이 필요합니다.");
      return;
    }
    const ok = await ensureNotPurchased();
    if (!ok) return;
    setIsPurchaseModalOpen(true);
  };

  const handleDirectPurchase = async () => {
    setIsPurchaseModalOpen(false);
    const ok = await ensureNotPurchased();
    if (!ok) return;
    const params = new URLSearchParams({
      playId: playId,
      title: encodeURIComponent(playTitle),
      author: encodeURIComponent(authorName),
      price: (price || 0).toString(),
    });
    router.push(`/play/checkout?${params.toString()}`);
  };

  const handleAddToCart = async () => {
    setIsPurchaseModalOpen(false);
    if (!authUser) {
      showErrorToast("로그인이 필요합니다.");
      return;
    }
    const ok = await ensureNotPurchased();
    if (!ok) return;
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playId: playId,
          title: playTitle,
          author: authorName,
          price: Number(price || 0),
        }),
      });
      if (res.status === 409) {
        const e = await res.json().catch(() => ({}));
        showErrorToast(e?.error || "이미 담긴 희곡입니다.");
        return;
      }
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        showErrorToast(e?.error || "장바구니에 추가하지 못했습니다.");
        return;
      }
      setIsCartModalOpen(true);
    } catch (_e) {
      showErrorToast("장바구니에 추가 중 문제가 발생했습니다.");
    }
  };

  const handleContinueBrowsing = () => {
    setIsCartModalOpen(false);
  };

  const handleGoToCart = () => {
    setIsCartModalOpen(false);
    router.push("/mypage/cart");
  };

  const handlePreview = async () => {
    if (!attachmentPath && !attachmentName && !attachmentUrl) {
      showErrorToast("미리보기 파일이 없습니다.");
      return;
    }

    if (!authUser) {
      showErrorToast("로그인이 필요합니다.");
      return;
    }

    const email = authUser.email;
    if (!email) {
      showErrorToast("계정 이메일 정보를 확인하지 못했습니다.");
      return;
    }

    setIsLoadingPreview(true);
    try {
      const response = await fetch("/api/plays/preview-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: attachmentName,
          filePath: attachmentPath,
          attachmentUrl: attachmentUrl,
          email: email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showErrorToast(errorData.error || "PDF 미리보기 생성에 실패했습니다.");
        return;
      }

      const blob = await response.blob();
      const pdfUrl = window.URL.createObjectURL(blob);
      setPreviewUrl(pdfUrl);
      setIsPreviewOpen(true);
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : "오류가 발생했습니다."
      );
    } finally {
      setIsLoadingPreview(false);
    }
  };

  return (
    <div>
      <p className="text-gray-3 text-sm font-medium mb-3">
        본 상품은 주문 제작형 파일로, <br className="lg:hidden" />
        다운로드 후에는 취소가 불가능합니다.
      </p>
      <div className="w-full flex flex-col lg:flex-row gap-3 justify-between">
        <Button
          onClick={handlePurchaseClick}
          className="flex w-full h-16 py-2.5 disabled:opacity-50 text-[18px] lg:flex-[1_0_0%] lg:min-w-[240px]"
        >
          희곡 구매하기
        </Button>
        <Button
          onClick={handlePreview}
          disabled={isLoadingPreview}
          className="flex w-full h-16 py-2.5 disabled:opacity-50 text-primary text-[18px] lg:flex-[1_0_0%] lg:min-w-[240px]"
          variant="outline"
        >
          {isLoadingPreview ? <Loader size="sm" /> : "희곡 미리보기"}
        </Button>
      </div>
      <PdfPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pdfUrl={previewUrl}
        onPurchase={() => {
          setIsPreviewOpen(false);
          setIsPurchaseModalOpen(true);
        }}
        onAddToCart={async () => {
          setIsPreviewOpen(false);
          await handleAddToCart();
        }}
      />
      <PlayPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        playTitle={playTitle}
        playAuthor={authorName}
        price={price || 0}
        type="purchase"
        onPurchase={handleDirectPurchase}
        onAddToCart={handleAddToCart}
      />
      <PlayPurchaseModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        playTitle={playTitle}
        playAuthor={authorName}
        price={price || 0}
        type="cart"
        onContinueBrowsing={handleContinueBrowsing}
        onGoToCart={handleGoToCart}
      />
    </div>
  );
}

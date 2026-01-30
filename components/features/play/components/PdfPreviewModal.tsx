"use client";

import { Modal, ModalHeader } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
  onPurchase?: () => void;
  onAddToCart?: () => void;
}

export default function PdfPreviewModal({
  isOpen,
  onClose,
  pdfUrl,
  onPurchase,
  onAddToCart,
}: PdfPreviewModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      {/* 오버레이 영역에서 반응형 여백 처리 */}
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex h-[90vh] w-[90vw] max-w-[1273px] min-w-[320px] flex-col gap-6 rounded-[12px] bg-white p-6 shadow-[0_0_10px_0_rgba(146,46,0,0.08)] md:p-11">
          <ModalHeader onClose={onClose} className="pb-0">
            희곡 미리보기
          </ModalHeader>

          <div className="flex w-full h-full flex-col gap-6 overflow-hidden rounded bg-background">
            {/* Content Section: PDF iframe */}
            <div className="flex w-full flex-1">
              <div className="flex h-full w-full overflow-hidden rounded bg-white">
                {pdfUrl ? (
                  <iframe
                    src={`${pdfUrl}#toolbar=0&navpanes=0`}
                    className="h-full w-full"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <p className="text-gray-500">PDF를 불러오는 중입니다...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-stretch justify-center gap-3 mt-2 px-4 pb-4 md:flex-row md:items-start md:px-20 md:pb-6">
              <Button
                onClick={onPurchase}
                className="h-auto justify-center gap-2.5 rounded px-[40px] py-4 font-pretendard text-lg font-semibold leading-6 md:px-[55px] md:py-5"
              >
                희곡 구매하기
              </Button>
              <Button
                onClick={onAddToCart}
                variant="outline"
                className="h-auto justify-center gap-2.5 rounded border border-primary bg-transparent px-[40px] py-4 font-pretendard text-lg font-semibold leading-6 text-primary hover:bg-primary/5 md:px-[55px] md:py-5"
              >
                장바구니 담기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

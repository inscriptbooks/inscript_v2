"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface CartItem {
  id: string;
  title: string;
  author: string;
}

interface CartDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onConfirmDelete: () => void;
}

export default function CartDeleteModal({
  isOpen,
  onClose,
  items,
  onConfirmDelete,
}: CartDeleteModalProps) {
  const handleDelete = () => {
    onConfirmDelete();
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose} type="default">
      <div className="flex w-[335px] flex-col items-start gap-3 rounded-xl bg-white p-8 shadow-[0_0_10px_0_rgba(146,46,0,0.08)] lg:w-[404px] lg:p-11">
        {/* Header */}
        <div className="flex w-full items-start justify-between">
          <h2 className="font-pretendard text-xl font-semibold leading-6 text-[#202224]">
            장바구니 삭제
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

        {/* Content */}
        <div className="flex w-full flex-col items-start gap-6">
          <div className="w-full flex flex-col gap-3">
            {/* Description */}
            <p className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              선택한 희곡을 장바구니에서
              <br />
              삭제하시겠습니까?
            </p>

            {/* Selected Items List */}
            <div className="flex w-full flex-col items-start gap-2 bg-gray-6 rounded-lg p-5">
              {items.map((item) => (
                <p
                  key={item.id}
                  className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2"
                >
                  {item.title} - {item.author}
                </p>
              ))}
            </div>
          </div>

          {/* Delete Button */}
          <Button
            onClick={handleDelete}
            className="h-auto w-full rounded bg-primary px-8 py-4 font-pretendard text-lg font-semibold leading-6 text-white hover:bg-primary/90 lg:px-[55px] lg:py-5"
          >
            삭제하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}

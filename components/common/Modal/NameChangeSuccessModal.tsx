"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface NameChangeSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NameChangeSuccessModal({
  isOpen,
  onClose,
}: NameChangeSuccessModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="flex w-[335px] flex-col items-center gap-10 rounded-md border border-primary bg-background p-11 lg:w-[404px]">
        <div className="flex flex-col items-center gap-9 self-stretch">
          <div className="flex flex-col items-center gap-[18px] self-stretch">
            {/* Icon */}
            <div className="relative h-20 w-20 lg:h-[112px] lg:w-[112px]">
              <Image
                src="/images/play.webp"
                alt="Success icon"
                className="object-contain"
                fill
              />
            </div>

            <div className="flex flex-col items-start gap-3 self-stretch">
              {/* Title */}
              <div className="self-stretch text-center font-serif text-xl font-medium leading-6 text-primary">
                닉네임 변경 완료
              </div>

              {/* Description */}
              <div className="self-stretch text-center font-pretendard text-sm font-normal leading-5 tracking-[-0.28px] text-gray-1">
                닉네임이 성공적으로 변경되었습니다.
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={onClose}
            className="h-16 w-full self-stretch rounded bg-primary px-[55px] py-5 font-pretendard text-lg font-semibold leading-6 text-white"
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
}

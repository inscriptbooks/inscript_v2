"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface EmailSentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function EmailSentModal({
  isOpen,
  onClose,
  title = "메일이 전송되었습니다.",
  description = "이메일을 확인해주세요.",
}: EmailSentModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="flex w-[335px] flex-col items-center gap-10 rounded-md border border-primary bg-background p-11 lg:w-[404px]">
        <div className="flex flex-col items-center gap-9 self-stretch">
          <div className="flex flex-col items-center gap-[18px] self-stretch">
            {/* Icon */}
            <div className="relative h-20 w-20 lg:h-[112px] lg:w-[112px]">
              <Image
                src="/images/play.webp"
                alt="Play icon"
                className="object-contain"
                fill
              />
            </div>

            <div className="flex flex-col items-start gap-3 self-stretch">
              {/* Title */}
              <div className="self-stretch text-center font-serif text-xl font-medium leading-6 text-primary">
                {title}
              </div>

              {/* Description */}
              <div className="self-stretch text-center font-pretendard text-sm font-normal leading-5 tracking-[-0.28px] text-gray-1">
                {description}
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

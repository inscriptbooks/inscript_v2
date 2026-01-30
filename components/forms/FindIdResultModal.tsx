"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface FindIdResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string | null;
}

export default function FindIdResultModal({
  isOpen,
  onClose,
  email,
}: FindIdResultModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="flex w-[335px] flex-col items-center gap-10 rounded-md border border-primary bg-background p-11 lg:w-[404px]">
        <div className="flex flex-col items-center gap-9 self-stretch">
          <div className="flex flex-col items-center gap-[18px] self-stretch">
            {/* Play Icon */}
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
                아이디 찾기 결과
              </div>

              {/* Email Display */}
              {email && (
                <div className="flex w-full flex-col items-center gap-2">
                  <div className="self-stretch text-center font-pretendard text-sm font-normal leading-5 tracking-[-0.28px] text-gray-1">
                    회원님의 아이디는 다음과 같습니다.
                  </div>
                  <div className="mt-2 self-stretch rounded bg-orange-4 px-4 py-3 text-center font-pretendard text-base font-semibold text-primary">
                    {email}
                  </div>
                </div>
              )}
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

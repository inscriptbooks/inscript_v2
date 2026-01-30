"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface AuthorRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function AuthorRequiredModal({
  isOpen,
  onClose,
  onConfirm,
}: AuthorRequiredModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="flex w-[335px] flex-col items-center gap-10 rounded-md border border-primary bg-background p-11 lg:w-[404px]">
        <div className="flex flex-col items-center gap-9 self-stretch">
          <div className="flex flex-col items-center gap-[18px] self-stretch">
            <div className="relative h-20 w-20 lg:h-[112px] lg:w-[112px]">
              <Image
                src="/images/play.webp"
                alt="Quill icon"
                className="object-contain"
                fill
              />
            </div>

            <div className="flex flex-col items-start gap-3 self-stretch">
              <div className="self-stretch text-center font-serif text-xl font-medium leading-6 text-primary">
                작가 커뮤니티는
                <br />
                작가 회원만 사용 가능합니다.
              </div>

              <div className="self-stretch text-center font-pretendard text-sm font-normal leading-5 tracking-[-0.28px] text-gray-1">
                작가 회원이 되시면 본 커뮤니티를 이용할 수 있습니다.
                <br />
                작가 회원 등록을 원할 경우,
                <br />
                <span className="font-bold text-primary">
                  &apos;마이페이지 - 작가 회원 신청&apos;
                </span>{" "}
                을 해주세요.
              </div>
            </div>
          </div>

          <Button
            onClick={handleConfirm}
            className="h-16 w-full self-stretch rounded bg-primary px-[55px] py-5 font-pretendard text-lg font-semibold leading-6 text-white"
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
}

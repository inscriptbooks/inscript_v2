"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface AuthorApplicationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthorApplicationSuccessModal({
  isOpen,
  onClose,
}: AuthorApplicationSuccessModalProps) {
  const router = useRouter();

  const handleConfirm = () => {
    onClose();
    router.refresh(); // 페이지 새로고침하여 AuthorApplicationStatus 표시
  };

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
                작가 회원 신청 완료
              </div>

              {/* Description */}
              <div className="self-stretch text-center font-pretendard text-sm font-normal leading-5 tracking-[-0.28px] text-gray-1">
                작가 회원 신청이 성공적으로 완료되었습니다.
                <br />
                관리자 승인 후 작가 회원으로 등록됩니다.
              </div>
            </div>
          </div>

          {/* Confirm Button */}
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

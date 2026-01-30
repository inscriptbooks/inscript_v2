"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/common";
import Image from "next/image";

interface NoteSendModalProps {
  isOpen: boolean;
  recipientName?: string;
  onClose: () => void;
  onSend?: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export default function NoteSendModal({
  isOpen,
  recipientName,
  onClose,
  onSend,
  isLoading = false,
}: NoteSendModalProps) {
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMessage("");
      setShowSuccessModal(false);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (onSend && message.trim()) {
      try {
        await onSend(message);
        setShowSuccessModal(true);
      } catch (error) {
        // 에러 발생 시 성공 모달을 띄우지 않음
      }
    }
  };

  const handleClose = () => {
    setMessage("");
    setShowSuccessModal(false);
    onClose();
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    handleClose();
  };

  if (showSuccessModal) {
    return (
      <Modal open={true} onClose={handleSuccessClose}>
        <div className="flex w-[335px] flex-col items-center gap-10 rounded-md border border-primary bg-background p-11 lg:w-[404px]">
          <div className="flex flex-col items-center gap-9 self-stretch">
            <div className="flex flex-col items-center gap-[18px] self-stretch">
              <div className="relative h-20 w-20 lg:h-[112px] lg:w-[112px]">
                <Image
                  src="/images/play.webp"
                  alt="Play icon"
                  className="object-contain"
                  fill
                />
              </div>

              <div className="flex flex-col items-start gap-3 self-stretch">
                <div className="self-stretch text-center font-serif text-xl font-medium leading-6 text-primary">
                  쪽지가 전송되었습니다.
                </div>

                <div className="self-stretch text-center font-pretendard text-sm font-normal leading-5 tracking-[-0.28px] text-gray-1">
                  쪽지함에서 확인해주세요.
                </div>
              </div>
            </div>

            <Button
              onClick={handleSuccessClose}
              className="h-16 w-full self-stretch rounded bg-primary px-[55px] py-5 font-pretendard text-lg font-semibold leading-6 text-white"
            >
              확인
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <ModalContent className="w-[335px] gap-10 rounded-md border border-primary bg-white p-6">
        <div className="flex w-full flex-col gap-3">
          <ModalHeader onClose={handleClose} className="mb-0">
            쪽지 보내기
          </ModalHeader>

          <ModalBody className="gap-6">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[210px] resize-y border-gray-6 bg-background px-5 py-5 text-gray-2"
              placeholder="쪽지 내용을 입력해주세요..."
            />
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={handleSend}
              className="h-[60px] w-full rounded bg-primary text-lg font-bold text-white"
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? <Loader size="xs" /> : "보내기"}
            </Button>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
}

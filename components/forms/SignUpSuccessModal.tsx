"use client";

import { Modal, ModalContent, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface SignUpSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SignUpSuccessModal({ open, onClose }: SignUpSuccessModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent className="gap-6">
        <ModalBody className="items-center gap-4">
          <h2 className="text-center text-xl font-bold text-[#202224]" style={{ fontFamily: "Noto Serif KR" }}>
            회원가입이 완료되었습니다
          </h2>
          <p className="text-center text-base text-gray-3">
            로그인 페이지로 이동하여 로그인해주세요.
          </p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button onClick={onClose} className="w-full text-lg rounded-[4px]">
            확인
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

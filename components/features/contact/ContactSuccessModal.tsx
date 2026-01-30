"use client";

import { Modal, ModalContent, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface ContactSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactSuccessModal({ open, onClose }: ContactSuccessModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent className="gap-6">
        <ModalBody className="items-center gap-4">

          <h2 className="text-center text-xl font-bold text-[#202224]" style={{ fontFamily: "Noto Serif KR" }}>
            문의가 성공적으로 전송되었습니다
          </h2>
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

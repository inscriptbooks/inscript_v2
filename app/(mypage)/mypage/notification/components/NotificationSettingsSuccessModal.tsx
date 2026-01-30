"use client";

import { Modal, ModalContent, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface NotificationSettingsSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationSettingsSuccessModal({ 
  open, 
  onClose 
}: NotificationSettingsSuccessModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent className="gap-6">
        <ModalBody className="items-center gap-4">
          <h2 className="text-center text-xl font-bold text-[#202224]" style={{ fontFamily: "Noto Serif KR" }}>
            알림 설정이 변경되었습니다
          </h2>
          <p className="text-center text-base text-gray-3">
            알림 설정이 성공적으로 저장되었습니다.
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

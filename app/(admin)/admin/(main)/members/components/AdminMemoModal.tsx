"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";

interface AdminMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  memo: string | null;
}

export default function AdminMemoModal({
  isOpen,
  onClose,
  memberName,
  memo,
}: AdminMemoModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent className="w-[400px] gap-4 rounded-md border border-primary bg-white p-6">
        <ModalHeader onClose={onClose} className="mb-0">
          운영자 메모
        </ModalHeader>

        <div className="text-sm text-gray-3">
          회원: <span className="font-medium text-gray-1">{memberName}</span>
        </div>

        <ModalBody className="w-full gap-4">
          <div className="max-h-[200px] min-h-[120px] w-full overflow-y-auto rounded-lg border border-gray-6 bg-[#FAF8F6] p-4">
            {memo ? (
              <p className="whitespace-pre-wrap font-pretendard text-base text-orange-3">
                {memo}
              </p>
            ) : (
              <p className="font-pretendard text-base text-gray-4">
                등록된 메모가 없습니다.
              </p>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

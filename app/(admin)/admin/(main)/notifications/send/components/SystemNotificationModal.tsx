"use client";

import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import { SystemNotificationFormData } from "../types";
import { showSuccessToast,showErrorToast } from "@/components/ui/toast";
interface SystemNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: SystemNotificationFormData;
  setFormData: React.Dispatch<React.SetStateAction<SystemNotificationFormData>>;
  onSubmit: () => void;
  onDelete?: () => void;
  mode: "create" | "edit";
}

export default function SystemNotificationModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  onDelete,
  mode,
}: SystemNotificationModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent>
        <div className="flex w-full flex-col items-start gap-6">
          <ModalHeader onClose={onClose}>
            {mode === "create" ? "알림 등록" : "알림 상세"}
          </ModalHeader>

          <ModalBody>
            {/* 제목 */}
            <div className="flex w-full flex-col items-start">
              <div className="mb-3 flex h-11 w-40 items-center gap-1">
                <span className="font-pretendard text-base font-bold leading-6 text-gray-1">
                  제목
                </span>
              </div>
              <div className="w-full">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="제목을 입력해주세요"
                  className="flex w-full items-center justify-between rounded border border-red-3 bg-orange-4 px-5 py-4 text-base font-normal leading-6 tracking-[-0.32px] text-gray-2 placeholder:text-orange-3"
                />
              </div>
            </div>

            {/* 내용 */}
            <div className="flex w-full flex-col items-start">
              <div className="mb-3 flex h-11 w-40 items-center gap-1">
                <span className="font-pretendard text-base font-bold leading-6 text-gray-1">
                  내용
                </span>
              </div>
              <div className="w-full">
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  placeholder="내용을 입력해주세요"
                  className="h-[185px] w-full resize-none rounded border border-red-3 bg-orange-4 px-5 py-4 text-base font-normal leading-6 tracking-[-0.32px] text-gray-2 placeholder:text-orange-3"
                />
              </div>
            </div>

            {/* 버튼 영역 */}
            {mode === "create" ? (
              <Button
                onClick={onSubmit}
                className="flex w-full items-center justify-center gap-2.5 rounded bg-primary px-[55px] py-5 font-pretendard text-lg font-bold leading-6 text-white"
              >
                등록
              </Button>
            ) : (
              <div className="flex w-full gap-3">
                <Button
                  onClick={onDelete}
                  variant="outline"
                  className="flex flex-1 items-center justify-center gap-2.5 rounded border-[1.6px] border-primary bg-white px-[55px] py-5 font-pretendard text-lg font-bold leading-6 text-primary hover:bg-gray-50"
                >
                  삭제
                </Button>
                <Button
                  onClick={onSubmit}
                  className="flex flex-1 items-center justify-center gap-2.5 rounded bg-primary px-[55px] py-5 font-pretendard text-lg font-bold leading-6 text-white"
                >
                  수정
                </Button>
              </div>
            )}
          </ModalBody>
        </div>
      </ModalContent>
    </Modal>
  );
}

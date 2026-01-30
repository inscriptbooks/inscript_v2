"use client";

import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 font-pretendard text-xl font-semibold text-gray-1">
          {title}
        </h2>
        <p className="mb-6 font-pretendard text-base text-gray-2">{message}</p>
        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="h-9 rounded border border-gray-4 bg-white px-4 hover:bg-gray-6"
          >
            <span className="font-pretendard text-sm font-semibold text-gray-2">
              {cancelText}
            </span>
          </Button>
          <Button
            onClick={onConfirm}
            className="h-9 rounded bg-primary px-4 hover:bg-primary/90"
          >
            <span className="font-pretendard text-sm font-semibold text-white">
              {confirmText}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  type?: "default" | "preview";
}

interface ModalContentProps {
  children: ReactNode;
  className?: string;
  type?: "default" | "preview";
}

interface ModalHeaderProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  children,
  type = "default",
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-[rgba(4,4,4,0.8)] flex items-center justify-center"
      )}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

export function ModalContent({
  children,
  className,
  type = "default",
}: ModalContentProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-[46px] rounded-[12px] bg-white p-11 shadow-[0_0_10px_0_rgba(146,46,0,0.08)]",
        type === "preview" ? "w-full" : "w-[520px]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ModalHeader({
  children,
  onClose,
  className,
}: ModalHeaderProps) {
  return (
    <div className={cn("flex w-full items-start justify-between", className)}>
      <h2 className="font-pretendard text-xl font-bold leading-6 text-[#202224]">
        {children}
      </h2>
      {onClose && (
        <button onClick={onClose} className="text-gray-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 19L12 12M12 12L19 5M12 12L5 5M12 12L19 19"
              stroke="#6D6D6D"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn("flex w-full flex-col items-start gap-6", className)}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      {children}
    </div>
  );
}

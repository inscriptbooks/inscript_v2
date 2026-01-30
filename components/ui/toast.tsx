"use client";

import { cn } from "@/lib/utils";
import { toast as sonnerToast } from "sonner";

interface SuccessToastProps {
  message: string;
  className?: string;
}

interface ErrorToastProps {
  message: string;
  className?: string;
}

const SuccessToastContent = ({ message, className }: SuccessToastProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 rounded border px-5 py-3",
        "border-[#009951] bg-[#F5FFEF]",
        "min-h-[48px] w-full",
        className,
      )}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 flex-shrink-0"
      >
        <circle cx="12" cy="12" r="10" stroke="#009951" strokeWidth="1.5" />
        <path
          d="M8.5 12.5L10.5 14.5L15.5 9.5"
          stroke="#009951"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
      </svg>
      <div className="font-pretendard text-base font-medium leading-5 text-[#009951]">
        {message}
      </div>
    </div>
  );
};

const ErrorToastContent = ({ message, className }: ErrorToastProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 rounded border px-5 py-3",
        "border-[#EC221F] bg-[#FEE9E7]",
        "min-h-[48px] w-full",
        className,
      )}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 flex-shrink-0"
      >
        <path
          d="M11.7861 3L20.7861 20H2.78613L11.7861 3Z"
          stroke="#EC221F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.7861 10V14"
          stroke="#EC221F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.7861 17V17.01"
          stroke="#EC221F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="font-pretendard text-base font-medium leading-5 text-[#EC221F]">
        {message}
      </div>
    </div>
  );
};

export const showErrorToast = (message: string) => {
  sonnerToast.custom(() => <ErrorToastContent message={message} />, {
    duration: 2000,
    unstyled: true,
    className: "flex w-full items-center justify-center",
  });
};

export const showSuccessToast = (message: string) => {
  sonnerToast.custom(() => <SuccessToastContent message={message} />, {
    duration: 2000,
    unstyled: true,
    className: "flex w-full items-center justify-center",
  });
};

export { SuccessToastContent, ErrorToastContent };

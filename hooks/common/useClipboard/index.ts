import { useState, useCallback } from "react";
import { showSuccessToast } from "@/components/ui/toast";

interface UseClipboardProps {
  successMessage?: string;
  errorMessage?: string;
}

export const useClipboard = (options?: UseClipboardProps) => {
  const [copied, setCopied] = useState(false);
  const successMessage =
    options?.successMessage || "클립보드에 복사되었습니다.";
  // const errorMessage = options?.errorMessage || '클립보드 복사에 실패했습니다.';

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        // 브라우저가 Clipboard API를 지원하지 않는 경우
        if (!navigator.clipboard) {
          throw new Error("브라우저가 클립보드 API를 지원하지 않습니다.");
        }

        await navigator.clipboard.writeText(text);
        setCopied(true);
        showSuccessToast(successMessage);

        // 2초 후 copied 상태 초기화
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (error) {
        // showErrorToast(errorMessage);
      }
    },
    [successMessage]
  );

  return {
    copied,
    copyToClipboard,
  };
};

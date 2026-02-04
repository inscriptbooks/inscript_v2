"use client";

import { createContext, useState, ReactNode, useRef } from "react";

interface LoaderContextType {
  isLoading: boolean;
  message?: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}

export const LoaderContext = createContext<LoaderContextType | undefined>(
  undefined
);

export default function LoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const showTimeRef = useRef<number>(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showCountRef = useRef<number>(0);

  const forceHide = () => {
    showCountRef.current = 0;
    setIsLoading(false);
    setMessage(undefined);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
  };

  const showLoader = (msg?: string) => {
    // 대기 중인 hide 취소
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    showCountRef.current += 1;

    // 첫 번째 호출일 때만 실제로 로더 표시
    if (showCountRef.current === 1) {
      showTimeRef.current = Date.now();
      setIsLoading(true);
      setMessage(msg);

      // 최대 3초 후 강제 숨김 (카운트 불일치 방지)
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
      }
      maxTimeoutRef.current = setTimeout(() => {
        forceHide();
      }, 3000);
    }
  };

  const hideLoader = () => {
    showCountRef.current = Math.max(0, showCountRef.current - 1);

    // 아직 로딩 중인 컴포넌트가 있으면 숨기지 않음
    if (showCountRef.current > 0) {
      return;
    }

    // 최대 시간 타이머 취소
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }

    const elapsed = Date.now() - showTimeRef.current;
    const minDisplayTime = 300;
    const debounceTime = 50; // 깜빡임 방지 디바운스

    // 대기 중인 hide가 있으면 취소
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    // 최소 표시 시간과 디바운스 중 더 긴 시간 적용
    const remainingTime = Math.max(minDisplayTime - elapsed, debounceTime);

    hideTimeoutRef.current = setTimeout(() => {
      // 타임아웃 실행 시점에 다시 확인 (그 사이 새로운 showLoader가 호출됐을 수 있음)
      if (showCountRef.current === 0) {
        setIsLoading(false);
        setMessage(undefined);
      }
      hideTimeoutRef.current = null;
    }, remainingTime);
  };

  return (
    <LoaderContext.Provider
      value={{ isLoading, message, showLoader, hideLoader }}
    >
      {children}
    </LoaderContext.Provider>
  );
}

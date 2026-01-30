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

  const showLoader = (msg?: string) => {
    showTimeRef.current = Date.now();
    setIsLoading(true);
    setMessage(msg);
  };

  const hideLoader = () => {
    // setIsLoading(false);
    // setMessage(undefined);
    const elapsed = Date.now() - showTimeRef.current;
    const minDisplayTime = 300; // 최소 300ms 표시
    if (elapsed < minDisplayTime) {
      // 최소 표시 시간이 지나지 않았으면 남은 시간만큼 대기
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        setMessage(undefined);
      }, minDisplayTime - elapsed);
    } else {
      setIsLoading(false);
      setMessage(undefined);
    }
  };

  return (
    <LoaderContext.Provider
      value={{ isLoading, message, showLoader, hideLoader }}
    >
      {children}
    </LoaderContext.Provider>
  );
}

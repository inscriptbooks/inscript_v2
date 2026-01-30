"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common";

function PurchaseFailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const message = searchParams.get("message");
    const code = searchParams.get("code");

    if (message) {
      setErrorMessage(decodeURIComponent(message));
    } else if (code) {
      setErrorMessage(`결제 실패 (오류 코드: ${code})`);
    } else {
      setErrorMessage("결제가 취소되었거나 오류가 발생했습니다.");
    }

    setIsLoading(false);
  }, [searchParams]);

  const handleRetry = () => {
    router.push("/mypage/cart");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(250,248,246,0.8)]">
        <Loader size="md" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1 flex-col">
      {/* Title Section */}
      <div className="full-bleed mt-11 flex justify-center border-b border-primary px-[20px] lg:mt-20 lg:px-[120px]">
        <span className="mb-5 font-serif text-[28px] font-bold leading-8 text-primary">
          희곡 구매하기
        </span>
      </div>

      {/* Main Content */}
      <div className="mx-auto flex w-full max-w-[600px] flex-col items-center gap-8 px-[20px] py-[72px]">
        {/* Error Message */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="font-pretendard text-[20px] font-semibold leading-6 text-gray-1">
            결제 실패
          </h1>
          <p className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
            {errorMessage}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-3">
          <Button
            onClick={handleRetry}
            className="w-full rounded bg-primary px-8 py-4 font-pretendard text-base font-medium leading-5 text-white hover:bg-primary/90"
          >
            다시 시도하기
          </Button>
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full rounded border border-primary bg-transparent px-8 py-4 font-pretendard text-base font-medium leading-5 text-primary hover:bg-primary hover:text-white"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PurchaseFailPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(250,248,246,0.8)]">
          <Loader size="md" />
        </div>
      }
    >
      <PurchaseFailContent />
    </Suspense>
  );
}

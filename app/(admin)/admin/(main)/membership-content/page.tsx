"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";

interface MembershipContent {
  introduction: string;
  benefits: string;
  subscription_info: string;
}

export default function MembershipContentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState<MembershipContent>({
    introduction: "",
    benefits: "",
    subscription_info: "",
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/membership-content");
      const result = await response.json();

      if (result.data) {
        setContent({
          introduction: result.data.introduction || "",
          benefits: result.data.benefits || "",
          subscription_info: result.data.subscription_info || "",
        });
      }
    } catch (error) {
      showErrorToast("멤버십 콘텐츠를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/membership-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          introduction: content.introduction,
          benefits: content.benefits,
          subscriptionInfo: content.subscription_info,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showSuccessToast("멤버십 콘텐츠가 저장되었습니다.");
      } else {
        showErrorToast(result.error || "저장에 실패했습니다.");
      }
    } catch (error) {
      showErrorToast("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center p-8">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full p-8">
      <div className="flex flex-1 flex-col items-center justify-center rounded-[5px] bg-white p-11">
        {/* Header */}
        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex w-full items-center justify-between">
            <h1 className="font-pretendard text-2xl font-semibold leading-8 text-gray-1">
              멤버십 페이지 관리
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 flex w-full flex-col gap-4">
          {/* 멤버십 소개 */}
          <div className="flex w-full items-start">
            <div className="flex h-14 w-40 items-start gap-1 py-4">
              <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                멤버십 소개
              </span>
              <span className="font-pretendard text-xl font-semibold leading-6 text-red">
                *
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <textarea
                id="introduction"
                value={content.introduction}
                onChange={(e) =>
                  setContent({ ...content, introduction: e.target.value })
                }
                placeholder="멤버십 소개 내용을 입력하세요"
                className="h-[200px] w-full resize-none rounded border border-red-3 bg-orange-4 px-5 py-4 font-pretendard text-base leading-6 text-gray-1 placeholder:text-orange-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* 멤버십 혜택 */}
          <div className="flex w-full items-start">
            <div className="flex h-14 w-40 items-start gap-1 py-4">
              <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                멤버십 혜택
              </span>
              <span className="font-pretendard text-xl font-semibold leading-6 text-red">
                *
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <textarea
                id="benefits"
                value={content.benefits}
                onChange={(e) =>
                  setContent({ ...content, benefits: e.target.value })
                }
                placeholder="멤버십 혜택 내용을 입력하세요"
                className="h-[200px] w-full resize-none rounded border border-red-3 bg-orange-4 px-5 py-4 font-pretendard text-base leading-6 text-gray-1 placeholder:text-orange-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* 멤버십 구독료 */}
          <div className="flex w-full items-start">
            <div className="flex h-14 w-40 items-start gap-1 py-4">
              <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                멤버십 구독료
              </span>
              <span className="font-pretendard text-xl font-semibold leading-6 text-red">
                *
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <textarea
                id="subscription_info"
                value={content.subscription_info}
                onChange={(e) =>
                  setContent({ ...content, subscription_info: e.target.value })
                }
                placeholder="멤버십 구독료 정보를 입력하세요"
                className="h-[120px] w-full resize-none rounded border border-red-3 bg-orange-4 px-5 py-4 font-pretendard text-base leading-6 text-gray-1 placeholder:text-orange-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="mt-6 flex w-full justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="h-14 rounded bg-primary px-8 py-4 font-pretendard text-base font-semibold leading-6 text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isSaving ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

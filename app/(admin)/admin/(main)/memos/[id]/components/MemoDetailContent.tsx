"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Hamburger from "@/components/icons/Hamburger";
import { Memo, MemoComment } from "../../types";
import MemoCommentSection from "./MemoCommentSection";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";

interface MemoDetailContentProps {
  initialMemo: Memo;
  initialComments: MemoComment[];
}

export default function MemoDetailContent({
  initialMemo,
  initialComments,
}: MemoDetailContentProps) {
  const router = useRouter();
  const [memo] = useState(initialMemo);
  const [comments, setComments] = useState(initialComments);
  const [isLoading, setIsLoading] = useState(false);

  const getOriginalUrl = (): string | null => {
    if (memo.type === "play" && memo.play_id) {
      return `/play/${memo.play_id}`;
    }
    if (memo.type === "author" && memo.author_id) {
      return `/author/${memo.author_id}`;
    }
    if (memo.type === "program" && memo.program_id) {
      return `/program/${memo.program_id}`;
    }
    return null;
  };

  const handleToggleVisibility = async () => {
    setIsLoading(true);
    try {
      const newIsVisible = !memo.is_visible;

      const response = await fetch(`/api/admin/memos/${memo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_visible: newIsVisible,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        showErrorToast(error.error || "상태 변경에 실패했습니다.");
        return;
      }

      showSuccessToast(
        newIsVisible ? "메모가 공개되었습니다." : "메모가 비공개되었습니다."
      );

      // 페이지 전체 새로고침
      window.location.reload();
    } catch (error) {
      showErrorToast("상태 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    // if (!confirm("정말 이 메모를 삭제하시겠습니까?")) {
    //   return;
    // }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/memos/${memo.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        showErrorToast(error.error || "메모 삭제에 실패했습니다.");
        return;
      }

      showSuccessToast("메모가 삭제되었습니다.");
      router.push("/admin/memos");
    } catch (error) {
      showErrorToast("메모 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentsUpdate = async () => {
    try {
      const response = await fetch(`/api/admin/memos/${memo.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      }
    } catch (error) {
      showErrorToast("댓글 목록을 새로고침하는 중 오류가 발생했습니다.");
    }
  };

  const originalUrl = getOriginalUrl();

  return (
    <div className="flex min-h-screen w-full items-start justify-center p-8">
      <div className="flex w-full flex-col items-center justify-center gap-20 rounded-[5px] bg-white p-11">
        <div className="flex w-full flex-col items-start gap-10">
          {/* 메모 정보 섹션 */}
          <div className="flex w-full flex-col items-end gap-4">
            <div className="flex w-full items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-1">메모 관리</h1>
            </div>

            {/* 메모 정보 테이블 */}
            <div className="flex w-full flex-col border border-gray-7">
              {/* 메모ID와 구분 */}
              <div className="flex">
                <div className="flex h-12 flex-1 items-center border-b border-gray-7">
                  <div className="flex h-full w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
                    <span className="text-base text-gray-2">메모ID</span>
                  </div>
                  <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
                    <span className="text-base text-gray-1">
                      {memo.id.slice(0, 8)}
                    </span>
                  </div>
                </div>
                <div className="flex h-12 flex-1 items-center border-b border-gray-7">
                  <div className="flex h-full w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
                    <span className="text-base text-gray-2">구분</span>
                  </div>
                  <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
                    <span className="text-base text-gray-1">
                      {memo.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* 대상 */}
              <div className="flex h-12 w-full items-center border-b border-gray-7">
                <div className="flex h-full w-40 flex-shrink-0 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
                  <span className="text-base text-gray-2">대상</span>
                </div>
                <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
                  <span className="text-base text-gray-1">
                    {memo.target_title}
                  </span>
                  {originalUrl && (
                    <a
                      href={originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-[#2581F9] underline hover:no-underline"
                    >
                      원문 바로가기
                    </a>
                  )}
                </div>
              </div>

              {/* 작성자와 등록일 */}
              <div className="flex">
                <div className="flex h-12 flex-1 items-center border-b border-gray-7">
                  <div className="flex h-full w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
                    <span className="text-base text-gray-2">작성자</span>
                  </div>
                  <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
                    <span className="text-base text-gray-1">
                      {memo.author_name}({memo.author_email})
                    </span>
                  </div>
                </div>
                <div className="flex h-12 flex-1 items-center border-b border-gray-7">
                  <div className="flex h-full w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
                    <span className="text-base text-gray-2">등록일</span>
                  </div>
                  <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
                    <span className="text-base text-gray-1">
                      {new Date(memo.created_at).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* 상태와 좋아요 */}
              <div className="flex">
                <div className="flex h-12 flex-1 items-center border-b border-gray-7">
                  <div className="flex h-full w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
                    <span className="text-base text-gray-2">노출 여부</span>
                  </div>
                  <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
                    <div
                      className={`flex items-center justify-center gap-2.5 rounded-full px-3 py-1.5 ${
                        memo.status === "exposed"
                          ? "border border-[#B0D5F2] bg-[#F6FBFF]"
                          : "bg-gray-5"
                      }`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          memo.status === "exposed"
                            ? "text-[#2581F9]"
                            : "text-gray-1"
                        }`}
                      >
                        {memo.status === "exposed" ? "노출중" : "비공개"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex h-12 flex-1 items-center border-b border-gray-7">
                  <div className="flex h-full w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
                    <span className="text-base text-gray-2">좋아요</span>
                  </div>
                  <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
                    <span className="text-base text-gray-1">
                      {memo.like_count}
                    </span>
                  </div>
                </div>
              </div>

              {/* 메모 */}
              <div className="flex items-center border-b border-gray-7">
                <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
                  <span className="text-base text-gray-2">메모</span>
                </div>
                <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
                  <span className="text-base text-gray-1">{memo.content}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <MemoCommentSection
            comments={comments}
            onUpdate={handleCommentsUpdate}
          />
        </div>

        {/* 하단 액션 버튼들 */}
        <div className="flex w-full items-center justify-between">
          <Button
            onClick={() => router.push("/admin/memos")}
            variant="outline"
            className="flex h-auto items-center gap-1.5 rounded border border-gray-4 bg-white px-3 py-2.5 text-sm font-semibold text-gray-2 hover:bg-white/90 hover:text-gray-1"
          >
            <Hamburger size={16} color="#555555" />
            목록으로
          </Button>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={handleDelete}
              disabled={isLoading}
              variant="outline"
              className="h-9 w-12 rounded border border-primary bg-white px-3 py-2.5 text-sm font-semibold text-primary hover:bg-red-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              삭제
            </Button>
            <Button
              onClick={handleToggleVisibility}
              disabled={isLoading}
              className="w-15 h-9 rounded bg-primary px-3 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? "처리중..."
                : memo.status === "exposed"
                  ? "비공개"
                  : "공개"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

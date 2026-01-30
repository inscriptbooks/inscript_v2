"use client";

import { useState } from "react";
import { Comment } from "../types";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface ReportCommentsProps {
  comments: Comment[];
}

export default function ReportComments({ comments }: ReportCommentsProps) {
  const router = useRouter();
  const [loadingCommentId, setLoadingCommentId] = useState<string | null>(null);

  const handleToggleVisibility = async (comment: Comment) => {
    setLoadingCommentId(comment.id);
    try {
      const newIsVisible = !comment.isVisible;

      const response = await fetch(`/api/admin/comments/${comment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_visible: newIsVisible }),
      });

      if (!response.ok) {
        const error = await response.json();
        showErrorToast(error.error || "상태 변경에 실패했습니다.");
        return;
      }

      showSuccessToast(
        newIsVisible ? "댓글이 공개되었습니다." : "댓글이 비공개되었습니다."
      );
      router.refresh();
    } catch (error) {
      showErrorToast("상태 변경 중 오류가 발생했습니다.");
    } finally {
      setLoadingCommentId(null);
    }
  };

  const handleDelete = async (commentId: string) => {
    setLoadingCommentId(commentId);
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        showErrorToast(error.error || "댓글 삭제에 실패했습니다.");
        return;
      }

      showSuccessToast("댓글이 삭제되었습니다.");
      router.refresh();
    } catch (error) {
      showErrorToast("댓글 삭제 중 오류가 발생했습니다.");
    } finally {
      setLoadingCommentId(null);
    }
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="flex w-full flex-col items-end gap-4">
        <div className="flex w-full items-center justify-between">
          <h2 className="font-pretendard text-xl font-semibold leading-6 text-gray-1">
            댓글
          </h2>
        </div>
        <div className="flex w-full flex-col gap-6 py-11">
          <p className="text-center text-gray-4">댓글이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-end gap-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="font-pretendard text-xl font-semibold leading-6 text-gray-1">
          댓글 ({comments.length})
        </h2>
      </div>
      <div className="flex w-full flex-col gap-6 py-11">
        {comments.map((comment) => (
          <div key={comment.id} className="flex w-full flex-col gap-3">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="size-[47px] rounded-full bg-gray-5"></div>
                <span className="font-pretendard text-sm font-medium leading-[150%] tracking-[-0.28px] text-gray-2">
                  {comment.author}
                </span>
                <span className="font-pretendard text-sm font-medium leading-[150%] tracking-[-0.28px] text-gray-4">
                  {comment.createdAt}
                </span>
                {comment.isPrivate && (
                  <span className="rounded-full bg-gray-5 px-3 py-1 text-xs text-gray-2">
                    비공개
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleToggleVisibility(comment)}
                  disabled={loadingCommentId === comment.id}
                  className="text-sm font-medium text-gray-3 hover:text-gray-1 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingCommentId === comment.id
                    ? "처리중..."
                    : comment.isVisible
                      ? "비공개"
                      : "공개"}
                </button>
                <span className="text-sm font-medium text-gray-3">|</span>
                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={loadingCommentId === comment.id}
                  className="text-sm font-medium text-gray-3 hover:text-gray-1 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  삭제
                </button>
              </div>
            </div>
            <div className="w-full font-pretendard text-base font-medium leading-[150%] tracking-[-0.32px] text-gray-2">
              {comment.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

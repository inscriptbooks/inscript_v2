"use client";

import { useState } from "react";
import { MemoComment } from "../../types";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { formatKoreanDate } from "@/lib/utils/date";

interface MemoCommentSectionProps {
  comments: MemoComment[];
  onUpdate: () => void;
}

export default function MemoCommentSection({
  comments,
  onUpdate,
}: MemoCommentSectionProps) {
  const [loadingCommentId, setLoadingCommentId] = useState<string | null>(null);

  const handleToggleVisibility = async (comment: MemoComment) => {
    setLoadingCommentId(comment.id);
    try {
      const newIsVisible = comment.status === "exposed" ? false : true;

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
      onUpdate();
    } catch (error) {
      showErrorToast("상태 변경 중 오류가 발생했습니다.");
    } finally {
      setLoadingCommentId(null);
    }
  };

  const handleDelete = async (commentId: string) => {
    // if (!confirm("정말 이 댓글을 삭제하시겠습니까?")) {
    //   return;
    // }

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
      onUpdate();
    } catch (error) {
      showErrorToast("댓글 삭제 중 오류가 발생했습니다.");
    } finally {
      setLoadingCommentId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "오늘";
    } else if (diffInDays === 1) {
      return "1일 전";
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks}주 전`;
    } else {
      return formatKoreanDate(dateString);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="flex w-full flex-col items-end gap-4">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-xl font-bold text-gray-1">댓글</h2>
        </div>
        <div className="flex w-full items-center justify-center py-11">
          <p className="text-base text-gray-4">댓글이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-end gap-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-xl font-bold text-gray-1">댓글</h2>
      </div>

      <div className="flex w-full flex-col items-start gap-6 py-11">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex w-full flex-col items-start gap-3"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="size-[47px] rounded-full bg-gray-5"></div>
                <span className="text-sm font-medium text-gray-2">
                  {comment.author_name}
                </span>
                <span className="text-sm font-medium text-gray-4">
                  {formatDate(comment.created_at)}
                </span>
                {comment.status === "hidden" && (
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
                    : comment.status === "exposed"
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
            <p className="w-full text-base font-medium leading-6 text-gray-2">
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

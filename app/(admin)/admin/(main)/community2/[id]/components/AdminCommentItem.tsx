"use client";

import { Comment } from "@/models/comment";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import { useUser } from "@/hooks/auth";
import { useDeleteComment } from "@/hooks/comments";
import { useLoginRequired } from "@/hooks/common";
import { useState } from "react";
import EntryDeleteModal from "@/components/common/Modal/EntryDeleteModal";
import { UserInfoPopover } from "@/components/ui/UserInfoPopover";
import { useToggleCommentVisibility } from "../hooks/useToggleCommentVisibility";

interface AdminCommentItemProps {
  comment: Comment;
}

export default function AdminCommentItem({ comment }: AdminCommentItemProps) {
  const { user: currentUser } = useUser();
  const { requireAuth } = useLoginRequired();
  const userId = currentUser?.id;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();
  const { mutate: toggleVisibility, isPending: isTogglingVisibility } =
    useToggleCommentVisibility();

  // 관리자는 모든 댓글을 관리할 수 있음
  const isAdmin = true;

  const handleDeleteClick = () => {
    requireAuth(() => {
      setIsDeleteModalOpen(true);
    });
  };

  const handleDeleteConfirm = () => {
    deleteComment(comment.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
      },
    });
  };

  const handleToggleVisibility = () => {
    requireAuth(() => {
      toggleVisibility({
        id: comment.id,
        isVisible: !comment.isVisible,
      });
    });
  };

  return (
    <>
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center gap-5">
            <UserInfoPopover
              userId={comment.user.id}
              userName={comment.user.name}
              userCreatedAt={comment.user.createdAt}
            >
              <span className="line-clamp-1 cursor-pointer text-sm font-medium text-gray-2 hover:text-primary user-name">
                {comment.user.name}
              </span>
            </UserInfoPopover>

            <span className="min-w-[40px] text-sm font-semibold text-gray-4">
              {formatRelativeTime(comment.createdAt)}
            </span>

            {!comment.isVisible && (
              <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded">
                비공개
              </span>
            )}
          </div>

          {isAdmin && (
            <div className="flex shrink-0 cursor-default items-center gap-2.5">
              <button
                type="button"
                onClick={handleToggleVisibility}
                disabled={isTogglingVisibility}
                className="text-sm font-medium text-gray-3 hover:text-primary disabled:opacity-50"
              >
                {comment.isVisible ? "비공개로 전환" : "공개로 전환"}
              </button>
              <span className="text-sm font-medium text-gray-3">|</span>
              <button
                type="button"
                onClick={handleDeleteClick}
                className="text-sm font-medium text-gray-3 hover:text-primary"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        <p className="line-clamp-2 font-medium text-gray-2">
          {comment.content}
        </p>
      </div>

      {/* 삭제 모달 */}
      <EntryDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteConfirm}
        title="댓글 삭제"
        description="정말로 이 댓글을 삭제하시겠습니까?"
        content={comment.content}
        createdAt={formatDate(comment.createdAt)}
        isLoading={isDeleting}
      />
    </>
  );
}

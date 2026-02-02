"use client";

import { Comment } from "@/models/comment";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import { useUser } from "@/hooks/auth";
import { useUpdateComment, useDeleteComment } from "@/hooks/comments";
import { useLoginRequired } from "@/hooks/common";
import { useState } from "react";
import EntryEditModal from "@/components/common/Modal/EntryEditModal";
import EntryDeleteModal from "@/components/common/Modal/EntryDeleteModal";
import { UserInfoPopover } from "@/components/ui/UserInfoPopover";
import ReportModal from "@/components/common/Modal/ReportModal";
import { useCreateReport } from "@/hooks/reports";

interface CommentItemProps {
  comment: Comment;
  isAnonymous?: boolean;
}

export default function CommentItem({
  comment,
  isAnonymous = false,
}: CommentItemProps) {
  const { user: currentUser } = useUser();
  const { requireAuth } = useLoginRequired();
  const userId = currentUser?.id;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment();
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();
  const createReport = useCreateReport();

  const isOwner = comment.user.id === userId;

  const handleEditClick = () => {
    requireAuth(() => {
      setIsEditModalOpen(true);
    });
  };

  const handleDeleteClick = () => {
    requireAuth(() => {
      setIsDeleteModalOpen(true);
    });
  };

  const handleEditSave = (updatedContent: string) => {
    updateComment(
      {
        id: comment.id,
        content: updatedContent,
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    deleteComment(comment.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
      },
    });
  };

  const handleReport = () => {
    requireAuth(() => {
      setIsReportModalOpen(true);
    });
  };

  const handleReportSubmit = (reason: string) => {
    createReport.mutate({
      commentId: comment.id,
      reason,
    });
  };

  return (
    <>
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center gap-5">
            <UserInfoPopover
              userId={comment.user.id}
              userName={isAnonymous ? "작가회원" : comment.user.name}
              userCreatedAt={comment.user.createdAt}
              onReport={handleReport}
              isAnonymous={isAnonymous}
            >
              <span className="line-clamp-1 cursor-pointer text-sm font-medium text-gray-2 hover:text-primary user-name">
                {isAnonymous ? "작가회원" : comment.user.name}
              </span>
            </UserInfoPopover>

            <span className="min-w-[40px] text-sm font-semibold text-gray-4">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>

          {isOwner && (
            <div className="flex shrink-0 cursor-default items-center gap-2.5">
              <button
                type="button"
                onClick={handleEditClick}
                className="text-sm font-medium text-gray-3 hover:text-primary"
              >
                수정
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

      {/* 수정 모달 */}
      <EntryEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
        title="댓글 수정"
        initialContent={comment.content}
        isLoading={isUpdating}
      />

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

      {/* 신고 모달 */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="comment"
        authorName={isAnonymous ? "작가회원" : comment.user.name}
        content={comment.content}
        onSubmit={handleReportSubmit}
      />
    </>
  );
}

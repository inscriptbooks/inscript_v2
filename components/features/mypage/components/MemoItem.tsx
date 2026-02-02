"use client";

import { Memo } from "@/models/memo";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import { useUser } from "@/hooks/auth";
import { useUpdateMemo, useDeleteMemo } from "@/hooks/memos";
import { useLoginRequired } from "@/hooks/common";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EntryEditModal from "@/components/common/Modal/EntryEditModal";
import EntryDeleteModal from "@/components/common/Modal/EntryDeleteModal";
import { UserInfoPopover } from "@/components/ui/UserInfoPopover";
import ReportModal from "@/components/common/Modal/ReportModal";
import { useCreateReport } from "@/hooks/reports";

interface MemoItemProps {
  memo: Memo;
}

export default function MemoItem({ memo }: MemoItemProps) {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const { requireAuth } = useLoginRequired();
  const userId = currentUser?.id;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { mutate: updateMemo, isPending: isUpdating } = useUpdateMemo();
  const { mutate: deleteMemo, isPending: isDeleting } = useDeleteMemo();
  const createReport = useCreateReport();

  const isOwner = memo.user.id === userId;

  const handleMemoClick = () => {
    if (memo.type === "play") {
      router.push(`/play/${memo.play.id}`);
    } else if (memo.type === "author") {
      router.push(`/author/${memo.author.id}`);
    } else if (memo.type === "program") {
      router.push(`/program/${memo.program.id}`);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuth(() => {
      setIsEditModalOpen(true);
    });
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuth(() => {
      setIsDeleteModalOpen(true);
    });
  };

  const handleEditSave = (updatedContent: string) => {
    updateMemo(
      {
        id: memo.id,
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
    deleteMemo(memo.id, {
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
      memoId: memo.id,
      reason,
    });
  };

  return (
    <>
      <div
        className="flex w-full flex-1 flex-col gap-3 cursor-pointer transition-colors hover:bg-gray-6/50 rounded-lg p-3 -m-3"
        onClick={handleMemoClick}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center gap-5">
            <div onClick={(e) => e.stopPropagation()}>
              <UserInfoPopover
                userId={memo.user.id}
                userName={memo.user.name}
                userCreatedAt={memo.user.createdAt}
                onReport={handleReport}
              >
                <span className="line-clamp-1 cursor-pointer text-sm font-medium text-gray-2 hover:text-primary user-name">
                  {memo.user.name}
                </span>
              </UserInfoPopover>
            </div>

            <span className="min-w-[40px] text-sm font-semibold text-gray-4">
              {formatRelativeTime(memo.createdAt)}
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

        <p className="line-clamp-2 font-medium text-gray-2">{memo.content}</p>
      </div>

      {/* 수정 모달 */}
      <EntryEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
        title="메모 수정"
        initialContent={memo.content}
        isLoading={isUpdating}
      />

      {/* 삭제 모달 */}
      <EntryDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteConfirm}
        title="메모 삭제"
        description="정말로 이 메모를 삭제하시겠습니까?"
        content={memo.content}
        createdAt={formatDate(memo.createdAt)}
        isLoading={isDeleting}
      />

      {/* 신고 모달 */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="memo"
        authorName={memo.user.name}
        content={memo.content}
        onSubmit={handleReportSubmit}
      />
    </>
  );
}

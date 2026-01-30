"use client";

import Link from "next/link";
import { useState } from "react";
import { Memo } from "@/models/memo";
import { Like, Comment, Bookmark } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useCreateLike, useDeleteLike, useGetLikes } from "@/hooks/likes";
import {
  useCreateBookmark,
  useDeleteBookmark,
  useGetBookmarks,
} from "@/hooks/bookmarks";
import { useUpdateMemo, useDeleteMemo } from "@/hooks/memos";
import { useUser } from "@/hooks/auth";
import { useLoginRequired } from "@/hooks/common";
import { EntryDeleteModal, EntryEditModal } from "@/components/common/Modal";
import { UserInfoPopover } from "@/components/ui/UserInfoPopover";
import ReportModal from "@/components/common/Modal/ReportModal";
import { useCreateReport } from "@/hooks/reports";

interface MemoPreviewCardProps {
  memo: Memo;
  className?: string;
  hideTitle?: boolean;
  hasLink?: boolean;
  hideCreatedAt?: boolean;
  readonly?: boolean;
}

function getMemoLink(memo: Memo): string {
  switch (memo.type) {
    case "play":
      return `/play/${memo.play.id}/memo/${memo.id}`;
    case "author":
      return `/author/${memo.author.id}/memo/${memo.id}`;
    case "program":
      return `/program/${memo.program.id}/memo/${memo.id}`;
    default:
      throw new Error(
        `처리되지 않은 메모 타입: ${(memo as unknown as { type: string }).type}`
      );
  }
}

export default function MemoPreviewCard({
  memo,
  className,
  hideTitle = false,
  hasLink = true,
  hideCreatedAt = false,
  readonly = false,
}: MemoPreviewCardProps) {
  const {
    type,
    user,
    createdAt,
    title,
    content,
    likeCount: initialLikeCount,
    commentCount,
  } = memo;
  const { requireAuth } = useLoginRequired();
  const { user: currentUser, isAuthenticated } = useUser();
  const userId = currentUser?.id;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { data: likes } = useGetLikes({
    userId,
    memoId: memo.id,
  });
  const { data: bookmarks } = useGetBookmarks({
    userId,
    memoId: memo.id,
  });
  const createLike = useCreateLike();
  const deleteLike = useDeleteLike();
  const createBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();
  const updateMemoMutation = useUpdateMemo();
  const deleteMemoMutation = useDeleteMemo();
  const createReport = useCreateReport();

  const isLiked = isAuthenticated && likes && likes.length > 0;
  const isBookmarked = isAuthenticated && bookmarks && bookmarks.length > 0;
  const isPending = createLike.isPending || deleteLike.isPending;
  const isBookmarkPending =
    createBookmark.isPending || deleteBookmark.isPending;
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const isOwner = currentUser?.id === memo.user.id;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    requireAuth(() => {
      if (isLiked) {
        setLikeCount((prev) => Math.max(0, prev - 1));
        deleteLike.mutate({ memoId: memo.id });
      } else {
        setLikeCount((prev) => prev + 1);
        createLike.mutate({ memoId: memo.id });
      }
    });
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    requireAuth(() => {
      if (isBookmarked) {
        deleteBookmark.mutate({ memoId: memo.id });
      } else {
        createBookmark.mutate({ memoId: memo.id });
      }
    });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    if (readonly || !isOwner) return;

    e.preventDefault();
    e.stopPropagation();

    requireAuth(() => {
      setIsEditModalOpen(true);
    });
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    if (readonly || !isOwner) return;

    e.preventDefault();
    e.stopPropagation();

    requireAuth(() => {
      setIsDeleteModalOpen(true);
    });
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSave = (updatedContent: string) => {
    updateMemoMutation.mutate(
      {
        id: memo.id,
        content: updatedContent,
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
        },
      }
    );
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = () => {
    deleteMemoMutation.mutate(memo.id, {
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

  const cardContent = (
    <Card
      className={cn(
        "flex h-full w-full flex-col border border-orange-4 bg-white p-8",
        className
      )}
    >
      <CardContent className="flex flex-1 flex-col justify-between p-0">
        <div className="flex flex-col gap-2">
          {/* User info section */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3">
                <UserInfoPopover
                  userId={user.id}
                  userName={user.name}
                  userCreatedAt={user.createdAt}
                  onReport={handleReport}
                >
                  <span className="line-clamp-1 cursor-pointer text-sm font-medium text-gray-2 hover:text-primary user-name">
                    {user.name}
                  </span>
                </UserInfoPopover>
              </div>
              {!hideCreatedAt && (
                <span className="min-w-[40px] text-sm font-semibold text-gray-4">
                  {formatRelativeTime(createdAt)}
                </span>
              )}
            </div>
            {!readonly && isOwner && (
              <div className="flex cursor-default items-center gap-2.5">
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

          {/* Content section */}
          <div className="flex flex-col gap-2.5">
            {!hideTitle && (
              <span className="line-clamp-1 text-xl font-semibold text-primary">
                {title}
              </span>
            )}
            <p className="line-clamp-8 text-gray-2">{content}</p>
          </div>
        </div>

        {/* Bottom section with interactions and book info */}
        <div className="mt-4 flex items-end justify-between gap-2">
          {/* Interaction icons */}
          <div className="flex items-center gap-5 lg:gap-3 xl:gap-5">
            <button
              type="button"
              onClick={handleLikeClick}
              className="line-clamp-1 flex h-6 max-w-[200px] cursor-pointer items-center gap-2"
              disabled={isPending}
            >
              <Like className={cn(isLiked ? "text-primary" : "text-gray-3")} />
              <span className="text-sm font-semibold text-gray-3">
                {likeCount}
              </span>
            </button>
            <div className="flex items-center gap-2">
              <Comment className="text-gray-3" />
              <span className="text-sm font-semibold text-gray-3">
                {commentCount}
              </span>
            </div>
            {!readonly && (
              <button
                type="button"
                onClick={handleBookmarkClick}
                className="flex h-6 cursor-pointer items-center gap-2"
                disabled={isBookmarkPending}
              >
                <Bookmark
                  className={cn(isBookmarked ? "text-primary" : "text-gray-3")}
                />
              </button>
            )}
          </div>

          {/* Author and book info */}
          {type === "play" && memo.play && (
            <div className="flex-1 flex-col justify-between gap-1 overflow-hidden">
              {memo.play.author && (
                <span className="line-clamp-1 flex-1 text-right text-sm font-medium text-gray-3">
                  {memo.play.author.authorName}
                </span>
              )}
              <span className="line-clamp-1 flex-1 text-right text-sm font-semibold text-primary">
                {`『${memo.play.title}』`}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {hasLink ? (
        <Link href={getMemoLink(memo)} className="h-full w-full">
          {cardContent}
        </Link>
      ) : (
        <div className="h-full w-full">{cardContent}</div>
      )}
      <EntryEditModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSave={handleEditSave}
        title="메모 수정"
        initialContent={memo.content}
        isLoading={updateMemoMutation.isPending}
      />
      <EntryDeleteModal
        title="메모 삭제"
        description="해당 메모를 삭제하시겠습니까?"
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onDelete={handleDelete}
        createdAt={memo.createdAt}
        content={memo.content}
        isLoading={deleteMemoMutation.isPending}
      />
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="memo"
        authorName={user.name}
        content={content}
        onSubmit={handleReportSubmit}
      />
    </>
  );
}

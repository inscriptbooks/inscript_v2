"use client";

import { useState } from "react";
import { Post } from "@/models/post";
import { Like, Comment, Bookmark, Download } from "@/components/icons";
import { RichTextViewer } from "@/components/common";
import { useCreateLike, useDeleteLike, useGetLikes } from "@/hooks/likes";
import { useUser } from "@/hooks/auth";
import { useLoginRequired } from "@/hooks/common";
import { cn } from "@/lib/utils";
import CommunityReportModal from "./CommunityReportModal";
import { useCreateReport } from "@/hooks/reports";

interface CommunityDetailSectionProps {
  post: Post;
}

export default function CommunityDetailSection({
  post,
}: CommunityDetailSectionProps) {
  const { requireAuth } = useLoginRequired();
  const { user: currentUser, isAuthenticated } = useUser();
  const userId = currentUser?.id;

  const { data: likes } = useGetLikes({
    userId,
    postId: post.id,
  });
  const createLike = useCreateLike();
  const deleteLike = useDeleteLike();

  const isLiked = isAuthenticated && likes && likes.length > 0;
  const isPending = createLike.isPending || deleteLike.isPending;
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const createReport = useCreateReport();

  const handleLikeClick = () => {
    requireAuth(() => {
      if (isLiked) {
        setLikeCount((prev) => Math.max(0, prev - 1));
        deleteLike.mutate({ postId: post.id });
      } else {
        setLikeCount((prev) => prev + 1);
        createLike.mutate({ postId: post.id });
      }
    });
  };

  // const handleBookmarkClick = () => {
  //   // Implement bookmark functionality
  // };

  const handleReportClick = () => {
    requireAuth(() => {
      setIsReportModalOpen(true);
    });
  };

  const handleReportSubmit = (reason: string) => {
    createReport.mutate({
      postId: post.id,
      reason,
    });
  };

  return (
    <section className="flex w-full flex-col gap-5 px-5 md:px-20">
      <RichTextViewer content={post.content} />

      {/* File Attachment Section */}
      {post.attachmentUrl && post.attachmentName && (
        <div className="flex items-center gap-2">
          <Download size={20} className="text-gray-2" />
          <span className="text-base font-normal leading-6 text-gray-2">
            첨부파일:
          </span>
          <a
            href={`${post.attachmentUrl}?download=${encodeURIComponent(post.attachmentName)}`}
            className="text-base font-normal leading-6 text-primary underline hover:opacity-70"
          >
            {post.attachmentName}
          </a>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-red-3 pb-3">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={handleLikeClick}
            className="flex cursor-pointer items-center gap-2"
            disabled={isPending}
          >
            <Like className={cn(isLiked ? "text-primary" : "text-gray-3")} />
            <span className="text-sm font-medium text-gray-3">{likeCount}</span>
          </button>

          <div className="flex items-center gap-2">
            <Comment />
            <span className="text-sm font-medium text-gray-3">
              {post.commentCount}
            </span>
          </div>

          {/* <button
            type="button"
            className="flex cursor-pointer items-center gap-2"
            onClick={handleBookmarkClick}
          >
            <Bookmark />
          </button> */}
        </div>

        <button
          type="button"
          onClick={handleReportClick}
          className="cursor-pointer text-sm font-medium text-gray-3"
        >
          신고
        </button>
      </div>

      <CommunityReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        authorName={post.user.name}
        postTitle={post.title}
        onSubmit={handleReportSubmit}
      />
    </section>
  );
}

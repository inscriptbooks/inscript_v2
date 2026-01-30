"use client";

import {
  BackLinkButton,
  BookmarkButton,
  ShareButton,
} from "@/components/common/Button";
import { formatRelativeTime } from "@/lib/utils";
import { Post } from "@/models/post";
import { useClipboard, useLoginRequired } from "@/hooks/common";
import {
  useCreateBookmark,
  useDeleteBookmark,
  useGetBookmarks,
} from "@/hooks/bookmarks";
import { useUser } from "@/hooks/auth";
import { UserInfoPopover } from "@/components/ui/UserInfoPopover";
import { ArrowLeft } from "@/components/icons";
import Link from "next/link";
import ReportModal from "@/components/common/Modal/ReportModal";
import { ShareModal } from "@/components/common/Modal";
import { useCreateReport } from "@/hooks/reports";
import { useState } from "react";

interface CommunityDetailHeaderSectionProps {
  post: Post;
  backLinkHref: string;
  backLinkText: string;
  isAnonymous?: boolean;
}

export default function CommunityDetailHeaderSection({
  post,
  backLinkHref,
  backLinkText,
  isAnonymous = false,
}: CommunityDetailHeaderSectionProps) {
  const { user, isAuthenticated } = useUser();
  const userId = user?.id;
  const { requireAuth } = useLoginRequired();
  const { data: bookmarks } = useGetBookmarks({ postId: post.id, userId });
  const createBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();
  const createReport = useCreateReport();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const isBookmarked = isAuthenticated && bookmarks && bookmarks.length > 0;

  const handleBookmarkButtonClick = () => {
    requireAuth(() => {
      if (isBookmarked) {
        deleteBookmark.mutate({ postId: post.id });
      } else {
        createBookmark.mutate({ postId: post.id });
      }
    });
  };

  const handleShareButtonClick = () => {
    setIsShareModalOpen(true);
  };

  const handleReport = () => {
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
    <section className="full relative">
      <div className="flex w-full flex-col justify-between px-5 md:px-20 py-3 relative before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-screen before:h-px before:bg-primary before:-z-10">
        <Link
          href={backLinkHref}
          className="flex items-center gap-2 mt-3 mb-8 hover:opacity-70 transition-opacity w-fit"
        >
          <ArrowLeft size={24} className="text-primary" />
          <span className="text-[16px] font-medium text-primary">
            {backLinkText}
          </span>
        </Link>

        <h1 className="mb-3 mt-2 line-clamp-1 flex font-serif text-lg font-bold text-black lg:text-[28px]">
          {post.title}
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 rounded-full bg-gray-5" />
            <UserInfoPopover
              userId={post.user.id}
              userName={isAnonymous ? "익명" : post.user.name}
              userCreatedAt={post.user.createdAt}
              onReport={handleReport}
              isAnonymous={isAnonymous}
            >
              <span className="cursor-pointer text-sm font-medium text-gray-2 hover:text-primary user-name">
                {isAnonymous ? "익명" : post.user.name}
              </span>
            </UserInfoPopover>
            <span className="text-sm font-medium text-gray-2">
              {formatRelativeTime(post.createdAt)}
            </span>

            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-2">댓글</span>
              <span className="text-sm font-medium text-primary">
                {post.commentCount}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-2">조회</span>
              <span className="text-sm font-medium text-primary">
                {post.viewCount}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BookmarkButton
              onClick={handleBookmarkButtonClick}
              isBookmarked={isBookmarked}
            />
            <ShareButton onClick={handleShareButtonClick} />
          </div>
        </div>
      </div>

      {/* 신고 모달 */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="post"
        authorName={isAnonymous ? "익명" : post.user.name}
        content={post.title}
        onSubmit={handleReportSubmit}
      />

      {/* 공유하기 모달 */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
    </section>
  );
}

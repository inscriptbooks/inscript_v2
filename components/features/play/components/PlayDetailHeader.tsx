"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BookmarkButton, ShareButton } from "@/components/common/Button";
import { Play } from "@/models/play";
import { useClipboard, useLoginRequired } from "@/hooks/common";
import {
  useCreateBookmark,
  useDeleteBookmark,
  useGetBookmarks,
} from "@/hooks/bookmarks";
import { useUser } from "@/hooks/auth";

interface PlayDetailHeaderProps {
  play: Play;
}

export default function PlayDetailHeader({ play }: PlayDetailHeaderProps) {
  const { copyToClipboard } = useClipboard({
    successMessage: "링크가 복사되었습니다.",
  });

  const { user, isAuthenticated } = useUser();
  const userId = user?.id;
  const { requireAuth } = useLoginRequired();
  const { data: bookmarks } = useGetBookmarks({ playId: play.id, userId });
  const createBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();

  const isBookmarked = isAuthenticated && bookmarks && bookmarks.length > 0;

  const handleBookmarkButtonClick = () => {
    requireAuth(() => {
      if (isBookmarked) {
        deleteBookmark.mutate({ playId: play.id });
      } else {
        createBookmark.mutate({ playId: play.id });
      }
    });
  };

  const handleShareButtonClick = () => {
    const fullUrl = window.location.href;
    copyToClipboard(fullUrl);
  };

  return (
    <div className="full-bleed border-b border-primary">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-[20px] pb-5 lg:gap-5 lg:px-[120px]">
        <h1 className="flex font-serif text-2xl font-bold leading-[28px] text-gray-1 lg:text-[48px] lg:leading-[62.4px]">
          {play.title}
        </h1>
        <div className="flex items-center justify-between">
          {play.author ? (
            <Link
              href={`/author/${play.author.id}`}
              className="flex items-center gap-1.5"
            >
              <span className="font-serif text-sm font-bold leading-[18px] text-primary lg:text-[28px] lg:leading-[36.4px]">
                {play.author.authorName}
              </span>
              <ChevronRight className="h-5 w-5 font-normal text-primary lg:h-9 lg:w-9" />
            </Link>
          ) : (
            <span className="font-serif text-sm font-bold leading-[18px] text-primary lg:text-[28px] lg:leading-[36.4px]">
              작가 미지정
            </span>
          )}

          <div className="flex items-center gap-3">
            <BookmarkButton
              onClick={handleBookmarkButtonClick}
              isBookmarked={isBookmarked}
            />
            <ShareButton onClick={handleShareButtonClick} />
          </div>
        </div>
      </div>
    </div>
  );
}

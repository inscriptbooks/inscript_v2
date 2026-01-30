"use client";

import { BookmarkButton, ShareButton } from "@/components/common/Button";
import { Program } from "@/models/program";
import { useClipboard, useLoginRequired } from "@/hooks/common";
import {
  useCreateBookmark,
  useDeleteBookmark,
  useGetBookmarks,
} from "@/hooks/bookmarks";
import { useUser } from "@/hooks/auth";

interface ProgramDetailHeaderProps {
  program: Program;
}

export default function ProgramDetailHeader({
  program,
}: ProgramDetailHeaderProps) {
  const { copyToClipboard } = useClipboard({
    successMessage: "링크가 복사되었습니다.",
  });

  const { user, isAuthenticated } = useUser();
  const userId = user?.id;
  const { requireAuth } = useLoginRequired();
  const { data: bookmarks } = useGetBookmarks({
    programId: program.id,
    userId,
  });
  const createBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();

  const isBookmarked = isAuthenticated && bookmarks && bookmarks.length > 0;

  const handleBookmarkButtonClick = () => {
    requireAuth(() => {
      if (isBookmarked) {
        deleteBookmark.mutate({ programId: program.id });
      } else {
        createBookmark.mutate({ programId: program.id });
      }
    });
  };

  const handleShareButtonClick = () => {
    const fullUrl = window.location.href;
    copyToClipboard(fullUrl);
  };

  return (
    <div className="full-bleed flex flex-col border-b border-primary">
      <div className="mx-auto flex w-full max-w-[1440px] justify-between px-[20px] pb-5 lg:gap-5 lg:px-[120px] lg:pb-8">
        <h1 className="flex font-serif text-2xl font-bold leading-[28px] text-gray-1 lg:text-[32px] lg:leading-[36px]">
          {program.title}
        </h1>
        <div className="flex items-center gap-3">
          <BookmarkButton
            onClick={handleBookmarkButtonClick}
            isBookmarked={isBookmarked}
          />
          <ShareButton onClick={handleShareButtonClick} />
        </div>
      </div>
    </div>
  );
}

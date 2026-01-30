"use client";

import { BookmarkButton, ShareButton } from "@/components/common/Button";
import { useClipboard, useLoginRequired } from "@/hooks/common";
import {
  useCreateBookmark,
  useDeleteBookmark,
  useGetBookmarks,
} from "@/hooks/bookmarks";
import { useUser } from "@/hooks/auth";
import { Author } from "@/models/author";

interface AuthorDetailHeaderProps {
  author: Author;
}

export default function AuthorDetailHeader({
  author,
}: AuthorDetailHeaderProps) {
  const { authorName, authorNameEn } = author;
  const { copyToClipboard } = useClipboard({
    successMessage: "링크가 복사되었습니다.",
  });

  const { user, isAuthenticated } = useUser();
  const userId = user?.id;
  const { requireAuth } = useLoginRequired();
  const { data: bookmarks } = useGetBookmarks({ authorId: author.id, userId });
  const createBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();

  const isBookmarked = isAuthenticated && bookmarks && bookmarks.length > 0;

  const handleBookmarkButtonClick = () => {
    requireAuth(() => {
      if (isBookmarked) {
        deleteBookmark.mutate({ authorId: author.id });
      } else {
        createBookmark.mutate({ authorId: author.id });
      }
    });
  };

  const handleShareButtonClick = () => {
    const fullUrl = window.location.href;
    copyToClipboard(fullUrl);
  };

  return (
    <div className="full-bleed flex flex-col border-b border-primary">
      <div className="mx-auto flex w-full max-w-[1440px] items-end justify-between px-[20px] pb-5 pt-11 lg:px-[120px] lg:pt-[120px]">
        <div className="flex items-center gap-6">
          <h1 className="flex flex-col gap-2 font-serif text-[32px] font-bold leading-9 lg:flex-row">
            <span className="text-gray-1">{authorName}</span>
            {authorNameEn && (
              <span className="text-gray-5">{authorNameEn}</span>
            )}
          </h1>
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
  );
}

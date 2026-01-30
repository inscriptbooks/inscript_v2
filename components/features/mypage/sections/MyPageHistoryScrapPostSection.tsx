"use client";

import { Post } from "@/models/post";
import { ShowMoreButton } from "@/components/common";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";

interface MyPageHistoryScrapPostSectionProps {
  posts: Post[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function MyPageHistoryScrapPostSection({
  posts,
  onLoadMore,
  hasMore,
  isLoading,
}: MyPageHistoryScrapPostSectionProps) {
  return (
    <section className="flex w-full flex-col gap-7">
      <h2 className="self-start text-xl font-semibold text-gray-1">
        내가 스크랩한 게시글
      </h2>

      {posts.length === 0 ? (
        <p className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
          스크랩한 게시글이 없습니다.
        </p>
      ) : (
        <>
          <div className="flex flex-col border-b border-red-2">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.type}/${post.id}`}
                className="flex items-center justify-between py-2.5 transition-colors hover:bg-gray-6/50"
              >
                {/* Left side: title and comment count */}
                <div className="flex max-w-[520px] items-center gap-2.5">
                  <span className="line-clamp-1 text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                    {post.title}
                  </span>
                  {post.commentCount && (
                    <span className="text-sm font-bold leading-4 tracking-[-0.28px] text-primary">
                      {post.commentCount}
                    </span>
                  )}
                </div>

                {/* Right side: timestamp */}
                <div className="flex w-20 items-center justify-end">
                  <span className="text-right text-sm font-bold leading-4 tracking-[-0.28px] text-gray-3">
                    {formatRelativeTime(post.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {hasMore && (
            <ShowMoreButton
              className="self-center"
              onClick={onLoadMore}
              disabled={isLoading}
            />
          )}
        </>
      )}
    </section>
  );
}

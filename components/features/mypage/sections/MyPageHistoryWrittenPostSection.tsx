"use client";

import { useEffect } from "react";
import { useGetPostsPaginated } from "@/hooks/posts";
import { useLoader } from "@/hooks/common";
import { ShowMoreButton } from "@/components/common/Button";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

interface MyPageHistoryWrittenPostSectionProps {
  userId: string;
}

export default function MyPageHistoryWrittenPostSection({
  userId,
}: MyPageHistoryWrittenPostSectionProps) {
  const { showLoader, hideLoader } = useLoader();

  // 함께하기
  const {
    data: companionData,
    fetchNextPage: fetchNextCompanion,
    hasNextPage: hasNextCompanion,
    isFetchingNextPage: isFetchingNextCompanion,
    isLoading: isCompanionLoading,
  } = useGetPostsPaginated({ createdById: userId, type: "recruit", limit: 5 });

  // 홍보하기
  const {
    data: qnaData,
    fetchNextPage: fetchNextQna,
    hasNextPage: hasNextQna,
    isFetchingNextPage: isFetchingNextQna,
    isLoading: isQnaLoading,
  } = useGetPostsPaginated({ createdById: userId, type: "qna", limit: 5 });

  // 사고팔기
  const {
    data: marketData,
    fetchNextPage: fetchNextMarket,
    hasNextPage: hasNextMarket,
    isFetchingNextPage: isFetchingNextMarket,
    isLoading: isMarketLoading,
  } = useGetPostsPaginated({ createdById: userId, type: "market", limit: 5 });

  // 얘기하기
  const {
    data: promotionData,
    fetchNextPage: fetchNextPromotion,
    hasNextPage: hasNextPromotion,
    isFetchingNextPage: isFetchingNextPromotion,
    isLoading: isPromotionLoading,
  } = useGetPostsPaginated({
    createdById: userId,
    type: "promotion",
    limit: 5,
  });

  const companionPosts =
    companionData?.pages.flatMap((page) => page.posts) ?? [];
  const qnaPosts = qnaData?.pages.flatMap((page) => page.posts) ?? [];
  const marketPosts = marketData?.pages.flatMap((page) => page.posts) ?? [];
  const promotionPosts =
    promotionData?.pages.flatMap((page) => page.posts) ?? [];

  // 모든 데이터가 로딩 중일 때 로더 표시
  useEffect(() => {
    if (
      isCompanionLoading ||
      isQnaLoading ||
      isMarketLoading ||
      isPromotionLoading
    ) {
      showLoader();
    } else {
      hideLoader();
    }

    return () => {
      hideLoader();
    };
  }, [
    isCompanionLoading,
    isQnaLoading,
    isMarketLoading,
    isPromotionLoading,
    showLoader,
    hideLoader,
  ]);

  const renderPostList = (
    title: string,
    posts: typeof companionPosts,
    postType: string,
    isLoading: boolean,
    hasNextPage: boolean,
    fetchNextPage: () => void,
    isFetchingNextPage: boolean
  ) => (
    <div className="flex flex-1 flex-col gap-5">
      {/* Title section with border bottom */}
      <div className="flex justify-between border-b border-red-2 pb-3">
        <h2 className="text-xl font-bold leading-6 text-primary">{title}</h2>
      </div>

      {isLoading ? null : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
            게시글이 없습니다.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${postType}/${post.id}`}
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
          {hasNextPage && (
            <ShowMoreButton
              className="self-center"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            />
          )}
        </>
      )}
    </div>
  );

  return (
    <section className="flex w-full flex-col gap-7">
      <h2 className="self-start text-xl font-semibold text-gray-1">
        내가 작성한 게시글
      </h2>

      <div className="flex w-full flex-col justify-center gap-11 lg:flex-row">
        {renderPostList(
          "함께하기",
          companionPosts,
          "recruit",
          isCompanionLoading,
          hasNextCompanion ?? false,
          fetchNextCompanion,
          isFetchingNextCompanion
        )}
        {renderPostList(
          "홍보하기",
          qnaPosts,
          "qna",
          isQnaLoading,
          hasNextQna ?? false,
          fetchNextQna,
          isFetchingNextQna
        )}
      </div>

      <div className="flex w-full flex-col justify-center gap-11 lg:flex-row">
        {renderPostList(
          "사고팔기",
          marketPosts,
          "market",
          isMarketLoading,
          hasNextMarket ?? false,
          fetchNextMarket,
          isFetchingNextMarket
        )}
        {renderPostList(
          "얘기하기",
          promotionPosts,
          "promotion",
          isPromotionLoading,
          hasNextPromotion ?? false,
          fetchNextPromotion,
          isFetchingNextPromotion
        )}
      </div>
    </section>
  );
}

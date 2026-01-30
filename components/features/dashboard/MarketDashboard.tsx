"use client";

import { Post, PostType } from "@/models/post";
import { formatRelativeTime } from "@/lib/utils";
import {
  CommunityPostButton,
  SearchInput,
  EmptyBox,
} from "@/components/common";
import { CommentCount } from "@/components/common/CommentCount";
import { Pagination } from "@/components/common";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useGetPostsPaginated } from "@/hooks/posts";
import { useLoader } from "@/hooks/common";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Comment } from "@/components/icons";

interface MarketDashboardProps {
  type?: PostType;
}

export default function MarketDashboard({
  type = "market",
}: MarketDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const { showLoader, hideLoader } = useLoader();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useGetPostsPaginated({
      type,
      limit: 10,
      keyword,
    });

  const pages = data?.pages || [];
  const lastPage = pages.length > 0 ? pages[pages.length - 1] : undefined;
  const totalPages = lastPage?.meta?.totalPages || 1;

  const [viewPage, setViewPage] = useState(1);

  useEffect(() => {
    if (isFetching) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isFetching, showLoader, hideLoader]);

  useEffect(() => {
    if (lastPage?.meta?.currentPage && viewPage > totalPages) {
      setViewPage(lastPage.meta.currentPage);
    }
  }, [lastPage?.meta?.currentPage, totalPages, viewPage]);

  // 키워드 변경 시 페이지를 1로 리셋하여 즉시 반영
  useEffect(() => {
    setViewPage(1);
  }, [keyword]);

  const selectedPage =
    pages.find((p) => p.meta?.currentPage === viewPage) || lastPage;
  const marketItems: Post[] = selectedPage?.posts || [];

  const handleMarketItemClick = (item: Post) => {
    router.push(`/community/market/${item.id}`);
  };

  return (
    <div className="flex w-full flex-col pt-3 lg:pt-7">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-primary">사고팔기</h2>
          <p className="text-gray-2">사고팔기 게시판</p>
        </div>

        <Suspense fallback={<div />}>
          <SearchInput
            value={keyword}
            wrapperClassName="w-full lg:w-[375px] lg:h-12"
            className="px-0 py-0 lg:px-0 lg:py-0 lg:text-lg"
            showFilter={true}
          />
        </Suspense>
      </div>

      {/* Market Grid */}
      <div className="pt-3">
        {marketItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-3 self-stretch md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {/* Posts grid */}
              {marketItems.map((post) => (
                <Card
                  key={post.id}
                  className="h-full w-full cursor-pointer border border-red-3"
                  onClick={() => handleMarketItemClick(post)}
                >
                  <CardContent className="flex w-full flex-1 flex-col items-start p-0">
                    {/* Image */}
                    <div className="relative aspect-video w-full">
                      {/* FIXME: 썸네일 기본 이미지 필요 */}
                      <Image
                        src={post.thumbnailUrl ?? "/images/noimage.png"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col items-start gap-1 self-stretch bg-white px-[18px] py-4">
                      {/* Title and comment count */}
                      <div className="flex items-center justify-between self-stretch">
                        <h3 className="line-clamp-1 text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Comment size={24} color="#6D6D6D" />
                          <CommentCount
                            count={post.commentCount}
                            className="text-gray-3"
                          />
                        </div>
                      </div>

                      {/* Author and timestamp */}
                      <div className="flex items-center justify-between self-stretch">
                        <div className="flex items-center gap-1.5">
                          <div className="h-5 w-5 rounded-full bg-gray-5" />
                          <span className="line-clamp-1 text-sm font-medium leading-4 text-gray-3">
                            {post.user.name}
                          </span>
                        </div>
                        <span className="shrink-0 text-sm font-bold leading-4 tracking-[-0.28px] text-primary">
                          {formatRelativeTime(post.createdAt)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 flex w-full flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">
              <Pagination
                currentPage={viewPage}
                totalPages={totalPages}
                onPageChange={(nextPage) => {
                  if (nextPage === viewPage) return;

                  const isLoaded = pages.some(
                    (p) => p.meta?.currentPage === nextPage
                  );
                  if (isLoaded) {
                    setViewPage(nextPage);
                    return;
                  }

                  // 아직 로드되지 않은 경우: 바로 다음 페이지만 지원되므로 완료 후 전환
                  const lastLoaded =
                    lastPage?.meta?.currentPage || pages.length;
                  if (
                    nextPage === lastLoaded + 1 &&
                    hasNextPage &&
                    !isFetchingNextPage
                  ) {
                    fetchNextPage().then(() => {
                      setViewPage(nextPage);
                    });
                  }
                }}
              />
              <CommunityPostButton type="market" />
            </div>
          </>
        ) : (
          !isFetching && <EmptyBox text="게시글이 없습니다." />
        )}
      </div>
    </div>
  );
}

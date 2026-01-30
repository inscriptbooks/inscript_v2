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

interface QnaDashboardProps {
  type?: PostType;
}

export default function QnaDashboard({ type = "qna" }: QnaDashboardProps) {
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
  const qnaItems: Post[] = selectedPage?.posts || [];

  const handleQnaItemClick = (item: Post) => {
    router.push(`/community/qna/${item.id}`);
  };

  return (
    <div className="flex w-full flex-col pt-3 lg:pt-7">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-primary">홍보하기</h2>
          <p className="text-gray-2">홍보하기 게시판</p>
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

      {/* QnA Table */}
      <div className="overflow-x-auto lg:pt-3">
        {qnaItems.length > 0 ? (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-red-2">
                  <th className="px-3 py-3 text-left text-sm font-bold text-primary">
                    제목
                  </th>
                  <th className="w-[75px] shrink-0 px-3 py-3 text-sm font-bold text-primary lg:w-[150px]">
                    작성자
                  </th>
                  <th className="w-[70px] shrink-0 px-3 py-3 text-sm font-bold text-primary lg:w-[80px]">
                    작성일
                  </th>
                </tr>
              </thead>
              <tbody>
                {qnaItems.map((item) => (
                  <tr
                    key={item.id}
                    className="cursor-pointer transition-colors hover:bg-gray-6/50"
                    onClick={() => handleQnaItemClick(item)}
                  >
                    {/* Title Column */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="line-clamp-1 text-sm text-gray-1">
                          {item.title}
                        </div>
                        <CommentCount count={item.commentCount} />
                      </div>
                    </td>

                    {/* Author Column */}
                    <td className="shrink-0 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        {/* Avatar Circle */}
                        <div className="h-6 w-6 shrink-0 rounded-full bg-gray-5" />
                        {/* Author Name */}
                        <span className="line-clamp-1 text-sm text-gray-3">
                          {item.user.name}
                        </span>
                      </div>
                    </td>

                    {/* Timestamp Column */}
                    <td className="px-3 py-2.5 text-center">
                      <span className="shrink-0 text-sm text-gray-3">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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
              <CommunityPostButton type="qna" />
            </div>
          </>
        ) : (
          !isFetching && <EmptyBox text="게시글이 없습니다." />
        )}
      </div>
    </div>
  );
}

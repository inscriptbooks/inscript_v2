"use client";

import { MemoList } from "@/components/features/mypage/components";
import { ShowMoreButton } from "@/components/common";
import { useGetLikedMemos } from "@/hooks/likes";
import { useMemo } from "react";

export default function MyPageHistoryLikesMemoSection() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetLikedMemos({ limit: 5 });

  const memos = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const handleShowMoreButtonClick = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <section className="flex w-full flex-col gap-14 lg:flex-row">
        <div className="flex flex-col items-center gap-7">
          <h2 className="self-start text-xl font-semibold text-gray-1">
            좋아요한 메모
          </h2>
          <div className="text-gray-3">로딩 중...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col gap-14 lg:flex-row">
      <div className="flex flex-col items-center gap-7">
        <h2 className="self-start text-xl font-semibold text-gray-1">
          좋아요한 메모
        </h2>
        {memos.length === 0 ? (
          <div className="text-gray-3">좋아요한 메모가 없습니다.</div>
        ) : (
          <>
            <MemoList
              memoList={memos}
              className="grid grid-cols-1 lg:auto-rows-max lg:grid-cols-2"
            />
            {hasNextPage && (
              <ShowMoreButton
                onClick={handleShowMoreButtonClick}
                disabled={isFetchingNextPage}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

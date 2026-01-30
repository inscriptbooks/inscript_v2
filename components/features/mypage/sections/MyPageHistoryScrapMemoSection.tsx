"use client";

import { MemoList } from "@/components/features/mypage/components";
import { Memo } from "@/models/memo";
import { ShowMoreButton } from "@/components/common";

interface MyPageHistoryScrapMemoSectionProps {
  memoScraps: Memo[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function MyPageHistoryScrapMemoSection({
  memoScraps,
  onLoadMore,
  hasMore,
  isLoading,
}: MyPageHistoryScrapMemoSectionProps) {
  return (
    <section className="flex-1 w-full flex-col gap-14 lg:flex-row">
      <div className="flex flex-col items-center gap-7">
        <h2 className="self-start text-xl font-semibold text-gray-1">
          내가 스크랩한 메모
        </h2>
        {memoScraps.length === 0 ? (
          <p className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
            스크랩한 메모가 없습니다.
          </p>
        ) : (
          <>
            <MemoList
              memoList={memoScraps}
              className="grid grid-cols-1 lg:auto-rows-max lg:grid-cols-2"
            />
            {hasMore && (
              <ShowMoreButton onClick={onLoadMore} disabled={isLoading} />
            )}
          </>
        )}
      </div>
    </section>
  );
}

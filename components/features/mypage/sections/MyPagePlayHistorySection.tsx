"use client";

import { PlayHistoryCard } from "@/components/features/play";
import ShowMoreButton from "@/components/common/Button/ShowMoreButton";
import { Play } from "@/models/play";

interface MyPagePlayHistorySectionProps {
  playHistory: Play[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore?: boolean;
}

export default function MyPagePlayHistorySection({
  playHistory,
  hasMore,
  onLoadMore,
  isLoadingMore = false,
}: MyPagePlayHistorySectionProps) {
  return (
    <section className="flex w-full flex-col items-center gap-7">
      <div className="flex flex-col items-start gap-3 self-stretch">
        <h1 className="font-pretendard text-xl font-semibold leading-6 text-gray-1">
          내가 등록한 희곡
        </h1>
      </div>

      <div className="flex flex-col items-start gap-[18px] self-stretch">
        {playHistory.map((item) => (
          <PlayHistoryCard key={item.id} item={item} />
        ))}
      </div>

      {hasMore && (
        <ShowMoreButton 
          onClick={onLoadMore}
          disabled={isLoadingMore}
        />
      )}
    </section>
  );
}

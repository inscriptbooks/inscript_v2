"use client";

import { PlayHistoryCard } from "@/components/features/play";
import ShowMoreButton from "@/components/common/Button/ShowMoreButton";
import { Play } from "@/models/play";
import { useRouter } from "next/navigation";

interface MyPageHistoryScrapPlaySectionProps {
  playScraps: Play[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function MyPageHistoryScrapPlaySection({
  playScraps,
  onLoadMore,
  hasMore,
  isLoading,
}: MyPageHistoryScrapPlaySectionProps) {
  const router = useRouter();

  const handlePlayClick = (playId: string) => {
    router.push(`/play/${playId}`);
  };

  return (
    <section className="flex w-full flex-col items-center gap-7">
      <div className="flex flex-col items-start gap-3 self-stretch">
        <h1 className="font-pretendard text-xl font-semibold leading-6 text-gray-1">
          내가 스크랩한 희곡
        </h1>
      </div>

      {playScraps.length === 0 ? (
        <p className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
          스크랩한 희곡이 없습니다.
        </p>
      ) : (
        <>
          <div className="flex flex-col items-start gap-[18px] self-stretch">
            {playScraps.map((item) => (
              <PlayHistoryCard 
                key={item.id} 
                item={item} 
                showStatus={false}
                onClick={() => handlePlayClick(item.id)}
              />
            ))}
          </div>

          {hasMore && (
            <ShowMoreButton onClick={onLoadMore} disabled={isLoading} />
          )}
        </>
      )}
    </section>
  );
}

"use client";

import { EmptyBox, ViewMoreLinkButton } from "@/components/common";
import { PlayPreviewCard } from "@/components/features/play";
import { Play } from "@/models/play";

interface MainSearchResultPlaySectionProps {
  plays: Play[];
}

export default function MainSearchResultPlaySection({
  plays,
}: MainSearchResultPlaySectionProps) {
  return (
    <section className="flex w-full flex-col gap-5 pt-1 lg:pt-1.5">
      <div className="flex items-center justify-between">
        <span className="font-serif text-xl font-bold text-gray-1 lg:text-[28px]">
          희곡
        </span>
        <ViewMoreLinkButton href="/play" />
      </div>

      {plays.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6 xl:grid-cols-5">
          {plays.map((play) => (
            <PlayPreviewCard key={play.id} play={play} />
          ))}
        </div>
      ) : (
        <EmptyBox text="검색 결과가 없습니다." />
      )}
    </section>
  );
}

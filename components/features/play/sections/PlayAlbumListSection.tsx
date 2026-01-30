"use client";

import { PlayAlbumList } from "../components";
import { ShowMoreButton } from "@/components/common";
import { useGetPlaysPaginated } from "@/hooks/plays";
import { useEffect } from "react";
import { useLoader, useBreakpoint } from "@/hooks/common";
import { ApplyStatus } from "@/models/play";

interface PlayAlbumListSectionProps {
  keyword?: string;
}

export default function PlayAlbumListSection({
  keyword,
}: PlayAlbumListSectionProps) {
  const { showLoader, hideLoader } = useLoader();
  const { isAbove } = useBreakpoint();

  const {
    data: playsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPlaysPaginated({
    keyword,
    limit: isAbove("lg") ? 10 : 8,
    applyStatus: ApplyStatus.ACCEPTED,
  });

  const plays = playsData?.pages.flatMap((page) => page.plays) ?? [];

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  return (
    <section className="flex flex-col gap-8">
      {plays.length > 0 ? (
        <>
          <PlayAlbumList
            playList={plays}
            onMoreClick={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />

          {hasNextPage && (
            <div className="hidden justify-center lg:flex">
              <ShowMoreButton
                onClick={fetchNextPage}
                disabled={isFetchingNextPage}
              />
            </div>
          )}
        </>
      ) : (
        <span className="font-serif font-bold text-orange-2 lg:text-xl">
          검색 결과에 해당하는 희곡이 없습니다.
        </span>
      )}
    </section>
  );
}

"use client";

import { PlayDetailMemoListSection } from "@/components/features/play";
import { useGetMemosPaginated } from "@/hooks/memos";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLoader } from "@/hooks/common";

export default function PlayDetailMemoListPage() {
  const params = useParams();
  const playId = params.playId as string;
  const { showLoader, hideLoader } = useLoader();

  const {
    data: memosData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMemosPaginated({
    type: "play",
    playId,
    limit: 10,
  });

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  const playMemoList = memosData?.pages.flatMap((page) => page.memos) ?? [];

  return (
    <section className="flex w-full flex-1 flex-col">
      <PlayDetailMemoListSection
        playMemoList={playMemoList}
        onMoreClick={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </section>
  );
}

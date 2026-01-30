"use client";

import {
  PlayDetailMemoSection,
  PlayDetailSection,
} from "@/components/features/play/sections";
import { useGetPlay } from "@/hooks/plays";
import { useGetMemos } from "@/hooks/memos";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLoader } from "@/hooks/common";

export default function PlayDetailPage() {
  const { playId } = useParams<{ playId: string }>();
  const { data: play } = useGetPlay(playId);
  const { data: memosData, isLoading: memosLoading } = useGetMemos({
    type: "play",
    limit: 3,
    playId,
  });

  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (memosLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [memosLoading, showLoader, hideLoader]);

  const playMemoList = memosData?.memos ?? [];
  const playMemoCount = memosData?.meta.totalCount ?? 0;

  if (!play) return null;

  return (
    <section className="flex w-full flex-1 flex-col pb-[60px] pt-11 lg:pt-[80px]">
      <PlayDetailSection play={play} />
      <PlayDetailMemoSection
        playId={playId}
        playMemoList={playMemoList}
        playMemoCount={playMemoCount}
      />
    </section>
  );
}

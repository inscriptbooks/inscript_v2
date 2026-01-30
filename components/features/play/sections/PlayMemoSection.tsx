"use client";

import { MemoList } from "@/components/features/memo";
import { useGetMemosPaginated } from "@/hooks/memos";
import { useLoader } from "@/hooks/common";
import { useEffect } from "react";
import { ShowMoreButton } from "@/components/common";

export default function PlayMemoSection() {
  const { showLoader, hideLoader } = useLoader();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetMemosPaginated({
      type: "play",
      limit: 3,
    });

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  const playMemos = data?.pages?.flatMap((page) => page.memos) ?? [];

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="font-serif text-xl font-bold text-primary lg:text-[28px]">
          희곡 메모
        </span>
      </div>

      <MemoList memoList={playMemos} hideCreatedAt />

      {hasNextPage && (
        <div className="mt-5 flex justify-center">
          <ShowMoreButton
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          />
        </div>
      )}
    </section>
  );
}

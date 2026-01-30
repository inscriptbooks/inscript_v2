"use client";

import { useEffect } from "react";
import {
  MyPageHistoryScrapPlaySection,
  MyPageHistoryScrapProgramSection,
  MyPageHistoryScrapMemoSection,
  MyPageHistoryScrapPostSection,
} from "@/components/features/mypage";
import {
  useGetBookmarkedPlays,
  useGetBookmarkedPrograms,
  useGetBookmarkedMemos,
  useGetBookmarkedPosts,
} from "@/hooks/bookmarks";
import { useLoader } from "@/hooks/common";

export default function MyPageHistoryScrapsPage() {
  const { showLoader, hideLoader } = useLoader();

  // 북마크된 데이터 가져오기
  const {
    data: playsData,
    fetchNextPage: fetchNextPlays,
    hasNextPage: hasNextPlays,
    isFetchingNextPage: isFetchingNextPlays,
    isLoading: isPlaysLoading,
  } = useGetBookmarkedPlays({ limit: 5 });

  const {
    data: programsData,
    fetchNextPage: fetchNextPrograms,
    hasNextPage: hasNextPrograms,
    isFetchingNextPage: isFetchingNextPrograms,
    isLoading: isProgramsLoading,
  } = useGetBookmarkedPrograms({ limit: 5 });

  const {
    data: memosData,
    fetchNextPage: fetchNextMemos,
    hasNextPage: hasNextMemos,
    isFetchingNextPage: isFetchingNextMemos,
    isLoading: isMemosLoading,
  } = useGetBookmarkedMemos({ limit: 5 });

  const {
    data: postsData,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: isFetchingNextPosts,
    isLoading: isPostsLoading,
  } = useGetBookmarkedPosts({ limit: 5 });

  // 로딩 상태 관리
  useEffect(() => {
    if (
      isPlaysLoading ||
      isProgramsLoading ||
      isMemosLoading ||
      isPostsLoading
    ) {
      showLoader();
    } else {
      hideLoader();
    }

    return () => {
      hideLoader();
    };
  }, [
    isPlaysLoading,
    isProgramsLoading,
    isMemosLoading,
    isPostsLoading,
    showLoader,
    hideLoader,
  ]);

  const playScraps = playsData?.pages.flatMap((page) => page.plays) ?? [];
  const programScraps =
    programsData?.pages.flatMap((page) => page.programs) ?? [];
  const memoScraps = memosData?.pages.flatMap((page) => page.memos) ?? [];
  const postScraps = postsData?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <section className="flex w-full flex-col items-center gap-14 py-14">
      <MyPageHistoryScrapPlaySection
        playScraps={playScraps}
        onLoadMore={fetchNextPlays}
        hasMore={hasNextPlays ?? false}
        isLoading={isFetchingNextPlays}
      />
      <MyPageHistoryScrapProgramSection
        programScraps={programScraps}
        onLoadMore={fetchNextPrograms}
        hasMore={hasNextPrograms ?? false}
        isLoading={isFetchingNextPrograms}
      />
      <MyPageHistoryScrapMemoSection
        memoScraps={memoScraps}
        onLoadMore={fetchNextMemos}
        hasMore={hasNextMemos ?? false}
        isLoading={isFetchingNextMemos}
      />
      <MyPageHistoryScrapPostSection
        posts={postScraps}
        onLoadMore={fetchNextPosts}
        hasMore={hasNextPosts ?? false}
        isLoading={isFetchingNextPosts}
      />
    </section>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import { MyPagePlayHistorySection } from "@/components/features/mypage";
import { useGetPlaysPaginated } from "@/hooks/plays";
import { useAuthSession } from "@/hooks/auth";
import { useLoader } from "@/hooks/common";
import { redirect } from "next/navigation";

export default function MyPageHistoryPage() {
  const { showLoader, hideLoader } = useLoader();
  const { authUser, isLoading: authLoading, isAuthenticated } = useAuthSession();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetPlaysPaginated({
    createdById: authUser?.id,
    limit: 5,
  });

  // 로딩 상태에 따라 로더 표시
  useEffect(() => {
    if (authLoading || isLoading) {
      showLoader();
    } else {
      hideLoader();
    }

    return () => {
      hideLoader();
    };
  }, [authLoading, isLoading, showLoader, hideLoader]);

  // 인증되지 않은 경우 리디렉션
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      redirect("/auth");
    }
  }, [authLoading, isAuthenticated]);

  const playHistory = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.plays);
  }, [data]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (authLoading || !authUser) {
    return null;
  }

  return (
    <section className="flex w-full flex-col items-center gap-14 py-14">
      <MyPagePlayHistorySection
        playHistory={playHistory}
        hasMore={hasNextPage ?? false}
        onLoadMore={handleLoadMore}
        isLoadingMore={isFetchingNextPage}
      />
    </section>
  );
}

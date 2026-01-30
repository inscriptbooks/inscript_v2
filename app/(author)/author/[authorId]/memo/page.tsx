"use client";

import { AuthorDetailMemoListSection } from "@/components/features/author";
import { useLoader } from "@/hooks/common";
import { useGetMemosPaginated } from "@/hooks/memos";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthorDetailMemoListPage() {
  const params = useParams();
  const authorId = params.authorId as string;
  const { showLoader, hideLoader } = useLoader();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetMemosPaginated({
      type: "author",
      authorId,
      limit: 6,
    });

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  const authorMemoList = data?.pages.flatMap((page) => page.memos) ?? [];

  return (
    <section className="flex w-full flex-1 flex-col">
      <AuthorDetailMemoListSection
        authorMemoList={authorMemoList}
        onMoreClick={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </section>
  );
}

"use client";

import { Suspense, useEffect } from "react";
import { NewsDashboard } from "@/components/features/dashboard";
import { useGetPosts } from "@/hooks/posts";
import { useLoader } from "@/hooks/common";
import { useSearchParams, useRouter } from "next/navigation";

function CommunityNewsPageContent() {
  const { showLoader, hideLoader } = useLoader();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || undefined;
  const filterType = searchParams.get("filterType") || undefined;
  const pageSize = 20;

  const { data, isLoading } = useGetPosts({
    type: "news",
    page: currentPage,
    limit: pageSize,
    keyword,
    filterType: filterType as "title" | "author" | "titleContent" | undefined,
  });

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }

    return () => {
      hideLoader();
    };
  }, [isLoading, showLoader, hideLoader]);

  const posts = data?.posts || [];
  const totalPages = data?.meta?.totalPages || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/community/news?${params.toString()}`);
  };

  return (
    <section className="flex w-full flex-1 flex-col pb-[60px]">
      <NewsDashboard
        newsItems={posts}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
}

export default function CommunityNewsPage() {
  return (
    <Suspense fallback={<div />}>
      <CommunityNewsPageContent />
    </Suspense>
  );
}

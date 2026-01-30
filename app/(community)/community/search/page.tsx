"use client";

import { Suspense, useEffect } from "react";
import {
  CommunitySearchResultSection,
  CommunityPostFeedSection,
  CommunityPostListSection,
} from "@/components/features/community";

import { useGetPosts } from "@/hooks/posts";
import { useSaveSearchKeyword } from "@/hooks/search-keywords";
import { useSearchParams } from "next/navigation";

function CommunitySearchPageContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const filterType =
    (searchParams.get("filterType") as "title" | "author" | "titleContent") ||
    "title";
  const { mutate: saveSearchKeyword } = useSaveSearchKeyword();

  // 각 타입별로 검색 결과 가져오기
  const { data: newsData } = useGetPosts({
    type: "news",
    keyword,
    filterType,
    limit: 6,
  });
  const { data: popularData } = useGetPosts({
    sortBy: "viewCount",
    keyword,
    filterType,
    limit: 6,
  });
  const { data: marketData } = useGetPosts({
    type: "market",
    keyword,
    filterType,
    limit: 6,
  });
  const { data: recruitData } = useGetPosts({
    type: "recruit",
    keyword,
    filterType,
    limit: 6,
  });
  const { data: qnaData } = useGetPosts({
    type: "qna",
    keyword,
    filterType,
    limit: 6,
  });
  const { data: promotionData } = useGetPosts({
    type: "promotion",
    keyword,
    filterType,
    limit: 6,
  });

  useEffect(() => {
    if (keyword && keyword.trim() !== "") {
      saveSearchKeyword({ keyword: keyword.trim() });
    }
  }, [keyword, saveSearchKeyword]);

  const inscriptNewsPosts = newsData?.posts ?? [];
  const popularPosts = popularData?.posts ?? [];
  const marketPosts = marketData?.posts ?? [];
  const recruitPosts = recruitData?.posts ?? [];
  const qnaPosts = qnaData?.posts ?? [];
  const promotionPosts = promotionData?.posts ?? [];

  return (
    <section className="flex w-full flex-1 flex-col gap-10 pb-[60px] pt-7">
      <CommunitySearchResultSection keyword={keyword} />

      <CommunityPostListSection
        list={[
          {
            title: "인크소식",
            viewMoreLink: "/community/news",
            posts: inscriptNewsPosts,
          },
          {
            title: "인기글",
            posts: popularPosts,
          },
        ]}
      />

      <CommunityPostFeedSection
        feed={{
          title: "사고팔기",
          description: "*게시판 설명글입니다.",
          posts: marketPosts,
          viewMoreLink: "/community/market",
        }}
      />

      <CommunityPostListSection
        list={[
          {
            title: "함께하기",
            posts: recruitPosts,
            viewMoreLink: "/community/recruit",
          },
          {
            title: "홍보하기",
            posts: qnaPosts,
            viewMoreLink: "/community/qna",
          },
        ]}
      />

      <CommunityPostFeedSection
        feed={{
          title: "얘기하기",
          description: "*게시판 설명글입니다.",
          posts: promotionPosts,
          viewMoreLink: "/community/promotion",
        }}
      />
    </section>
  );
}

export default function CommunitySearchPage() {
  return (
    <Suspense fallback={<div />}>
      <CommunitySearchPageContent />
    </Suspense>
  );
}

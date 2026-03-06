export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { SearchInput } from "@/components/common";
import {
  CommunityPostFeedSection,
  CommunityPostListSection,
} from "@/components/features/community";
import { SubHeader } from "@/components/layout";
import axiosInstance from "@/lib/axios/client";
import { Post } from "@/models/post";

async function fetchPostsByType(type: string, limit: number = 5) {
  try {
    const response = await axiosInstance.get<{ data: Post[] }>("/posts", {
      params: { type, limit },
    });
    return response.data.data || [];
  } catch {
    return [];
  }
}

async function fetchPopularPosts(limit: number = 5) {
  try {
    const response = await axiosInstance.get<{ data: Post[] }>("/posts", {
      params: { sortBy: "viewCount", limit },
    });
    return response.data.data || [];
  } catch {
    return [];
  }
}

export default async function CommunityPage() {
  // 각 타입별로 최신 5개씩 가져오기
  const [
    inscriptNewsPosts,
    popularPosts,
    marketPosts,
    recruitPosts,
    qnaPosts,
    promotionPosts,
  ] = await Promise.all([
    fetchPostsByType("news", 5),
    fetchPopularPosts(5),
    fetchPostsByType("market", 5),
    fetchPostsByType("recruit", 5),
    fetchPostsByType("qna", 5),
    fetchPostsByType("promotion", 5),
  ]);

  return (
    <section className="flex w-full flex-1 flex-col gap-10 pb-[60px]">
      <SubHeader activeTab="home" />

      <Suspense fallback={<div />}>
        <SearchInput searchPath="/community/search" showFilter={true} />
      </Suspense>

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

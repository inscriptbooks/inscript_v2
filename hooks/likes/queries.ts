import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getLikes,
  getLikeById,
  GetLikesParams,
  getLikedMemos,
  GetLikedMemosParams,
  LikedMemosResponse,
  getLikedPosts,
  GetLikedPostsParams,
} from "./apis";
import { likeKeys } from "./keys";
import { Like } from "@/models/like";
import { Post } from "@/models/post";
import type { ApiResponse } from "@/lib/types/api";

export const useGetLikes = (params?: GetLikesParams) => {
  return useQuery<Like[], Error>({
    queryKey: likeKeys.list(params || {}),
    queryFn: () => getLikes(params),
    enabled: !!params?.userId,
  });
};

export const useGetLike = (id: string) => {
  return useQuery<Like, Error>({
    queryKey: likeKeys.detail(id),
    queryFn: () => getLikeById(id),
    enabled: !!id,
  });
};

export const useGetLikedMemos = (params?: GetLikedMemosParams) => {
  return useInfiniteQuery<LikedMemosResponse, Error>({
    queryKey: likeKeys.likedMemos(params || {}),
    queryFn: ({ pageParam = 1 }) =>
      getLikedMemos({
        ...params,
        page: pageParam as number,
        limit: params?.limit || 5,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.meta.hasMore
        ? (lastPage.meta.currentPage || 1) + 1
        : undefined;
    },
    initialPageParam: 1,
  });
};

type LikedPostsResponse = ApiResponse<Post[]>;

interface LikedPostsPageData {
  posts: Post[];
  meta: LikedPostsResponse["meta"];
}

export const useGetLikedPosts = (params?: GetLikedPostsParams) => {
  return useInfiniteQuery<LikedPostsResponse, Error, { pages: LikedPostsPageData[], pageParams: unknown[] }>({
    queryKey: likeKeys.likedPosts(params || {}),
    queryFn: ({ pageParam = 1 }) =>
      getLikedPosts({
        ...params,
        page: pageParam as number,
        limit: params?.limit || 5,
      }),
    select: (data) => ({
      pages: data.pages.map((page) => ({
        posts: page.data || [],
        meta: page.meta,
      })),
      pageParams: data.pageParams,
    }),
    getNextPageParam: (lastPage) => {
      return lastPage.meta.hasMore
        ? (lastPage.meta.currentPage || 1) + 1
        : undefined;
    },
    initialPageParam: 1,
  });
};

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getBookmarks,
  getBookmarkById,
  GetBookmarksParams,
  getBookmarkedPlays,
  GetBookmarkedPlaysParams,
  getBookmarkedPrograms,
  GetBookmarkedProgramsParams,
  getBookmarkedMemos,
  GetBookmarkedMemosParams,
  getBookmarkedPosts,
  GetBookmarkedPostsParams,
} from "./apis";
import { bookmarkKeys } from "./keys";
import { Bookmark } from "@/models/bookmark";
import { Play } from "@/models/play";
import { Program } from "@/models/program";
import { Memo } from "@/models/memo";
import { Post } from "@/models/post";
import type { ApiResponse } from "@/lib/types/api";

export const useGetBookmarks = (params?: GetBookmarksParams) => {
  return useQuery<Bookmark[], Error>({
    queryKey: bookmarkKeys.list(params || {}),
    queryFn: () => getBookmarks(params),
    enabled: !!params?.userId,
  });
};

export const useGetBookmark = (id: string) => {
  return useQuery<Bookmark, Error>({
    queryKey: bookmarkKeys.detail(id),
    queryFn: () => getBookmarkById(id),
    enabled: !!id,
  });
};

type BookmarkedPlaysResponse = ApiResponse<Play[]>;

interface BookmarkedPlaysPageData {
  plays: Play[];
  meta: BookmarkedPlaysResponse["meta"];
}

export const useGetBookmarkedPlays = (params?: GetBookmarkedPlaysParams) => {
  return useInfiniteQuery<BookmarkedPlaysResponse, Error, { pages: BookmarkedPlaysPageData[], pageParams: unknown[] }>({
    queryKey: bookmarkKeys.bookmarkedPlays(params || {}),
    queryFn: ({ pageParam = 1 }) =>
      getBookmarkedPlays({
        ...params,
        page: pageParam as number,
        limit: params?.limit || 5,
      }),
    select: (data) => ({
      pages: data.pages.map((page) => ({
        plays: page.data || [],
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

type BookmarkedProgramsResponse = ApiResponse<Program[]>;

interface BookmarkedProgramsPageData {
  programs: Program[];
  meta: BookmarkedProgramsResponse["meta"];
}

export const useGetBookmarkedPrograms = (
  params?: GetBookmarkedProgramsParams
) => {
  return useInfiniteQuery<BookmarkedProgramsResponse, Error, { pages: BookmarkedProgramsPageData[], pageParams: unknown[] }>({
    queryKey: bookmarkKeys.bookmarkedPrograms(params || {}),
    queryFn: ({ pageParam = 1 }) =>
      getBookmarkedPrograms({
        ...params,
        page: pageParam as number,
        limit: params?.limit || 5,
      }),
    select: (data) => ({
      pages: data.pages.map((page) => ({
        programs: page.data || [],
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

type BookmarkedMemosResponse = ApiResponse<Memo[]>;

interface BookmarkedMemosPageData {
  memos: Memo[];
  meta: BookmarkedMemosResponse["meta"];
}

export const useGetBookmarkedMemos = (params?: GetBookmarkedMemosParams) => {
  return useInfiniteQuery<BookmarkedMemosResponse, Error, { pages: BookmarkedMemosPageData[], pageParams: unknown[] }>({
    queryKey: bookmarkKeys.bookmarkedMemos(params || {}),
    queryFn: ({ pageParam = 1 }) =>
      getBookmarkedMemos({
        ...params,
        page: pageParam as number,
        limit: params?.limit || 5,
      }),
    select: (data) => ({
      pages: data.pages.map((page) => ({
        memos: page.data || [],
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

type BookmarkedPostsResponse = ApiResponse<Post[]>;

interface BookmarkedPostsPageData {
  posts: Post[];
  meta: BookmarkedPostsResponse["meta"];
}

export const useGetBookmarkedPosts = (params?: GetBookmarkedPostsParams) => {
  return useInfiniteQuery<BookmarkedPostsResponse, Error, { pages: BookmarkedPostsPageData[], pageParams: unknown[] }>({
    queryKey: bookmarkKeys.bookmarkedPosts(params || {}),
    queryFn: ({ pageParam = 1 }) =>
      getBookmarkedPosts({
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

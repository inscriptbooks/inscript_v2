import {
  useQuery,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import { getPosts, getPostById, GetPostsParams, PostsResponse } from "./apis";
import { postKeys } from "./keys";
import { Post } from "@/models/post";

interface PostsResponseData {
  posts: Post[];
  meta: PostsResponse["meta"];
}

export const useGetPosts = (params?: GetPostsParams) => {
  const queryParams = { ...params };
  return useQuery<PostsResponse, Error, PostsResponseData>({
    queryKey: postKeys.list(queryParams),
    queryFn: () => getPosts(queryParams),
    select: (data) => ({
      posts: data.data,
      meta: data.meta,
    }),
  });
};

export const useGetPostsPaginated = (params?: GetPostsParams) => {
  const queryParams = { ...params };
  return useInfiniteQuery<
    PostsResponse,
    Error,
    InfiniteData<PostsResponseData>
  >({
    queryKey: postKeys.list(queryParams),
    queryFn: ({ pageParam = 1 }) =>
      getPosts({
        ...queryParams,
        page: pageParam as number,
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
        ? (lastPage.meta.currentPage || 0) + 1
        : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      const { currentPage } = firstPage.meta;
      return currentPage && currentPage > 1 ? currentPage - 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useGetPost = (id: string) => {
  return useQuery<Post, Error>({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostById(id),
    enabled: !!id,
  });
};

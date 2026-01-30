import {
  useQuery,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import {
  getComments,
  getCommentById,
  GetCommentsParams,
  CommentsResponse,
} from "./apis";
import { commentKeys } from "./keys";
import { Comment } from "@/models/comment";

interface CommentsResponseData {
  comments: Comment[];
  meta: CommentsResponse["meta"];
}

export const useGetComments = (params?: GetCommentsParams) => {
  return useQuery<CommentsResponse, Error, CommentsResponseData>({
    queryKey: commentKeys.list(params || {}),
    queryFn: () => getComments(params),
    select: (data) => ({
      comments: data.data,
      meta: data.meta,
    }),
  });
};

export const useGetCommentsPaginated = (params?: GetCommentsParams) => {
  return useInfiniteQuery<
    CommentsResponse,
    Error,
    InfiniteData<CommentsResponseData>
  >({
    queryKey: commentKeys.list({ ...params }),
    queryFn: ({ pageParam = 1 }) =>
      getComments({
        ...params,
        page: pageParam as number,
      }),
    select: (data) => ({
      pages: data.pages.map((page) => ({
        comments: page.data || [],
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

export const useGetComment = (id: string) => {
  return useQuery<Comment, Error>({
    queryKey: commentKeys.detail(id),
    queryFn: () => getCommentById(id),
    enabled: !!id,
  });
};

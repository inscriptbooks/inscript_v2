import {
  useQuery,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import { getMemos, getMemoById, GetMemosParams, MemosResponse } from "./apis";
import { memoKeys } from "./keys";
import { Memo } from "@/models/memo";

interface MemosResponseData {
  memos: Memo[];
  meta: MemosResponse["meta"];
}

export const useGetMemos = (params?: GetMemosParams) => {
  return useQuery<MemosResponse, Error, MemosResponseData>({
    queryKey: memoKeys.list(params || {}),
    queryFn: () => getMemos(params),
    select: (data) => ({
      memos: data.data,
      meta: data.meta,
    }),
  });
};

export const useGetMemosPaginated = (params?: GetMemosParams) => {
  return useInfiniteQuery<
    MemosResponse,
    Error,
    InfiniteData<MemosResponseData>
  >({
    queryKey: memoKeys.list({ ...params }),
    queryFn: ({ pageParam = 1 }) =>
      getMemos({
        ...params,
        page: pageParam as number,
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

export const useGetMemo = (id: string) => {
  return useQuery<Memo, Error>({
    queryKey: memoKeys.detail(id),
    queryFn: () => getMemoById(id),
    enabled: !!id,
  });
};

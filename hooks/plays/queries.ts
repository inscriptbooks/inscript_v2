import {
  useQuery,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import { getPlays, getPlayById, GetPlaysParams, PlaysResponse } from "./apis";
import { playKeys } from "./keys";
import { Play } from "@/models/play";

interface PlaysResponseData {
  plays: Play[];
  meta: PlaysResponse["meta"];
}

export const useGetPlays = (params?: GetPlaysParams) => {
  return useQuery<PlaysResponse, Error, PlaysResponseData>({
    queryKey: playKeys.list(params || {}),
    queryFn: () => getPlays(params),
    select: (data) => ({
      plays: data.data,
      meta: data.meta,
    }),
  });
};

export const useGetPlaysPaginated = (params?: GetPlaysParams) => {
  return useInfiniteQuery<
    PlaysResponse,
    Error,
    InfiniteData<PlaysResponseData>
  >({
    queryKey: playKeys.list({ ...params }),
    queryFn: ({ pageParam = 1 }) =>
      getPlays({
        ...params,
        page: pageParam as number,
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

export const useGetPlay = (id: string) => {
  return useQuery<Play, Error>({
    queryKey: playKeys.detail(id),
    queryFn: () => getPlayById(id),
    enabled: !!id,
  });
};

import {
  useQuery,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import {
  getReports,
  getReportById,
  GetReportsParams,
  ReportsResponse,
} from "./apis";
import { reportKeys } from "./keys";
import { Report } from "@/models/report";

interface ReportsResponseData {
  reports: Report[];
  meta: ReportsResponse["meta"];
}

export const useGetReports = (params?: GetReportsParams) => {
  return useQuery<ReportsResponse, Error, ReportsResponseData>({
    queryKey: reportKeys.list(params || {}),
    queryFn: () => getReports(params),
    select: (data) => ({
      reports: data.data,
      meta: data.meta,
    }),
  });
};

export const useGetReportsPaginated = (params?: GetReportsParams) => {
  return useInfiniteQuery<
    ReportsResponse,
    Error,
    InfiniteData<ReportsResponseData>
  >({
    queryKey: reportKeys.list({ ...params }),
    queryFn: ({ pageParam = 1 }) =>
      getReports({
        ...params,
        page: pageParam as number,
      }),
    select: (data) => ({
      pages: data.pages.map((page) => ({
        reports: page.data || [],
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

export const useGetReport = (id: string) => {
  return useQuery<Report, Error>({
    queryKey: reportKeys.detail(id),
    queryFn: () => getReportById(id),
    enabled: !!id,
  });
};

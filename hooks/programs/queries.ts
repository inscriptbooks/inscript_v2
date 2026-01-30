import {
  useQuery,
  useInfiniteQuery,
  InfiniteData,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getPrograms,
  getProgramById,
  GetProgramsParams,
  ProgramsResponse,
} from "./apis";
import { programKeys } from "./keys";
import { Program } from "@/models/program";

interface ProgramsResponseData {
  programs: Program[];
  meta: ProgramsResponse["meta"];
}

export const useGetPrograms = (params?: GetProgramsParams) => {
  return useQuery<ProgramsResponse, Error, ProgramsResponseData>({
    queryKey: programKeys.list(params || {}),
    queryFn: () => getPrograms(params),
    select: (data) => ({
      programs: data.data,
      meta: data.meta,
    }),
    placeholderData: keepPreviousData,
  });
};

export const useGetProgramsPaginated = (params?: GetProgramsParams) => {
  return useInfiniteQuery<
    ProgramsResponse,
    Error,
    InfiniteData<ProgramsResponseData>
  >({
    queryKey: programKeys.list({ ...params }),
    queryFn: ({ pageParam = 1 }) =>
      getPrograms({
        ...params,
        page: pageParam as number,
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

export const useGetProgram = (id: string) => {
  return useQuery<Program, Error>({
    queryKey: programKeys.detail(id),
    queryFn: () => getProgramById(id),
    enabled: !!id,
  });
};

import {
  useQuery,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import {
  getAuthors,
  getAuthorById,
  GetAuthorsParams,
  AuthorsResponse,
} from "./apis";
import { authorKeys } from "./keys";
import { Author } from "@/models/author";

interface AuthorsResponseData {
  authors: Author[];
  meta: AuthorsResponse["meta"];
}

export const useGetAuthors = (params?: GetAuthorsParams) => {
  return useQuery<AuthorsResponse, Error, AuthorsResponseData>({
    queryKey: authorKeys.list(params || {}),
    queryFn: () => getAuthors(params),
    select: (data) => ({
      authors: data.data,
      meta: data.meta,
    }),
  });
};

export const useGetAuthorsPaginated = (params?: GetAuthorsParams) => {
  return useInfiniteQuery<
    AuthorsResponse,
    Error,
    InfiniteData<AuthorsResponseData>
  >({
    queryKey: authorKeys.list({ ...params }),
    queryFn: ({ pageParam = 1 }) =>
      getAuthors({
        ...params,
        page: pageParam as number,
      }),
    select: (data) => ({
      pages: data.pages.map((page) => ({
        authors: page.data || [],
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

export const useGetAuthor = (id: string) => {
  return useQuery<Author, Error>({
    queryKey: authorKeys.detail(id),
    queryFn: () => getAuthorById(id),
    enabled: !!id,
  });
};

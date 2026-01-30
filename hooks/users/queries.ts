import {
  useQuery,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import { getUsers, getUserById, GetUsersParams, UsersResponse } from "./apis";
import { userKeys } from "./keys";
import { User } from "@/models/user";

interface UsersResponseData {
  users: User[];
  meta: UsersResponse["meta"];
}

export const useGetUsers = (params?: GetUsersParams) => {
  return useQuery<UsersResponse, Error, UsersResponseData>({
    queryKey: userKeys.list(params || {}),
    queryFn: () => getUsers(params),
    select: (data) => ({
      users: data.data,
      meta: data.meta,
    }),
  });
};

export const useGetUsersPaginated = (params?: GetUsersParams) => {
  return useInfiniteQuery<
    UsersResponse,
    Error,
    InfiniteData<UsersResponseData>
  >({
    queryKey: userKeys.list({ ...params }),
    queryFn: ({ pageParam = 1 }) =>
      getUsers({
        ...params,
        page: pageParam as number,
      }),
    select: (data) => ({
      pages: data.pages.map((page) => ({
        users: page.data || [],
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

export const useGetUserById = (id: string) => {
  return useQuery<User, Error>({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

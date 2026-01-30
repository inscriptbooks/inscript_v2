import { GetAuthorsParams } from "./apis";

export const authorKeys = {
  all: ["authors"] as const,
  lists: () => [...authorKeys.all, "list"] as const,
  list: (filters: GetAuthorsParams) =>
    [...authorKeys.lists(), filters] as const,
  details: () => [...authorKeys.all, "detail"] as const,
  detail: (id: string) => [...authorKeys.details(), id] as const,
};

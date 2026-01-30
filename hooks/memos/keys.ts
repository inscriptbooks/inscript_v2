import { GetMemosParams } from "./apis";

export const memoKeys = {
  all: ["memos"] as const,
  lists: () => [...memoKeys.all, "list"] as const,
  list: (filters: GetMemosParams) => [...memoKeys.lists(), filters] as const,
  details: () => [...memoKeys.all, "detail"] as const,
  detail: (id: string) => [...memoKeys.details(), id] as const,
};

import { GetPlaysParams } from "./apis";

export const playKeys = {
  all: ["plays"] as const,
  lists: () => [...playKeys.all, "list"] as const,
  list: (filters: GetPlaysParams) => [...playKeys.lists(), filters] as const,
  details: () => [...playKeys.all, "detail"] as const,
  detail: (id: string) => [...playKeys.details(), id] as const,
};

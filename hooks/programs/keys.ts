import { GetProgramsParams } from "./apis";

export const programKeys = {
  all: ["programs"] as const,
  lists: () => [...programKeys.all, "list"] as const,
  list: (filters: GetProgramsParams) =>
    [...programKeys.lists(), filters] as const,
  details: () => [...programKeys.all, "detail"] as const,
  detail: (id: string) => [...programKeys.details(), id] as const,
};

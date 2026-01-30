import { GetProgramApplicationsParams } from "./apis";

export const programApplicationKeys = {
  all: ["programApplications"] as const,
  lists: () => [...programApplicationKeys.all, "list"] as const,
  list: (filters: GetProgramApplicationsParams) =>
    [...programApplicationKeys.lists(), filters] as const,
  details: () => [...programApplicationKeys.all, "detail"] as const,
  detail: (id: string) => [...programApplicationKeys.details(), id] as const,
};

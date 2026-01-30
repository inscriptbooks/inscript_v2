import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getProgramApplications,
  GetProgramApplicationsParams,
  ProgramApplicationsResponse,
} from "./apis";
import { programApplicationKeys } from "./keys";
import { ProgramApplication } from "@/models/programApplication";

interface ProgramApplicationsResponseData {
  applications: ProgramApplication[];
  meta: ProgramApplicationsResponse["meta"];
}

export const useGetProgramApplications = (
  params: GetProgramApplicationsParams,
) => {
  return useQuery<
    ProgramApplicationsResponse,
    Error,
    ProgramApplicationsResponseData
  >({
    queryKey: programApplicationKeys.list(params),
    queryFn: () => getProgramApplications(params),
    select: (data) => ({
      applications: data.data,
      meta: data.meta,
    }),
    placeholderData: keepPreviousData,
    enabled: !!params.programId,
  });
};

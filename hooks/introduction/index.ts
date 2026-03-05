import { useQuery } from "@tanstack/react-query";
import { introductionKeys } from "./keys";
import { introductionApis } from "./apis";

export const useIntroduction = () => {
  return useQuery({
    queryKey: introductionKeys.list(),
    queryFn: introductionApis.getIntroduction,
  });
};

export * from "./apis";
export * from "./keys";

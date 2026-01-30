import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProgramApplication,
  CreateProgramApplicationParams,
} from "./apis";
import { programApplicationKeys } from "./keys";
import { programKeys } from "../programs/keys";

export const useCreateProgramApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateProgramApplicationParams) =>
      createProgramApplication(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: programApplicationKeys.all });
      queryClient.invalidateQueries({
        queryKey: programKeys.detail(variables.programId),
      });
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
    },
  });
};

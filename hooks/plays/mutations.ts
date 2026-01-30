import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postPlay, PostPlayParams, updatePlay, UpdatePlayParams } from "./apis";
import { playKeys } from "./keys";

export const useCreatePlay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PostPlayParams) => postPlay(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playKeys.all });
    },
  });
};

export const useUpdatePlay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdatePlayParams) => updatePlay(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: playKeys.all });
      queryClient.invalidateQueries({ queryKey: playKeys.detail(data.id) });
    },
  });
};

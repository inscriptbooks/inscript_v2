import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMemo,
  CreateMemoParams,
  updateMemo,
  UpdateMemoParams,
  deleteMemo,
} from "./apis";
import { memoKeys } from "./keys";
import { toast } from "sonner";
import { showSuccessToast } from "@/components/ui/toast";

export const useCreateMemo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateMemoParams) => createMemo(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memoKeys.all });
    },
    onError: (error) => {
      toast.error("메모 등록에 실패했습니다.");
    },
  });
};

export const useUpdateMemo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateMemoParams) => updateMemo(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memoKeys.all });
      showSuccessToast("메모가 수정되었습니다.");
    },
    onError: (error) => {
      // Error silently handled
    },
  });
};

export const useDeleteMemo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMemo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memoKeys.all });
      showSuccessToast("메모가 삭제되었습니다.");
    },
    onError: (error) => {
      // Error silently handled
    },
  });
};

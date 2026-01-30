import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  CreateCommentParams,
  updateComment,
  UpdateCommentParams,
  deleteComment,
} from "./apis";
import { commentKeys } from "./keys";
import { showSuccessToast } from "@/components/ui/toast";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateCommentParams) => createComment(params),
    onSuccess: (data, variables) => {
      // 댓글이 달린 대상의 댓글 목록 쿼리를 무효화하여 다시 불러오도록 함
      queryClient.invalidateQueries({
        queryKey: commentKeys.list({
          memoId: variables.memoId,
          postId: variables.postId,
        }),
      });
    },
    onError: (error) => {
      // Error silently handled
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateCommentParams) => updateComment(params),
    onSuccess: () => {
      showSuccessToast("댓글이 수정되었습니다.");
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
    onError: (error) => {
      // Error silently handled
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => {
      showSuccessToast("댓글이 삭제되었습니다.");
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
    onError: (error) => {},
  });
};

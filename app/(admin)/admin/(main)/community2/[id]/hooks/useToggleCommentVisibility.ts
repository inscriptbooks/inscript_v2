import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  toggleCommentVisibility,
  ToggleCommentVisibilityParams,
} from "@/hooks/comments/apis";
import { commentKeys } from "@/hooks/comments/keys";
import { showSuccessToast } from "@/components/ui/toast";

export const useToggleCommentVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ToggleCommentVisibilityParams) =>
      toggleCommentVisibility(params),
    onSuccess: (data) => {
      showSuccessToast(
        data.isVisible ? "댓글이 공개되었습니다." : "댓글이 비공개되었습니다."
      );
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
  });
};

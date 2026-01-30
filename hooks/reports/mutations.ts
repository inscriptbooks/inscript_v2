import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReport, CreateReportParams } from "./apis";
import { reportKeys } from "./keys";
import { showSuccessToast } from "@/components/ui/toast";

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateReportParams) => createReport(params),
    onSuccess: (data, variables) => {
      showSuccessToast("신고가 접수되었습니다.");
      // 신고가 달린 대상의 신고 목록 쿼리를 무효화하여 다시 불러오도록 함
      queryClient.invalidateQueries({
        queryKey: reportKeys.list({
          memoId: variables.memoId,
          postId: variables.postId,
          commentId: variables.commentId,
        }),
      });
    },
    onError: (error) => {
      // 에러 처리는 컴포넌트에서 처리
    },
  });
};

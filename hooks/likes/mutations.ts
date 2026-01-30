import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLike,
  deleteLike,
  CreateLikeParams,
  DeleteLikeParams,
} from "./apis";
import { likeKeys } from "./keys";
import { memoKeys } from "@/hooks/memos";
import { postKeys } from "@/hooks/posts";
import { Like } from "@/models/like";
import { Memo } from "@/models/memo";
import { Post } from "@/models/post";
import { useUser } from "@/hooks/auth";

export const useCreateLike = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: (params: CreateLikeParams) => createLike(params),
    onMutate: async (params: CreateLikeParams) => {
      if (!user?.id) return;

      const queryKey = likeKeys.list({
        userId: user.id,
        ...(params.memoId
          ? { memoId: params.memoId }
          : { postId: params.postId }),
      });

      await queryClient.cancelQueries({ queryKey });

      const previousLikes = queryClient.getQueryData<Like[]>(queryKey);

      queryClient.setQueryData<Like[]>(queryKey, (old) => {
        const tempLike: Like = params.memoId
          ? ({
              id: "temp-" + Date.now(),
              type: "memo",
              createdAt: new Date().toISOString(),
              memo: { id: params.memoId } as Memo,
            } as Like)
          : ({
              id: "temp-" + Date.now(),
              type: "post",
              createdAt: new Date().toISOString(),
              post: { id: params.postId } as Post,
            } as Like);

        return old ? [...old, tempLike] : [tempLike];
      });

      return { previousLikes, queryKey };
    },
    onError: (_error, _variables, context) => {
      if (context?.queryKey && context?.previousLikes !== undefined) {
        queryClient.setQueryData(context.queryKey, context.previousLikes);
      }
    },
    onSettled: (_data, _error, variables) => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: likeKeys.list({
            userId: user.id,
            ...(variables.memoId
              ? { memoId: variables.memoId }
              : { postId: variables.postId }),
          }),
        });
      }

      if (variables.memoId) {
        queryClient.invalidateQueries({
          queryKey: memoKeys.detail(variables.memoId),
        });
        queryClient.invalidateQueries({ queryKey: memoKeys.lists() });
      } else if (variables.postId) {
        queryClient.invalidateQueries({
          queryKey: postKeys.detail(variables.postId),
        });
        queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      }
    },
  });
};

export const useDeleteLike = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: (params: DeleteLikeParams) => deleteLike(params),
    onMutate: async (params: DeleteLikeParams) => {
      if (!user?.id) return;

      const queryKey = likeKeys.list({
        userId: user.id,
        ...(params.memoId
          ? { memoId: params.memoId }
          : { postId: params.postId }),
      });

      await queryClient.cancelQueries({ queryKey });

      const previousLikes = queryClient.getQueryData<Like[]>(queryKey);

      queryClient.setQueryData<Like[]>(queryKey, (old) => {
        if (!old) return [];
        return old.filter((like) => {
          if (params.memoId && like.type === "memo") {
            return like.memo.id !== params.memoId;
          }
          if (params.postId && like.type === "post") {
            return like.post.id !== params.postId;
          }
          return true;
        });
      });

      return { previousLikes, queryKey };
    },
    onError: (_error, _variables, context) => {
      if (context?.queryKey && context?.previousLikes !== undefined) {
        queryClient.setQueryData(context.queryKey, context.previousLikes);
      }
    },
    onSettled: (_data, _error, variables) => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: likeKeys.list({
            userId: user.id,
            ...(variables.memoId
              ? { memoId: variables.memoId }
              : { postId: variables.postId }),
          }),
        });
      }

      if (variables.memoId) {
        queryClient.invalidateQueries({
          queryKey: memoKeys.detail(variables.memoId),
        });
        queryClient.invalidateQueries({ queryKey: memoKeys.lists() });
      } else if (variables.postId) {
        queryClient.invalidateQueries({
          queryKey: postKeys.detail(variables.postId),
        });
        queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      }
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, updatePost, UpdatePostParams } from "./apis";
import { CommunityPostUploadFormData } from "@/components/forms/schema";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      // 게시글 목록 쿼리를 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // 특정 게시글 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: ["posts", newPost.id] });

      // 사용자별 게시글 목록도 무효화
      if (newPost.user) {
        queryClient.invalidateQueries({
          queryKey: ["posts", "user", newPost.user.id],
        });
      }
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost) => {
      // 게시글 목록 쿼리를 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // 특정 게시글 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: ["posts", updatedPost.id] });

      // 사용자별 게시글 목록도 무효화
      if (updatedPost.user) {
        queryClient.invalidateQueries({
          queryKey: ["posts", "user", updatedPost.user.id],
        });
      }
    },
  });
};

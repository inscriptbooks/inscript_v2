import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBookmark,
  deleteBookmark,
  CreateBookmarkParams,
  DeleteBookmarkParams,
} from "./apis";
import { bookmarkKeys } from "./keys";
import { playKeys } from "@/hooks/plays";
import { memoKeys } from "@/hooks/memos";
import { authorKeys } from "@/hooks/authors";
import { programKeys } from "@/hooks/programs";
import { postKeys } from "@/hooks/posts";
import { Bookmark } from "@/models/bookmark";
import { Play } from "@/models/play";
import { Memo } from "@/models/memo";
import { Author } from "@/models/author";
import { Program } from "@/models/program";
import { Post } from "@/models/post";
import { showSuccessToast } from "@/components/ui/toast";
import { toast } from "sonner";
import { useUser } from "@/hooks/auth";

export const useCreateBookmark = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: (params: CreateBookmarkParams) => createBookmark(params),
    onMutate: async (params: CreateBookmarkParams) => {
      if (!user?.id) return;

      const queryKey = bookmarkKeys.list({
        userId: user.id,
        playId: params.playId,
        memoId: params.memoId,
        authorId: params.authorId,
        programId: params.programId,
        postId: params.postId,
      });

      // 특정 쿼리만 취소
      await queryClient.cancelQueries({ queryKey });

      // 이전 상태 저장
      const previousBookmarks = queryClient.getQueryData<Bookmark[]>(queryKey);

      // 낙관적 업데이트: 해당 쿼리에만 즉시 추가
      queryClient.setQueryData<Bookmark[]>(queryKey, (old) => {
        const tempBookmark: Bookmark = params.playId
          ? ({
              id: "temp-" + Date.now(),
              type: "play",
              play: { id: params.playId } as Play,
              createdAt: new Date().toISOString(),
            } as Bookmark)
          : params.memoId
            ? ({
                id: "temp-" + Date.now(),
                type: "memo",
                memo: { id: params.memoId } as Memo,
                createdAt: new Date().toISOString(),
              } as Bookmark)
            : params.programId
              ? ({
                  id: "temp-" + Date.now(),
                  type: "program",
                  program: { id: params.programId } as Program,
                  createdAt: new Date().toISOString(),
                } as Bookmark)
              : params.postId
                ? ({
                    id: "temp-" + Date.now(),
                    type: "post",
                    post: { id: params.postId } as Post,
                    createdAt: new Date().toISOString(),
                  } as Bookmark)
                : ({
                    id: "temp-" + Date.now(),
                    type: "author",
                    author: { id: params.authorId } as Author,
                    createdAt: new Date().toISOString(),
                  } as Bookmark);
        return old ? [...old, tempBookmark] : [tempBookmark];
      });

      // 즉시 성공 토스트 표시
      showSuccessToast("북마크에 추가되었습니다.");

      return { previousBookmarks, queryKey };
    },
    onError: (_error, _variables, context) => {
      // 에러 발생 시 롤백
      if (context?.queryKey && context?.previousBookmarks !== undefined) {
        queryClient.setQueryData(context.queryKey, context.previousBookmarks);
      }
      toast.error("북마크 추가에 실패했습니다.");
    },
    onSettled: (_data, _error, variables) => {
      // 해당 북마크 쿼리와 관련 정보 재검증
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: bookmarkKeys.list({
            userId: user.id,
            playId: variables.playId,
            memoId: variables.memoId,
            authorId: variables.authorId,
            programId: variables.programId,
            postId: variables.postId,
          }),
        });
      }
      if (variables.playId) {
        queryClient.invalidateQueries({
          queryKey: playKeys.detail(variables.playId),
        });
      }
      if (variables.memoId) {
        queryClient.invalidateQueries({
          queryKey: memoKeys.detail(variables.memoId),
        });
      }
      if (variables.authorId) {
        queryClient.invalidateQueries({
          queryKey: authorKeys.detail(variables.authorId),
        });
      }
      if (variables.programId) {
        queryClient.invalidateQueries({
          queryKey: programKeys.detail(variables.programId),
        });
      }
      if (variables.postId) {
        queryClient.invalidateQueries({
          queryKey: postKeys.detail(variables.postId),
        });
      }
    },
  });
};

export const useDeleteBookmark = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: (params: DeleteBookmarkParams) => deleteBookmark(params),
    onMutate: async (params: DeleteBookmarkParams) => {
      if (!user?.id) return;

      const queryKey = bookmarkKeys.list({
        userId: user.id,
        playId: params.playId,
        memoId: params.memoId,
        authorId: params.authorId,
        programId: params.programId,
        postId: params.postId,
      });

      // 특정 쿼리만 취소
      await queryClient.cancelQueries({ queryKey });

      // 이전 상태 저장
      const previousBookmarks = queryClient.getQueryData<Bookmark[]>(queryKey);

      // 낙관적 업데이트: 해당 쿼리에서만 즉시 제거
      queryClient.setQueryData<Bookmark[]>(queryKey, (old) => {
        if (!old) return [];
        return old.filter((bookmark) => {
          if (params.playId && bookmark.type === "play") {
            return bookmark.play.id !== params.playId;
          }
          if (params.memoId && bookmark.type === "memo") {
            return bookmark.memo.id !== params.memoId;
          }
          if (params.authorId && bookmark.type === "author") {
            return bookmark.author.id !== params.authorId;
          }
          if (params.programId && bookmark.type === "program") {
            return bookmark.program.id !== params.programId;
          }
          if (params.postId && bookmark.type === "post") {
            return bookmark.post.id !== params.postId;
          }
          return true;
        });
      });

      // 즉시 성공 토스트 표시
      showSuccessToast("북마크가 해제되었습니다.");

      return { previousBookmarks, queryKey };
    },
    onError: (_error, _variables, context) => {
      // 에러 발생 시 롤백
      if (context?.queryKey && context?.previousBookmarks !== undefined) {
        queryClient.setQueryData(context.queryKey, context.previousBookmarks);
      }
      toast.error("북마크 해제에 실패했습니다.");
    },
    onSettled: (_data, _error, variables) => {
      // 해당 북마크 쿼리와 관련 정보 재검증
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: bookmarkKeys.list({
            userId: user.id,
            playId: variables.playId,
            memoId: variables.memoId,
            authorId: variables.authorId,
            programId: variables.programId,
            postId: variables.postId,
          }),
        });
      }
      if (variables.playId) {
        queryClient.invalidateQueries({
          queryKey: playKeys.detail(variables.playId),
        });
      }
      if (variables.memoId) {
        queryClient.invalidateQueries({
          queryKey: memoKeys.detail(variables.memoId),
        });
      }
      if (variables.authorId) {
        queryClient.invalidateQueries({
          queryKey: authorKeys.detail(variables.authorId),
        });
      }
      if (variables.programId) {
        queryClient.invalidateQueries({
          queryKey: programKeys.detail(variables.programId),
        });
      }
      if (variables.postId) {
        queryClient.invalidateQueries({
          queryKey: postKeys.detail(variables.postId),
        });
      }
    },
  });
};

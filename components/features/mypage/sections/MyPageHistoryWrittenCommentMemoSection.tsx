"use client";

import { useEffect } from "react";
import { CommentList } from "@/components/features/comment";
import { MemoList } from "@/components/features/mypage/components";
import { ShowMoreButton } from "@/components/common";
import { useGetCommentsPaginated } from "@/hooks/comments";
import { useGetMemosPaginated } from "@/hooks/memos";
import { useLoader } from "@/hooks/common";

interface MyPageHistoryWrittenCommentMemoSectionProps {
  userId: string;
}

export default function MyPageHistoryWrittenCommentMemoSection({
  userId,
}: MyPageHistoryWrittenCommentMemoSectionProps) {
  const { showLoader, hideLoader } = useLoader();
  
  const {
    data: commentsData,
    fetchNextPage: fetchNextComments,
    hasNextPage: hasNextComments,
    isFetchingNextPage: isFetchingNextComments,
    isLoading: isCommentsLoading,
  } = useGetCommentsPaginated({ createdById: userId, limit: 5 });

  const {
    data: memosData,
    fetchNextPage: fetchNextMemos,
    hasNextPage: hasNextMemos,
    isFetchingNextPage: isFetchingNextMemos,
    isLoading: isMemosLoading,
  } = useGetMemosPaginated({ createdById: userId, limit: 5 });

  const comments = commentsData?.pages.flatMap((page) => page.comments) ?? [];
  const memos = memosData?.pages.flatMap((page) => page.memos) ?? [];

  // 댓글과 메모 모두 로딩이 완료될 때까지 로더 표시
  useEffect(() => {
    if (isCommentsLoading || isMemosLoading) {
      showLoader();
    } else {
      hideLoader();
    }

    return () => {
      hideLoader();
    };
  }, [isCommentsLoading, isMemosLoading, showLoader, hideLoader]);

  return (
    <section className="flex w-full flex-col gap-14 lg:flex-row">
      <div className="flex basis-1/2 flex-col items-center gap-7">
        <h2 className="self-start text-xl font-semibold text-gray-1">
          내가 작성한 댓글
        </h2>
        {isCommentsLoading ? null : comments.length === 0 ? (
          <div className="text-center text-gray-400">작성한 댓글이 없습니다.</div>
        ) : (
          <>
            <CommentList commentList={comments} />
            {hasNextComments && (
              <ShowMoreButton
                onClick={() => fetchNextComments()}
                disabled={isFetchingNextComments}
              />
            )}
          </>
        )}
      </div>

      <div className="flex basis-1/2 flex-col items-center gap-7">
        <h2 className="self-start text-xl font-semibold text-gray-1">
          내가 작성한 메모
        </h2>
        {isMemosLoading ? null : memos.length === 0 ? (
          <div className="text-center text-gray-400">작성한 메모가 없습니다.</div>
        ) : (
          <>
            <MemoList memoList={memos} />
            {hasNextMemos && (
              <ShowMoreButton
                onClick={() => fetchNextMemos()}
                disabled={isFetchingNextMemos}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

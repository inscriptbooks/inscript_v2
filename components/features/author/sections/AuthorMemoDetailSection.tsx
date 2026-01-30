"use client";

import { EntryForm } from "@/components/forms";
import { Memo } from "@/models/memo";
import { Comment } from "@/models/comment";
import { CommentList } from "@/components/features/comment";
import { useCreateComment } from "@/hooks/comments";
import { useLoginRequired } from "@/hooks/common";
import { EntryFormData } from "@/components/forms/schema";

interface AuthorMemoDetailSectionProps {
  authorMemo: Memo;
  commentList: Comment[];
}

export default function AuthorMemoDetailSection({
  authorMemo,
  commentList,
}: AuthorMemoDetailSectionProps) {
  const { requireAuth } = useLoginRequired();
  const createComment = useCreateComment();

  const handleSubmit = (data: EntryFormData, resetForm: () => void) => {
    requireAuth(() => {
      createComment.mutate(
        {
          memoId: authorMemo.id,
          content: data.content,
        },
        {
          onSuccess: () => {
            resetForm();
          },
        },
      );
    });
  };

  return (
    <section className="flex w-full flex-1 flex-col gap-5">
      <div className="flex items-center gap-1.5">
        <span className="font-serif text-xl font-bold text-gray-1 lg:text-[28px]">
          댓글
        </span>
        <span className="font-serif text-xl font-bold text-orange-3 lg:text-[28px]">
          {commentList.length}
        </span>
      </div>

      <EntryForm
        submitButtonText="댓글 남기기"
        onSubmit={handleSubmit}
        isSubmitting={createComment.isPending}
      />
      <CommentList commentList={commentList} />
    </section>
  );
}

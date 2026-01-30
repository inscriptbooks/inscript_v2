"use client";

import { EntryForm } from "@/components/forms";
import { Memo } from "@/models/memo";
import { Comment } from "@/models/comment";
import { CommentList } from "@/components/features/comment";
import { MemoPreviewCard } from "@/components/features/memo";
import { useCreateComment } from "@/hooks/comments";
import { useLoginRequired } from "@/hooks/common";
import { EntryFormData } from "@/components/forms/schema";

interface ProgramMemoDetailSectionProps {
  programMemo: Memo;
  commentList: Comment[];
}

export default function ProgramMemoDetailSection({
  programMemo,
  commentList,
}: ProgramMemoDetailSectionProps) {
  const { requireAuth } = useLoginRequired();
  const createComment = useCreateComment();

  const handleSubmit = (data: EntryFormData, resetForm: () => void) => {
    requireAuth(() => {
      createComment.mutate(
        {
          memoId: programMemo.id,
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
    <section className="flex w-full flex-1 flex-col gap-5 px-[20px] pt-10 lg:gap-10 lg:px-[120px]">
      <MemoPreviewCard memo={programMemo} hasLink={false} />

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

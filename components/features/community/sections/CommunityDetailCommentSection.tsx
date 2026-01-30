"use client";

import { Comment } from "@/models/comment";
import { EntryForm } from "@/components/forms";
import CommentList from "@/components/features/comment/components/CommentList";
import { useCreateComment } from "@/hooks/comments";
import { useLoginRequired } from "@/hooks/common";
import { EntryFormData } from "@/components/forms/schema";

interface CommunityDetailCommentSectionProps {
  postId: string;
  commentList: Comment[];
  isAnonymous?: boolean;
}

export default function CommunityDetailCommentSection({
  postId,
  commentList,
  isAnonymous = false,
}: CommunityDetailCommentSectionProps) {
  const { requireAuth } = useLoginRequired();
  const createComment = useCreateComment();

  const handleSubmit = (data: EntryFormData, resetForm: () => void) => {
    requireAuth(() => {
      createComment.mutate(
        {
          postId: postId,
          content: data.content,
        },
        {
          onSuccess: () => {
            resetForm();
          },
        }
      );
    });
  };

  return (
    <section className="flex w-full flex-1 flex-col gap-5 px-5 md:px-20">
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
      <CommentList commentList={commentList} isAnonymous={isAnonymous} />
    </section>
  );
}

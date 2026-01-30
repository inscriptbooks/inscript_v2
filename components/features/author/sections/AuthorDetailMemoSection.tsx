"use client";

import { ViewMoreLinkButton } from "@/components/common";
import { MemoList } from "@/components/features/memo";
import { EntryForm } from "@/components/forms";
import { useGetMemos, useCreateMemo } from "@/hooks/memos";
import { useLoader, useLoginRequired } from "@/hooks/common";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { EntryFormData } from "@/components/forms/schema";

export default function AuthorDetailMemoSection() {
  const { authorId } = useParams<{ authorId: string }>();
  const { showLoader, hideLoader } = useLoader();
  const { requireAuth } = useLoginRequired();
  const createMemo = useCreateMemo();

  const { data: memosData, isLoading } = useGetMemos({
    type: "author",
    authorId: authorId,
  });

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  const authorMemoList = memosData?.memos ?? [];

  const handleSubmit = (data: EntryFormData, resetForm: () => void) => {
    requireAuth(() => {
      createMemo.mutate(
        {
          type: "author",
          content: data.content,
          authorId,
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
    <section className="flex w-full flex-col gap-5 px-[20px] pt-11 lg:px-[120px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-serif text-xl font-bold text-gray-1 lg:text-[28px]">
            메모
          </span>
          <span className="font-serif text-xl font-bold text-orange-3 lg:text-[28px]">
            {authorMemoList.length}
          </span>
        </div>

        <ViewMoreLinkButton href={`/author/${authorId}/memo`} />
      </div>

      {/* 메모 작성 폼 */}
      <EntryForm
        submitButtonText="메모 남기기"
        onSubmit={handleSubmit}
        isSubmitting={createMemo.isPending}
      />

      {/* 메모 리스트 */}
      <MemoList memoList={authorMemoList} hideCreatedAt />
    </section>
  );
}

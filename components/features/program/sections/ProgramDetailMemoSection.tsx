"use client";

import { ViewMoreLinkButton } from "@/components/common";
import { MemoList } from "@/components/features/memo";
import { EntryForm } from "@/components/forms";
import { Memo } from "@/models/memo";
import { useCreateMemo } from "@/hooks/memos";
import { useLoginRequired } from "@/hooks/common";
import { EntryFormData } from "@/components/forms/schema";

interface ProgramDetailMemoSectionProps {
  programId: string;
  programMemoList: Memo[];
  programMemoCount: number;
}

export default function ProgramDetailMemoSection({
  programId,
  programMemoList,
  programMemoCount,
}: ProgramDetailMemoSectionProps) {
  const { requireAuth } = useLoginRequired();
  const createMemo = useCreateMemo();

  const handleSubmit = (data: EntryFormData, resetForm: () => void) => {
    requireAuth(() => {
      createMemo.mutate(
        {
          type: "program",
          content: data.content,
          programId,
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
    <section className="flex w-full flex-col gap-5 px-[20px] pt-10 lg:px-[120px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-serif text-xl font-bold text-gray-1 lg:text-[28px]">
            프로그램 메모
          </span>
          <span className="font-serif text-xl font-bold text-orange-3 lg:text-[28px]">
            {programMemoCount}
          </span>
        </div>

        <ViewMoreLinkButton href={`/program/${programId}/memo`} />
      </div>

      {/* 메모 작성 폼 */}
      <EntryForm
        submitButtonText="메모 남기기"
        onSubmit={handleSubmit}
        isSubmitting={createMemo.isPending}
      />

      <MemoList
        memoList={programMemoList}
        className="grid grid-cols-1 gap-4 lg:auto-rows-[380px] lg:grid-cols-1 xl:grid-cols-3"
        hideCreatedAt
      />
    </section>
  );
}

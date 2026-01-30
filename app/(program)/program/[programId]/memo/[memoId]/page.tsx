"use client";

import { ProgramDetailHeader } from "@/components/features/program";
import { ProgramMemoDetailSection } from "@/components/features/program/sections";
import { useGetComments } from "@/hooks/comments";
import { useGetMemo } from "@/hooks/memos";
import { useGetProgram } from "@/hooks/programs";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLoader } from "@/hooks/common";

export default function ProgramMemoDetailPage() {
  const params = useParams();
  const programId = params.programId as string;
  const memoId = params.memoId as string;
  const { showLoader, hideLoader } = useLoader();

  const { data: program, isLoading: isProgramLoading } =
    useGetProgram(programId);
  const { data: memo, isLoading: isMemoLoading } = useGetMemo(memoId);
  const { data: commentsData, isLoading: isCommentsLoading } = useGetComments({
    memoId: memoId,
  });

  useEffect(() => {
    if (isProgramLoading || isMemoLoading || isCommentsLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [
    isProgramLoading,
    isMemoLoading,
    isCommentsLoading,
    showLoader,
    hideLoader,
  ]);

  if (!memo || !program) {
    return;
  }

  const commentList = commentsData?.comments ?? [];

  return (
    <section className="flex w-full flex-1 flex-col gap-10">
      <ProgramDetailHeader program={program} />
      <ProgramMemoDetailSection programMemo={memo} commentList={commentList} />
    </section>
  );
}

"use client";

import { useEffect } from "react";
import {
  ProgramDetailSection,
  ProgramDetailMemoSection,
} from "@/components/features/program/sections";
import { useGetMemos } from "@/hooks/memos";
import { useGetProgram } from "@/hooks/programs";
import { useParams } from "next/navigation";
import { useLoader } from "@/hooks/common";

export default function ProgramDetailPage() {
  const { programId } = useParams<{ programId: string }>();
  const { showLoader, hideLoader } = useLoader();

  const { data: program, isLoading: programLoading } = useGetProgram(programId);

  const { data, isLoading: memosLoading } = useGetMemos({
    type: "program",
    programId,
  });

  const isLoading = programLoading || memosLoading;

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  if (!program) return null;

  const programMemoList = data?.memos.slice(0, 6) ?? [];
  const programMemoCount = data?.meta.totalCount ?? 0;

  return (
    <section className="flex w-full flex-1 flex-col">
      <ProgramDetailSection program={program} />

      <ProgramDetailMemoSection
        programId={programId}
        programMemoList={programMemoList}
        programMemoCount={programMemoCount}
      />
    </section>
  );
}

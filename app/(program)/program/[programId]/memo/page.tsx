"use client";

import {
  ProgramDetailHeader,
  ProgramDetailMemoListSection,
} from "@/components/features/program";
import { useGetMemosPaginated } from "@/hooks/memos";
import { useGetProgram } from "@/hooks/programs";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLoader } from "@/hooks/common";

export default function ProgramMemosPage() {
  const params = useParams();
  const programId = params.programId as string;
  const { showLoader, hideLoader } = useLoader();

  const { data: program, isLoading: isProgramLoading } =
    useGetProgram(programId);
  const {
    data: memosData,
    isLoading: isMemosLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMemosPaginated({
    type: "program",
    programId,
    limit: 6,
  });

  // 모든 페이지의 메모를 하나의 배열로 플랫하게 변환
  const programMemoList = memosData?.pages.flatMap((page) => page.memos) ?? [];

  useEffect(() => {
    if (isProgramLoading || isMemosLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isProgramLoading, isMemosLoading, showLoader, hideLoader]);

  if (!program) {
    return;
  }

  return (
    <section className="flex w-full flex-1 flex-col">
      <ProgramDetailHeader program={program} />
      <ProgramDetailMemoListSection
        programMemoList={programMemoList}
        onMoreClick={() => fetchNextPage()}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </section>
  );
}

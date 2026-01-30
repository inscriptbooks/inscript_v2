"use client";

import { Suspense, useEffect } from "react";
import { ProgramListSection } from "@/components/features/program";
import { SearchSection } from "@/components/common";
import { useGetPrograms } from "@/hooks/programs";
import { useSearchParams } from "next/navigation";
import { useLoader } from "@/hooks/common";

function ProgramPageContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const filter = searchParams.get("filter") as "ongoing" | "closed" | null;
  const view = searchParams.get("view") as "calendar" | null;

  const { showLoader, hideLoader } = useLoader();

  const { data, isLoading } = useGetPrograms({
    status: filter || "ongoing",
    keyword,
    limit: 11,
    isVisible: true,
  });

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  const programs = data?.programs || [];

  return (
    <section className="flex w-full flex-1 flex-col px-[20px] pb-[60px] pt-10 lg:px-[120px]">
      {view !== "calendar" && <SearchSection keyword={keyword} />}
      <ProgramListSection programs={programs} />
    </section>
  );
}

export default function ProgramPage() {
  return (
    <Suspense fallback={<div />}>
      <ProgramPageContent />
    </Suspense>
  );
}

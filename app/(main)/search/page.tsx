"use client";

import { Suspense, useEffect } from "react";
import MainSearchResultSection from "@/components/features/main/sections/MainSearchResultSection";
import MainSearchResultPlaySection from "@/components/features/main/sections/MainSearchResultPlaySection";
import MainSearchResultAuthorSection from "@/components/features/main/sections/MainSearchResultAuthorSection";
import MainSearchResultProgramSection from "@/components/features/main/sections/MainSearchResultProgramSection";
import { useGetPlays } from "@/hooks/plays";
import { useGetPrograms } from "@/hooks/programs";
import { useGetAuthors } from "@/hooks/authors";
import { useSaveSearchKeyword } from "@/hooks/search-keywords";
import { useSearchParams } from "next/navigation";
import { useBreakpoint, useLoader } from "@/hooks/common";

function MainSearchPageContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const { showLoader, hideLoader } = useLoader();
  const { isAbove } = useBreakpoint();
  const { mutate: saveSearchKeyword } = useSaveSearchKeyword();

  const { data: playsData, isLoading: isPlaysLoading } = useGetPlays({
    keyword,
    limit: isAbove("xl") ? 5 : 6,
  });
  const { data: authorsData, isLoading: isAuthorsLoading } = useGetAuthors({
    keyword,
    limit: isAbove("md") ? 4 : 2,
  });
  const { data: programsData, isLoading: isProgramsLoading } = useGetPrograms({
    keyword,
    limit: 3,
  });

  useEffect(() => {
    if (keyword && keyword.trim() !== "") {
      saveSearchKeyword({ keyword: keyword.trim() });
    }
  }, [keyword, saveSearchKeyword]);

  useEffect(() => {
    if (isPlaysLoading || isAuthorsLoading || isProgramsLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [
    isPlaysLoading,
    isAuthorsLoading,
    isProgramsLoading,
    showLoader,
    hideLoader,
  ]);

  const plays = playsData?.plays || [];
  const authors = authorsData?.authors || [];
  const programs = programsData?.programs || [];

  return (
    <section className="flex w-full flex-col bg-background px-[20px] lg:px-[120px]">
      <MainSearchResultSection keyword={keyword} />

      <div className="flex flex-col gap-[60px] lg:gap-20">
        <MainSearchResultPlaySection plays={plays} />
        <MainSearchResultAuthorSection authors={authors} />
        <MainSearchResultProgramSection programs={programs} />
      </div>
    </section>
  );
}

export default function MainSearchPage() {
  return (
    <Suspense fallback={<div />}>
      <MainSearchPageContent />
    </Suspense>
  );
}

"use client";

import { Suspense, useEffect } from "react";
import { SearchSection } from "@/components/common";
import {
  AuthorMemoListSection,
  AuthorTextListSection,
  AuthorConsonantFilterSection,
} from "@/components/features/author";
import { useGetAuthors } from "@/hooks/authors";
import { useGetMemos } from "@/hooks/memos";
import { useSearchParams } from "next/navigation";
import { useLoader } from "@/hooks/common";

function AuthorPageContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const consonant = searchParams.get("consonant") || "";
  const { showLoader, hideLoader } = useLoader();

  const { data: authorsData, isLoading: authorsLoading } = useGetAuthors({
    keyword,
    requestStatus: "approved",
  });

  const { data: authorMemosData, isLoading: memosLoading } = useGetMemos({
    type: "author",
    limit: 6,
  });

  useEffect(() => {
    if (authorsLoading || memosLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [authorsLoading, memosLoading, showLoader, hideLoader]);

  const authors = authorsData?.authors || [];
  const authorMemoList = authorMemosData?.memos ?? [];

  return (
    <section className="flex w-full flex-1 flex-col gap-8 px-[20px] pb-[60px] pt-10 lg:px-[120px]">
      <SearchSection keyword={keyword} />
      <AuthorConsonantFilterSection initialConsonant={consonant} />

      {keyword || consonant
        ? authors.length > 0 && <AuthorTextListSection authorList={authors} />
        : authorMemoList && <AuthorMemoListSection memoList={authorMemoList} />}
    </section>
  );
}

export default function AuthorPage() {
  return (
    <Suspense fallback={<div />}>
      <AuthorPageContent />
    </Suspense>
  );
}

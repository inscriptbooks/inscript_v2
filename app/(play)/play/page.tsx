"use client";

import { Suspense, useEffect, useState } from "react";
import { SearchSection } from "@/components/common";
import {
  PlaySection,
  PlayMemoSection,
  PlayHeroSection,
} from "@/components/features/play";
import { useSearchParams } from "next/navigation";
import { useSaveSearchKeyword } from "@/hooks/search-keywords";

function PlayPageContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const view = searchParams.get("view") || "";
  const consonant = searchParams.get("consonant") || "";
  const { mutate: saveSearchKeyword } = useSaveSearchKeyword();
  const [randomPlaceholder, setRandomPlaceholder] = useState("SEARCH");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (keyword && keyword.trim() !== "") {
      saveSearchKeyword({ keyword: keyword.trim() });
    }
  }, [keyword, saveSearchKeyword]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // keyword가 없을 때만 랜덤 키워드 가져오기
    if (!keyword && isClient) {
      fetch("/api/admin/dashboard/search-keywords")
        .then((res) => res.json())
        .then((data) => {
          if (data.keywords && data.keywords.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * data.keywords.length
            );
            setRandomPlaceholder(data.keywords[randomIndex].keyword);
          }
        })
        .catch(() => {
          setRandomPlaceholder("#로맨스 #고전주의 #신화 #비극");
        });
    }
  }, [keyword, isClient]);

  return (
    <section className="flex w-full flex-1 flex-col gap-[60px] px-[20px] pt-10 lg:px-[120px]">
      <SearchSection
        keyword={keyword}
        placeholder={keyword ? "SEARCH" : randomPlaceholder}
      />
      <PlaySection consonant={consonant} view={view} keyword={keyword} />
      {!keyword && view !== "text" && <PlayMemoSection />}
      <PlayHeroSection />
    </section>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div />}>
      <PlayPageContent />
    </Suspense>
  );
}

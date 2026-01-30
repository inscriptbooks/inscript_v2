import Image from "next/image";
import { SearchInput } from "@/components/common";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

async function getHeroKeyword() {
  try {
    const supabase = await createClient();

    // search_keywords 테이블에서 모든 검색 키워드 가져오기
    const { data, error } = await supabase
      .from("search_keywords")
      .select("keyword")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return "#로맨스 #고전주의 #신화 #비극";
    }

    // 키워드별로 카운트하고 상위 10개 추출
    const keywordCount: Record<string, number> = {};

    data.forEach((item) => {
      const keyword = item.keyword.toLowerCase();
      keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
    });

    const topKeywords = Object.entries(keywordCount)
      .map(([keyword, count]) => ({
        keyword,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    if (topKeywords.length === 0) {
      return "#로맨스 #고전주의 #신화 #비극";
    }

    // TOP10 중 랜덤으로 1개 선택
    const randomIndex = Math.floor(Math.random() * topKeywords.length);
    const randomKeyword = topKeywords[randomIndex];

    return randomKeyword.keyword;
  } catch (error) {
    return "#로맨스 #고전주의 #신화 #비극";
  }
}

export default async function MainSearchSection() {
  const keyword = await getHeroKeyword();

  return (
    <section className="full-bleed flex justify-center bg-[#F8F1EA]">
      <div className="flex w-full flex-col items-center justify-end gap-8 px-5 py-[72px] lg:w-[720px] lg:px-0 lg:pb-[100px]">
        {/* Content Container: Title and search input */}
        <div className="flex w-full flex-col items-center gap-5">
          {/* Title */}
          <h1 className="w-full text-center font-pretendard text-2xl font-bold text-primary lg:text-[28px]">
            오늘 찾아볼 희곡은 무엇인가요?
          </h1>

          {/* Search Input */}
          <Suspense fallback={<div />}>
            <SearchInput
              className="font-bold lg:h-16 lg:text-xl lg:leading-[1.5rem]"
              wrapperClassName="bg-transparent"
              placeholder={keyword}
              searchPath="/search"
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

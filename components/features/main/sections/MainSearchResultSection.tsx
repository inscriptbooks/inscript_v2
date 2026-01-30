import { SearchInput } from "@/components/common";
import { Suspense } from "react";

interface MainSearchResultSectionProps {
  keyword: string;
}

export default function MainSearchResultSection({
  keyword,
}: MainSearchResultSectionProps) {
  return (
    <section className="flex w-full flex-col pt-10 lg:pt-[76px]">
      <Suspense fallback={<div />}>
        <SearchInput wrapperClassName="bg-orange-4 py-3 h-14 lg:py-5 lg:h-[64px]" />
      </Suspense>
      <span className="py-6 font-serif text-2xl font-bold text-primary lg:py-10 lg:text-[32px]">{`“${keyword}” 검색 결과`}</span>
    </section>
  );
}

import { SearchInput } from "@/components/common";
import { Suspense } from "react";

interface CommunitySearchResultSectionProps {
  keyword: string;
  showFilter?: boolean;
}

export default function CommunitySearchResultSection({
  keyword,
  showFilter = true,
}: CommunitySearchResultSectionProps) {
  return (
    <section className="flex w-full flex-col">
      <Suspense fallback={<div />}>
        <SearchInput wrapperClassName="bg-orange-4" showFilter={showFilter} />
      </Suspense>
      <span className="pt-10 font-serif text-2xl font-bold text-primary lg:text-[32px]">{`"${keyword}" 검색 결과`}</span>
    </section>
  );
}

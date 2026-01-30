import { SearchInput } from "@/components/common";
import { Suspense } from "react";

interface AuthorSearchResultSectionProps {
  keyword: string;
}

export default function AuthorSearchResultSection({
  keyword,
}: AuthorSearchResultSectionProps) {
  return (
    <section className="flex w-full flex-col pt-10 lg:pt-[76px]">
      <Suspense fallback={<div />}>
        <SearchInput wrapperClassName="bg-orange-4" />
      </Suspense>
      <span className="pt-10 font-serif text-2xl font-bold text-primary lg:text-[32px]">{`"${keyword}" 검색 결과`}</span>
    </section>
  );
}

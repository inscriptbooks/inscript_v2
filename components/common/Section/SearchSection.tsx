import { Suspense } from "react";
import { SearchInput } from "@/components/common";

interface SearchSectionProps {
  keyword: string;
  placeholder?: string;
}

export default function SearchSection({ keyword, placeholder = "SEARCH" }: SearchSectionProps) {
  return (
    <section className="flex w-full flex-col">
      <Suspense fallback={<div />}>
        <SearchInput wrapperClassName="bg-orange-4" value={keyword} placeholder={placeholder} />
      </Suspense>
      {keyword && (
        <span className="pt-10 font-serif text-2xl font-bold text-primary lg:text-[32px]">{`"${keyword}" 검색 결과`}</span>
      )}
    </section>
  );
}

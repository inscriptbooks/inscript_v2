"use client";

import { ViewMoreLinkButton } from "@/components/common/Button";
import { AuthorList } from "@/components/features/author";
import { Author } from "@/models/author";
import { EmptyBox } from "@/components/common";

interface MainSearchResultAuthorSectionProps {
  authors: Author[];
}

export default function MainSearchResultAuthorSection({
  authors,
}: MainSearchResultAuthorSectionProps) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="font-serif text-xl font-bold text-gray-1 lg:text-[28px]">
          작가
        </span>
        <ViewMoreLinkButton href="/author" />
      </div>

      {authors.length > 0 ? (
        <AuthorList
          authorList={authors}
          className="grid auto-rows-[320px] grid-cols-1 gap-4 md:gap-5 lg:auto-rows-max lg:grid-cols-2"
        />
      ) : (
        <EmptyBox text="검색 결과가 없습니다." />
      )}
    </section>
  );
}

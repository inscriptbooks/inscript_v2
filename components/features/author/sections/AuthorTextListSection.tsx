"use client";

import {
  chunkArray,
  flattenArray,
  getInitialConsonant,
  getInitialLetter,
} from "@/lib/utils";
import { Author } from "@/models/author";
import { AuthorConsonantFilteredList } from "../components";
import { koreanConsonants, englishLetters } from "@/lib/constants";
import { useSearchParams } from "next/navigation";

interface AuthorTextListSectionProps {
  authorList: Author[];
}

export default function AuthorTextListSection({
  authorList,
}: AuthorTextListSectionProps) {
  const searchParams = useSearchParams();
  const selectedConsonant = searchParams.get("consonant");

  // 자음별로 작가 필터링하는 함수
  const filterAuthorsByConsonant = (consonant: string): Author[] => {
    return authorList.filter((author) => {
      // 한글인 경우
      const koreanConsonant = getInitialConsonant(author.authorName);
      if (koreanConsonant === consonant) {
        return true;
      }

      // 영문인 경우
      const englishLetter = getInitialLetter(author.authorName);
      if (englishLetter === consonant) {
        return true;
      }

      return false;
    });
  };

  // 선택된 자음이 있는 경우
  if (selectedConsonant) {
    const filteredAuthors = filterAuthorsByConsonant(selectedConsonant);
    if (filteredAuthors.length === 0) {
      return null;
    }
    const chunks = chunkArray(filteredAuthors, 10);
    return (
      <section className="flex flex-col gap-10">
        <AuthorConsonantFilteredList
          key={selectedConsonant}
          consonant={selectedConsonant}
          items={chunks}
        />
      </section>
    );
  }

  // 모든 자음에 대해 필터링
  const allConsonants = [
    ...flattenArray(koreanConsonants),
    ...flattenArray(englishLetters),
  ];

  return (
    <section className="flex flex-col gap-10">
      {allConsonants.map((consonant) => {
        const filteredAuthors = filterAuthorsByConsonant(consonant);
        if (filteredAuthors.length === 0) {
          return null;
        }
        const chunks = chunkArray(filteredAuthors, 10);
        return (
          <AuthorConsonantFilteredList
            key={consonant}
            consonant={consonant}
            items={chunks}
          />
        );
      })}
    </section>
  );
}

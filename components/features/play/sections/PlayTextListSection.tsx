"use client";

import { ConsonantFilter } from "@/components/common";
import { chunkArray, flattenArray, groupByConsonant } from "@/lib/utils";
import { PlayConsonantFilteredList } from "../components";
import { koreanConsonants, englishLetters } from "@/lib/constants";
import { useState, useEffect } from "react";
import { useGetPlays } from "@/hooks/plays";
import { useLoader } from "@/hooks/common";
import { ApplyStatus } from "@/models/play";

interface PlayTextListSectionProps {
  initialConsonant?: string;
  keyword?: string;
}

export default function PlayTextListSection({
  initialConsonant,
  keyword,
}: PlayTextListSectionProps) {
  const [selectedConsonant, setSelectedConsonant] = useState(initialConsonant);
  const { showLoader, hideLoader } = useLoader();
  const MAX_ITEMS_PER_CONSONANT = 30;

  // 한 번만 데이터 가져오기 (keyword만 사용)
  const { data, isLoading } = useGetPlays({
    keyword,
    limit: 200,
    applyStatus: ApplyStatus.ACCEPTED,
  });

  const plays = data?.plays ?? [];

  // 클라이언트에서 초성별로 그룹화
  const groupedPlays = groupByConsonant(plays, (play) => play.title);

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  return (
    <section className="flex flex-col gap-8">
      <ConsonantFilter
        selectedConsonant={selectedConsonant}
        onConsonantSelect={setSelectedConsonant}
      />

      {plays.length > 0 ? (
        <div className="flex flex-col gap-10">
          {selectedConsonant
            ? groupedPlays[selectedConsonant] && (
                <PlayConsonantFilteredList
                  key={selectedConsonant}
                  consonant={selectedConsonant}
                  items={chunkArray(
                    groupedPlays[selectedConsonant].slice(
                      0,
                      MAX_ITEMS_PER_CONSONANT
                    ),
                    10
                  )}
                />
              )
            : [
                ...flattenArray(koreanConsonants),
                ...flattenArray(englishLetters),
              ].map((consonant) => {
                const consonantPlays = groupedPlays[consonant];
                if (!consonantPlays || consonantPlays.length === 0) return null;

                return (
                  <PlayConsonantFilteredList
                    key={consonant}
                    consonant={consonant}
                    items={chunkArray(
                      consonantPlays.slice(0, MAX_ITEMS_PER_CONSONANT),
                      10
                    )}
                  />
                );
              })}
        </div>
      ) : (
        <span className="font-serif font-bold text-orange-2 lg:text-xl">
          검색 결과에 해당하는 희곡이 없습니다.
        </span>
      )}
    </section>
  );
}

"use client";

import ShowMoreButton from "@/components/common/Button/ShowMoreButton";
import { Program } from "@/models/program";
import { ProgramHistoryCard } from "@/components/features/program";
import { useRouter } from "next/navigation";

interface MyPageHistoryScrapProgramSectionProps {
  programScraps: Program[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function MyPageHistoryScrapProgramSection({
  programScraps,
  onLoadMore,
  hasMore,
  isLoading,
}: MyPageHistoryScrapProgramSectionProps) {
  const router = useRouter();

  const handleProgramClick = (programId: string) => {
    router.push(`/program/${programId}`);
  };

  return (
    <section className="flex w-full flex-col items-center gap-7">
      <div className="flex flex-col items-start gap-3 self-stretch">
        <h1 className="font-pretendard text-xl font-semibold leading-6 text-gray-1">
          내가 스크랩한 프로그램
        </h1>
      </div>

      {programScraps.length === 0 ? (
        <p className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
          스크랩한 프로그램이 없습니다.
        </p>
      ) : (
        <>
          <div className="flex flex-col items-start gap-[18px] self-stretch">
            {programScraps.map((item) => (
              <ProgramHistoryCard 
                key={item.id} 
                item={item}
                onClick={() => handleProgramClick(item.id)}
              />
            ))}
          </div>

          {hasMore && (
            <ShowMoreButton onClick={onLoadMore} disabled={isLoading} />
          )}
        </>
      )}
    </section>
  );
}

import { EmptyBox } from "@/components/common";
import { ViewMoreLinkButton } from "@/components/common/Button";
import { ProgramPreviewCard } from "@/components/features/program";
import { Program } from "@/models/program";

interface MainSearchResultProgramSectionProps {
  programs: Program[];
}

export default function MainSearchResultProgramSection({
  programs,
}: MainSearchResultProgramSectionProps) {
  return (
    <section className="mb-[60px] flex flex-col gap-5 lg:mb-20">
      <div className="flex items-center justify-between">
        <span className="font-serif text-xl font-bold text-gray-1 lg:text-[28px]">
          프로그램
        </span>
        <ViewMoreLinkButton href="/program" />
      </div>

      {programs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {programs.map((program) => (
            <ProgramPreviewCard key={program.id} program={program} />
          ))}
        </div>
      ) : (
        <EmptyBox text="검색 결과가 없습니다." />
      )}
    </section>
  );
}

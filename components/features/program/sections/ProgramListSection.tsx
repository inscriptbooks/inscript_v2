"use client";

import { ProgramPreviewCard } from "@/components/features/program";
import {
  CalendarViewToggle,
  EmptyBox,
  ProgramCalendar,
} from "@/components/common";
import { Program } from "@/models/program";
import { useSearchParams } from "next/navigation";

interface ProgramListSectionProps {
  programs: Program[];
}

export default function ProgramListSection({
  programs,
}: ProgramListSectionProps) {
  const searchParams = useSearchParams();
  const isCalendarView = searchParams.get("view") === "calendar";
  const programStatusFilter =
    searchParams.get("filter") === "closed" ? "closed" : "ongoing";

  const BannerComponent = () => (
    <div className="flex h-[288px] w-full flex-col justify-between rounded bg-primary p-5">
      <div className="w-full font-serif text-[28px] font-bold leading-8 text-white">
        Archiving playscripts, shaping a new theatre community
      </div>
      <div className="w-full text-sm font-medium leading-4 text-white">
        Connecting Playscripts, Playwrights, and People.
      </div>
    </div>
  );

  // Rearrange programs for row-based display in column layout
  const getColumnPrograms = (columnIndex: number) => {
    const result = [];

    for (let i = columnIndex; i < programs.length; i += 3) {
      result.push(programs[i]);
    }

    return result;
  };

  return (
    <section className="flex w-full flex-1 flex-col">
      {/* Calendar View Toggle */}
      <div className="mb-10 mt-10 flex w-full justify-end lg:mt-5">
        {programs.length > 0 && <CalendarViewToggle />}
      </div>

      {programs.length > 0 ? (
        isCalendarView ? (
          <div className="flex w-full flex-col gap-[60px]">
            <ProgramCalendar status={programStatusFilter} />

            <div className="flex flex-col">
              <h1 className="mb-5 font-serif text-2xl text-primary font-bold">
                {programStatusFilter === "ongoing"
                  ? "진행 중인 프로그램"
                  : "지난 프로그램"}
              </h1>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {programs.slice(0, 3).map((program) => (
                  <ProgramPreviewCard key={program.id} program={program} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col">
            {/* Normal Grid View */}

            <h1 className="mb-5 font-serif text-2xl text-primary font-bold">
              {programStatusFilter === "ongoing"
                ? "진행 중인 프로그램"
                : "지난 프로그램"}
            </h1>

            <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3 lg:items-start">
              {/* Mobile/Tablet Layout (1 column) - All items in single column */}
              <div className="flex flex-col gap-5 lg:hidden">
                {programs.map((program) => (
                  <ProgramPreviewCard key={program.id} program={program} />
                ))}
              </div>

              {/* Desktop Layout (3 columns) - Each column with independent height, row-based data */}
              {/* First Column: programs[0], programs[3], programs[6], programs[9] */}
              <div className="hidden flex-col gap-5 lg:flex">
                {getColumnPrograms(0).map((program) => (
                  <ProgramPreviewCard key={program.id} program={program} />
                ))}
              </div>

              {/* Second Column with Banner: banner, programs[1], programs[4], programs[7], programs[10] */}
              <div className="hidden flex-col gap-5 lg:flex">
                <BannerComponent />
                {getColumnPrograms(1).map((program) => (
                  <ProgramPreviewCard key={program.id} program={program} />
                ))}
              </div>

              {/* Third Column: programs[2], programs[5], programs[8], programs[11] */}
              <div className="hidden flex-col gap-5 lg:flex">
                {getColumnPrograms(2).map((program) => (
                  <ProgramPreviewCard key={program.id} program={program} />
                ))}
              </div>
            </div>
          </div>
        )
      ) : (
        <EmptyBox text="검색된 프로그램이 없습니다." />
      )}
    </section>
  );
}

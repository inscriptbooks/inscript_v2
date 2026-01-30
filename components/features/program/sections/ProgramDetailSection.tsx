import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Program, isWithinApplicationPeriod } from "@/models/program";
import { formatDateTime } from "@/lib/utils";
import { ProgramDetailHeader } from "../components";

interface ProgramDetailSectionProps {
  program: Program;
}

export default function ProgramDetailSection({
  program,
}: ProgramDetailSectionProps) {
  const {
    description,
    eventDateTime,
    location,
    notes,
    keyword,
    applicationStartAt,
    applicationEndAt,
    thumbnailUrl,
    smartstoreUrl,
  } = program;

  // 신청 가능 여부 확인 (신청 기간 내)
  const isApplicationOpen = isWithinApplicationPeriod(
    applicationStartAt,
    applicationEndAt
  );

  return (
    <section className="flex w-full flex-1 flex-col">
      <ProgramDetailHeader program={program} />

      <div className="flex w-full flex-col gap-10 lg:flex-row lg:px-[120px] lg:py-11">
        {/* Left side - Image and Description */}
        <div className="flex w-full flex-col gap-[50px] lg:basis-[63%]">
          {/* Program Image */}
          <div className="relative flex aspect-video w-full items-center justify-center bg-gray-5">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt="프로그램 이미지"
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-[28px] font-medium leading-[150%] tracking-[-0.56px] text-primary">
                *프로그램 이미지
              </span>
            )}
          </div>

          {/* Program Description */}
          {description && (
            <div className="flex flex-col gap-3 px-[20px] lg:px-0">
              <h2 className="text-xl font-semibold leading-6 text-gray-1">
                프로그램 소개
              </h2>
              <p className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Right side - Program Details */}
        <div className="flex flex-1 flex-col gap-10 px-[20px] lg:px-0 lg:py-0">
          <div className="flex flex-col gap-8">
            {/* Date */}
            <div className="flex flex-col gap-2.5">
              <h3 className="text-xl font-semibold leading-6 text-gray-1">
                날짜
              </h3>
              <p className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                {formatDateTime(eventDateTime)}
              </p>
            </div>

            {/* Location */}
            {location && (
              <div className="flex flex-col gap-2.5">
                <h3 className="text-xl font-semibold leading-6 text-gray-1">
                  장소
                </h3>
                <p className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  {location}
                </p>
              </div>
            )}

            {/* Keywords */}
            {keyword && keyword.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <h3 className="text-xl font-semibold leading-6 text-gray-1">
                  키워드
                </h3>
                <p className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  {keyword.join(", ")}
                </p>
              </div>
            )}

            {/* Other Information */}
            {notes && (
              <div className="flex flex-col gap-2.5">
                <h3 className="text-xl font-semibold leading-6 text-gray-1">
                  기타 안내사항
                </h3>
                <p className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  {notes}
                </p>
              </div>
            )}
          </div>

          {/* Apply Button */}
          {isApplicationOpen ? (
            smartstoreUrl ? (
              <a href={smartstoreUrl} target="_blank" rel="noopener noreferrer">
                <Button className="w-full rounded text-lg font-semibold leading-6">
                  신청하기
                </Button>
              </a>
            ) : (
              <Link href={`/program/${program.id}/register`}>
                <Button className="w-full rounded text-lg font-semibold leading-6">
                  신청하기
                </Button>
              </Link>
            )
          ) : (
            <Button
              variant="disabled"
              disabled
              className="w-full rounded text-lg font-semibold leading-6"
            >
              신청 마감
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

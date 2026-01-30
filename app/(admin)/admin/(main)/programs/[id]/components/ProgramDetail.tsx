import { Badge } from "@/components/ui/badge";
import { ProgramDetailInfo } from "../types";

interface ProgramDetailProps {
  programInfo: ProgramDetailInfo;
}

export default function ProgramDetail({ programInfo }: ProgramDetailProps) {
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-xl font-bold leading-6 text-gray-1">
          프로그램 정보
        </h2>
      </div>

      <div className="flex w-full flex-col items-start border border-gray-7">
        {/* 프로그램명 */}
        <div className="flex h-12 w-full items-center border-b border-gray-7">
          <div className="flex w-40 items-center gap-2.5 self-stretch bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              프로그램명
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              {programInfo.title}
            </span>
          </div>
        </div>

        {/* 행사일시, 신청기간 */}
        <div className="flex w-full items-center">
          <div className="flex h-12 w-40 items-center gap-2.5 border-b border-gray-7 bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              행사일시
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center gap-2.5 border-b border-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              {programInfo.eventDateTime}
            </span>
          </div>
          <div className="flex h-12 w-40 items-center gap-2.5 border-b border-gray-7 bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              신청기간
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center gap-2.5 border-b border-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              {programInfo.applicationPeriod}
            </span>
          </div>
        </div>

        {/* 장소, 인원 */}
        <div className="flex w-full items-center">
          <div className="flex h-12 w-40 items-center gap-2.5 border-b border-gray-7 bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              장소
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center gap-2.5 border-b border-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              {programInfo.location}
            </span>
          </div>
          <div className="flex h-12 w-40 items-center gap-2.5 border-b border-gray-7 bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              인원
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center gap-2.5 border-b border-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              {programInfo.capacity}
            </span>
          </div>
        </div>

        {/* 안내사항 */}
        <div className="flex h-12 w-full items-center border-b border-gray-7">
          <div className="flex w-40 items-center gap-2.5 self-stretch bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              안내사항
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              {programInfo.notes}
            </span>
          </div>
        </div>

        {/* 키워드 */}
        <div className="flex w-full items-center border-b border-gray-7">
          <div className="flex w-40 items-center gap-2.5 self-stretch bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              키워드
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
            <div className="flex items-start gap-1.5">
              {programInfo.keywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  size="md"
                  className="border-primary text-primary"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* 프로그램 소개 */}
        <div className="flex w-full items-center border-b border-gray-7">
          <div className="flex w-40 items-center gap-2.5 self-stretch bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              프로그램 소개
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              {programInfo.description}
            </span>
          </div>
        </div>

        {/* 대표 이미지 */}
        <div className="flex w-full items-center border-b border-gray-7">
          <div className="flex w-40 items-center gap-2.5 self-stretch bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              대표 이미지
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
            {programInfo.thumbnailUrl ? (
              <img
                src={programInfo.thumbnailUrl}
                alt={programInfo.title}
                className="h-[199px] w-[288px] object-cover"
              />
            ) : (
              <div className="flex h-[199px] w-[288px] items-center justify-center bg-[#D9D9D9]">
                <span className="text-[28px] font-medium leading-[150%] tracking-[-0.56px] text-primary">
                  *프로그램 이미지
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 노출 여부, 상태 */}
        <div className="flex w-full items-center">
          <div className="flex h-12 w-40 items-center gap-2.5 border-b border-gray-7 bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              노출 여부
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center gap-2.5 border-b border-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              {programInfo.isVisible ? "노출중" : "비노출"}
            </span>
          </div>
          <div className="flex h-12 w-40 items-center gap-2.5 border-b border-gray-7 bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              상태
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center gap-2.5 border-b border-gray-7 px-6 py-2.5">
            <div className="flex items-center justify-center gap-2.5 rounded-full border border-[#B0D5F2] bg-[#F6FBFF] px-3 py-1.5">
              <span className="text-sm font-medium leading-4 text-[#2581F9]">
                {programInfo.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

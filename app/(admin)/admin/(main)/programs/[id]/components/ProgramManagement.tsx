import { ProgramBasicInfo } from "../types";

interface ProgramManagementProps {
  basicInfo: ProgramBasicInfo;
}

export default function ProgramManagement({ basicInfo }: ProgramManagementProps) {
  return (
    <div className="flex w-full flex-col items-end gap-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold leading-8 text-gray-1">
          프로그램 관리
        </h1>
      </div>

      {/* 기본 정보 테이블 */}
      <div className="flex w-full flex-col items-start border border-gray-7">
        {/* 첫 번째 줄 */}
        <div className="flex w-full items-center">
          <div className="flex h-12 w-40 items-center gap-2.5 border-b border-gray-7 bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              프로그램ID
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center gap-2.5 border-b border-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              {basicInfo.programId}
            </span>
          </div>
        </div>

        {/* 두 번째 줄 */}
        <div className="flex w-full items-center">
          <div className="flex h-12 w-40 items-center gap-2.5 border-b border-gray-7 bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              신청수
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center gap-2.5 border-b border-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              {basicInfo.applicationCount}
            </span>
          </div>
          <div className="flex h-12 w-40 items-center gap-2.5 border-b border-gray-7 bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              등록일
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center gap-2.5 border-b border-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              {basicInfo.createdAt}
            </span>
          </div>
        </div>

        {/* 세 번째 줄 */}
        <div className="flex w-full items-center">
          <div className="flex h-12 w-40 items-center gap-2.5 border-b border-gray-7 bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              조회수
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center gap-2.5 border-b border-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              {basicInfo.viewCount.toLocaleString()}
            </span>
          </div>
          <div className="flex h-12 w-40 items-center gap-2.5 border-b border-gray-7 bg-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              스크랩수
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center gap-2.5 border-b border-gray-7 px-6 py-2.5">
            <span className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              {basicInfo.bookmarkCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

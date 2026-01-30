"use client";

import { ReportDetail } from "../types";

interface ReportInfoProps {
  reportDetail: ReportDetail;
}

export default function ReportInfo({ reportDetail }: ReportInfoProps) {
  return (
    <div className="flex w-full flex-col items-end gap-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="font-pretendard text-xl font-semibold leading-6 text-gray-1">
          신고정보
        </h2>
      </div>
      <div className="flex w-full flex-col border border-gray-7">
        {/* 신고자, 신고유형 행 */}
        <div className="flex">
          <div className="flex h-12 flex-1 items-center border-b border-gray-7">
            <div className="flex h-full w-40 items-center gap-2.5 bg-gray-7 px-6">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                신고자
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                {reportDetail.reportInfo.reporter}
              </span>
            </div>
          </div>
          <div className="flex h-12 flex-1 items-center border-b border-gray-7">
            <div className="flex h-full w-40 items-center gap-2.5 bg-gray-7 px-6">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                신고유형
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                {reportDetail.reportInfo.reportType}
              </span>
            </div>
          </div>
        </div>

        {/* 신고사유, 신고일시 행 */}
        <div className="flex">
          <div className="flex h-12 flex-1 items-center border-b border-gray-7">
            <div className="flex h-full w-40 items-center gap-2.5 bg-gray-7 px-6">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                신고사유
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                {reportDetail.reportInfo.reason}
              </span>
            </div>
          </div>
          <div className="flex h-12 flex-1 items-center border-b border-gray-7">
            <div className="flex h-full w-40 items-center gap-2.5 bg-gray-7 px-6">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                신고일시
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                {reportDetail.reportInfo.reportedAt}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

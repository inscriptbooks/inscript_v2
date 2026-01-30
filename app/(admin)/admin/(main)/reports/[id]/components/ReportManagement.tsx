"use client";

import ReportStatusBadge from "@/components/ui/ReportStatusBadge";
import { ReportDetail } from "../types";

interface ReportManagementProps {
  reportDetail: ReportDetail;
}

// HTML 태그 제거 함수
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

export default function ReportManagement({ reportDetail }: ReportManagementProps) {
  return (
    <div className="flex w-full flex-col items-end gap-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="font-pretendard text-2xl font-semibold leading-8 text-gray-1">
          신고 관리
        </h1>
      </div>
      <div className="flex w-full flex-col border border-gray-7">
        {/* 신고ID, 상태 행 */}
        <div className="flex">
          <div className="flex h-12 flex-1 items-center border-b border-gray-7">
            <div className="flex h-full w-40 items-center gap-2.5 bg-gray-7 px-6">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                신고ID
              </span>
            </div>
            <div className="flex h-full flex-1 items-center gap-2.5 px-6">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                {reportDetail.reportId}
              </span>
            </div>
          </div>
          <div className="flex h-12 flex-1 items-center border-b border-gray-7">
            <div className="flex h-full w-40 items-center gap-2.5 bg-gray-7 px-6">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                상태
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <ReportStatusBadge status={reportDetail.status} />
            </div>
          </div>
        </div>

        {/* 신고 대상 행 */}
        <div className="flex h-12 items-center border-b border-gray-7">
          <div className="flex h-full w-40 items-center gap-2.5 bg-gray-7 px-6">
            <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              신고 대상
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
            <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              커뮤니티 {reportDetail.target.type} ({reportDetail.target.id})
            </span>
            {reportDetail.target.originalLink && (
              <a
                href={reportDetail.target.originalLink}
                className="font-pretendard text-base font-medium leading-6 tracking-[-0.32px] text-[#2581F9] underline"
                target="_blank"
              >
                원문 바로가기
              </a>
            )}
          </div>
        </div>

        {/* 작성자, 작성일시 행 */}
        <div className="flex">
          <div className="flex h-12 flex-1 items-center border-b border-gray-7">
            <div className="flex h-full w-40 items-center gap-2.5 bg-gray-7 px-6">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                작성자
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                {reportDetail.target.author}
              </span>
            </div>
          </div>
          <div className="flex h-12 flex-1 items-center border-b border-gray-7">
            <div className="flex h-full w-40 items-center gap-2.5 bg-gray-7 px-6">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                작성일시
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                {reportDetail.target.createdAt}
              </span>
            </div>
          </div>
        </div>

        {/* 내용 행 */}
        <div className="flex">
          <div className="flex flex-1 items-start">
            <div className="flex h-full w-40 items-start gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                내용
              </span>
            </div>
            <div className="flex flex-1 items-start gap-2.5 px-6 py-2.5">
              <pre className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1 whitespace-pre-wrap break-words">
                {stripHtmlTags(reportDetail.target.content)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

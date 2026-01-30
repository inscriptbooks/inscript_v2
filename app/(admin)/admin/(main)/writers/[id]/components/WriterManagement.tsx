import { AuthorData } from "../types";
import { formatKoreanDate } from "@/lib/utils/date";

interface WriterManagementProps {
  authorData: AuthorData;
}

export default function WriterManagement({
  authorData,
}: WriterManagementProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-pretendard text-2xl font-bold leading-8 text-gray-1">
          작가 관리
        </h1>
      </div>

      {/* 작가 기본 정보 테이블 */}
      <div className="border border-gray-7">
        {/* 첫 번째 행 */}
        <div className="flex">
          <div className="flex h-12 w-40 items-center bg-gray-7 px-6">
            <span className="font-pretendard text-base font-normal text-gray-2">
              작가ID
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center border-b border-gray-7 px-6">
            <span className="font-pretendard text-base font-normal text-gray-1">
              {authorData.id}
            </span>
          </div>
        </div>

        {/* 두 번째 행 */}
        <div className="flex">
          <div className="flex h-12 w-40 items-center bg-gray-7 px-6">
            <span className="font-pretendard text-base font-normal text-gray-2">
              등록일
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center border-b border-gray-7 px-6">
            <span className="font-pretendard text-base font-normal text-gray-1">
              {formatKoreanDate(authorData.created_at)}
            </span>
          </div>
        </div>

        {/* 세 번째 행 */}
        <div className="flex">
          <div className="flex h-12 w-40 items-center bg-gray-7 px-6">
            <span className="font-pretendard text-base font-normal text-gray-2">
              조회수
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center px-6">
            <span className="font-pretendard text-base font-normal text-gray-1">
              {authorData.view_count.toLocaleString()}
            </span>
          </div>
          <div className="flex h-12 w-40 items-center bg-gray-7 px-6">
            <span className="font-pretendard text-base font-normal text-gray-2">
              스크랩수
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center px-6">
            <span className="font-pretendard text-base font-normal text-gray-1">
              {authorData.bookmark_count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

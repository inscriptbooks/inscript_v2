import { Badge } from "@/components/ui/badge";
import { AuthorData } from "../types";

interface WriterInfoProps {
  authorData: AuthorData;
}

export default function WriterInfo({ authorData }: WriterInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-pretendard text-xl font-bold text-gray-1">
        작가 정보
      </h2>
      <div className="border border-gray-7">
        {/* 작가명 행 */}
        <div className="flex">
          <div className="flex h-12 w-40 items-center bg-gray-7 px-6">
            <span className="font-pretendard text-base font-normal text-gray-2">
              작가명
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center border-b border-gray-7 px-6">
            <span className="font-pretendard text-base font-normal text-gray-1">
              {authorData.author_name}
            </span>
          </div>
          <div className="flex h-12 w-40 items-center bg-gray-7 px-6">
            <span className="font-pretendard text-base font-normal text-gray-2">
              작가명(영문)
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center border-b border-gray-7 px-6">
            <span className="font-pretendard text-base font-normal text-gray-1">
              {authorData.author_name_en || "-"}
            </span>
          </div>
        </div>

        {/* 키워드 행 */}
        <div className="flex">
          <div className="flex h-12 w-40 items-center bg-gray-7 px-6">
            <span className="font-pretendard text-base font-normal text-gray-2">
              키워드
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center border-b border-gray-7 px-6">
            <div className="flex gap-1.5">
              {authorData.keyword && authorData.keyword.length > 0 ? (
                authorData.keyword.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="rounded border border-primary px-2.5 py-2 text-sm font-medium text-primary"
                  >
                    {keyword}
                  </Badge>
                ))
              ) : (
                <span className="font-pretendard text-base font-normal text-gray-2">
                  키워드 없음
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 작가 소개 행 */}
        <div className="flex">
          <div className="flex w-40 items-center bg-gray-7 px-6 py-2.5">
            <span className="font-pretendard text-base font-normal text-gray-2">
              작가 소개
            </span>
          </div>
          <div className="flex flex-1 items-center border-b border-gray-7 px-6 py-2.5">
            <span className="font-pretendard text-base font-normal text-gray-1">
              {authorData.description}
            </span>
          </div>
        </div>

        {/* 노출 여부 행 */}
        <div className="flex">
          <div className="flex h-12 w-40 items-center bg-gray-7 px-6">
            <span className="font-pretendard text-base font-normal text-gray-2">
              노출 여부
            </span>
          </div>
          <div className="flex h-12 flex-1 items-center px-6">
            <span className="font-pretendard text-base font-normal text-gray-1">
              {authorData.is_visible ? "노출중" : "미노출"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

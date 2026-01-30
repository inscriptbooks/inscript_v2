import { PlayData } from "../types";
import { formatKoreanDate } from "@/lib/utils/date";

interface PlayManagementProps {
  playData: PlayData;
}

export default function PlayManagement({ playData }: PlayManagementProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold leading-8 text-gray-1">희곡 관리</h1>
      </div>

      <div className="flex flex-col border border-gray-7">
        {/* 첫 번째 행 */}
        <div className="flex items-stretch">
          <div className="flex flex-1 border-b border-gray-7">
            <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                작품ID
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-1">
                {playData.id}
              </span>
            </div>
          </div>
        </div>

        {/* 두 번째 행 */}
        <div className="flex items-stretch">
          <div className="flex flex-1 border-b border-gray-7">
            <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                등록자
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-1">
                {playData.created_by
                  ? `${playData.created_by.email} (${playData.created_by.name || "이름 없음"})`
                  : "알 수 없음"}
              </span>
            </div>
          </div>
          <div className="flex flex-1 border-b border-gray-7">
            <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                등록일
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-1">
                {formatKoreanDate(playData.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* 세 번째 행 */}
        <div className="flex items-stretch">
          <div className="flex flex-1 border-b border-gray-7">
            <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                조회수
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-1">
                {playData.view_count.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex flex-1 border-b border-gray-7">
            <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                스크랩수
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-1">
                {playData.bookmark_count.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { PlayData } from "../types";
import { useRouter } from "next/navigation";
import { formatKoreanDate } from "@/lib/utils/date";

interface PlayStatusProps {
  playData: PlayData[];
}

export default function PlayStatus({ playData }: PlayStatusProps) {
  const router = useRouter();

  const handleDetailClick = (playId: string) => {
    router.push(`/admin/plays/${playId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-pretendard text-xl font-bold text-gray-1">
        작품 현황
      </h2>
      <div className="flex flex-col bg-white">
        {/* 테이블 헤더 */}
        <div className="flex items-center justify-between bg-gray-7 px-6 py-2.5">
          <div className="w-[54px] text-center">
            <span className="font-pretendard text-sm font-medium text-gray-4">
              작품ID
            </span>
          </div>
          <div className="flex w-[214px] justify-center">
            <span className="font-pretendard text-base font-normal text-gray-2">
              작품명
            </span>
          </div>
          <div className="w-[116px] text-center">
            <span className="font-pretendard text-sm font-medium text-gray-4">
              등록일
            </span>
          </div>
          <div className="w-[44px] text-center">
            <span className="font-pretendard text-sm font-medium text-gray-4">
              좋아요
            </span>
          </div>
          <div className="w-[44px] text-center">
            <span className="font-pretendard text-base font-normal text-gray-2">
              댓글
            </span>
          </div>
          <div className="w-[44px] text-center">
            <span className="font-pretendard text-base font-normal text-gray-2">
              신고
            </span>
          </div>
          <div className="w-[72px] text-center">
            <span className="font-pretendard text-base font-normal text-gray-2 opacity-75">
              상세
            </span>
          </div>
        </div>

        {/* 테이블 본문 */}
        {playData.length > 0 ? (
          playData.map((play, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-gray-7 px-6 py-2.5"
            >
              <div className="w-[54px] text-center">
                <span className="font-pretendard text-base font-normal text-gray-1">
                  {play.id.substring(0, 8)}
                </span>
              </div>
              <div className="flex w-[214px] justify-center">
                <div className="max-w-[200px] truncate">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {play.title}
                  </span>
                </div>
              </div>
              <div className="w-[116px] text-center">
                <span className="font-pretendard text-sm font-medium text-gray-4">
                  {formatKoreanDate(play.created_at)}
                </span>
              </div>
              <div className="w-[44px] text-center">
                <span className="font-pretendard text-sm font-medium text-gray-4">
                  {play.like_count}
                </span>
              </div>
              <div className="w-[44px] text-center">
                <span className="font-pretendard text-sm font-medium text-gray-4">
                  {play.comment_count}
                </span>
              </div>
              <div className="w-[44px] text-center">
                <span className="font-pretendard text-sm font-medium text-gray-4">
                  {play.report_count}
                </span>
              </div>
              <div className="w-[72px] text-center">
                <Button
                  variant="outline"
                  onClick={() => handleDetailClick(play.id)}
                  className="h-9 rounded border border-primary bg-white px-3 py-2.5 hover:bg-gray-6"
                >
                  <span className="font-pretendard text-sm font-bold text-primary">
                    상세보기
                  </span>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-10">
            <span className="font-pretendard text-base font-normal text-gray-4">
              등록된 작품이 없습니다.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

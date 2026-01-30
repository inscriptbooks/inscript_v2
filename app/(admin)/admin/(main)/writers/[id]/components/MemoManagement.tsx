"use client";

import { Button } from "@/components/ui/button";
import { MemoData } from "../types";
import { useRouter } from "next/navigation";

interface MemoManagementProps {
  memoData: MemoData[];
}

export default function MemoManagement({ memoData }: MemoManagementProps) {
  const router = useRouter();

  const handleDetailClick = (memoId: string) => {
    // 메모 상세 페이지로 이동 (필요시 구현)
    router.push(`/admin/memos/${memoId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-pretendard text-xl font-bold text-gray-1">
        메모 관리
      </h2>
      <div className="flex flex-col bg-white">
        {/* 테이블 헤더 */}
        <div className="flex items-center justify-between bg-gray-7 px-6 py-2.5">
          <div className="w-[54px] text-center">
            <span className="font-pretendard text-sm font-medium text-gray-4">
              메모ID
            </span>
          </div>
          <div className="w-[116px] text-center">
            <span className="font-pretendard text-sm font-medium text-gray-4">
              작성자
            </span>
          </div>
          <div className="flex w-[316px] justify-center">
            <span className="font-pretendard text-base font-normal text-gray-2">
              내용 (앞 50자)
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
        {memoData.length > 0 ? (
          memoData.map((memo, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-gray-7 px-6 py-2.5"
            >
              <div className="w-[54px] text-center">
                <span className="font-pretendard text-base font-normal text-gray-1">
                  {memo.id.substring(0, 8)}
                </span>
              </div>
              <div className="w-[116px] text-center">
                <span className="font-pretendard text-sm font-medium text-gray-4">
                  {memo.author}
                </span>
              </div>
              <div className="flex w-[316px] justify-center">
                <div className="max-w-[316px] truncate">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {memo.content}
                  </span>
                </div>
              </div>
              <div className="w-[44px] text-center">
                <span className="font-pretendard text-sm font-medium text-gray-4">
                  {memo.like_count}
                </span>
              </div>
              <div className="w-[44px] text-center">
                <span className="font-pretendard text-sm font-medium text-gray-4">
                  {memo.comment_count}
                </span>
              </div>
              <div className="w-[44px] text-center">
                <span className="font-pretendard text-sm font-medium text-gray-4">
                  {memo.report_count}
                </span>
              </div>
              <div className="w-[72px] text-center">
                <Button
                  variant="outline"
                  onClick={() => handleDetailClick(memo.id)}
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
              등록된 메모가 없습니다.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

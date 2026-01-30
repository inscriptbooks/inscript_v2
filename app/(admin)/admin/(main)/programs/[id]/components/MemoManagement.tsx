import { MemoData } from "../types";

interface MemoManagementProps {
  memos: MemoData[];
}

export default function MemoManagement({ memos }: MemoManagementProps) {
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-xl font-bold leading-6 text-gray-1">
          메모 관리
        </h2>
      </div>

      <div className="flex w-full flex-col items-start bg-white">
        {/* 메모 테이블 헤더 */}
        <div className="flex w-full items-center justify-between border-b border-gray-7 bg-gray-7 px-6 py-2.5">
          <div className="w-[54px] text-center text-sm font-medium leading-4 text-[#6A6A6A]">
            메모ID
          </div>
          <div className="w-[116px] text-center text-sm font-medium leading-4 text-[#6A6A6A]">
            작성자
          </div>
          <div className="flex w-[316px] max-w-[316px] items-center justify-center gap-10">
            <div className="flex flex-1 items-center justify-center gap-2.5">
              <span className="max-w-[316px] flex-1 text-center text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                내용 (앞 50자)
              </span>
            </div>
          </div>
          <div className="w-[44px] text-center text-sm font-medium leading-4 text-[#6A6A6A]">
            좋아요
          </div>
          <div className="w-[44px] text-center text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
            댓글
          </div>
          <div className="w-[44px] text-center text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
            신고
          </div>
          <div className="w-[72px] text-center text-base font-normal leading-6 tracking-[-0.32px] text-gray-2 opacity-75">
            상세
          </div>
        </div>

        {/* 메모 리스트 */}
        {memos.map((memo, index) => (
          <div
            key={index}
            className="flex w-full items-center justify-between border-b border-gray-7 px-6 py-2.5"
          >
            <div className="w-[54px] text-center text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              {memo.id}
            </div>
            <div className="w-[116px] text-center text-sm font-medium leading-4 text-[#6A6A6A]">
              {memo.author}
            </div>
            <div className="flex w-[316px] max-w-[520px] items-center justify-center gap-10">
              <div className="flex flex-1 items-center justify-center gap-2.5">
                <span className="max-h-6 max-w-[316px] flex-1 text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                  {memo.content}
                </span>
              </div>
            </div>
            <div className="w-[44px] text-center text-sm font-medium leading-4 text-[#6A6A6A]">
              {memo.likes}
            </div>
            <div className="w-[44px] text-center text-sm font-medium leading-4 text-[#6A6A6A]">
              {memo.comments}
            </div>
            <div className="w-[44px] text-center text-sm font-medium leading-4 text-[#6A6A6A]">
              {memo.reports}
            </div>
            <div className="flex items-center justify-center gap-1.5 rounded border border-primary bg-white px-3 py-2.5">
              <span className="text-sm font-bold leading-4 tracking-[-0.28px] text-primary">
                상세보기
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

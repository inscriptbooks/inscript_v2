interface MemoData {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  reports: number;
}

interface MemoManagementProps {
  memoData: MemoData[];
}

export default function MemoManagement({ memoData }: MemoManagementProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold leading-6 text-gray-1">메모관리</h2>
      </div>

      <div className="flex flex-col bg-white">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-7 bg-gray-7 px-6 py-2.5">
          <div className="w-[54px] text-center text-sm font-medium leading-4 ">
            메모ID
          </div>
          <div className="w-[116px] text-center text-sm font-medium leading-4">
            작성자
          </div>
          <div className="flex max-w-[316px] flex-1 items-center justify-center gap-10">
            <div className="flex items-center justify-center gap-2.5">
              <span className="max-w-[316px] flex-1 text-center text-base font-normal leading-6 text-gray-2">
                내용 (앞 50자)
              </span>
            </div>
          </div>
          <div className="w-11 text-center text-sm font-medium leading-4">
            좋아요
          </div>
          <div className="w-11 text-center text-base font-normal leading-6">
            댓글
          </div>
          <div className="w-11 text-center text-base font-normal leading-6">
            신고
          </div>
          {/* <div className="w-20 text-center text-base font-normal leading-6 opacity-75">
            상세
          </div> */}
        </div>

        {/* 메모 목록 */}
        {memoData.map((memo, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-gray-7 px-6 py-2.5"
          >
            <div className="w-[54px] text-center text-base font-normal leading-6 overflow-hidden text-ellipsis whitespace-nowrap">
              {memo.id}
            </div>
            <div className="w-[116px] text-center text-sm font-medium leading-4">
              {memo.author}
            </div>
            <div className="flex w-[316px] max-w-[520px] items-center justify-center gap-10">
              <div className="flex flex-1 items-center justify-center gap-2.5">
                <span className="max-h-6 max-w-[316px] flex-1 text-base font-normal leading-6 text-gray-1">
                  {memo.content}
                </span>
              </div>
            </div>
            <div className="w-11 text-center text-sm font-medium leading-4">
              {memo.likes}
            </div>
            <div className="w-11 text-center text-sm font-medium leading-4">
              {memo.comments}
            </div>
            <div className="w-11 text-center text-sm font-medium leading-4">
              {memo.reports}
            </div>
            {/* <div className="flex w-20 justify-center">
              <button className="flex items-center justify-center gap-1.5 rounded border border-primary bg-white px-3 py-2.5 text-sm font-semibold leading-4 text-primary">
                상세보기
              </button>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}

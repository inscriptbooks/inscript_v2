import { MemoList } from "@/components/features/memo";
import { EmptyBox, ShowMoreButton } from "@/components/common";
import { Memo } from "@/models/memo";

interface PlayDetailMemoListSectionProps {
  playMemoList: Memo[];
  onMoreClick?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export default function PlayDetailMemoListSection({
  playMemoList,
  onMoreClick,
  hasNextPage,
  isFetchingNextPage,
}: PlayDetailMemoListSectionProps) {
  return (
    <section className="flex w-full flex-col justify-center gap-5 px-[20px] pt-10 lg:px-[120px]">
      <div className="mx-auto flex w-full max-w-[793px] flex-col justify-center gap-7">
        <div className="flex items-center gap-1.5">
          <span className="font-serif text-xl font-bold text-gray-1 lg:text-[28px]">
            메모
          </span>
          <span className="font-serif text-xl font-bold text-orange-3 lg:text-[28px]">
            {playMemoList.length}
          </span>
        </div>

        {playMemoList.length > 0 ? (
          <>
            <MemoList
              memoList={playMemoList}
              className="w-full gap-6 lg:auto-rows-min lg:grid-cols-1"
              hideTitle
            />

            {hasNextPage && (
              <div className="flex justify-center">
                <ShowMoreButton
                  onClick={onMoreClick}
                  disabled={isFetchingNextPage}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyBox text="메모가 없습니다." />
        )}
      </div>
    </section>
  );
}

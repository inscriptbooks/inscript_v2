import { MemoList } from "@/components/features/memo";
import { Memo } from "@/models/memo";

interface AuthorMemoListSectionProps {
  memoList: Memo[];
}

export default function AuthorMemoListSection({
  memoList,
}: AuthorMemoListSectionProps) {
  return (
    <section className="flex w-full flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-serif text-xl font-bold text-primary lg:text-[28px]">
            작가에게 남긴 메모
          </span>
        </div>
      </div>

      <MemoList memoList={memoList} hideCreatedAt />
    </section>
  );
}

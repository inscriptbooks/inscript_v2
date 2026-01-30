import { MemoPreviewCard } from "@/components/features/memo/components";
import { Memo } from "@/models/memo";
import { cn } from "@/lib/utils";

interface MemoListProps {
  memoList: Memo[];
  className?: string;
  hideTitle?: boolean;
  readonly?: boolean;
  hideCreatedAt?: boolean;
}

export default function MemoList({
  memoList,
  className,
  hideTitle = false,
  readonly = false,
  hideCreatedAt = false,
}: MemoListProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 lg:auto-rows-[380px] lg:grid-cols-3",
        className,
      )}
    >
      {memoList.map((memo) => (
        <MemoPreviewCard
          key={memo.id}
          memo={memo}
          hideTitle={hideTitle}
          hideCreatedAt={hideCreatedAt}
          readonly={readonly}
        />
      ))}
    </div>
  );
}

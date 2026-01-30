import { Memo } from "@/models/memo";
import { cn } from "@/lib/utils";
import MemoItem from "./MemoItem";

interface MemoListProps {
  memoList: Memo[];
  className?: string;
}

export default function MemoList({ memoList, className }: MemoListProps) {
  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      {memoList.map((memo) => (
        <MemoItem key={memo.id} memo={memo} />
      ))}
    </div>
  );
}

import { formatRelativeTime, cn } from "@/lib/utils";
import { Program } from "@/models/program";

interface ProgramHistoryCardProps {
  item: Program;
  onClick?: () => void;
}

export default function ProgramHistoryCard({ item, onClick }: ProgramHistoryCardProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-start justify-center gap-1.5 self-stretch rounded bg-white p-6",
        onClick && "cursor-pointer hover:bg-gray-50 transition-colors"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-3 self-stretch lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-col items-start justify-center gap-3">
          <div className="flex items-center justify-between self-stretch">
            <h3 className="line-clamp-1 font-pretendard text-base font-semibold leading-6 text-gray-1">
              {item.title}
            </h3>
            <span className="pl-2 text-sm font-medium leading-4 text-gray-4">
              {formatRelativeTime(item.createdAt)}
            </span>
          </div>
          <p className="font-pretendard text-sm font-medium leading-4 text-gray-3">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

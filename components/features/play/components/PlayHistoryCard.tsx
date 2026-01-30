import { Badge } from "@/components/ui/badge";
import { Play, ApplyStatus, ApplyStatusLabel } from "@/models/play";
import { cn, formatRelativeTime } from "@/lib/utils";

const getStatusConfig = (status: ApplyStatus) => {
  switch (status) {
    case ApplyStatus.APPLIED:
      return {
        label: ApplyStatusLabel[status],
        className: "bg-gray-6 text-[#1F750E]",
      };
    case ApplyStatus.REVIEW:
      return {
        label: ApplyStatusLabel[status],
        className: "bg-gray-6 text-[#D1754A]",
      };
    case ApplyStatus.ACCEPTED:
      return {
        label: ApplyStatusLabel[status],
        className: "bg-gray-6 text-[#0C66BA]",
      };
    case ApplyStatus.REJECTED:
      return {
        label: ApplyStatusLabel[status],
        className: "bg-gray-6 text-[#D02D01]",
      };
  }
};

interface PlayHistoryCardProps {
  item: Play;
  showStatus?: boolean;
  onClick?: () => void;
}

export default function PlayHistoryCard({
  item,
  showStatus = true,
  onClick,
}: PlayHistoryCardProps) {
  const authorName = item.author?.authorName ?? "작가 미지정";
  const statusConfig = getStatusConfig(item.applyStatus);

  // rejectionReason이 있으면 반려 badge를 표시
  const displayConfig = item.rejectionReason
    ? {
        label: "반려",
        className: "bg-gray-6 text-[#D02D01]",
      }
    : statusConfig;

  return (
    <div
      className={cn(
        "flex flex-col items-start justify-center gap-1.5 self-stretch rounded bg-white p-6",
        onClick && "cursor-pointer hover:bg-gray-50 transition-colors"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-3 self-stretch lg:flex-row lg:items-center">
        {showStatus && displayConfig && (
          <Badge
            className={cn(
              "flex w-24 items-center justify-center gap-2.5 rounded-full px-3 py-2 text-sm font-medium",
              displayConfig.className
            )}
          >
            {displayConfig.label}
          </Badge>
        )}

        <div className="flex flex-1 flex-col items-start justify-center gap-3">
          <div className="flex items-center justify-between self-stretch">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <h3 className="line-clamp-1 font-pretendard text-base font-semibold leading-6 text-gray-1">
                  {item.title} - {authorName}
                </h3>
              </div>
              {/* <span className="shrink-0 font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-3">
                ({item.ganre})
              </span> */}
            </div>
            <span className="pl-2 text-sm font-medium leading-4 text-gray-4">
              {formatRelativeTime(item.createdAt)}
            </span>
          </div>
          {item.rejectionReason && (
            <p className="font-pretendard text-sm font-medium leading-4 text-gray-3">
              반려 사유: {item.rejectionReason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

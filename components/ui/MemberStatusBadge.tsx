import { cn } from "@/lib/utils";

interface MemberStatusBadgeProps {
  status: "normal" | "suspended" | "blacklist";
  className?: string;
}

const statusConfig = {
  normal: {
    label: "정상",
    className: "border border-[#B0D5F2] bg-[#F6FBFF] text-[#2581F9]",
  },
  suspended: {
    label: "활동 정지",
    className: "border border-[#EBB9A3] bg-[#FBEEE8] text-[#D44F34]",
  },
  blacklist: {
    label: "블랙리스트",
    className: "border border-[#A0A0A0] bg-[#0E0E0E] text-white",
  },
};

export default function MemberStatusBadge({
  status,
  className,
}: MemberStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.normal;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </div>
  );
}

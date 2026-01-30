import { cn } from "@/lib/utils";

interface MemoStatusBadgeProps {
  status: "visible" | "hidden";
  className?: string;
}

const statusConfig = {
  visible: {
    label: "노출중",
    className: "border border-[#B0D5F2] bg-[#F6FBFF] text-[#2581F9]",
  },
  hidden: {
    label: "비공개",
    className: "bg-[#E0E0E0] text-[#2A2A2A]",
  },
};

export default function MemoStatusBadge({
  status,
  className,
}: MemoStatusBadgeProps) {
  const config = statusConfig[status];

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

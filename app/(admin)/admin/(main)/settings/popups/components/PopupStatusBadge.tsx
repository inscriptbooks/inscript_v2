import { cn } from "@/lib/utils";

interface PopupStatusBadgeProps {
  status: "waiting" | "active" | "ended";
  className?: string;
}

const statusConfig = {
  waiting: {
    label: "대기",
    className: "border border-[#911A00] bg-white text-[#911A00]",
  },
  active: {
    label: "진행",
    className: "border border-[#B0D5F2] bg-[#F6FBFF] text-[#2581F9]",
  },
  ended: {
    label: "종료",
    className: "bg-[#E0E0E0] text-[#2A2A2A]",
  },
};

export default function PopupStatusBadge({
  status,
  className,
}: PopupStatusBadgeProps) {
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

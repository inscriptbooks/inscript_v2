import { cn } from "@/lib/utils";
import { SubscriptionStatus } from "../types";

interface SubscriptionStatusBadgeProps {
  status: SubscriptionStatus;
  className?: string;
}

const statusConfig = {
  active: {
    label: "구독중",
    className: "bg-[#911A00] text-white",
  },
  failed: {
    label: "결제 실패",
    className: "bg-[#D65856] text-white",
  },
  cancelled: {
    label: "해지됨",
    className: "bg-[#E0E0E0] text-[#2A2A2A]",
  },
};

export default function SubscriptionStatusBadge({
  status,
  className,
}: SubscriptionStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 rounded-full px-3 py-1.5 font-pretendard text-sm font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </div>
  );
}

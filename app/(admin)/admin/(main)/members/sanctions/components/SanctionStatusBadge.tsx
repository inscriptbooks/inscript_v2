import { cn } from "@/lib/utils";

interface SanctionStatusBadgeProps {
  status: "active" | "released";
  className?: string;
}

const statusConfig = {
  active: {
    label: "제재중",
    className: "bg-gray-1 text-white",
  },
  released: {
    label: "해제됨",
    className: "border border-primary bg-white text-primary",
  },
};

export default function SanctionStatusBadge({
  status,
  className,
}: SanctionStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2.5 rounded-full px-3 py-1.5 text-sm font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </div>
  );
}

import { cn } from "@/lib/utils";

interface ReportStatusBadgeProps {
  status: "submitted" | "approved" | "rejected";
  className?: string;
}

const statusConfig = {
  submitted: {
    label: "접수",
    className: "bg-[#911A00] text-white",
  },
  approved: {
    label: "조치완료",
    className: "border border-[#078D46] bg-[#D9F8D7] text-[#078D46]",
  },
  rejected: {
    label: "무효",
    className: "bg-[#E0E0E0] text-[#2A2A2A]",
  },
};

export default function ReportStatusBadge({
  status,
  className,
}: ReportStatusBadgeProps) {
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

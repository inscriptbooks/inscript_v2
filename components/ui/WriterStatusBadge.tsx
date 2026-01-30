import { cn } from "@/lib/utils";

interface WriterStatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  노출중: {
    label: "노출중",
    className: "border border-[#B0D5F2] bg-[#F6FBFF] text-[#2581F9]",
  },
  미노출중: {
    label: "미노출중",
    className: "bg-[#E0E0E0] text-[#2A2A2A]",
  },
  비공개: {
    label: "비공개",
    className: "bg-[#E0E0E0] text-[#2A2A2A]",
  },
  승인대기: {
    label: "승인대기",
    className: "border border-[#D7825E] bg-[#FBEEE8] text-[#D44F34]",
  },
  반려: {
    label: "반려",
    className: "bg-[#D65856] text-white",
  },
};

export default function WriterStatusBadge({
  status,
  className,
}: WriterStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig["미노출중"];

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

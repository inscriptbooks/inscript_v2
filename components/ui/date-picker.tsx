"use client";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/icons";

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function DatePicker({
  value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange,
  placeholder = "날짜 입력",
  className,
}: DatePickerProps) {
  return (
    <div
      className={cn(
        "flex h-12 items-center justify-between rounded-md border border-[#EBEBEB] bg-white px-3",
        className
      )}
    >
      <span
        className={cn(
          "font-pretendard text-xs font-normal",
          value ? "font-bold text-primary" : "text-gray-3"
        )}
      >
        {value || placeholder}
      </span>
      <Calendar size={12} color="#727272" className="h-[13.333px] w-3" />
    </div>
  );
}

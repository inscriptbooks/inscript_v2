"use client";

import { cn } from "@/lib/utils";

interface CustomRadioProps {
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

export default function CustomRadio({
  value,
  checked,
  onChange,
  label,
  className,
}: CustomRadioProps) {
  return (
    <div className={cn("flex items-center gap-2 p-2", className)}>
      <button
        type="button"
        onClick={() => onChange(value)}
        className="flex h-[18px] w-[18px] items-center justify-center"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.8"
            y="1.27266"
            width="16.4"
            height="16.4"
            rx="8.2"
            stroke={checked ? "#911A00" : "#6D6D6D"}
            strokeWidth="1.6"
          />
          {checked && <circle cx="9" cy="9" r="4" fill="#911A00" />}
        </svg>
      </button>
      <span
        className={cn(
          "font-pretendard text-sm font-bold",
          checked ? "text-[#911A00]" : "text-[#6D6D6D]",
        )}
      >
        {label}
      </span>
    </div>
  );
}

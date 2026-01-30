"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CalendarViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isCalendarView = searchParams.get("view") === "calendar";

  const handleToggle = () => {
    const params = new URLSearchParams(searchParams);
    if (isCalendarView) {
      params.delete("view");
    } else {
      params.set("view", "calendar");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="inline-flex items-start justify-end gap-3">
      <span
        className={cn(
          "font-pretendard text-base font-semibold leading-6 tracking-[-0.32px] text-gray-3",
          isCalendarView ? "text-primary" : "text-gray-3",
        )}
      >
        달력으로 보기
      </span>
      <button
        onClick={handleToggle}
        className={cn(
          "relative flex h-6 w-[46px] items-center rounded-full px-[3px] py-[3px] transition-colors",
          isCalendarView ? "bg-primary" : "bg-gray-4",
        )}
        aria-label="달력으로 보기 토글"
      >
        <div
          className={cn(
            "h-[18px] w-[18px] rounded-full bg-white transition-transform",
            isCalendarView ? "translate-x-[22px]" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}

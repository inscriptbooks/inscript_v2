"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface CloseMethodSelectorProps {
  value?: "today" | "days" | "never" | null;
  days?: number | null;
  onValueChange?: (method: "today" | "days" | "never", days?: number) => void;
}

export default function CloseMethodSelector({
  value = "today",
  days = 1,
  onValueChange,
}: CloseMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<"today" | "days" | "never">(
    value || "today"
  );
  const [customDays, setCustomDays] = useState<number>(days || 1);

  const handleMethodChange = (method: "today" | "days" | "never") => {
    setSelectedMethod(method);
    if (method === "days") {
      onValueChange?.(method, customDays);
    } else {
      onValueChange?.(method);
    }
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setCustomDays(value);
    if (selectedMethod === "days") {
      onValueChange?.("days", value);
    }
  };

  return (
    <div className="flex items-center gap-12">
      <label className="text-[#6D6D6D] text-[20px] font-bold text-gray-2">
        <span>창닫기 방법</span>
        <span className="text-red-500">*</span>
      </label>
      <div className="flex  gap-3">
        {/* 오늘 하루 열지 않음 */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="closeMethod"
            checked={selectedMethod === "today"}
            onChange={() => handleMethodChange("today")}
            className="h-4 w-4 cursor-pointer accent-primary"
          />
          <span className="font-pretendard text-[16px] font-normal text-gray-2">
            오늘 하루 열지 않음
          </span>
        </label>

        {/* X일간 열지 않음 */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="closeMethod"
            checked={selectedMethod === "days"}
            onChange={() => handleMethodChange("days")}
            className="h-4 w-4 cursor-pointer accent-primary"
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              
              value={customDays}
              onChange={handleDaysChange}
              onClick={() => handleMethodChange("days")}
              className="h-[28px] w-[60px] border-gray-4 text-center text-[16px] px-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
            <span className="font-pretendard text-[16px] font-normal text-gray-2">
              일간 열지 않음
            </span>
          </div>
        </label>

        {/* 다시 열지 않음 */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="closeMethod"
            checked={selectedMethod === "never"}
            onChange={() => handleMethodChange("never")}
            className="h-4 w-4 cursor-pointer accent-primary"
          />
          <span className="font-pretendard text-[16px] font-normal text-gray-2">
            다시 열지 않음
          </span>
        </label>
      </div>
    </div>
  );
}

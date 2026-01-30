"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SelectChevronDown } from "@/components/icons";
import { useClickOutside } from "@/hooks/common";

interface PostFormSelectInputProps {
  value?: string;
  onChange?: (value: string) => void;
  options?: string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function PostFormSelectInput({
  value,
  onChange,
  options,
  placeholder,
  className,
  disabled = false,
}: PostFormSelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  }, isOpen);

  const handleSelect = (option: string) => {
    onChange?.(option);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "relative flex w-full flex-col rounded border px-4 py-3 lg:px-5 lg:py-4",
          disabled ? "border-gray-5 bg-gray-7" : "border-red-3 bg-orange-4",
        )}
      >
        <button
          type="button"
          className={cn(
            "flex items-center justify-between",
            disabled && "cursor-not-allowed opacity-50",
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span
            className={cn(
              "flex-1 text-left text-sm leading-6 tracking-[-0.32px] lg:text-base",
              value ? "text-gray-2" : "text-orange-3",
            )}
          >
            {value || placeholder}
          </span>
          <SelectChevronDown className="size-6 text-primary" />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-red-3 bg-orange-4 shadow-lg">
            {options?.map((option) => (
              <button
                key={option}
                type="button"
                className={cn(
                  "w-full px-4 py-3 text-left hover:text-primary",
                  value === option
                    ? "bg-primary/5 text-primary"
                    : "text-gray-2",
                )}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

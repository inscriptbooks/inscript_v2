"use client";

import { FormLabel, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

interface FormSelectInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  options: string[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  labelClassName?: string;
  className?: string;
}

export default function FormSelectInput({
  label,
  required,
  error,
  options,
  placeholder = "선택해주세요",
  value,
  onChange,
  labelClassName,
  className,
}: FormSelectInputProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center">
        <FormLabel
          className={cn(
            "relative w-[65px] gap-1 leading-6 text-gray-3 lg:w-40 lg:text-xl",
            error && "-top-2.5",
            labelClassName,
          )}
        >
          {label}
          {required && <span className="text-red">*</span>}
        </FormLabel>

        <div className="flex w-full flex-col gap-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "flex h-12 cursor-pointer items-center justify-between rounded border bg-orange-4 px-5 py-4 text-sm placeholder:text-orange-3 lg:h-14 lg:text-base",
                  error ? "border-destructive" : "border-red-3",
                  className,
                )}
              >
                <span
                  className={cn(
                    "flex-1 text-left leading-6 tracking-[-0.32px]",
                    value ? "text-gray-1" : "text-orange-3",
                  )}
                >
                  {value || placeholder}
                </span>
                <Image
                  src="/images/arrow.svg"
                  alt="arrow"
                  width={24}
                  height={24}
                  className={cn(
                    "transition-transform duration-300",
                    open && "rotate-180"
                  )}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="flex flex-col">
                {options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="px-5 py-3 text-left hover:bg-gray-7"
                    onClick={() => {
                      onChange?.(option);
                      setOpen(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          {error && <FormMessage>{error}</FormMessage>}
        </div>
      </div>
    </div>
  );
}

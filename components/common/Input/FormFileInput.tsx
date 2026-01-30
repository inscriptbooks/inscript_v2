"use client";

import { useState, useRef } from "react";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface FormFileInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string;
  required?: boolean;
  error?: string;
  labelClassName?: string;
  placeholder?: string;
  buttonText?: string;
  value?: never;
}

export default function FormFileInput({
  label,
  required,
  error,
  className,
  labelClassName,
  placeholder = "파일을 업로드 해주세요",
  buttonText = "파일 선택",
  onChange,
  value: _value,
  ...props
}: FormFileInputProps) {
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file?.name || "");
    onChange?.(e);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center">
        <FormLabel
          className={cn(
            "relative w-[65px] shrink-0 gap-1 font-semibold leading-6 text-gray-3 lg:w-40 lg:text-xl",
            error && "-top-2.5",
            labelClassName,
          )}
        >
          {label}
          {required && <span className="text-red">*</span>}
        </FormLabel>

        <div className="flex w-full flex-col gap-1">
          <label
            className={cn(
              "flex h-12 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-orange-4 px-3 text-sm lg:h-14 lg:text-base",
              error && "border-destructive",
              className,
            )}
          >
            {/* 숨겨진 input */}
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              {...props}
            />

            {/* 파일명 또는 placeholder */}
            <span
              className={cn(
                "truncate",
                fileName ? "text-gray-1" : "text-orange-3",
              )}
            >
              {fileName || placeholder}
            </span>

            {/* 파일 선택 버튼 */}
            <span className="ml-2 shrink-0 rounded bg-gray-3 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-2 lg:px-4 lg:py-2">
              {buttonText}
            </span>
          </label>
          {error && <FormMessage>{error}</FormMessage>}
        </div>
      </div>
    </div>
  );
}

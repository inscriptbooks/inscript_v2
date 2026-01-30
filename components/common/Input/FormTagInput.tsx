"use client";

import { useState, KeyboardEvent, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Close } from "@/components/icons";
import { cn } from "@/lib/utils";

interface FormTagInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
  value?: string[];
  maxTags?: number;
  maxLength?: number;
  labelClassName?: string;
  onChange?: (tags: string[]) => void;
  onLengthExceed?: () => void;
}

export default function FormTagInput({
  label,
  required,
  error,
  placeholder,
  className,
  value = [],
  maxTags = 5,
  maxLength = 10,
  labelClassName,
  onChange,
  onLengthExceed,
}: FormTagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleLengthExceed = () => {
    onLengthExceed?.();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (maxLength && value.length > maxLength) {
      handleLengthExceed();
      return;
    }
    setInputValue(value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // 한글 입력 중(IME 조합 중)일 때는 태그 추가를 하지 않음
      if (e.nativeEvent.isComposing) {
        return;
      }

      addTag();
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) return;

    if (maxLength && trimmedValue.length > maxLength) {
      handleLengthExceed();
      setInputValue("");
      return;
    }

    if (value.includes(trimmedValue)) {
      setInputValue("");
      return;
    }

    if (maxTags && value.length >= maxTags) {
      setInputValue("");
      return;
    }

    const newTags = [...value, trimmedValue];
    onChange?.(newTags);
    setInputValue("");
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = value.filter((_, index) => index !== indexToRemove);
    onChange?.(newTags);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <FormLabel
          className={cn(
            "relative w-[65px] shrink-0 gap-1 leading-6 text-gray-3 lg:w-40 lg:text-xl",
            error && "-top-2.5",
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-red">*</span>}
        </FormLabel>

        <div className="flex w-full flex-col gap-1">
          <Input
            className={cn(
              "h-12 bg-orange-4 text-sm placeholder:text-orange-3 lg:h-14 lg:text-base",
              error && "border-destructive",
              className
            )}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={addTag}
          />

          {error && <FormMessage>{error}</FormMessage>}
        </div>
      </div>

      {value.length > 0 && (
        <div className="mt-3 flex w-full justify-end">
          <div className="flex max-w-[250px] flex-wrap justify-end gap-2 lg:max-w-[430px]">
            {value.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                size="md"
                className="flex cursor-pointer items-center gap-1.5 rounded-full"
                onClick={() => removeTag(index)}
              >
                <span className="text-sm font-medium">{tag}</span>
                <Close className="text-primary" />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

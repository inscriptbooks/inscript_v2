"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type SearchFilterType = "title" | "author" | "titleContent";

interface SearchFilterDropdownProps {
  value: SearchFilterType;
  onChange: (value: SearchFilterType) => void;
  className?: string;
}

const filterOptions: Record<SearchFilterType, string> = {
  title: "제목",
  author: "글 작성자",
  titleContent: "제목 + 내용",
};

export default function SearchFilterDropdown({
  value,
  onChange,
  className,
}: SearchFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (filterValue: SearchFilterType) => {
    onChange(filterValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm font-normal leading-5 tracking-[-0.28px] text-primary"
      >
        {filterOptions[value]}
        <Image
          src="/images/arrow.svg"
          alt="arrow"
          width={12}
          height={12}
          className={cn(
            "transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute -left-[24px] lg:-left-6 top-full z-10 mt-[26px] flex w-[120px] flex-col gap-2.5 rounded border border-red-3 bg-orange-4 px-3 py-2">
          {(Object.keys(filterOptions) as SearchFilterType[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key)}
              className={cn(
                "text-left text-sm font-normal leading-5 tracking-[-0.28px]",
                value === key ? "text-primary" : "text-orange-2"
              )}
            >
              {filterOptions[key]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

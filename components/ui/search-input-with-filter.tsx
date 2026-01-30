"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import UpArrow from "@/components/icons/ArrowUp";

interface SearchInputWithFilterProps {
  filterValue: string;
  filterOptions: string[];
  onFilterChange: (value: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInputWithFilter({
  filterValue,
  filterOptions,
  onFilterChange,
  searchValue,
  onSearchChange,
  placeholder = "검색조건을 입력해주세요",
}: SearchInputWithFilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex h-[43px] flex-1 items-center gap-2 rounded-md border border-[#EBEBEB] bg-white px-3">
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="flex shrink-0 items-center gap-1 transition-colors hover:bg-transparent focus:outline-none">
            <span className="whitespace-nowrap font-pretendard text-xs font-bold text-[#911A00]">
              {filterValue}
            </span>
            <UpArrow
              size={8}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          alignOffset={-12}
          sideOffset={16}
          className="w-[120px] rounded-md border border-[#EBEBEB] bg-white shadow-lg"
        >
          {filterOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => onFilterChange(option)}
              className={`cursor-pointer px-4 py-2 hover:bg-[#FFF5F2] focus:bg-[#FFF5F2] ${
                filterValue === option
                  ? "bg-[#FFF5F2] font-bold text-[#911A00]"
                  : "text-[#686868]"
              }`}
            >
              <span className="font-pretendard text-xs">{option}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Input
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-0 bg-transparent p-0 font-pretendard text-xs font-medium text-[#2A2A2A] placeholder:text-[#727272] focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}

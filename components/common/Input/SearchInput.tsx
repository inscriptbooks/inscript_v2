"use client";

import { useEffect, useState } from "react";
import { Search } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SearchFilterDropdown, { SearchFilterType } from "./SearchFilterDropdown";

interface SearchInput extends React.ComponentProps<"input"> {
  value?: string;
  searchPath?: string;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  wrapperClassName?: string;
  onClick?: () => void;
  showFilter?: boolean;
}

export default function SearchInput({
  value = "",
  placeholder = "SEARCH",
  ariaLabel = "전체 검색",
  searchPath,
  className,
  wrapperClassName,
  showFilter = false,
  ...props
}: SearchInput) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(value);
  const [filterType, setFilterType] = useState<SearchFilterType>(
    (searchParams.get("filterType") as SearchFilterType) || "title"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const trimmed = searchValue.replaceAll(" ", "");
    const params = new URLSearchParams(searchParams.toString());

    // 입력값이 비어있으면 placeholder 값을 사용
    const searchKeyword =
      trimmed === "" ? placeholder.replaceAll(" ", "") : trimmed;

    if (searchKeyword === "" || searchKeyword === "SEARCH") {
      params.delete("keyword");
      params.delete("filterType");
    } else {
      params.set("keyword", searchKeyword);
      if (showFilter) {
        params.set("filterType", filterType);
      }
    }

    router.push(
      searchPath
        ? `${searchPath}?${params.toString()}`
        : `${pathname}?${params.toString()}`
    );

    // NOTE: 검색 후 입력값 초기화 기획 보류
    // setSearchValue('');
  };

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  return (
    <div
      className={cn(
        "flex h-12 w-full items-center justify-between gap-2.5 border-b-[1.4px] border-red bg-orange-4 px-4 lg:h-14 lg:px-6",
        wrapperClassName
      )}
    >
      {showFilter && (
        <SearchFilterDropdown
          value={filterType}
          onChange={setFilterType}
          className="shrink-0"
        />
      )}

      <Input
        type="text"
        name="search"
        value={searchValue}
        placeholder={placeholder}
        className={cn(
          "h-5 w-full rounded-none border-none bg-transparent p-0 text-base lg:text-lg text-primary ring-0 placeholder:text-orange-2 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 lg:h-6",
          className
        )}
        aria-label={ariaLabel}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />

      <button
        type="button"
        onClick={handleSearch}
        className="flex-shrink-0"
        aria-label="검색"
      >
        <Search size={24} className="text-primary" />
      </button>
    </div>
  );
}

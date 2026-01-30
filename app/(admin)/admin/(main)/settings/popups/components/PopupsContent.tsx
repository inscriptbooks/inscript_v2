"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, Search, Refresh } from "@/components/icons";
import FilterDropdown from "@/components/ui/filter-dropdown";
import SearchInputWithFilter from "@/components/ui/search-input-with-filter";
import { Pagination } from "@/components/common";
import DateEdit from "@/components/ui/date-edit";
import PopupStatusBadge from "./PopupStatusBadge";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useLoader } from "@/hooks/common";
import { formatKoreanDate } from "@/lib/utils/date";
import type { Popup, PopupsResponse } from "../types";

type SortColumn = "status" | "created_at" | null;
type SortOrder = "asc" | "desc";

function PopupsContentComponent({
  initialData,
}: {
  initialData: PopupsResponse;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showLoader, hideLoader } = useLoader();

  const [startDate, setStartDate] = useState<Date | null>(
    searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : null
  );
  const [status, setStatus] = useState(searchParams.get("status") || "전체");
  const [searchType, setSearchType] = useState(
    searchParams.get("searchCategory") || "전체"
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("searchQuery") || ""
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    searchParams.get("limit") || "10"
  );
  const [sortBy, setSortBy] = useState<SortColumn>(
    (searchParams.get("sortBy") as SortColumn) || null
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (searchParams.get("sortOrder") as SortOrder) || "desc"
  );
  const [popups, setPopups] = useState<Popup[]>(initialData.popups);
  const [pagination, setPagination] = useState(initialData.pagination);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const startDateRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (startDate) params.set("startDate", formatDate(startDate));
    else params.delete("startDate");
    if (endDate) params.set("endDate", formatDate(endDate));
    else params.delete("endDate");
    if (status !== "전체") params.set("status", status);
    else params.delete("status");
    params.set("searchCategory", searchType);
    if (searchQuery) params.set("searchQuery", searchQuery);
    else params.delete("searchQuery");
    params.set("limit", itemsPerPage);
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setStatus("전체");
    setSearchType("전체");
    setSearchQuery("");
    setItemsPerPage("10");
    setSortBy(null);
    setSortOrder("desc");
    router.push("/admin/settings/popups");
  };

  const handleSort = (column: SortColumn) => {
    let newSortOrder: SortOrder = "asc";
    if (sortBy === column) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortBy(column);
    setSortOrder(newSortOrder);

    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", itemsPerPage);
    if (startDate) params.set("startDate", formatDate(startDate));
    if (endDate) params.set("endDate", formatDate(endDate));
    if (status !== "전체") params.set("status", status);
    params.set("searchCategory", searchType);
    if (searchQuery) params.set("searchQuery", searchQuery);
    if (column) {
      params.set("sortBy", column);
      params.set("sortOrder", newSortOrder);
    }

    const url = `/api/admin/popups?${params.toString()}`;
    showLoader();
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPopups(data.popups);
        setPagination(data.pagination);
        router.push(`/admin/settings/popups?${params.toString()}`);
        hideLoader();
      });
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3 text-[#911A00]" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-[#911A00]" />
    );
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", value);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleRegisterPopup = () => {
    router.push("/admin/settings/popups/edit");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startDateRef.current &&
        !startDateRef.current.contains(event.target as Node)
      ) {
        setShowStartDatePicker(false);
      }
      if (
        endDateRef.current &&
        !endDateRef.current.contains(event.target as Node)
      ) {
        setShowEndDatePicker(false);
      }
    };
    if (showStartDatePicker || showEndDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStartDatePicker, showEndDatePicker]);

  return (
    <div className="flex w-full flex-col items-start gap-8 p-11">
      {/* 제목 */}
      <h1 className="font-pretendard text-2xl font-bold leading-8 text-gray-1">
        팝업관리
      </h1>

      {/* 필터 영역 */}
      <div className="flex w-full flex-col items-start gap-5 rounded-lg bg-background p-8">
        {/* 첫 번째 행 - 등록일과 상태 */}
        <div className="flex w-full items-start gap-6">
          {/* 등록일 */}
          <div className="flex items-center gap-2">
            <span className="font-pretendard text-base font-bold text-gray-2">
              등록일
            </span>
            <div className="flex w-[306px] items-center gap-2">
              {/* 시작일 */}
              <div className="relative" ref={startDateRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowStartDatePicker(!showStartDatePicker);
                    setShowEndDatePicker(false);
                  }}
                  className="flex w-[140px] items-center justify-between rounded-md border border-[#EBEBEB] bg-white p-3 transition-colors hover:border-primary"
                >
                  <span
                    className={`font-pretendard text-xs ${
                      startDate
                        ? "font-bold text-primary"
                        : "font-medium text-[#727272]"
                    }`}
                  >
                    {formatDate(startDate) || "날짜 입력"}
                  </span>
                  <Calendar size={12} color="#727272" />
                </button>
                {showStartDatePicker && (
                  <div className="absolute left-0 top-full z-50 mt-2">
                    <DateEdit
                      value={startDate || new Date()}
                      onChange={setStartDate}
                      onConfirm={(date) => {
                        setStartDate(date);
                        setShowStartDatePicker(false);
                      }}
                      onCancel={() => setShowStartDatePicker(false)}
                    />
                  </div>
                )}
              </div>

              <span className="font-pretendard text-xs font-bold text-[#727272]">
                -
              </span>

              {/* 종료일 */}
              <div className="relative" ref={endDateRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEndDatePicker(!showEndDatePicker);
                    setShowStartDatePicker(false);
                  }}
                  className="flex w-[140px] items-center justify-between rounded-md border border-[#EBEBEB] bg-white p-3 transition-colors hover:border-primary"
                >
                  <span
                    className={`font-pretendard text-xs ${
                      endDate
                        ? "font-bold text-primary"
                        : "font-medium text-[#727272]"
                    }`}
                  >
                    {formatDate(endDate) || "날짜 입력"}
                  </span>
                  <Calendar size={12} color="#727272" />
                </button>
                {showEndDatePicker && (
                  <div className="absolute left-0 top-full z-50 mt-2">
                    <DateEdit
                      value={endDate || new Date()}
                      onChange={setEndDate}
                      onConfirm={(date) => {
                        setEndDate(date);
                        setShowEndDatePicker(false);
                      }}
                      onCancel={() => setShowEndDatePicker(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 상태 */}
          <div className="flex flex-1 items-center gap-2">
            <span className="font-pretendard text-base font-bold text-gray-2">
              상태
            </span>
            <FilterDropdown
              value={status}
              options={["전체", "대기", "진행중", "종료"]}
              onChange={setStatus}
            />
          </div>
        </div>

        {/* 두 번째 행 - 검색 */}
        <div className="flex w-full items-center gap-6">
          {/* 검색 영역 */}
          <SearchInputWithFilter
            filterValue={searchType}
            filterOptions={["전체", "팝업ID", "제목"]}
            onFilterChange={setSearchType}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="검색조건을 입력해주세요"
          />

          {/* 버튼들 */}
          <div className="flex items-center gap-2">
            <Button
              className="flex h-[43px] w-[120px] items-center justify-center gap-2 rounded bg-primary px-0 py-3"
              onClick={handleSearch}
            >
              <Search size={16} color="white" />
              <span className="font-pretendard text-base font-bold text-white">
                검색
              </span>
            </Button>
            <Button
              variant="outline"
              className="flex h-[43px] w-[120px] items-center justify-center gap-2 rounded border-[1.3px] border-primary bg-white px-0 py-3 hover:bg-gray-50"
              onClick={handleReset}
            >
              <Refresh size={16} color="#911A00" />
              <span className="font-pretendard text-base font-bold text-primary">
                초기화
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* 결과 영역 */}
      <div className="flex w-full flex-1 flex-col items-end gap-4">
        {/* 상단 정보 */}
        <div className="flex w-full items-center justify-between">
          <div className="font-pretendard text-xl font-medium leading-6 tracking-[-0.4px] text-[#6D6D6D]">
            총{" "}
            <span className="font-pretendard text-xl font-medium text-primary">
              {pagination.totalCount.toLocaleString()}
            </span>
            건
          </div>
          <Button
            className="flex h-10 w-[120px] items-center justify-center rounded bg-primary px-0 py-2.5"
            onClick={handleRegisterPopup}
          >
            <span className="font-pretendard text-sm font-bold leading-4 tracking-[-0.28px] text-white">
              팝업 관리
            </span>
          </Button>
        </div>

        {/* 테이블 */}
        <div className="flex w-full flex-1 flex-col items-start gap-6">
          <div className="flex w-full flex-1 flex-col">
            {/* 테이블 헤더 */}
            <div className="flex h-[50px] w-full items-center justify-between rounded-sm bg-[#EEE] px-4">
              <div className="flex w-10 items-center justify-center p-2">
                <span className="font-pretendard text-xs font-bold text-[#515151]">
                  NO
                </span>
              </div>
              <div className="flex w-[100px] items-center justify-center p-2">
                <span className="font-pretendard text-xs font-bold text-[#515151]">
                  팝업ID
                </span>
              </div>
              <div className="flex w-[318px] max-w-[318px] items-center justify-center p-2">
                <span className="font-pretendard text-xs font-bold text-[#515151]">
                  제목
                </span>
              </div>
              <div className="flex w-[180px] max-w-[180px] items-center justify-center p-2">
                <span className="font-pretendard text-xs font-bold text-[#515151]">
                  기간
                </span>
              </div>
              <div
                className="flex w-[100px] cursor-pointer items-center justify-center p-2 transition-colors hover:bg-[#E0E0E0]"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  <span className="font-pretendard text-xs font-bold text-[#515151]">
                    상태
                  </span>
                  {getSortIcon("status")}
                </div>
              </div>
              <div
                className="flex w-[124px] cursor-pointer items-center justify-center p-2 transition-colors hover:bg-[#E0E0E0]"
                onClick={() => handleSort("created_at")}
              >
                <div className="flex items-center">
                  <span className="font-pretendard text-xs font-bold text-[#515151]">
                    등록일
                  </span>
                  {getSortIcon("created_at")}
                </div>
              </div>
            </div>

            {/* 테이블 본문 */}
            {popups.map((popup, index) => (
              <div
                key={popup.id}
                className="group flex h-[50px] w-full cursor-pointer items-center justify-between bg-white px-4 transition-colors hover:rounded-sm hover:bg-[#EBE1DF]"
              >
                <div className="flex w-10 items-center justify-center p-2">
                  <span className="font-pretendard text-xs font-medium text-[#686868] transition-colors group-hover:text-[#911A00]">
                    {pagination.totalCount -
                      (pagination.currentPage - 1) * pagination.limit -
                      index}
                  </span>
                </div>
                <div className="flex w-[100px] items-center justify-center p-2">
                  <span className="font-pretendard text-xs font-medium text-[#686868] transition-colors group-hover:text-[#911A00]">
                    {popup.id}
                  </span>
                </div>
                <div className="flex w-[318px] max-w-[318px] items-center justify-center p-2">
                  <span className="max-h-4 text-center font-pretendard text-xs font-medium text-[#686868] transition-colors group-hover:text-[#911A00]">
                    팝업 {index + 1}
                  </span>
                </div>
                <div className="flex w-[180px] max-w-[180px] items-center justify-center p-2">
                  <span className="font-pretendard text-xs font-medium text-[#686868] transition-colors group-hover:text-[#911A00]">
                    {popup.start_date
                      ? formatKoreanDate(popup.start_date)
                      : "-"}{" "}
                    ~ {popup.end_date ? formatKoreanDate(popup.end_date) : "-"}
                  </span>
                </div>
                <div className="flex w-[100px] items-center justify-center px-2 py-0">
                  <PopupStatusBadge status={popup.status} />
                </div>
                <div className="flex w-[124px] items-center justify-center p-2">
                  <span className="font-pretendard text-xs font-medium text-[#686868] transition-colors group-hover:text-[#911A00]">
                    {formatKoreanDate(popup.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="flex w-full items-center justify-between">
            {/* 항목 수 선택 */}
            <FilterDropdown
              value={`${itemsPerPage}개씩 보기`}
              options={[
                "10개씩 보기",
                "20개씩 보기",
                "30개씩 보기",
                "50개씩 보기",
              ]}
              onChange={(val) =>
                handleItemsPerPageChange(val.replace("개씩 보기", ""))
              }
              width="w-[104px]"
            />

            {/* 페이지 번호 */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PopupsContent({
  initialData,
}: {
  initialData: PopupsResponse;
}) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PopupsContentComponent initialData={initialData} />
    </Suspense>
  );
}

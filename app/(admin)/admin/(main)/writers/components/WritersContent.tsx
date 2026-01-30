"use client";

import { useState, useRef, useEffect, Suspense, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DateEdit from "@/components/ui/date-edit";
import FilterDropdown from "@/components/ui/filter-dropdown";
import SearchInputWithFilter from "@/components/ui/search-input-with-filter";
import { Pagination } from "@/components/common";
import { Button } from "@/components/ui/button";
import Calendar from "@/components/icons/Calendar";
import Search from "@/components/icons/Search";
import Refresh from "@/components/icons/Refresh";
import Excel from "@/components/icons/Excel";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import WriterStatusBadge from "@/components/ui/WriterStatusBadge";
import { WritersResponse } from "../types";
import { showErrorToast } from "@/components/ui/toast";
import { useLoader } from "@/hooks/common";

type SortColumn =
  | "authorName"
  | "createdAt"
  | "worksCount"
  | "memosCount"
  | "scrapsCount"
  | null;
type SortOrder = "asc" | "desc";

function WritersContentComponent({
  initialData,
}: {
  initialData: WritersResponse;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
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
    searchParams.get("searchCategory") || "작가명"
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

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const startDateRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLDivElement>(null);

  const { writers, pagination, stats } = initialData;

  // isPending 상태에 따라 Loader 제어
  useEffect(() => {
    if (isPending) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isPending, showLoader, hideLoader]);

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
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      router.push("/admin/writers");
    });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", value);
    params.set("page", "1");
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleSort = (column: SortColumn) => {
    let newSortOrder: SortOrder = "asc";
    if (sortBy === column) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortBy(column);
    setSortOrder(newSortOrder);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (column) {
      params.set("sortBy", column);
      params.set("sortOrder", newSortOrder);
    } else {
      params.delete("sortBy");
      params.delete("sortOrder");
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
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

  const handleRowClick = (writerId: string) => {
    router.push(`/admin/writers/${writerId}`);
  };

  const handleExcelDownload = async () => {
    try {
      const response = await fetch("/api/admin/writers/export");
      if (!response.ok) {
        showErrorToast("엑셀 다운로드에 실패했습니다.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `writers_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showErrorToast("엑셀 다운로드 중 오류가 발생했습니다.");
    }
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
    <div className="flex w-full flex-col items-center gap-8 p-11">
      <h1 className="self-stretch text-2xl font-semibold leading-8 text-gray-1">
        작가 관리
      </h1>

      {/* 필터 영역 */}
      <div className="flex flex-col gap-4 self-stretch rounded-lg bg-background p-8">
        <div className="flex items-start gap-6 self-stretch">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-2">가입일</span>
            <div className="flex items-center gap-2.5">
              <div className="relative" ref={startDateRef}>
                <button
                  onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                  className="flex w-[140px] items-center justify-between rounded-md border border-[#EBEBEB] bg-white px-3 py-3 hover:bg-[#FFF5F2]"
                >
                  <span className="text-xs font-semibold text-primary">
                    {formatDate(startDate) || "날짜 입력"}
                  </span>
                  <Calendar size={12} />
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
              <span className="text-xs font-semibold text-gray-4">-</span>
              <div className="relative" ref={endDateRef}>
                <button
                  onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                  className="flex w-[140px] items-center justify-between rounded-md border border-[#EBEBEB] bg-white px-3 py-3 hover:bg-[#FFF5F2]"
                >
                  <span
                    className={
                      endDate
                        ? "text-xs font-semibold text-primary"
                        : "text-xs font-medium text-gray-4"
                    }
                  >
                    {formatDate(endDate) || "날짜 입력"}
                  </span>
                  <Calendar size={12} />
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
          <div className="flex flex-1 items-center gap-2">
            <span className="text-base font-semibold text-gray-2">상태</span>
            <FilterDropdown
              value={status}
              options={["전체", "노출중", "미노출중"]}
              onChange={setStatus}
            />
          </div>
        </div>
        <div className="flex items-center gap-6 self-stretch">
          <SearchInputWithFilter
            filterValue={searchType}
            filterOptions={["작가명", "대표작"]}
            onFilterChange={setSearchType}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="검색조건을 입력해주세요"
          />
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSearch}
              className="flex h-[43px] w-[120px] items-center justify-center gap-2.5 rounded bg-primary px-0 py-3"
            >
              <Search size={16} color="white" />
              <span className="text-base font-semibold text-white">검색</span>
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex h-[43px] w-[120px] items-center justify-center gap-2.5 rounded border-[1.3px] border-primary bg-white px-0 py-3"
            >
              <Refresh size={16} />
              <span className="text-base font-semibold text-primary">
                초기화
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* 통계 및 테이블 영역 */}
      <div className="flex flex-col items-center gap-6 self-stretch">
        {/* 통계 카드들 */}
        <div className="flex items-start gap-8">
          {/* 노출작가 */}
          <div className="flex flex-col items-center justify-center gap-0 rounded border border-[#CCBCAB] bg-[#FAF8F6] px-10 py-5">
            <div className="flex w-[120px] items-center justify-center gap-2 px-4 py-2">
              <div className="text-lg font-semibold leading-6 text-primary">
                노출작가
              </div>
            </div>
            <div className="w-[180px] truncate text-center text-2xl font-semibold leading-8 text-black">
              {stats.visibleCount.toLocaleString()}명
            </div>
          </div>

          {/* 미노출 작가 */}
          <div className="flex flex-col items-center justify-center gap-0 rounded border border-[#CCBCAB] bg-[#FAF8F6] px-10 py-5">
            <div className="flex w-[120px] items-center justify-center gap-2 px-4 py-2">
              <div className="text-lg font-semibold leading-6 text-primary">
                미노출 작가
              </div>
            </div>
            <div className="w-[180px] truncate text-center text-2xl font-semibold leading-8 text-black">
              {stats.hiddenCount.toLocaleString()}명
            </div>
          </div>
        </div>

        {/* 총 수와 액션 버튼들 */}
        <div className="flex items-end justify-between self-stretch">
          <div className="text-xl font-medium leading-6 tracking-[-0.4px]">
            <span className="text-gray-3">총 </span>
            <span className="text-primary">{pagination.totalCount}</span>
            <span className="text-gray-3">명</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleExcelDownload}
              className="flex h-auto items-center gap-3 rounded border-[1.6px] border-[#4CA452] bg-white px-3 py-2.5 hover:bg-white/90"
            >
              <Excel size={16} />
              <span className="text-sm font-semibold leading-4 tracking-[-0.28px] text-[#4CA452]">
                엑셀 다운로드
              </span>
            </Button>
            <Button
              onClick={() => router.push("/admin/writers/edit")}
              className="h-auto w-[120px] rounded bg-primary px-0 py-2.5"
            >
              <span className="text-sm font-semibold leading-4 tracking-[-0.28px] text-white">
                작가 등록
              </span>
            </Button>
          </div>
        </div>

        {/* 테이블 */}
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="h-[50px] bg-[#EEE]">
                <th className="px-2.5 text-xs font-bold text-[#515151]">NO</th>
                <th
                  className="px-2.5 text-xs font-bold text-[#515151] cursor-pointer hover:bg-[#E0E0E0] transition-colors"
                  onClick={() => handleSort("authorName")}
                >
                  <div className="flex items-center justify-center">
                    작가명
                    {getSortIcon("authorName")}
                  </div>
                </th>
                <th className="px-2.5 text-xs font-bold text-[#515151]">
                  대표작
                </th>
                <th className="px-2.5 text-xs font-bold text-[#515151]">
                  키워드
                </th>
                <th className="px-2.5 text-xs font-bold text-[#515151]">
                  상태
                </th>
                <th
                  className="px-2.5 text-xs font-bold text-[#515151] cursor-pointer hover:bg-[#E0E0E0] transition-colors"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center justify-center">
                    등록/신청일
                    {getSortIcon("createdAt")}
                  </div>
                </th>
                <th
                  className="px-2.5 text-xs font-bold text-[#515151] cursor-pointer hover:bg-[#E0E0E0] transition-colors"
                  onClick={() => handleSort("worksCount")}
                >
                  <div className="flex items-center justify-center">
                    작품수
                    {getSortIcon("worksCount")}
                  </div>
                </th>
                <th
                  className="px-2.5 text-xs font-bold text-[#515151] cursor-pointer hover:bg-[#E0E0E0] transition-colors"
                  onClick={() => handleSort("memosCount")}
                >
                  <div className="flex items-center justify-center">
                    메모수
                    {getSortIcon("memosCount")}
                  </div>
                </th>
                <th
                  className="px-2.5 text-xs font-bold text-[#515151] cursor-pointer hover:bg-[#E0E0E0] transition-colors"
                  onClick={() => handleSort("scrapsCount")}
                >
                  <div className="flex items-center justify-center">
                    스크랩수
                    {getSortIcon("scrapsCount")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {writers.map((writer, index) => (
                <tr
                  key={writer.id}
                  onClick={() => handleRowClick(writer.id)}
                  className="group h-[50px] cursor-pointer bg-white transition-colors hover:bg-[#EBE1DF]"
                >
                  <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {pagination.totalCount -
                      (pagination.currentPage - 1) * pagination.limit -
                      index}
                  </td>
                  <td className="max-w-[100px] truncate px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {writer.name}
                  </td>
                  <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {writer.representative}
                  </td>
                  <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {writer.keywords?.join(", ") || "-"}
                  </td>
                  <td className="px-2.5 text-center">
                    <div className="flex justify-center">
                      <WriterStatusBadge status={writer.status} />
                    </div>
                  </td>
                  <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {writer.registeredAt}
                  </td>
                  <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {writer.worksCount || "-"}
                  </td>
                  <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {writer.memosCount || "-"}
                  </td>
                  <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {writer.scrapsCount || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between self-stretch">
          <FilterDropdown
            value={`${itemsPerPage}개씩 보기`}
            options={["10개씩 보기", "20개씩 보기", "50개씩 보기"]}
            onChange={(val) =>
              handleItemsPerPageChange(val.replace("개씩 보기", ""))
            }
            width="w-[140px]"
          />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default function WritersContent({
  initialData,
}: {
  initialData: WritersResponse;
}) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <WritersContentComponent initialData={initialData} />
    </Suspense>
  );
}

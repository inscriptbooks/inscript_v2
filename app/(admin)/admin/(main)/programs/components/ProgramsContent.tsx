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
import { ProgramData, ProgramsResponse } from "../types";
import { showErrorToast } from "@/components/ui/toast";
import { useLoader } from "@/hooks/common";
import { formatKoreanDate, formatKoreanDateTime } from "@/lib/utils/date";

type SortColumn =
  | "eventDateTime"
  | "createdAt"
  | "memosCount"
  | "bookmarksCount"
  | null;
type SortOrder = "asc" | "desc";

// 상태 뱃지 컴포넌트
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    진행중: {
      className: "border border-[#B0D5F2] bg-[#F6FBFF] text-[#2581F9]",
    },
    종료: { className: "bg-gray-5" },
  };
  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.진행중;
  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${config.className}`}
    >
      {status}
    </div>
  );
}

// 통계 카드 컴포넌트
function StatisticCard({ title, count }: { title: string; count: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded border border-orange-3 bg-background px-10 py-6">
      <div className="flex items-center justify-center px-4 py-2">
        <span className="text-lg font-semibold leading-6 text-primary">
          {title}
        </span>
      </div>
      <div className="w-[180px] overflow-hidden text-center text-2xl font-semibold leading-8 text-black">
        {count}
      </div>
    </div>
  );
}

function ProgramsContentComponent({
  initialData,
}: {
  initialData: ProgramsResponse;
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
  const [visibility, setVisibility] = useState(
    searchParams.get("visibility") || "전체"
  );
  const [status, setStatus] = useState(searchParams.get("status") || "전체");
  const [searchType, setSearchType] = useState(
    searchParams.get("searchCategory") || "프로그램명"
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

  const { programs, pagination, statistics } = initialData;

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
    if (visibility !== "전체") params.set("visibility", visibility);
    else params.delete("visibility");
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
      router.push("/admin/programs");
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

  const handleRowClick = (programId: string) => {
    router.push(`/admin/programs/${programId}`);
  };

  const handleExcelDownload = async () => {
    try {
      const response = await fetch("/api/admin/programs/export");
      if (!response.ok) {
        showErrorToast("엑셀 다운로드에 실패했습니다.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `programs_${new Date().toISOString().split("T")[0]}.xlsx`;
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
        프로그램 관리
      </h1>
      <div className="flex flex-col gap-4 self-stretch rounded-lg bg-background p-8">
        <div className="flex items-start gap-6 self-stretch">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-2">
              등록일자
            </span>
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
          {/* <div className="flex flex-1 items-center gap-2">
            <span className="text-base font-semibold text-gray-2">노출 여부</span>
            <FilterDropdown value={visibility} options={["전체", "노출", "비노출"]} onChange={setVisibility} />
          </div> */}
          <div className="flex flex-1 items-center gap-2">
            <span className="text-base font-semibold text-gray-2">상태</span>
            <FilterDropdown
              value={status}
              options={["전체", "진행중", "종료"]}
              onChange={setStatus}
            />
          </div>
        </div>
        <div className="flex items-center gap-6 self-stretch">
          <SearchInputWithFilter
            filterValue={searchType}
            filterOptions={["프로그램명", "행사장소"]}
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
      <div className="flex flex-col items-center gap-6 self-stretch">
        <div className="flex items-start gap-[34px]">
          <StatisticCard
            title="진행중"
            count={`${statistics.progressCount}건`}
          />
          <StatisticCard title="종료" count={`${statistics.endedCount}건`} />
        </div>
        <div className="flex flex-col items-end gap-4 self-stretch">
          <div className="flex items-end justify-between self-stretch">
            <div className="text-xl font-medium leading-6 tracking-[-0.4px]">
              <span className="text-gray-3">총 </span>
              <span className="text-primary">{pagination.totalCount}</span>
              <span className="text-gray-3">건</span>
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
                onClick={() => router.push("/admin/programs/edit")}
                className="h-auto w-[120px] rounded bg-primary px-0 py-2.5"
              >
                <span className="text-sm font-semibold leading-4 tracking-[-0.28px] text-white">
                  프로그램 등록
                </span>
              </Button>
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="h-[50px] bg-[#EEE]">
                  <th className="px-2.5 text-xs font-bold text-[#515151]">
                    NO
                  </th>
                  <th className="px-2.5 text-xs font-bold text-[#515151]">
                    프로그램명
                  </th>
                  <th
                    className="px-2.5 text-xs font-bold text-[#515151] cursor-pointer hover:bg-[#E0E0E0] transition-colors"
                    onClick={() => handleSort("eventDateTime")}
                  >
                    <div className="flex items-center justify-center">
                      행사일시
                      {getSortIcon("eventDateTime")}
                    </div>
                  </th>
                  <th className="px-2.5 text-xs font-bold text-[#515151]">
                    행사장소
                  </th>
                  <th className="px-2.5 text-xs font-bold text-[#515151]">
                    신청기간
                  </th>
                  <th className="px-2.5 text-xs font-bold text-[#515151]">
                    상태
                  </th>
                  <th
                    className="px-2.5 text-xs font-bold text-[#515151] cursor-pointer hover:bg-[#E0E0E0] transition-colors"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center justify-center">
                      등록일자
                      {getSortIcon("createdAt")}
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
                    onClick={() => handleSort("bookmarksCount")}
                  >
                    <div className="flex items-center justify-center">
                      스크랩수
                      {getSortIcon("bookmarksCount")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {programs.map((row, index) => (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row.id)}
                    className="group h-[50px] cursor-pointer bg-white transition-colors hover:bg-[#EBE1DF]"
                  >
                    <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {pagination.totalCount -
                        (pagination.currentPage - 1) * pagination.limit -
                        index}
                    </td>
                    <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {row.title}
                    </td>
                    <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {formatKoreanDateTime(row.event_date)}
                    </td>
                    <td className="max-w-[88px] truncate px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {row.event_location}
                    </td>
                    <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">{`${formatKoreanDate(row.application_start_date)}~${formatKoreanDate(row.application_end_date)}`}</td>
                    <td className="px-2.5 text-center">
                      <div className="flex justify-center">
                        <StatusBadge status={row.status} />
                      </div>
                    </td>
                    <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {formatKoreanDate(row.created_at)}
                    </td>
                    <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {row.memos_count || "-"}
                    </td>
                    <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {row.bookmarks_count || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    </div>
  );
}

export default function ProgramsContent({
  initialData,
}: {
  initialData: ProgramsResponse;
}) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ProgramsContentComponent initialData={initialData} />
    </Suspense>
  );
}

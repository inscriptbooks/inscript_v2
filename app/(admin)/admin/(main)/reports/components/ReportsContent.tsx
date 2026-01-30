"use client";

import { useState, useRef, useEffect, Suspense } from "react";
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
import ReportStatusBadge from "@/components/ui/ReportStatusBadge";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Report, ReportsResponse } from "../types";
import { useLoader } from "@/hooks/common";

type SortColumn = "created_at" | "is_complete" | "reporter_name" | null;
type SortOrder = "asc" | "desc";

function ReportsContentComponent({
  initialData,
}: {
  initialData: ReportsResponse;
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
  const [category, setCategory] = useState(
    searchParams.get("category") || "전체"
  );
  const [status, setStatus] = useState(searchParams.get("status") || "전체");
  const [searchType, setSearchType] = useState(
    searchParams.get("searchCategory") || "신고자"
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
  const [reports, setReports] = useState<Report[]>(initialData.reports);
  const [pagination, setPagination] = useState(initialData.pagination);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const startDateRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLDivElement>(null);

  const { statistics } = initialData;

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
    if (category !== "전체") params.set("category", category);
    else params.delete("category");
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
    setCategory("전체");
    setStatus("전체");
    setSearchType("신고자");
    setSearchQuery("");
    setItemsPerPage("10");
    setSortBy(null);
    setSortOrder("desc");
    router.push("/admin/reports");
  };

  const buildQueryString = (page: number = 1) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", itemsPerPage);
    if (startDate) params.set("startDate", formatDate(startDate));
    if (endDate) params.set("endDate", formatDate(endDate));
    if (category !== "전체") params.set("category", category);
    if (status !== "전체") params.set("status", status);
    params.set("searchCategory", searchType);
    if (searchQuery) params.set("searchQuery", searchQuery);
    if (sortBy) {
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
    }
    return params.toString();
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
    if (category !== "전체") params.set("category", category);
    if (status !== "전체") params.set("status", status);
    params.set("searchCategory", searchType);
    if (searchQuery) params.set("searchQuery", searchQuery);
    if (column) {
      params.set("sortBy", column);
      params.set("sortOrder", newSortOrder);
    }

    const url = `/api/admin/reports?${params.toString()}`;
    showLoader();
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setReports(data.reports);
        setPagination(data.pagination);
        router.push(`/admin/reports?${params.toString()}`);
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

  const handleRowClick = (report: Report) => {
    router.push(`/admin/reports/${report.id}`);
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
    <div className="flex w-full flex-col gap-8 p-11">
      {/* 제목 */}
      <h1 className="text-2xl font-bold text-gray-1">신고 관리</h1>

      {/* 필터 섹션 */}
      <div className="flex flex-col gap-4 rounded-lg bg-[#FAF8F6] p-8">
        {/* 첫 번째 행: 신고일시, 구분, 상태 */}
        <div className="flex items-start gap-6">
          {/* 신고일시 */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-2">신고일시</span>
            <div className="flex items-center gap-2.5">
              {/* 시작일 */}
              <div className="relative" ref={startDateRef}>
                <button
                  onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                  className="flex w-[140px] items-center justify-between rounded-md border border-[#EBEBEB] bg-white px-3 py-3 hover:bg-[#FFF5F2]"
                >
                  <span className="text-xs font-bold text-primary">
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
              <span className="text-xs font-bold text-[#727272]">-</span>
              {/* 종료일 */}
              <div className="relative" ref={endDateRef}>
                <button
                  onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                  className="flex w-[140px] items-center justify-between rounded-md border border-[#EBEBEB] bg-white px-3 py-3 hover:bg-[#FFF5F2]"
                >
                  <span
                    className={
                      endDate
                        ? "text-xs font-bold text-primary"
                        : "text-xs font-medium text-[#727272]"
                    }
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

          {/* 구분 */}
          <div className="flex flex-1 items-center gap-2">
            <span className="text-base font-bold text-gray-2">구분</span>
            <FilterDropdown
              value={category}
              options={["전체", "댓글", "게시물", "메모"]}
              onChange={setCategory}
            />
          </div>

          {/* 상태 */}
          <div className="flex flex-1 items-center gap-2">
            <span className="text-base font-bold text-gray-2">상태</span>
            <FilterDropdown
              value={status}
              options={["전체", "처리완료", "대기중", "무효"]}
              onChange={setStatus}
            />
          </div>
        </div>

        {/* 두 번째 행: 검색 */}
        <div className="flex items-center gap-6">
          {/* 검색 입력 */}
          <SearchInputWithFilter
            filterValue={searchType}
            filterOptions={["신고자", "내용"]}
            onFilterChange={setSearchType}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="검색조건을 입력해주세요"
          />

          {/* 검색/초기화 버튼 */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSearch}
              className="flex h-[43px] w-[120px] items-center justify-center gap-2.5 rounded bg-primary px-0 py-3"
            >
              <Search size={16} color="white" />
              <span className="text-base font-bold">검색</span>
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex h-[43px] w-[120px] items-center justify-center gap-2.5 rounded border-[1.3px] border-primary bg-white px-0 py-3 text-primary hover:bg-[#FFF5F2]"
            >
              <Refresh size={16} color="#911A00" />
              <span className="text-base font-bold text-primary">초기화</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 결과 정보 및 액션 버튼 */}
      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-4">
            <p className="text-xl text-gray-3">
              총{" "}
              <span className="text-primary">
                {pagination.totalCount.toLocaleString()}
              </span>
              건
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="flex h-9 w-[127px] items-center justify-center gap-3 rounded border-[1.6px] border-[#4CA452] bg-white"
            >
              <Excel size={16} color="#4CA452" />
              <span className="text-sm font-bold text-[#4CA452]">
                엑셀 다운로드
              </span>
            </Button>
          </div>
        </div>

        {/* 테이블 */}
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            {/* 테이블 헤더 */}
            <thead>
              <tr className="h-[50px] bg-[#EEE]">
                <th className="px-2.5 text-xs font-bold text-[#515151]">NO</th>
                <th className="px-2.5 text-xs font-bold text-[#515151]">
                  신고ID
                </th>
                <th className="px-2.5 text-xs font-bold text-[#515151]">
                  구분
                </th>
                <th className="px-2.5 text-xs font-bold text-[#515151]">
                  작성자
                </th>
                <th className="px-2.5 text-xs font-bold text-[#515151]">
                  내용
                </th>
                <th
                  className="cursor-pointer px-2.5 text-xs font-bold text-[#515151] transition-colors hover:bg-[#E0E0E0]"
                  onClick={() => handleSort("reporter_name")}
                >
                  <div className="flex items-center justify-center">
                    신고자
                    {getSortIcon("reporter_name")}
                  </div>
                </th>
                <th className="px-2.5 text-xs font-bold text-[#515151]">
                  신고유형
                </th>
                <th
                  className="cursor-pointer px-2.5 text-xs font-bold text-[#515151] transition-colors hover:bg-[#E0E0E0]"
                  onClick={() => handleSort("is_complete")}
                >
                  <div className="flex items-center justify-center">
                    상태
                    {getSortIcon("is_complete")}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-2.5 text-xs font-bold text-[#515151] transition-colors hover:bg-[#E0E0E0]"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center justify-center">
                    신고일시
                    {getSortIcon("created_at")}
                  </div>
                </th>
              </tr>
            </thead>

            {/* 테이블 바디 */}
            <tbody>
              {reports.map((report, index) => (
                <tr
                  key={report.id}
                  onClick={() => handleRowClick(report)}
                  className="group h-[50px] cursor-pointer bg-white transition-colors hover:bg-[#EBE1DF]"
                >
                  <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {pagination.totalCount -
                      (pagination.currentPage - 1) * pagination.limit -
                      index}
                  </td>
                  <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {report.id.slice(0, 8)}
                  </td>
                  <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {report.category}
                  </td>
                  <td className="max-w-[88px] truncate px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {report.author_name && report.author_email
                      ? `${report.author_name}(${report.author_email})`
                      : "-"}
                  </td>
                  <td className="max-w-[260px] truncate px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {report.content_preview}
                  </td>
                  <td className="max-w-[88px] truncate px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {report.reporter_name}({report.reporter_email})
                  </td>
                  <td className="max-w-[88px] truncate px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {report.reason}
                  </td>
                  <td className="px-2.5 text-center">
                    <div className="flex justify-center">
                      <ReportStatusBadge status={report.status} />
                    </div>
                  </td>
                  <td className="px-2.5 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                    {new Date(report.created_at).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between">
          {/* 페이지당 항목 수 */}
          <FilterDropdown
            value={`${itemsPerPage}개씩 보기`}
            options={["10개씩 보기", "20개씩 보기", "50개씩 보기"]}
            onChange={(val) =>
              handleItemsPerPageChange(val.replace("개씩 보기", ""))
            }
            width="w-[140px]"
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
  );
}

export default function ReportsContent({
  initialData,
}: {
  initialData: ReportsResponse;
}) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ReportsContentComponent initialData={initialData} />
    </Suspense>
  );
}

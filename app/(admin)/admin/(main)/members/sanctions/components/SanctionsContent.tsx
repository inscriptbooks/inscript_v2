"use client";

import { useState, useRef, useEffect } from "react";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
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
import SanctionStatusBadge from "./SanctionStatusBadge";

type SortColumn = "userName" | "created_at" | "end_date" | null;
type SortOrder = "asc" | "desc";
import SanctionDetailModal from "./SanctionDetailModalNew";
import { SanctionRecord, SanctionsResponse } from "../types";
import { useLoader } from "@/hooks/common";

interface SanctionsContentProps {
  initialData: SanctionsResponse;
}

export default function SanctionsContent({
  initialData,
}: SanctionsContentProps) {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  const defaultPagination = {
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    limit: 10,
  };

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sanctionType, setSanctionType] = useState("전체");
  const [status, setStatus] = useState("전체");
  const [searchType, setSearchType] = useState("이름");
  const [searchValue, setSearchValue] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("10개씩 보기");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSanction, setSelectedSanction] =
    useState<SanctionRecord | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [sanctions, setSanctions] = useState<SanctionRecord[]>(
    initialData?.sanctions || []
  );
  const [pagination, setPagination] = useState(
    initialData?.pagination || defaultPagination
  );
  const [sortBy, setSortBy] = useState<SortColumn>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const startDateRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getLimitNumber = (itemsPerPage: string): number => {
    if (itemsPerPage === "20개씩 보기") return 20;
    if (itemsPerPage === "50개씩 보기") return 50;
    return 10;
  };

  const buildQueryString = (page: number = 1) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", getLimitNumber(itemsPerPage).toString());

    if (startDate) {
      params.set("startDate", formatDate(startDate));
    }
    if (endDate) {
      params.set("endDate", formatDate(endDate));
    }
    if (sanctionType && sanctionType !== "전체") {
      params.set("sanctionType", sanctionType);
    }
    if (status && status !== "전체") {
      params.set("status", status);
    }
    if (searchType) {
      params.set("searchCategory", searchType);
    }
    if (searchValue) {
      params.set("searchQuery", searchValue);
    }
    if (sortBy) {
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
    }

    return params.toString();
  };

  const fetchSanctions = async (page: number = 1) => {
    showLoader();
    const queryString = buildQueryString(page);
    const url = `/api/admin/sanctions?${queryString}`;

    const response = await fetch(url);
    const data: SanctionsResponse = await response.json();

    setSanctions(data.sanctions);
    setPagination(data.pagination);
    setCurrentPage(page);

    // URL 업데이트
    const newUrl = `/admin/members/sanctions?${queryString}`;
    router.push(newUrl);

    hideLoader();
  };

  const handleSearch = () => {
    fetchSanctions(1);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSanctionType("전체");
    setStatus("전체");
    setSearchType("회원 ID");
    setSearchValue("");
    setItemsPerPage("10개씩 보기");
    setCurrentPage(1);
    setSortBy(null);
    setSortOrder("desc");

    // URL 리셋
    router.push("/admin/members/sanctions");
    fetchSanctions(1);
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
    params.set("limit", getLimitNumber(itemsPerPage).toString());
    if (startDate) params.set("startDate", formatDate(startDate));
    if (endDate) params.set("endDate", formatDate(endDate));
    if (sanctionType !== "전체") params.set("sanctionType", sanctionType);
    if (status !== "전체") params.set("status", status);
    if (searchType) params.set("searchCategory", searchType);
    if (searchValue) params.set("searchQuery", searchValue);
    if (column) {
      params.set("sortBy", column);
      params.set("sortOrder", newSortOrder);
    }

    showLoader();
    fetch(`/api/admin/sanctions?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setSanctions(data.sanctions);
        setPagination(data.pagination);
        setCurrentPage(1);
        router.push(`/admin/members/sanctions?${params.toString()}`);
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
    fetchSanctions(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value);
    setCurrentPage(1);

    const params = new URLSearchParams();
    params.set("page", "1");
    params.set(
      "limit",
      value === "20개씩 보기" ? "20" : value === "50개씩 보기" ? "50" : "10"
    );

    if (startDate) {
      params.set("startDate", formatDate(startDate));
    }
    if (endDate) {
      params.set("endDate", formatDate(endDate));
    }
    if (sanctionType && sanctionType !== "전체") {
      params.set("sanctionType", sanctionType);
    }
    if (status && status !== "전체") {
      params.set("status", status);
    }
    if (searchType) {
      params.set("searchCategory", searchType);
    }
    if (searchValue) {
      params.set("searchQuery", searchValue);
    }
    if (sortBy) {
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
    }

    const url = `/api/admin/sanctions?${params.toString()}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSanctions(data.sanctions);
        setPagination(data.pagination);
      });
  };

  const handleRowClick = (record: SanctionRecord) => {
    setSelectedSanction(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSanction(null);
  };

  const handleReleaseSanction = async (sanctionId: number) => {
    if (!selectedSanction) return;

    showLoader();
    try {
      const response = await fetch("/api/admin/sanctions/release", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sanctionId,
          sanctionType: selectedSanction.sanctionType,
          userId: selectedSanction.userId,
        }),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || "API error";
        } catch (e) {
          // 응답이 JSON이 아닐 경우, 텍스트로 읽어 에러 메시지에 포함
          const errorText = await response.text();
          errorMessage = `${errorMessage}\n${errorText.substring(0, 200)}...`;
        }
        throw new Error(errorMessage);
      }

      await fetchSanctions(currentPage);
      handleCloseModal();
      showSuccessToast("제재가 성공적으로 해제되었습니다.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      showErrorToast(errorMessage);
    } finally {
      hideLoader();
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
    <div className="flex w-full flex-col items-start gap-[34px] p-11">
      {/* 제목 */}
      <h1 className="text-2xl font-bold leading-8 text-gray-1">
        회원 제재 이력
      </h1>

      {/* 검색 필터 섹션 */}
      <div className="flex w-full flex-col gap-4 rounded-lg bg-[#FAF8F6] p-8">
        {/* 첫 번째 행: 제재일자, 제재유형, 상태 */}
        <div className="flex w-full items-start gap-6">
          {/* 제재일자 */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-2">제재일자</span>
            <div className="flex items-center gap-2.5">
              {/* 시작일 */}
              <div className="relative" ref={startDateRef}>
                <button
                  onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                  className="flex w-[140px] items-center justify-between rounded-md border border-[#EBEBEB] bg-white px-3 py-3 hover:bg-[#FFF5F2]"
                >
                  <span
                    className={
                      startDate
                        ? "text-xs font-bold text-primary"
                        : "text-xs font-medium text-[#727272]"
                    }
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

          {/* 제재유형 */}
          <div className="flex flex-1 items-center gap-2">
            <span className="text-base font-bold text-gray-2">제재유형</span>
            <FilterDropdown
              value={sanctionType}
              options={["전체", "활동정지", "블랙리스트"]}
              onChange={setSanctionType}
            />
          </div>

          {/* 상태 */}
          <div className="flex flex-1 items-center gap-2">
            <span className="text-base font-bold text-gray-2">상태</span>
            <FilterDropdown
              value={status}
              options={["전체", "제재중", "해제됨"]}
              onChange={setStatus}
            />
          </div>
        </div>

        {/* 두 번째 행: 검색 */}
        <div className="flex w-full items-center gap-6">
          <SearchInputWithFilter
            filterValue={searchType}
            filterOptions={["이름", "이메일"]}
            onFilterChange={setSearchType}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            placeholder="검색조건을 입력해주세요"
          />
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSearch}
              className="flex h-12 w-[120px] items-center justify-center gap-2.5 rounded bg-primary px-0 py-3 hover:bg-primary/90"
            >
              <Search size={16} color="white" />
              <span className="text-base font-bold text-white">검색</span>
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex h-12 w-[120px] items-center justify-center gap-2.5 rounded border-[1.3px] border-primary bg-white px-0 py-3 hover:bg-[#FFF5F2]"
            >
              <Refresh size={16} />
              <span className="text-base font-bold text-primary">초기화</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 결과 및 엑셀 다운로드 */}
      <div className="flex w-full flex-col items-end gap-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-xl font-medium leading-6 tracking-[-0.4px]">
            <span className="text-[#6D6D6D]">총 </span>
            <span className="text-primary">
              {(pagination?.totalCount || 0).toLocaleString()}
            </span>
            <span className="text-[#6D6D6D]">건</span>
          </div>
          <Button
            variant="outline"
            className="flex h-[36px] w-[128px] items-center gap-3 rounded border-[1.6px] border-[#4CA452] bg-white px-3 py-2.5 hover:bg-white/90"
          >
            <Excel size={16} color="#4CA452" />
            <span className="text-sm font-bold leading-4 tracking-[-0.28px] text-[#4CA452]">
              엑셀 다운로드
            </span>
          </Button>
        </div>

        {/* 테이블 */}
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            {/* 테이블 헤더 */}
            <thead>
              <tr className="h-[50px] bg-[#EEE]">
                <th className="px-2.5 text-xs font-bold text-[#515151]">NO</th>
                <th className="px-2.5 text-xs font-bold text-[#515151]">
                  이메일
                </th>
                <th
                  className="px-2.5 text-xs font-bold text-[#515151] cursor-pointer hover:bg-[#E0E0E0] transition-colors"
                  onClick={() => handleSort("userName")}
                >
                  <div className="flex items-center justify-center">
                    이름
                    {getSortIcon("userName")}
                  </div>
                </th>
                <th className="px-2.5 text-xs font-bold text-[#515151]">
                  제재유형
                </th>
                <th className="px-2.5 text-xs font-bold text-[#515151]">
                  제재 사유
                </th>
                <th className="px-2.5 text-xs font-bold text-[#515151]">
                  제재기간
                </th>
                <th className="px-2.5 text-xs font-bold text-[#515151]">
                  상태
                </th>
                <th
                  className="px-2.5 text-xs font-bold text-[#515151] cursor-pointer hover:bg-[#E0E0E0] transition-colors"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center justify-center">
                    제재일자
                    {getSortIcon("created_at")}
                  </div>
                </th>
                <th
                  className="px-2.5 text-xs font-bold text-[#515151] cursor-pointer hover:bg-[#E0E0E0] transition-colors"
                  onClick={() => handleSort("end_date")}
                >
                  <div className="flex items-center justify-center">
                    해제일자
                    {getSortIcon("end_date")}
                  </div>
                </th>
              </tr>
            </thead>

            {/* 테이블 바디 */}
            <tbody>
              {sanctions.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-2.5 py-10 text-center text-sm text-[#686868]"
                  >
                    조회된 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                sanctions.map((record, index) => {
                  const period =
                    record.endDate && record.startDate
                      ? `${Math.ceil(
                          (new Date(record.endDate).getTime() -
                            new Date(record.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}일`
                      : "영구";

                  return (
                    <tr
                      key={`${record.sanctionType}-${record.id}-${index}`}
                      onClick={() => handleRowClick(record)}
                      className="h-[50px] cursor-pointer bg-white transition-colors hover:bg-[#FFF5F2]"
                    >
                      <td className="px-2.5 text-center text-xs font-medium text-[#686868]">
                        {record.no}
                      </td>
                      <td className="px-2.5 text-center text-xs font-medium text-[#686868]">
                        {record.userEmail}
                      </td>
                      <td className="px-2.5 text-center text-xs font-medium text-[#686868]">
                        {record.userName}
                      </td>
                      <td className="px-2.5 text-center text-xs font-medium text-[#686868]">
                        {record.sanctionType}
                      </td>
                      <td className="px-2.5 text-center text-xs font-medium text-[#686868]">
                        {record.category}
                      </td>
                      <td className="px-2.5 text-center text-xs font-medium text-[#686868]">
                        {period}
                      </td>
                      <td className="px-2.5 text-center">
                        <div className="flex justify-center">
                          <SanctionStatusBadge status={record.status} />
                        </div>
                      </td>
                      <td className="px-2.5 text-center text-xs font-medium text-[#686868]">
                        {record.startDate}
                      </td>
                      <td className="px-2.5 text-center text-xs font-medium text-[#686868]">
                        {record.endDate || "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex w-full items-center justify-between">
          <FilterDropdown
            value={itemsPerPage}
            options={["10개씩 보기", "20개씩 보기", "50개씩 보기"]}
            onChange={handleItemsPerPageChange}
            width="w-[140px]"
          />

          <Pagination
            currentPage={pagination?.currentPage || 1}
            totalPages={pagination?.totalPages || 0}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* 제재 상세 보기 모달 */}
      {selectedSanction && (
        <SanctionDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          sanctionData={selectedSanction}
          onRelease={handleReleaseSanction}
        />
      )}
    </div>
  );
}

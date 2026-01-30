"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DateEdit from "@/components/ui/date-edit";
import FilterDropdown from "@/components/ui/filter-dropdown";
import SearchInputWithFilter from "@/components/ui/search-input-with-filter";
import { Pagination } from "@/components/common";
import { Button } from "@/components/ui/button";
import MemberStatusBadge from "@/components/ui/MemberStatusBadge";
import CustomRadio from "@/components/ui/CustomRadio";
import Calendar from "@/components/icons/Calendar";
import Search from "@/components/icons/Search";
import Refresh from "@/components/icons/Refresh";
import Excel from "@/components/icons/Excel";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Member, MembersResponse } from "../types";
import { useLoader } from "@/hooks/common";
import AdminMemoModal from "./AdminMemoModal";

type SortColumn = "name" | "last_login" | "created_at" | null;
type SortOrder = "asc" | "desc";

interface MembersContentProps {
  initialData: MembersResponse;
}

export default function MembersContent({ initialData }: MembersContentProps) {
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
  const [writerFilter, setWriterFilter] = useState("normal");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [searchCategory, setSearchCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10개씩 보기");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [members, setMembers] = useState<Member[]>(initialData?.members || []);
  const [pagination, setPagination] = useState(
    initialData?.pagination || defaultPagination
  );
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortColumn>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [memoModalOpen, setMemoModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

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
    if (itemsPerPage === "50개씩 보기") return 50;
    if (itemsPerPage === "100개씩 보기") return 100;
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
    if (writerFilter && writerFilter === "writer") {
      params.set("isWriter", writerFilter);
    }
    if (statusFilter && statusFilter !== "전체") {
      params.set("status", statusFilter);
    }
    if (searchQuery) {
      params.set("searchQuery", searchQuery);
      if (searchCategory) {
        params.set("searchCategory", searchCategory);
      }
    }
    if (sortBy) {
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
    }

    return params.toString();
  };

  const fetchMembers = async (page: number = 1) => {
    setLoading(true);
    const queryString = buildQueryString(page);
    const url = `/api/admin/members?${queryString}`;

    const response = await fetch(url);
    const data: MembersResponse = await response.json();

    setMembers(data.members);
    setPagination(data.pagination);
    setCurrentPage(page);

    // URL 업데이트
    const newUrl = `/admin/members?${queryString}`;
    router.push(newUrl);

    setLoading(false);
  };

  const handleSearch = () => {
    fetchMembers(1);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setWriterFilter("normal");
    setStatusFilter("전체");
    setSearchCategory("전체");
    setSearchQuery("");
    setItemsPerPage("10개씩 보기");
    setCurrentPage(1);
    setSortBy(null);
    setSortOrder("desc");

    // URL 리셋
    router.push("/admin/members");
    fetchMembers(1);
  };

  const handleSort = (column: SortColumn) => {
    let newSortOrder: SortOrder = "asc";

    if (sortBy === column) {
      // 같은 컬럼 클릭 시 정렬 순서 토글
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    setSortBy(column);
    setSortOrder(newSortOrder);

    // 정렬 변경 후 데이터 다시 조회
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", getLimitNumber(itemsPerPage).toString());
    if (startDate) params.set("startDate", formatDate(startDate));
    if (endDate) params.set("endDate", formatDate(endDate));
    if (writerFilter === "writer") params.set("isWriter", writerFilter);
    if (statusFilter !== "전체") params.set("status", statusFilter);
    if (searchQuery) {
      params.set("searchQuery", searchQuery);
      if (searchCategory) params.set("searchCategory", searchCategory);
    }
    if (column) {
      params.set("sortBy", column);
      params.set("sortOrder", newSortOrder);
    }

    const url = `/api/admin/members?${params.toString()}`;
    showLoader();
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.members);
        setPagination(data.pagination);
        setCurrentPage(1);
        router.push(`/admin/members?${params.toString()}`);
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
    fetchMembers(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value);
    setCurrentPage(1);

    // 새 limit으로 데이터 조회
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set(
      "limit",
      value === "50개씩 보기" ? "50" : value === "100개씩 보기" ? "100" : "10"
    );

    if (startDate) {
      params.set("startDate", formatDate(startDate));
    }
    if (endDate) {
      params.set("endDate", formatDate(endDate));
    }
    if (writerFilter && writerFilter === "writer") {
      params.set("isWriter", writerFilter);
    }
    if (statusFilter && statusFilter !== "전체") {
      params.set("status", statusFilter);
    }
    if (searchQuery) {
      params.set("searchQuery", searchQuery);
      if (searchCategory) {
        params.set("searchCategory", searchCategory);
      }
    }
    if (sortBy) {
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
    }

    const url = `/api/admin/members?${params.toString()}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.members);
        setPagination(data.pagination);
      });
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
      <h1 className="font-pretendard text-2xl font-bold leading-8 text-[#2A2A2A]">
        회원 관리
      </h1>

      {/* 필터 영역 */}
      <div className="flex w-full flex-col gap-4 rounded-lg bg-[#FAF8F6] p-8">
        {/* 첫 번째 행 */}
        <div className="flex w-full items-center gap-6">
          {/* 가입일 */}
          <div className="flex items-center gap-2">
            <span className="font-pretendard text-base font-bold text-[#555]">
              가입일
            </span>
            <div className="flex items-center gap-2">
              {/* 시작일 */}
              <div className="relative" ref={startDateRef}>
                <button
                  onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                  className="flex w-[140px] items-center justify-between rounded-md border border-[#EBEBEB] bg-white p-3 hover:bg-[#FFF5F2]"
                >
                  <span
                    className={
                      startDate
                        ? "font-pretendard text-xs font-bold text-[#911A00]"
                        : "font-pretendard text-xs font-medium text-[#727272]"
                    }
                  >
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
              <span className="font-pretendard text-xs font-bold text-[#727272]">
                -
              </span>
              {/* 종료일 */}
              <div className="relative" ref={endDateRef}>
                <button
                  onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                  className="flex w-[140px] items-center justify-between rounded-md border border-[#EBEBEB] bg-white p-3 hover:bg-[#FFF5F2]"
                >
                  <span
                    className={
                      endDate
                        ? "font-pretendard text-xs font-bold text-[#911A00]"
                        : "font-pretendard text-xs font-medium text-[#727272]"
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

          {/* 작가 여부 */}
          <div className="flex flex-1 items-center gap-2">
            <span className="font-pretendard text-base font-bold text-[#555]">
              작가 여부
            </span>
            <div className="flex items-center gap-0">
              <CustomRadio
                value="writer"
                checked={writerFilter === "writer"}
                onChange={setWriterFilter}
                label="작가"
              />
              <CustomRadio
                value="normal"
                checked={writerFilter === "normal"}
                onChange={setWriterFilter}
                label="일반"
              />
            </div>
          </div>

          {/* 상태 */}
          <div className="flex flex-1 items-center gap-2">
            <span className="font-pretendard text-base font-bold text-[#555]">
              상태
            </span>
            <FilterDropdown
              value={statusFilter}
              options={["전체", "정상", "활동정지", "블랙리스트"]}
              onChange={setStatusFilter}
            />
          </div>
        </div>

        {/* 두 번째 행 */}
        <div className="flex w-full items-center gap-6">
          {/* 검색 영역 */}
          <SearchInputWithFilter
            filterValue={searchCategory}
            filterOptions={["전체", "이름", "이메일"]}
            onFilterChange={setSearchCategory}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="검색조건을 입력해주세요"
          />

          {/* 버튼들 */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="flex h-[43px] w-[120px] items-center justify-center gap-2 rounded bg-[#911A00] px-0 py-3 hover:bg-[#911A00]/90 disabled:opacity-50"
            >
              <Search size={16} color="white" />
              <span className="font-pretendard text-base font-bold text-white">
                검색
              </span>
            </Button>
            <Button
              onClick={handleReset}
              disabled={loading}
              variant="outline"
              className="flex h-[43px] w-[120px] items-center justify-center gap-2 rounded border-[1.3px] border-[#911A00] bg-white px-0 py-3 hover:bg-[#FFF5F2] disabled:opacity-50"
            >
              <Refresh size={16} />
              <span className="font-pretendard text-base font-bold text-[#911A00]">
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
          <div className="font-pretendard text-xl font-medium leading-6 text-[#6D6D6D]">
            총{" "}
            <span className="font-pretendard text-xl font-medium text-[#911A00]">
              {(pagination?.totalCount || 0).toLocaleString()}
            </span>
            명
          </div>
          <Button
            variant="outline"
            className="flex h-[36px] w-[128px] items-center gap-3 rounded border-[1.6px] border-[#4CA452] bg-white px-3 hover:bg-white/90"
          >
            <Excel size={16} />
            <span className="font-pretendard text-sm font-bold text-[#4CA452]">
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
                <th className="px-2 text-xs font-bold text-[#515151]">NO</th>
                <th
                  className="px-2 text-xs font-bold text-[#515151] cursor-pointer hover:bg-[#E0E0E0] transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center justify-center">
                    이름
                    {getSortIcon("name")}
                  </div>
                </th>
                <th className="px-2 text-xs font-bold text-[#515151]">
                  이메일
                </th>
                <th className="px-2 text-xs font-bold text-[#515151]">
                  가입방식
                </th>
                <th className="px-2 text-xs font-bold text-[#515151]">
                  작가 여부
                </th>
                <th className="px-2 text-xs font-bold text-[#515151]">상태</th>
                <th
                  className="px-2 text-xs font-bold text-[#515151] cursor-pointer hover:bg-[#E0E0E0] transition-colors"
                  onClick={() => handleSort("last_login")}
                >
                  <div className="flex items-center justify-center">
                    최근 로그인
                    {getSortIcon("last_login")}
                  </div>
                </th>
                <th
                  className="px-2 text-xs font-bold text-[#515151] cursor-pointer hover:bg-[#E0E0E0] transition-colors"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center justify-center">
                    가입일시
                    {getSortIcon("created_at")}
                  </div>
                </th>
                <th className="px-2 text-xs font-bold text-[#515151]">
                  운영자 메모
                </th>
              </tr>
            </thead>

            {/* 테이블 본문 */}
            <tbody>
              {members.map((member) => {
                return (
                  <tr
                    key={member.id}
                    onClick={() => router.push(`/admin/members/${member.id}`)}
                    className="group h-[50px] cursor-pointer bg-white transition-colors hover:bg-[#EBE1DF]"
                  >
                    <td className="px-2 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {member.no}
                    </td>
                    <td className="px-2 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {member.name}
                    </td>
                    <td className="px-2 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {member.email}
                    </td>
                    <td className="px-2 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {member.signupMethod}
                    </td>
                    <td className="px-2 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {member.isWriter ? "Y" : "N"}
                    </td>
                    <td className="px-2 text-center">
                      <div className="flex justify-center">
                        <MemberStatusBadge status={member.status} />
                      </div>
                    </td>
                    <td className="px-2 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {member.lastLogin}
                    </td>
                    <td className="px-2 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {member.joinDate}
                    </td>
                    <td className="px-2 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (member.adminMemo) {
                            setSelectedMember(member);
                            setMemoModalOpen(true);
                          }
                        }}
                        disabled={!member.adminMemo}
                        className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                          member.adminMemo
                            ? "border border-[#B0D5F2] bg-[#F6FBFF] text-[#2581F9] hover:bg-[#E8F4FF] cursor-pointer"
                            : "border border-gray-5 bg-gray-7 text-gray-3 cursor-default"
                        }`}
                      >
                        {member.adminMemo ? "있음" : "없음"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex w-full items-center justify-between">
          <FilterDropdown
            value={itemsPerPage}
            options={["10개씩 보기", "50개씩 보기", "100개씩 보기"]}
            onChange={handleItemsPerPageChange}
            width="w-[150px]"
          />

          <Pagination
            currentPage={pagination?.currentPage || 1}
            totalPages={pagination?.totalPages || 0}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* 운영자 메모 모달 */}
      <AdminMemoModal
        isOpen={memoModalOpen}
        onClose={() => {
          setMemoModalOpen(false);
          setSelectedMember(null);
        }}
        memberName={selectedMember?.name || ""}
        memo={selectedMember?.adminMemo || null}
      />
    </div>
  );
}

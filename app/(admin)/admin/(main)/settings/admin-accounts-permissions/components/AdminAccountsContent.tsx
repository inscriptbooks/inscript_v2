"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, Refresh } from "@/components/icons";
import FilterDropdown from "@/components/ui/filter-dropdown";
import SearchInputWithFilter from "@/components/ui/search-input-with-filter";
import { Pagination } from "@/components/common";
import AccountRegistrationModal from "./AccountRegistrationModal";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useLoader } from "@/hooks/common";
import type { AdminAccountsResponse, AdminAccount } from "../types";

type SortColumn = "status" | null;
type SortOrder = "asc" | "desc";

function AdminAccountsContentComponent({
  initialData,
}: {
  initialData: AdminAccountsResponse;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showLoader, hideLoader } = useLoader();

  const [searchType, setSearchType] = useState(
    searchParams.get("searchCategory") || "이름"
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("searchQuery") || ""
  );
  const [status, setStatus] = useState(searchParams.get("status") || "전체");
  const [type, setType] = useState(searchParams.get("type") || "전체");
  const [itemsPerPage, setItemsPerPage] = useState(
    searchParams.get("limit") || "10"
  );
  const [sortBy, setSortBy] = useState<SortColumn>(
    (searchParams.get("sortBy") as SortColumn) || null
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (searchParams.get("sortOrder") as SortOrder) || "desc"
  );
  const [accounts, setAccounts] = useState<AdminAccount[]>(
    initialData.accounts
  );
  const [pagination, setPagination] = useState(initialData.pagination);
  const [isAccountRegistrationModalOpen, setIsAccountRegistrationModalOpen] =
    useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("searchCategory", searchType);
    if (searchQuery) params.set("searchQuery", searchQuery);
    else params.delete("searchQuery");
    if (status !== "전체") params.set("status", status);
    else params.delete("status");
    if (type !== "전체") params.set("type", type);
    else params.delete("type");
    params.set("limit", itemsPerPage);
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    setSearchType("이름");
    setSearchQuery("");
    setStatus("전체");
    setType("전체");
    setItemsPerPage("10");
    setSortBy(null);
    setSortOrder("desc");
    router.push("/admin/settings/admin-accounts-permissions");
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
    params.set("searchCategory", searchType);
    if (searchQuery) params.set("searchQuery", searchQuery);
    if (status !== "전체") params.set("status", status);
    if (type !== "전체") params.set("type", type);
    if (column) {
      params.set("sortBy", column);
      params.set("sortOrder", newSortOrder);
    }

    const url = `/api/admin/accounts?${params.toString()}`;
    showLoader();
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setAccounts(data.accounts);
        setPagination(data.pagination);
        router.push(
          `/admin/settings/admin-accounts-permissions?${params.toString()}`
        );
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

  // admin_kind를 타입으로 변환
  const getTypeLabel = (adminKind: string | null) => {
    const typeMap: Record<string, string> = {
      master: "최고관리자",
      second: "운영관리자",
    };
    return typeMap[adminKind || ""] || "-";
  };

  // status를 Y/N으로 변환
  const getStatusLabel = (status: string | null) => {
    return status === "active" ? "Y" : "N";
  };

  return (
    <div className="flex w-full flex-col items-start gap-[34px] p-11">
      {/* 제목 */}
      <h1 className="text-2xl font-bold leading-8 text-[#2A2A2A]">
        관리자 계정/권한
      </h1>

      {/* 검색 섹션 */}
      <div className="flex w-full flex-col items-start gap-[18px] rounded-lg bg-[#FAF8F6] p-8">
        <div className="flex w-full items-center gap-6">
          {/* 검색 필드 */}
          <SearchInputWithFilter
            filterValue={searchType}
            filterOptions={["이름", "ID"]}
            onFilterChange={setSearchType}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="검색조건을 입력해주세요"
          />

          {/* 필터 섹션 */}
          <div className="flex flex-1 items-start gap-6">
            {/* 상태 필터 */}
            {/*<div className="flex flex-1 items-center gap-2">
              <span className="text-base font-bold text-[#555]">상태</span>
              <FilterDropdown
                value={status}
                options={["전체", "Y", "N"]}
                onChange={setStatus}
              />
            </div>*/}

            {/* 타입 필터 */}
            <div className="flex flex-1 items-center gap-2">
              <span className="text-base font-bold text-[#555]">타입</span>
              <FilterDropdown
                value={type}
                options={["전체", "최고관리자", "운영관리자"]}
                onChange={setType}
              />
            </div>
          </div>

          {/* 버튼 섹션 */}
          <div className="flex items-center gap-2">
            <Button
              className="flex h-[43px] w-[120px] items-center justify-center gap-2 rounded bg-[#911A00] px-0 py-3"
              onClick={handleSearch}
            >
              <Search size={16} color="white" />
              <span className="text-base font-bold text-white">검색</span>
            </Button>
            <Button
              variant="outline"
              className="flex h-[43px] w-[120px] items-center justify-center gap-2 rounded border-[1.3px] border-[#911A00] bg-white px-0 py-3 hover:bg-gray-50"
              onClick={handleReset}
            >
              <Refresh size={16} color="#911A00" />
              <span className="text-base font-bold text-[#911A00]">초기화</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 결과 및 액션 섹션 */}
      <div className="flex w-full flex-col items-end gap-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-xl text-[#6D6D6D]">
            총{" "}
            <span className="text-[#911A00]">
              {pagination.totalCount.toLocaleString()}
            </span>
            건
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="flex w-[120px] items-center justify-center rounded bg-[#911A00] py-2.5 h-[36px]"
              onClick={() => setIsAccountRegistrationModalOpen(true)}
            >
              <span className="text-sm font-bold text-white">계정등록</span>
            </Button>
          </div>
        </div>

        {/* 테이블 */}
        <div className="flex w-full flex-col items-start gap-6">
          <div className="flex w-full flex-col">
            {/* 테이블 헤더 */}
            <div className="flex h-[50px] w-full items-center justify-between rounded-t bg-[#EEE] px-4">
              <div className="flex w-[60px] items-center justify-center py-4">
                <span className="w-10 text-center text-xs font-bold text-[#515151]">
                  NO
                </span>
              </div>
              <div className="flex w-[120px] items-center justify-center py-4">
                <span className="w-[100px] text-center text-xs font-bold text-[#515151]">
                  이름
                </span>
              </div>
              <div className="flex w-[338px] items-center justify-center py-4">
                <span className="w-[318px] text-center text-xs font-bold text-[#515151]">
                  ID
                </span>
              </div>
              <div
                className="flex w-[100px] cursor-pointer items-center justify-center py-4 transition-colors hover:bg-[#E0E0E0]"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  <span className="text-center text-xs font-bold text-[#515151]">
                    상태
                  </span>
                  {getSortIcon("status")}
                </div>
              </div>
              <div className="flex w-[144px] items-center justify-center py-4">
                <span className="w-[124px] text-center text-xs font-bold text-[#515151]">
                  타입
                </span>
              </div>
            </div>

            {/* 테이블 데이터 */}
            {accounts.map((account, index) => (
              <div
                key={account.id}
                className="group flex h-[50px] w-full items-center justify-between bg-white px-4 hover:bg-[#EBE1DF]"
              >
                <div className="flex w-[60px] items-center justify-center py-4">
                  <span className="w-10 text-center text-xs text-[#686868] group-hover:text-[#911A00]">
                    {pagination.totalCount -
                      (pagination.currentPage - 1) * pagination.limit -
                      index}
                  </span>
                </div>
                <div className="flex w-[120px] items-center justify-center py-4">
                  <span className="w-[100px] text-center text-xs text-[#686868] group-hover:text-[#911A00]">
                    {account.name || "-"}
                  </span>
                </div>
                <div className="flex w-[338px] items-center justify-center py-4">
                  <span className="w-[318px] text-center text-xs text-[#686868] group-hover:text-[#911A00]">
                    {account.email || "-"}
                  </span>
                </div>
                <div className="flex w-[100px] items-center justify-center py-4">
                  <span className="w-20 text-center text-xs text-[#686868] group-hover:text-[#911A00]">
                    {getStatusLabel(account.status)}
                  </span>
                </div>
                <div className="flex w-[144px] items-center justify-center py-4">
                  <span className="w-[124px] text-center text-xs text-[#686868] group-hover:text-[#911A00]">
                    {getTypeLabel(account.admin_kind)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="flex w-full items-center justify-between">
            <FilterDropdown
              value={`${itemsPerPage}개씩 보기`}
              options={["10개씩 보기", "20개씩 보기", "50개씩 보기"]}
              onChange={(val) =>
                handleItemsPerPageChange(val.replace("개씩 보기", ""))
              }
              width="w-[104px]"
            />

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* 계정등록 모달 */}
      <AccountRegistrationModal
        isOpen={isAccountRegistrationModalOpen}
        onClose={() => setIsAccountRegistrationModalOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}

export default function AdminAccountsContent({
  initialData,
}: {
  initialData: AdminAccountsResponse;
}) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AdminAccountsContentComponent initialData={initialData} />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/common";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { AuthorApplicationItem, AuthorApplicationsResponse } from "../types";

type SortColumn = "status" | "created_at" | null;
type SortOrder = "asc" | "desc";

interface AuthorApplicationsContentProps {
  initialData: AuthorApplicationsResponse;
}

export default function AuthorApplicationsContent({
  initialData,
}: AuthorApplicationsContentProps) {
  const router = useRouter();

  const defaultPagination = {
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    limit: 10,
  };

  const [applications, setApplications] = useState<AuthorApplicationItem[]>(
    initialData?.applications || []
  );
  const [pagination, setPagination] = useState(
    initialData?.pagination || defaultPagination
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10개씩 보기");
  const [sortBy, setSortBy] = useState<SortColumn>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const getLimitNumber = (itemsPerPage: string): number => {
    if (itemsPerPage === "50개씩 보기") return 50;
    if (itemsPerPage === "100개씩 보기") return 100;
    return 10;
  };

  const fetchApplications = async (
    page: number,
    limit: number,
    sort?: SortColumn,
    order?: SortOrder
  ) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    const currentSort = sort !== undefined ? sort : sortBy;
    const currentOrder = order !== undefined ? order : sortOrder;

    if (currentSort) {
      params.set("sortBy", currentSort);
      params.set("sortOrder", currentOrder);
    }

    const url = `/api/admin/members/author-applications?${params.toString()}`;
    const response = await fetch(url);
    const data: AuthorApplicationsResponse = await response.json();

    setApplications(data.applications);
    setPagination(data.pagination);
    setCurrentPage(page);
  };

  const handlePageChange = (page: number) => {
    fetchApplications(page, getLimitNumber(itemsPerPage));
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    fetchApplications(1, getLimitNumber(value));
  };

  const handleSort = (column: SortColumn) => {
    let newSortOrder: SortOrder = "asc";

    if (sortBy === column) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    setSortBy(column);
    setSortOrder(newSortOrder);
    fetchApplications(1, getLimitNumber(itemsPerPage), column, newSortOrder);
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

  const getStatusBadge = (status: string) => {
    if (status === "pending") {
      return (
        <span className="inline-flex items-center justify-center rounded-full border border-[#B0D5F2] bg-[#F6FBFF] px-3 py-1 text-sm font-medium text-[#2581F9]">
          승인대기
        </span>
      );
    }
    if (status === "rejected") {
      return (
        <span className="inline-flex items-center justify-center rounded-full border border-[#D7825E] bg-[#FBEEE8] px-3 py-1 text-sm font-medium text-[#D44F34]">
          반려
        </span>
      );
    }
    return null;
  };

  return (
    <div className="flex w-full flex-col items-start gap-8 p-11">
      {/* 제목 */}
      <h1 className="font-pretendard text-2xl font-bold leading-8 text-[#2A2A2A]">
        작가 신청 이력
      </h1>

      {/* 결과 영역 */}
      <div className="flex w-full flex-1 flex-col items-end gap-4">
        {/* 상단 정보 */}
        <div className="flex w-full items-center justify-between">
          <div className="font-pretendard text-xl font-medium leading-6 text-[#6D6D6D]">
            총{" "}
            <span className="font-pretendard text-xl font-medium text-[#911A00]">
              {(pagination?.totalCount || 0).toLocaleString()}
            </span>
            건
          </div>
        </div>

        {/* 테이블 */}
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            {/* 테이블 헤더 */}
            <thead>
              <tr className="h-[50px] bg-[#EEE]">
                <th className="px-2 text-xs font-bold text-[#515151]">NO</th>
                <th className="px-2 text-xs font-bold text-[#515151]">이름</th>
                <th className="px-2 text-xs font-bold text-[#515151]">
                  이메일
                </th>
                <th
                  className="cursor-pointer px-2 text-xs font-bold text-[#515151]"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center justify-center">
                    상태
                    {getSortIcon("status")}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-2 text-xs font-bold text-[#515151]"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center justify-center">
                    작가 승인 요청일시
                    {getSortIcon("created_at")}
                  </div>
                </th>
              </tr>
            </thead>

            {/* 테이블 본문 */}
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-base text-gray-3"
                  >
                    작가 신청 이력이 없습니다.
                  </td>
                </tr>
              ) : (
                applications.map((application) => (
                  <tr
                    key={application.id}
                    onClick={() =>
                      router.push(
                        `/admin/members/author-applications/${application.id}`
                      )
                    }
                    className="group h-[50px] cursor-pointer bg-white transition-colors hover:bg-[#EBE1DF]"
                  >
                    <td className="px-2 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {application.no}
                    </td>
                    <td className="px-2 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {application.name}
                    </td>
                    <td className="px-2 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {application.email}
                    </td>
                    <td className="px-2 text-center">
                      <div className="flex justify-center">
                        {getStatusBadge(application.status)}
                      </div>
                    </td>
                    <td className="px-2 text-center text-xs font-medium text-[#686868] group-hover:text-[#911A00]">
                      {application.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {applications.length > 0 && (
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
        )}
      </div>
    </div>
  );
}

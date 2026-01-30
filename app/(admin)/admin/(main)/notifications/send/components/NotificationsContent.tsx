"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, Search, Refresh, Excel } from "@/components/icons";
import SearchInputWithFilter from "@/components/ui/search-input-with-filter";
import { Pagination } from "@/components/common";
import DateEdit from "@/components/ui/date-edit";
import FilterDropdown from "@/components/ui/filter-dropdown";
import SystemNotificationModal from "./SystemNotificationModal";
import type {
  NotificationsResponse,
  SystemNotificationFormData,
  SystemNotification,
} from "../types";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useLoader } from "@/hooks/common";

type SortColumn = "created_at" | null;
type SortOrder = "asc" | "desc";

function NotificationsContentComponent({
  initialData,
}: {
  initialData: NotificationsResponse;
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
  const [notifications, setNotifications] = useState<SystemNotification[]>(
    initialData.notifications
  );
  const [pagination, setPagination] = useState(initialData.pagination);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    number | null
  >(null);
  const [formData, setFormData] = useState<SystemNotificationFormData>({
    title: "",
    message: "",
  });

  const startDateRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (startDate) params.set("startDate", formatDate(startDate));
    else params.delete("startDate");
    if (endDate) params.set("endDate", formatDate(endDate));
    else params.delete("endDate");
    if (searchQuery) params.set("searchQuery", searchQuery);
    else params.delete("searchQuery");
    params.set("limit", itemsPerPage);
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchQuery("");
    setItemsPerPage("10");
    setSortBy(null);
    setSortOrder("desc");
    router.push("/admin/notifications/send");
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
    if (searchQuery) params.set("searchQuery", searchQuery);
    if (column) {
      params.set("sortBy", column);
      params.set("sortOrder", newSortOrder);
    }

    const url = `/api/admin/notifications?${params.toString()}`;
    showLoader();
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.notifications);
        setPagination(data.pagination);
        router.push(`/admin/notifications/send?${params.toString()}`);
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

  const handleExcelDownload = async () => {
    try {
      // 현재 필터 조건을 포함하여 전체 데이터 요청
      const params = new URLSearchParams();
      if (startDate) params.set("startDate", formatDate(startDate));
      if (endDate) params.set("endDate", formatDate(endDate));
      if (searchQuery) params.set("searchQuery", searchQuery);

      const response = await fetch(
        `/api/admin/notifications/export?${params.toString()}`
      );

      if (!response.ok) {
        showErrorToast("데이터를 가져오는데 실패했습니다.");
        return;
      }

      const { notifications: allNotifications } = await response.json();

      if (!allNotifications || allNotifications.length === 0) {
        showErrorToast("다운로드할 데이터가 없습니다.");
        return;
      }

      // xlsx 라이브러리 동적 import
      const XLSX = await import("xlsx");

      // 엑셀 데이터 형식으로 변환
      const excelData = allNotifications.map(
        (notification: any, index: number) => ({
          NO: allNotifications.length - index,
          알림ID: notification.id,
          제목: notification.title,
          내용: notification.message,
          등록일: formatDateTime(notification.created_at),
        })
      );

      // 워크북 생성
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "시스템 알림");

      // 컬럼 너비 설정
      const columnWidths = [
        { wch: 8 }, // NO
        { wch: 12 }, // 알림ID
        { wch: 30 }, // 제목
        { wch: 50 }, // 내용
        { wch: 20 }, // 등록일
      ];
      worksheet["!cols"] = columnWidths;

      // 파일명 생성 (현재 날짜 포함)
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
      const fileName = `시스템알림_${dateStr}.xlsx`;

      // 파일 다운로드
      XLSX.writeFile(workbook, fileName);

      showSuccessToast("엑셀 다운로드가 완료되었습니다.");
    } catch (error) {
      showErrorToast("엑셀 다운로드 중 오류가 발생했습니다.");
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedNotificationId(null);
    setFormData({
      title: "",
      message: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (notification: (typeof notifications)[0]) => {
    setModalMode("edit");
    setSelectedNotificationId(notification.id);
    setFormData({
      title: notification.title,
      message: notification.message,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotificationId(null);
    setFormData({
      title: "",
      message: "",
    });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      showErrorToast("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const url =
        modalMode === "create"
          ? "/api/admin/notifications"
          : `/api/admin/notifications/${selectedNotificationId}`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        showErrorToast("알림 저장에 실패했습니다.");
        return;
      }

      showSuccessToast(
        modalMode === "create"
          ? "알림이 등록되었습니다."
          : "알림이 수정되었습니다."
      );
      handleCloseModal();
      router.refresh();
    } catch (error) {
      showErrorToast("알림 저장 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!selectedNotificationId) {
      return;
    }

    // if (!confirm("정말 삭제하시겠습니까?")) {
    //   return;
    // }

    try {
      const response = await fetch(
        `/api/admin/notifications/${selectedNotificationId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        showErrorToast("알림 삭제에 실패했습니다.");
        return;
      }

      showSuccessToast("알림이 삭제되었습니다.");
      handleCloseModal();
      router.refresh();
    } catch (error) {
      showErrorToast("알림 삭제 중 오류가 발생했습니다.");
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
    <div className="flex w-full flex-col items-start gap-8 p-11">
      {/* 제목 */}
      <h1 className="font-pretendard text-2xl font-bold leading-8 text-gray-1">
        시스템 알림 발송
      </h1>

      {/* 필터 영역 */}
      <div className="flex w-full flex-col items-start gap-5 rounded-lg bg-background p-8">
        {/* 첫 번째 행 - 등록일 */}
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
        </div>

        {/* 두 번째 행 - 검색 */}
        <div className="flex w-full items-center gap-6">
          {/* 검색 영역 */}
          <SearchInputWithFilter
            filterValue="내용"
            filterOptions={["내용"]}
            onFilterChange={() => {}}
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
          <div className="flex items-center gap-2">
            <Button
              onClick={handleExcelDownload}
              variant="outline"
              className="flex h-[36px] w-[127px] items-center gap-3 rounded border-[1.6px] border-[#4CA452] bg-white hover:bg-white/90"
            >
              <Excel size={16} color="#4CA452" />
              <span className="text-sm font-bold text-[#4CA452]">
                엑셀 다운로드
              </span>
            </Button>
            <Button
              onClick={handleOpenCreateModal}
              className="flex h-[42px] w-[100px] items-center justify-center gap-2 rounded bg-primary px-4 py-2"
            >
              <span className="text-sm font-bold text-white">알림 등록</span>
            </Button>
          </div>
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
                  알림ID
                </span>
              </div>
              <div className="flex w-[150px] items-center justify-center p-2">
                <span className="font-pretendard text-xs font-bold text-[#515151]">
                  제목
                </span>
              </div>
              <div className="flex flex-1 items-center justify-center p-2">
                <span className="font-pretendard text-xs font-bold text-[#515151]">
                  내용
                </span>
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
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                onClick={() => handleOpenEditModal(notification)}
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
                    {notification.id}
                  </span>
                </div>
                <div className="flex w-[150px] items-center justify-center p-2">
                  <span className="truncate font-pretendard text-xs font-medium text-[#686868] transition-colors group-hover:text-[#911A00]">
                    {notification.title}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-center p-2">
                  <span className="truncate font-pretendard text-xs font-medium text-[#686868] transition-colors group-hover:text-[#911A00]">
                    {notification.message}
                  </span>
                </div>
                <div className="flex w-[124px] items-center justify-center p-2">
                  <span className="font-pretendard text-xs font-medium text-[#686868] transition-colors group-hover:text-[#911A00]">
                    {formatDateTime(notification.created_at)}
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

      {/* 알림 등록/수정 모달 */}
      <SystemNotificationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        mode={modalMode}
      />
    </div>
  );
}

export default function NotificationsContent({
  initialData,
}: {
  initialData: NotificationsResponse;
}) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <NotificationsContentComponent initialData={initialData} />
    </Suspense>
  );
}

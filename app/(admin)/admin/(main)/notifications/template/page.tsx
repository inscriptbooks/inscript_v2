"use client";

import { useState } from "react";
import { CheckboxUI } from "@/components/common/Checkbox/CheckboxUI";
import { Button } from "@/components/ui/button";
import Toggle from "@/components/ui/toggle";
import Search from "@/components/icons/Search";
import Refresh from "@/components/icons/Refresh";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { Pagination } from "@/components/common";
import TemplateRegistrationModal from "./components/TemplateRegistrationModal";
import { FilterState, TemplateData, TemplateFormData } from "./types";

export default function AdminNotificationTemplatesPage() {
  const [filters, setFilters] = useState<FilterState>({
    프로그램: true,
    희곡: false,
    작가: false,
    공지: false,
    커뮤니티: false,
    기타: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedType, setSelectedType] = useState("전체");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TemplateFormData>({
    title: "",
    type: "",
    content: "",
    isActive: true,
  });

  // 100개의 더미 데이터 생성 (10페이지 분량)
  const [templates, setTemplates] = useState<TemplateData[]>(() => {
    return Array.from({ length: 100 }, (_, index) => {
      const types = ["프로그램", "희곡", "작가", "공지", "커뮤니티", "기타"];
      const contents = [
        "신규 프로그램 등록 알림",
        "내 게시글에 댓글 알림",
        "프로그램 일정 변경 알림",
        "희곡 등록 완료 알림",
        "작가 정보 업데이트 알림",
        "공지사항 등록 알림",
        "커뮤니티 게시글 좋아요 알림",
        "메세지 수신 알림",
      ];

      return {
        id: `T${String(1001 + index).padStart(4, "0")}`,
        type: types[index % types.length],
        content: contents[index % contents.length],
        sender: "system",
        isEnabled: index % 3 !== 0,
        lastModified: "2025-09-05 11:22",
        ...(index % 15 === 1 && { isHighlighted: true }),
      };
    });
  });

  const handleFilterChange = (key: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleChange = (id: string, checked: boolean) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === id ? { ...template, isEnabled: checked } : template
      )
    );
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: "",
      type: "",
      content: "",
      isActive: true,
    });
  };

  const handleFormSubmit = () => {
    // 폼 제출 로직
    handleCloseModal();
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(templates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTemplates = templates.slice(startIndex, endIndex);

  // 유형 옵션
  const typeOptions = [
    "전체",
    "프로그램",
    "희곡",
    "작가",
    "공지",
    "커뮤니티",
    "기타",
  ];

  // 페이지당 항목 수 옵션
  const itemsPerPageOptions = [
    "10개씩 보기",
    "20개씩 보기",
    "30개씩 보기",
    "50개씩 보기",
  ];

  const handleItemsPerPageChange = (value: string) => {
    const num = parseInt(value);
    setItemsPerPage(num);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex w-full flex-col items-center gap-[34px] p-11">
        {/* 제목 */}
        <div className="w-full">
          <h1 className="font-pretendard text-2xl font-semibold leading-8 text-gray-1">
            알림 템플릿 관리
          </h1>
        </div>

        {/* 필터 섹션 */}
        <div className="flex w-full flex-col items-start gap-[18px] rounded-lg bg-[#FAF8F6] p-8">
          <div className="flex w-full items-center justify-between gap-6">
            {/* 체크박스 필터 */}
            <div className="flex items-start gap-[18px]">
              {Object.entries(filters).map(([key, checked]) => (
                <div key={key} className="flex items-center gap-2 px-2 py-1">
                  <CheckboxUI
                    checked={checked}
                    onChange={() =>
                      handleFilterChange(key as keyof FilterState)
                    }
                  />
                  <span
                    className={`font-pretendard text-sm font-medium ${
                      checked ? "text-primary" : "text-gray-2"
                    }`}
                  >
                    {key}
                  </span>
                </div>
              ))}
            </div>

            {/* 유형 드롭다운 */}
            <div className="flex flex-1 items-center gap-2">
              <span className="font-pretendard text-base font-semibold text-gray-2">
                유형
              </span>
              <FilterDropdown
                value={selectedType}
                options={typeOptions}
                onChange={setSelectedType}
              />
            </div>

            {/* 검색/초기화 버튼 */}
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                className="flex h-[43px] w-[120px] items-center justify-center gap-2 rounded bg-primary px-0 py-3 font-pretendard text-base font-semibold text-white"
              >
                <Search size={16} color="white" />
                검색
              </Button>
              <Button
                variant="outline"
                className="flex h-[43px] w-[120px] items-center justify-center gap-2 rounded border border-primary bg-white px-0 py-3 font-pretendard text-base font-semibold text-primary"
              >
                <Refresh size={16} color="#911A00" />
                초기화
              </Button>
            </div>
          </div>
        </div>

        {/* 결과 및 등록 버튼 */}
        <div className="flex w-full flex-col items-center gap-6">
          <div className="flex w-full flex-col items-end gap-4">
            <div className="flex w-full items-center justify-between">
              <div className="font-pretendard text-xl font-medium leading-6 tracking-[-0.4px]">
                <span className="text-gray-3">총 </span>
                <span className="text-primary">
                  {templates.length.toLocaleString()}
                </span>
                <span className="text-gray-3">건</span>
              </div>
              <Button
                variant="default"
                onClick={handleOpenModal}
                className="h-auto w-[120px] rounded bg-primary px-0 py-2.5 font-pretendard text-sm font-semibold leading-4 tracking-[-0.28px] text-white"
              >
                템플릿 등록
              </Button>
            </div>

            {/* 테이블 */}
            <div className="flex w-full flex-col items-start gap-6">
              <div className="flex w-full flex-col items-start">
                {/* 테이블 헤더 */}
                <div className="flex h-[50px] w-full items-center justify-between rounded-sm bg-[#EEEEEE] px-4">
                  <div className="flex w-[60px] max-w-[60px] items-center justify-center px-2.5 py-4">
                    <span className="font-pretendard text-xs font-bold text-gray-600">
                      템플릿ID
                    </span>
                  </div>
                  <div className="flex w-[100px] items-center justify-center px-2.5 py-4">
                    <span className="font-pretendard text-xs font-bold text-gray-600">
                      유형
                    </span>
                  </div>
                  <div className="flex w-[240px] max-w-[240px] items-center justify-center px-2.5 py-4">
                    <span className="font-pretendard text-xs font-bold text-gray-600">
                      내용
                    </span>
                  </div>
                  <div className="flex w-[88px] max-w-[88px] items-center justify-center px-2.5 py-4">
                    <span className="font-pretendard text-xs font-bold text-gray-600">
                      발신자
                    </span>
                  </div>
                  <div className="flex w-[100px] items-center justify-center px-2.5 py-4">
                    <span className="font-pretendard text-xs font-bold text-gray-600">
                      알림설정
                    </span>
                  </div>
                  <div className="flex w-[88px] max-w-[88px] items-center justify-center px-2.5 py-4">
                    <span className="font-pretendard text-xs font-bold text-gray-600">
                      메세지 수정
                    </span>
                  </div>
                  <div className="flex w-[114px] items-center justify-center px-2.5 py-4">
                    <span className="font-pretendard text-xs font-bold text-gray-600">
                      최근 수정 일시
                    </span>
                  </div>
                </div>

                {/* 테이블 데이터 */}
                {currentTemplates.map((template, index) => (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`flex h-[50px] w-full items-center justify-between px-4 transition-colors ${
                      hoveredRow === index ? "bg-[#EBE1DF]" : "bg-white"
                    }`}
                  >
                    <div className="flex w-[60px] max-w-[60px] items-center justify-center px-2.5 py-4">
                      <span
                        className={`font-pretendard text-xs font-medium ${
                          hoveredRow === index
                            ? "text-[#911A00]"
                            : "text-gray-500"
                        }`}
                      >
                        {template.id}
                      </span>
                    </div>
                    <div className="flex w-[100px] items-center justify-center px-2.5 py-4">
                      <span
                        className={`font-pretendard text-xs font-medium ${
                          hoveredRow === index
                            ? "text-[#911A00]"
                            : "text-gray-500"
                        }`}
                      >
                        {template.type}
                      </span>
                    </div>
                    <div className="flex w-[240px] max-w-[240px] items-center justify-center px-2.5 py-4">
                      <span
                        className={`font-pretendard text-xs font-medium ${
                          hoveredRow === index
                            ? "text-[#911A00]"
                            : "text-gray-500"
                        }`}
                      >
                        {template.content}
                      </span>
                    </div>
                    <div className="flex w-[88px] max-w-[88px] items-center justify-center px-2.5 py-4">
                      <span
                        className={`overflow-hidden text-ellipsis whitespace-nowrap font-pretendard text-xs font-medium ${
                          hoveredRow === index
                            ? "text-[#911A00]"
                            : "text-gray-500"
                        }`}
                      >
                        {template.sender}
                      </span>
                    </div>
                    <div className="flex w-[100px] items-center justify-center px-2.5">
                      <Toggle
                        checked={template.isEnabled}
                        onChange={(checked) =>
                          handleToggleChange(template.id, checked)
                        }
                      />
                    </div>
                    <div className="flex w-[88px] items-center justify-center px-2.5">
                      <Button
                        variant="outline"
                        className="h-auto w-[88px] rounded border border-primary bg-white px-3 py-2.5 font-pretendard text-sm font-semibold leading-4 tracking-[-0.28px] text-primary hover:bg-white/90"
                      >
                        메세지 수정
                      </Button>
                    </div>
                    <div className="flex w-[114px] items-center justify-center px-2.5 py-4">
                      <span
                        className={`font-pretendard text-xs font-medium ${
                          hoveredRow === index
                            ? "text-[#911A00]"
                            : "text-gray-500"
                        }`}
                      >
                        {template.lastModified}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 하단 페이지네이션 */}
              <div className="flex w-full items-center justify-between">
                {/* 페이지당 항목 수 선택 */}
                <FilterDropdown
                  value={`${itemsPerPage}개씩 보기`}
                  options={itemsPerPageOptions}
                  onChange={handleItemsPerPageChange}
                  width="w-[104px]"
                />

                {/* 페이지네이션 */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 템플릿 등록 모달 */}
      <TemplateRegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleFormSubmit}
      />
    </>
  );
}

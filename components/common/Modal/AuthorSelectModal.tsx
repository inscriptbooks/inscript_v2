"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search } from "@/components/icons";
import { useGetAuthorsPaginated } from "@/hooks/authors";
import { Author } from "@/models/author";
import { Loader } from "@/components/common";
import Pagination from "@/components/common/Pagination";
import { useBreakpoint } from "@/hooks/common";

type BasicAuthor = Pick<
  Author,
  "id" | "authorName" | "authorNameEn" | "featuredWork"
>;

interface AuthorSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (author: BasicAuthor) => void;
}

export default function AuthorSelectModal({
  isOpen,
  onClose,
  onConfirm,
}: AuthorSelectModalProps) {
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { isAbove } = useBreakpoint();
  const radioSize = isAbove("lg") ? 24 : 20;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const NONE_VALUE = "NONE";

  const { data, isLoading, fetchNextPage } = useGetAuthorsPaginated({
    keyword,
    limit: 5,
    requestStatus: "approved",
  });

  // 현재 페이지의 데이터 가져오기
  const currentPageData = data?.pages[currentPage - 1];
  const authors = currentPageData?.authors || [];
  const totalPages = currentPageData?.meta.totalPages || 1;

  const handleConfirm = () => {
    if (onConfirm) {
      const payload: BasicAuthor =
        selectedId === NONE_VALUE || !selectedAuthor
          ? {
              id: NONE_VALUE,
              authorName: "작가 미지정",
              authorNameEn: "",
              featuredWork: "-",
            }
          : {
              id: selectedAuthor.id,
              authorName: selectedAuthor.authorName,
              authorNameEn: selectedAuthor.authorNameEn || "",
              featuredWork: selectedAuthor.featuredWork || "-",
            };
      onConfirm(payload);
    }
    setSelectedAuthor(null);
    setSearchValue("");
    setKeyword("");
    setCurrentPage(1);
    setSelectedId(null);
    onClose();
  };

  const handleCancel = () => {
    setSelectedAuthor(null);
    setSearchValue("");
    setKeyword("");
    setCurrentPage(1);
    setSelectedId(null);
    onClose();
  };

  const handleSearch = () => {
    setKeyword(searchValue);
  };

  const handlePageChange = async (page: number) => {
    if (page > (data?.pages.length || 0)) {
      await fetchNextPage();
    }
    setCurrentPage(page);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setSelectedAuthor(null);
    setSelectedId(null);
  }, [keyword]);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent className="max-w-[350px] gap-6 p-6 sm:max-w-none lg:gap-[46px] lg:p-11">
        <div className="flex h-full w-full flex-col items-start gap-6">
          <ModalHeader onClose={onClose}>작가 회원</ModalHeader>

          <ModalBody className="h-full w-full flex-1 gap-6">
            {/* Search Input */}
            <div className="flex w-full items-center justify-between gap-2.5 rounded border border-red-3 bg-orange-4 px-5 py-4">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="작가명 (한글/영문) 검색"
                className="min-w-0 flex-1 bg-transparent font-pretendard text-base leading-6 tracking-[-0.32px] text-primary outline-none placeholder:text-orange-3"
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={isLoading}
                className="shrink-0"
                aria-label="검색"
              >
                {isLoading ? (
                  <Loader size="xs" className="text-primary" />
                ) : (
                  <Search size={24} className="text-primary" />
                )}
              </button>
            </div>

            {/* Author List */}
            <div className="flex h-full w-full flex-col items-start bg-white">
              {/* Header */}
              <div className="grid w-full grid-cols-[12%_24%_24%_40%] items-center border-b border-gray-7 bg-gray-7 py-2.5">
                <div className=""></div>
                <div className="px-2 text-center font-pretendard text-xs font-normal leading-4 text-[#6A6A6A] lg:text-sm">
                  작가명
                </div>
                <div className="px-2 text-center font-pretendard text-xs font-normal leading-4 text-[#6A6A6A] lg:text-sm">
                  영문명
                </div>
                <div className="px-2 text-center font-pretendard text-xs font-normal leading-4 text-[#6A6A6A] lg:text-sm">
                  대표작
                </div>
              </div>

              {!isLoading && (
                <RadioGroup
                  value={selectedId ?? ""}
                  onValueChange={(val) => {
                    if (val === NONE_VALUE) {
                      setSelectedId(NONE_VALUE);
                      setSelectedAuthor(null);
                      return;
                    }
                    const author = authors.find((a) => a.id === val) || null;
                    setSelectedId(val);
                    setSelectedAuthor(author);
                  }}
                  className="w-full gap-0"
                >
                  {authors.map((author: Author) => (
                    <div
                      key={author.id}
                      className="grid w-full grid-cols-[12%_24%_24%_40%] items-center border-b border-gray-7 py-2.5"
                    >
                      <div className="flex items-center justify-center">
                        <RadioGroupItem value={author.id} size={radioSize} />
                      </div>

                      <div className="w-full truncate px-2 text-center text-xs font-medium leading-4 text-[#6A6A6A] lg:text-sm">
                        {author.authorName}
                      </div>

                      <div className="w-full truncate px-2 text-center text-xs font-medium leading-4 text-[#6A6A6A] lg:text-sm">
                        {author.authorNameEn || "-"}
                      </div>

                      <div className="line-clamp-2 max-h-8 w-full px-2 text-center text-xs font-medium leading-4 text-[#6A6A6A] lg:text-sm">
                        {author.featuredWork || "-"}
                      </div>
                    </div>
                  ))}

                  {authors.length === 0 && (
                    <div className="flex w-full items-center justify-center py-8">
                      <p className="font-serif text-sm font-bold text-orange-2 lg:text-xl">
                        검색 결과에 해당하는 작가명이 없습니다.
                      </p>
                    </div>
                  )}

                  {authors.length > 0 && totalPages > 1 && (
                    <div className="flex w-full justify-center my-6">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}

                  <div className="grid w-full grid-cols-[12%_88%] items-center py-2.5">
                    <div className="flex items-center justify-center">
                      <RadioGroupItem value={NONE_VALUE} size={radioSize} />
                    </div>
                    <div className="px-2 text-left text-xs font-medium leading-4 text-[#6A6A6A] lg:text-sm">
                      작가 미지정
                    </div>
                  </div>
                </RadioGroup>
              )}
            </div>
          </ModalBody>

          <ModalFooter className="gap-3">
            <Button
              variant="disabled"
              onClick={handleCancel}
              className="flex-1 basis-1/2 text-lg font-bold leading-6 text-gray-3"
            >
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedId === null}
              className="flex-1 basis-1/2 text-lg font-bold leading-6 text-white"
            >
              확인
            </Button>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
}

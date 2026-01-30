"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Post } from "@/models/post";
import { formatRelativeTime } from "@/lib/utils";
import { SearchInput, EmptyBox } from "@/components/common";
import { Button } from "@/components/ui/button";
import { CommentCount } from "@/components/common/CommentCount";
import { Pagination } from "@/components/common";
import { useRouter } from "next/navigation";

interface NewsDashboardProps {
  newsItems: Post[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function NewsDashboard({
  newsItems,
  currentPage,
  totalPages,
  onPageChange,
}: NewsDashboardProps) {
  const router = useRouter();

  const handleNewsItemClick = (item: Post) => {
    router.push(`/community/news/${item.id}`);
  };
  return (
    <div className="flex w-full flex-col pt-3 lg:pt-7">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-primary">인크소식</h2>
          <p className="text-gray-2">인스크립트의 소식을 전해드립니다.</p>
        </div>

        <Suspense fallback={<div />}>
          <SearchInput
            wrapperClassName="w-full lg:w-[375px] lg:h-12"
            className="px-0 py-0 lg:px-0 lg:py-0 lg:text-lg"
            showFilter={true}
          />
        </Suspense>
      </div>

      {/* News Table */}
      <div className="overflow-x-auto lg:pt-3">
        {newsItems.length > 0 ? (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-red-2">
                  <th className="px-3 py-3 text-left text-sm font-bold text-primary">
                    제목
                  </th>
                  <th className="w-[75px] shrink-0 px-3 py-3 text-sm font-bold text-primary lg:w-[150px]">
                    작성자
                  </th>
                  <th className="w-[70px] shrink-0 px-3 py-3 text-sm font-bold text-primary lg:w-[80px]">
                    작성일
                  </th>
                </tr>
              </thead>
              <tbody>
                {newsItems.map((item) => (
                  <tr
                    key={item.id}
                    className="cursor-pointer transition-colors hover:bg-gray-6/50"
                    onClick={() => handleNewsItemClick(item)}
                  >
                    {/* Title Column */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="line-clamp-1 text-sm text-gray-1">
                          {item.title}
                        </div>
                        <CommentCount count={item.commentCount} />
                      </div>
                    </td>

                    {/* Author Column */}
                    <td className="shrink-0 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        {/* Avatar Circle */}
                        <div className="h-6 w-6 shrink-0 rounded-full bg-gray-5" />
                        {/* Author Name */}
                        <span className="line-clamp-1 text-sm text-gray-3">
                          {item.user.name}
                        </span>
                      </div>
                    </td>

                    {/* Timestamp Column */}
                    <td className="px-3 py-2.5 text-center">
                      <span className="line-clamp-1 shrink-0 text-sm text-gray-3">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex w-full flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </>
        ) : (
          <EmptyBox text="게시글이 없습니다." />
        )}
      </div>
    </div>
  );
}

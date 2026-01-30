"use client";

import Link from "next/link";
import { Post } from "@/models/post";
import { formatRelativeTime } from "@/lib/utils";
import { SearchInput } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/common";
import { CommentCount } from "@/components/common/CommentCount";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

interface AuthorDashboardProps {
  authorItems: Post[];
}

export default function AuthorDashboard({ authorItems }: AuthorDashboardProps) {
  const router = useRouter();

  const handleAuthorItemClick = (item: Post) => {
    router.push(`/community/author/${item.id}`);
  };

  return (
    <div className="flex w-full flex-col pt-3 lg:pt-7">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-primary">작가 커뮤니티</h2>
          <p className="text-gray-2">작가 커뮤니티 게시판</p>
        </div>

        <Suspense fallback={<div />}>
          <SearchInput
            wrapperClassName="w-full lg:w-[375px] lg:h-12"
            className="px-0 py-0 lg:px-0 lg:py-0 lg:text-lg"
          />
        </Suspense>
      </div>

      {/* News Table */}
      <div className="overflow-x-auto lg:pt-3">
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
            {authorItems.map((item) => (
              <tr
                key={item.id}
                className="cursor-pointer transition-colors hover:bg-gray-6/50"
                onClick={() => handleAuthorItemClick(item)}
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
                  <span className="shrink-0 text-sm text-gray-3">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex w-full flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">
          <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />

          <Button size="sm" className="w-full lg:w-[184px]">
            <Link href={`/community/post?type=author`}>글쓰기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

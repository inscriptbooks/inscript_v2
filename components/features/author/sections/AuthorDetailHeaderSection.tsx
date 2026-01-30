"use client";

import { Badge } from "@/components/ui/badge";
import { useGetAuthor } from "@/hooks/authors";
import { useLoader } from "@/hooks/common";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthorDetailHeaderSection() {
  const { authorId } = useParams<{ authorId: string }>();
  const { showLoader, hideLoader } = useLoader();
  const { data: author, isLoading } = useGetAuthor(authorId);

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  if (!author) {
    return null;
  }

  const { keyword, description } = author;

  return (
    <div className="full-bleed flex w-full flex-col border-b border-primary">
      {/* Bottom section with keywords and description */}
      <div className="mx-auto flex w-full max-w-[1440px] px-[20px] lg:px-[120px]">
        {/* Keywords section */}
        <div className="flex basis-1/3 flex-col gap-3 py-6 pr-5">
          <h2 className="text-xl font-bold text-gray-1">키워드</h2>
          <div className="flex flex-wrap gap-[6px]">
            {keyword.map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="outline"
                size="sm"
                className="rounded-[4px] border-primary px-[10px] py-2 text-sm text-primary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description section */}
        <div className="flex flex-1 flex-col gap-3 border-l border-primary p-6">
          <h2 className="text-xl font-bold text-gray-1">작가 소개</h2>
          <p className="line-clamp-5 text-base leading-6 tracking-[-0.32px] text-gray-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

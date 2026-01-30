"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PostType } from "@/models/post";
import { useAuthSession } from "@/hooks/auth";

interface CommunityPostButtonProps {
  type: PostType;
}

export default function CommunityPostButton({
  type,
}: CommunityPostButtonProps) {
  const { isAuthenticated, isLoading } = useAuthSession();

  // 로딩 중이거나 로그인되지 않은 경우 버튼 숨김
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <Link className="w-full md:w-auto" href={`/community/post?type=${type}`}>
      <Button size="sm" className="w-full lg:w-[184px]">
        글쓰기
      </Button>
    </Link>
  );
}

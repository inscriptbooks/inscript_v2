"use client";

import {
  MyPageHistoryWrittenCommentMemoSection,
  MyPageHistoryWrittenPostSection,
} from "@/components/features/mypage";
import { useUser } from "@/hooks/auth";

export default function MyPageHistoryWrittenPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const userId = user?.id;

  if (isUserLoading) {
    return (
      <section className="flex w-full flex-col items-center gap-14 py-14">
        <div className="text-center text-gray-500">로딩 중...</div>
      </section>
    );
  }

  if (!userId) {
    return (
      <section className="flex w-full flex-col items-center gap-14 py-14">
        <div className="text-center text-gray-500">로그인이 필요합니다.</div>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col items-center gap-14 py-14">
      <MyPageHistoryWrittenCommentMemoSection userId={userId} />
      <MyPageHistoryWrittenPostSection userId={userId} />
    </section>
  );
}

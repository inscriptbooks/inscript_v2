"use client";

import {
  MyPageHistoryLikesMemoSection,
  MyPageHistoryLikesPostSection,
} from "@/components/features/mypage";

export default function MyPageHistoryLikesPage() {
  return (
    <section className="flex w-full flex-col items-center gap-14 py-14">
      <MyPageHistoryLikesMemoSection />
      <MyPageHistoryLikesPostSection />
    </section>
  );
}

"use client";

import { QnaDashboard } from "@/components/features/dashboard";
import { Suspense } from "react";

export default function CommunityQnaPage() {
  return (
    <section className="flex w-full flex-1 flex-col pb-[60px]">
      <Suspense fallback={<div />}>
        <QnaDashboard type="qna" />
      </Suspense>
    </section>
  );
}

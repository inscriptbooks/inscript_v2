"use client";

import { PromotionDashboard } from "@/components/features/dashboard";
import { Suspense } from "react";

export default function CommunityPromotionPage() {
  return (
    <section className="flex w-full flex-1 flex-col pb-[60px]">
      <Suspense fallback={<div />}>
        <PromotionDashboard type="promotion" />
      </Suspense>
    </section>
  );
}

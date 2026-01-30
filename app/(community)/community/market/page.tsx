"use client";

import { MarketDashboard } from "@/components/features/dashboard";
import { Suspense } from "react";

export default function CommunityMarketPage() {
  return (
    <section className="flex w-full flex-1 flex-col pb-[60px]">
      <Suspense fallback={<div />}>
        <MarketDashboard type="market" />
      </Suspense>
    </section>
  );
}

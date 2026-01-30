import { RecruitDashboard } from "@/components/features/dashboard";
import { Suspense } from "react";

export default function CommunityRecruitPage() {
  return (
    <section className="flex w-full flex-1 flex-col pb-[60px]">
      <Suspense fallback={<div />}>
        <RecruitDashboard type="recruit" />
      </Suspense>
    </section>
  );
}

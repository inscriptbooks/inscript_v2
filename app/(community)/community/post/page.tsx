"use client";

import { Suspense } from "react";
import CommunityPostUploadSection from "@/components/features/community/sections/CommunityPostUploadSection";
import { SubHeader } from "@/components/layout";
import { SubHeaderType } from "@/components/layout/SubHeader";
import { useSearchParams } from "next/navigation";

function CommunityPostPageContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as SubHeaderType;

  return (
    <section className="flex h-full w-full flex-1 flex-col pb-[60px]">
      <SubHeader activeTab={type} />
      <CommunityPostUploadSection />
    </section>
  );
}

export default function CommunityPostPage() {
  return (
    <Suspense fallback={<div />}>
      <CommunityPostPageContent />
    </Suspense>
  );
}

"use client";

import Image from "next/image";
import { useIntroduction } from "@/hooks/introduction";

export default function AboutPage() {
  const { data: introData, isLoading } = useIntroduction();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Filter images by device and category
  const pcUpper = introData?.find((item) => item.device === "pc" && item.category === "upper");
  const pcLower = introData?.find((item) => item.device === "pc" && item.category === "lower");
  const mobileUpper = introData?.find((item) => item.device === "mobile" && item.category === "upper");
  const mobileLower = introData?.find((item) => item.device === "mobile" && item.category === "lower");

  return (
    <section className="flex w-full flex-col items-center">
      {/* Upper Image Section */}
      <div className="w-full">
        {/* PC Upper */}
        {pcUpper && (
          <div className="hidden w-full lg:block ">
            <img
              src={pcUpper.url}
              alt="Introduction Upper PC"
              className="w-full object-contain"
            />
          </div>
        )}
        {/* Mobile Upper */}
        {mobileUpper && (
          <div className="block w-full lg:hidden">
            <img
              src={mobileUpper.url}
              alt="Introduction Upper Mobile"
              className="w-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Lower Image Section */}
      <div className="w-full max-w-[1440px] mx-auto">
        {/* PC Lower */}
        {pcLower && (
          <div className="hidden w-full lg:block">
            <img
              src={pcLower.url}
              alt="Introduction Lower PC"
              className="w-full object-contain"
            />
          </div>
        )}
        {/* Mobile Lower */}
        {mobileLower && (
          <div className="block w-full lg:hidden">
            <img
              src={mobileLower.url}
              alt="Introduction Lower Mobile"
              className="w-full object-contain"
            />
          </div>
        )}
      </div>
    </section>
  );
}

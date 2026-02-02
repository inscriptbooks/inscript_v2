"use client";

import { useGetBanners } from "@/hooks/banners";
import { BannerType } from "@/models/banner";
import Image from "next/image";
import { useLoader } from "@/hooks/common";
import { useEffect, useCallback } from "react";

export default function MainAdBannerSection() {
  const today = new Date().toISOString().split("T")[0];
  const { data: banners, isLoading } = useGetBanners({
    type: BannerType.AD,
    isActive: true,
    date: today,
  });

  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  const handleBannerClick = useCallback((linkUrl?: string) => {
    if (!linkUrl) {
      return;
    }
    window.open(linkUrl, "_blank", "noopener,noreferrer");
  }, []);

  const displayBanners = banners?.slice(0, 3) || [];

  if (displayBanners.length === 0) {
    return null;
  }

  return (
    <section className="full-bleed pb-10 lg:pb-[145px]">
      <div className="mx-auto mt-[45px] max-w-[1440px] px-[20px] lg:px-[120px]">
        <div className="flex flex-col gap-3 lg:gap-10">
          {displayBanners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => handleBannerClick(banner.linkUrl)}
              className={`group relative w-full overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 ${banner.linkUrl ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" : "cursor-default"}`}
            >
              <div className="relative h-[260px] w-full">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="pointer-events-none select-none object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  draggable={false}
                  priority={index === 0}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { BannerPrevious, BannerNext } from "@/components/icons";
import { useGetBanners } from "@/hooks/banners";
import { BannerType } from "@/models/banner";
import { useLoader } from "@/hooks/common";

export default function MainBannerCarousel() {
  const today = new Date().toISOString().split("T")[0];
  const { data: banners, isLoading } = useGetBanners({
    type: BannerType.MAIN,
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    startPosRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - startPosRef.current.x);
    const dy = Math.abs(e.clientY - startPosRef.current.y);
    if (dx > 5 || dy > 5) {
      isDraggingRef.current = true;
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent, linkUrl: string) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (linkUrl) {
      window.open(linkUrl, "_blank", "noopener,noreferrer");
    }
  }, []);

  return (
    <Carousel
      className="full-bleed relative"
      opts={{
        loop: true,
        watchDrag: true,
        // NOTE: 스무스하고 느리게 넘어가게 반영 duration: 100
        duration: 100,
      }}
      // NOTE: 지연시간 10초 반영
      plugins={[Autoplay({ delay: 10000 })]}
      setApi={(instance) => {
        if (!instance) {
          return;
        }
        setApi(instance);
        setCurrentIndex(instance.selectedScrollSnap());
        instance.on("select", () => {
          setCurrentIndex(instance.selectedScrollSnap());
        });
      }}
    >
      {/* NOTE: 스무스하고 느리게 넘어가게 반영 duration-[2600ms] ease-in-out */}
      <CarouselContent className="duration-[2600ms] ease-in-out">
        {banners?.map((banner, index) => (
          <CarouselItem key={banner.id} className="pl-0">
            <div
              className={`relative w-full max-h-[600px] overflow-hidden transition-opacity duration-300 select-none ${banner.linkUrl ? "cursor-pointer hover:opacity-80" : ""}`}
              style={{ aspectRatio: "16/9", maxHeight: 600 }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onClick={(e) => banner.linkUrl && handleClick(e, banner.linkUrl)}
              draggable={false}
            >
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                // NOTE: object-center는 세로값 중앙정렬 통일. 미세하게 커스텀하려면 objectPosition: "center 56%" 사용
                // className="object-cover object-center select-none pointer-events-none"
                className="object-cover select-none pointer-events-none"
                style={{ objectPosition: "center 56%" }}
                fill
                priority={index === 0}
                draggable={false}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* NOTE: Pagination Dots 점.점.점 형식 반영 완료 */}
      {banners && banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 lg:bottom-8">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                api?.scrollTo(index);
              }}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`${index + 1}번째 배너로 이동`}
            />
          ))}
        </div>
      )}
    </Carousel>
  );
}

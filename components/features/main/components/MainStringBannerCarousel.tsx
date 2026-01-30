"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";

export default function MainStringBannerCarousel() {
  return (
    <Carousel
      className="full-bleed relative bg-primary"
      opts={{
        loop: true,
        watchDrag: false,
      }}
      plugins={[
        AutoScroll({
          speed: 1,
        }),
      ]}
    >
      <CarouselContent>
        {Array.from({ length: 3 }).map((_, i) => (
          <CarouselItem
            key={`text-banner-${i}`}
            className="relative max-w-[976px] pl-4"
          >
            <div className="relative h-[44px] w-full lg:h-[76px]">
              <Image
                src="/images/main-string-banner.webp"
                alt="Main String Banner"
                className="object-contain"
                priority
                fill
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

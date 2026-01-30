"use client";

import { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { MemoPreviewCard } from "@/components/features/memo";
import { useBreakpoint } from "@/hooks/common";
import AutoScroll from "embla-carousel-auto-scroll";
import { Memo } from "@/models/memo";

interface MainMemoCarouselProps {
  memoList: Memo[];
}

export default function MainMemoCarousel({ memoList }: MainMemoCarouselProps) {
  const { isAbove } = useBreakpoint();

  const carouselPlugins = useMemo(() => {
    if (isAbove("lg")) {
      return [
        AutoScroll({
          // NOTE: 더 느리게 해달라는 요청 속도1 에서 0.4로 낮춰서 반영
          // speed: 1,
          speed: 0.4,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
          stopOnFocusIn: false,
        }),
      ];
    } else {
      return [];
    }
  }, [isAbove]);

  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      plugins={carouselPlugins}
      className="absolute -top-[40px] mx-auto w-full"
    >
      <CarouselContent className="-ml-5">
        {memoList.map((memo) => (
          <CarouselItem key={memo.id} className="mb-1 basis-auto pl-5">
            <MemoPreviewCard
              memo={memo}
              className="h-[360px] w-[335px] shadow-[-4px_4px_4px_0_rgba(172,121,58,0.10)] xl:h-[380px] xl:w-[389px]"
              hideCreatedAt
              readonly
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

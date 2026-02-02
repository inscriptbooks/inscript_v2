"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useGetPrograms } from "@/hooks/programs";
import { useLoader } from "@/hooks/common";

export default function MainProgramSection() {
  const { data, isLoading } = useGetPrograms({
    status: "ongoing",
    isVisible: true,
  });

  const { showLoader, hideLoader } = useLoader();
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

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

  const handleClick = useCallback(
    (e: React.MouseEvent, programId: string | number) => {
      if (isDraggingRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      window.location.href = `/program/${programId}`;
    },
    [],
  );

  // event_date_time 최신 기준으로 정렬하고 5개만 가져오기
  const programs = data?.programs
    ?.filter((program) => !program.isDeleted && program.isVisible)
    .sort(
      (a, b) =>
        new Date(b.eventDateTime).getTime() -
        new Date(a.eventDateTime).getTime(),
    )
    .slice(0, 5);

  if (!programs || programs.length === 0) {
    return null;
  }

  return (
    <section className="full-bleed relative">
      <div className="absolute inset-0 w-full h-[270px] bg-gradient-to-b from-[#FAF6F1] to-[#FFFFFF]"></div>
      <div className="relative mx-auto max-w-[1440px]">
        <div className="relative mx-auto mt-[35px] flex w-full max-w-[1440px] flex-col gap-3 px-[20px] pb-[60px] pt-20 lg:px-[120px] xl:flex-row xl:items-center xl:pb-[80px]">
          <div className="flex w-full flex-col gap-[10px]">
            <h2 className="font-serif text-2xl font-bold text-primary">
              지금 신청할 수 있는 프로그램
            </h2>
            <p className="w-full font-pretendard font-normal text-gray-1">
              인스크립트 프로그램에 참여하세요
            </p>
          </div>
          <div className="font-serif text-[24px] lg:text-[44px] font-bold leading-[130%] text-[#F4E4D6]">
            Programme
          </div>
        </div>

        <div className="relative px-[20px] pb-6 lg:pb-20 lg:px-[120px]">
          <Carousel
            className="relative"
            opts={{
              loop: true,
              watchDrag: true,
              duration: 80,
            }}
            plugins={[Autoplay({ delay: 4000 })]}
            setApi={(api) => {
              if (!api) {
                return;
              }
              setCarouselApi(api);
              setCurrentIndex(api.selectedScrollSnap());
              api.on("select", () => {
                setCurrentIndex(api.selectedScrollSnap());
              });
            }}
          >
            <CarouselContent className="duration-[2000ms] ease-in-out">
              {programs.map((program, index) => (
                <CarouselItem key={program.id} className="pl-0">
                  <div
                    className="relative aspect-video min-h-[179px] w-full transition-opacity duration-300 select-none cursor-pointer hover:opacity-80"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onClick={(e) => handleClick(e, program.id)}
                    draggable={false}
                  >
                    <Image
                      src={program.thumbnailUrl}
                      alt={program.title}
                      className="object-cover select-none pointer-events-none"
                      fill
                      priority={index === 0}
                      draggable={false}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {programs.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 lg:bottom-8">
                {programs.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      carouselApi?.scrollTo(index);
                    }}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-6 bg-white"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`${index + 1}번째 프로그램으로 이동`}
                  />
                ))}
              </div>
            )}
          </Carousel>
        </div>
      </div>
    </section>
  );
}

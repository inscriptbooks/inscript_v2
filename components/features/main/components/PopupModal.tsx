"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Popup {
  id: number;
  title: string;
  detail_image_url: string | null;
  link_url: string | null;
  is_visible: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string | null;
  close_method: "today" | "days" | "never" | null;
  close_days: number | null;
}

export default function PopupModal() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);
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

  const handleImageClick = useCallback(
    (e: React.MouseEvent, linkUrl: string | null) => {
      if (isDraggingRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (linkUrl) {
        window.open(linkUrl, "_blank", "noopener,noreferrer");
      }
    },
    []
  );

  useEffect(() => {
    fetchActivePopups();
  }, []);

  // Carousel API로 인덱스 동기화
  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const fetchActivePopups = async () => {
    try {
      const response = await fetch("/api/popups/active");
      const result = await response.json();

      if (result.success && result.data) {
        const filteredPopups = filterPopupsByLocalStorage(result.data);
        if (filteredPopups.length > 0) {
          setPopups(filteredPopups);
          setIsVisible(true);
        }
      }
    } catch (error) {
      // Error silently handled
    }
  };

  const filterPopupsByLocalStorage = (popupList: Popup[]): Popup[] => {
    return popupList.filter((popup) => {
      const storageKey = `popup_${popup.id}_closed`;
      const closedData = localStorage.getItem(storageKey);

      if (!closedData) return true;

      const closedInfo = JSON.parse(closedData);
      const closedDate = new Date(closedInfo.closedAt);
      const now = new Date();

      // close_method에 따라 처리
      if (popup.close_method === "today") {
        // 오늘 하루 안 보기 - 날짜가 다르면 다시 표시
        return closedDate.toDateString() !== now.toDateString();
      } else if (popup.close_method === "days" && popup.close_days) {
        // N일 동안 안 보기
        const diffTime = now.getTime() - closedDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > popup.close_days;
      } else if (popup.close_method === "never") {
        // 다시 보지 않기
        return false;
      }

      return true;
    });
  };

  const handleClose = () => {
    if (popups.length === 0) return;

    // 체크박스가 체크되어 있으면 모든 팝업을 localStorage에 저장
    if (doNotShowAgain) {
      popups.forEach((popup) => {
        if (popup.close_method) {
          const storageKey = `popup_${popup.id}_closed`;
          const closedInfo = {
            closedAt: new Date().toISOString(),
            closeMethod: popup.close_method,
            closeDays: popup.close_days,
          };
          localStorage.setItem(storageKey, JSON.stringify(closedInfo));
        }
      });
    }

    // 모든 팝업을 한 번에 닫기
    setIsVisible(false);
    setPopups([]);
    setCurrentIndex(0);
    setDoNotShowAgain(false);
  };

  const getCloseMethodLabel = (popup: Popup): string => {
    if (!popup.close_method) return "";

    switch (popup.close_method) {
      case "today":
        return "오늘 하루 안 보기";
      case "days":
        return `${popup.close_days}일 동안 안 보기`;
      case "never":
        return "다시 보지 않기";
      default:
        return "";
    }
  };

  if (!isVisible || popups.length === 0) {
    return null;
  }

  const currentPopup = popups[currentIndex];

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 z-[9998] bg-black/50 "
        onClick={handleClose}
      />

      {/* 모달 */}
      <div className="fixed left-1/2 top-1/2 z-[9999] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-[24px]">
        {/* 이미지 영역 */}
        <div className="relative w-[80vw] overflow-hidden rounded-t-[12px] bg-white md:w-[50vw]">
          <Carousel
            opts={{
              loop: true,
              watchDrag: true,
              duration: 80,
            }}
            plugins={[Autoplay({ delay: 4000 })]}
            setApi={setApi}
          >
            <CarouselContent className="duration-[2000ms] ease-in-out">
              {popups.map((popup, index) => (
                <CarouselItem key={popup.id} className="pl-0">
                  <div
                    className={`relative aspect-[16/9] w-full select-none ${popup.link_url ? "cursor-pointer" : ""}`}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onClick={(e) => handleImageClick(e, popup.link_url)}
                    draggable={false}
                  >
                    {popup.detail_image_url ? (
                      <Image
                        src={popup.detail_image_url}
                        alt={popup.title || "팝업"}
                        fill
                        className="object-cover select-none pointer-events-none"
                        priority={index === 0}
                        draggable={false}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200">
                        <span className="text-gray-500">이미지 없음</span>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* 슬라이드 인디케이터 */}
            {popups.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {popups.map((_, index) => (
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
                    aria-label={`${index + 1}번째 팝업으로 이동`}
                  />
                ))}
              </div>
            )}
          </Carousel>
        </div>

        {/* 하단 컨트롤 영역 */}
        <div className="flex w-[80vw] items-center justify-between rounded-b-[12px] bg-white px-6 py-4 md:w-[50vw]">
          {/* 좌측: 체크박스 */}
          {currentPopup.close_method && (
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={doNotShowAgain}
                onChange={(e) => setDoNotShowAgain(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-primary"
              />
              <span className="font-pretendard text-sm font-medium text-gray-700">
                {getCloseMethodLabel(currentPopup)}
              </span>
            </label>
          )}

          {/* 우측: 닫기 버튼 */}
          <button
            onClick={handleClose}
            className="font-pretendard text-sm font-bold text-gray-700 hover:text-primary"
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
}

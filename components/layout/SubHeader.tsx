"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

interface SubHeaderProps {
  activeTab?: string;
  className?: string;
}

export type SubHeaderType = (typeof navigationItems)[number]["id"];

const navigationItems = [
  { id: "home", label: "HOME", href: "/community" },
  { id: "news", label: "인크소식", href: "/community/news" },
  { id: "recruit", label: "함께하기", href: "/community/recruit" },
  { id: "market", label: "사고팔기", href: "/community/market" },
  { id: "qna", label: "홍보하기", href: "/community/qna" },
  { id: "promotion", label: "얘기하기", href: "/community/promotion" },
  { id: "author", label: "작가 커뮤니티", href: "/community/author" },
] as const;

export default function SubHeader({
  activeTab = "home",
  className,
}: SubHeaderProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
  };

  const NavLink = ({
    item,
    isActive,
  }: {
    item: NavItem;
    isActive: boolean;
  }) => (
    <Link
      href={item.href}
      onClick={() => handleTabClick(item.id)}
      className={cn(
        "relative flex h-10 items-center justify-center whitespace-nowrap px-2.5 py-2.5 transition-colors duration-200",
        "md:flex-1",
        isActive && "border-b border-primary"
      )}
    >
      <span
        className={cn(
          "text-center font-pretendard text-base font-normal leading-5",
          isActive ? "font-medium text-primary" : "text-orange-2"
        )}
      >
        {item.label}
      </span>
    </Link>
  );

  return (
    <div className={cn("full-bleed w-full border-b border-red-3", className)}>
      <div className="mx-auto max-w-[1440px]">
        {/* Desktop Navigation */}
        <div className="hidden px-[20px] md:flex lg:px-[120px]">
          <div className="flex h-10 w-full">
            {navigationItems.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                isActive={currentTab === item.id}
              />
            ))}
          </div>
        </div>

        {/* Mobile Navigation with Carousel */}
        <div className="block px-[20px] md:hidden lg:px-[120px]">
          <Carousel
            opts={{
              align: "start",
              loop: false,
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-0 h-10">
              {navigationItems.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="min-w-fit basis-auto pl-0"
                >
                  <div className="h-10">
                    <NavLink item={item} isActive={currentTab === item.id} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

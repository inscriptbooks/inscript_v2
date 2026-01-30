"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Security,
  Profile,
  Alert,
  Crown,
  Pen,
  Script,
  Cart,
  Purchases,
} from "@/components/icons";
import { usePathname } from "next/navigation";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
    size?: number;
    color?: string;
  }>;
}

interface MypageSubHeaderProps {
  activeTab?: string;
  className?: string;
}

const navigationItems: NavItem[] = [
  { id: "mypage", label: "계정 관리", href: "/mypage", icon: Security },
  { id: "profile", label: "프로필", href: "/mypage/profile", icon: Profile },
  {
    id: "notification",
    label: "알림",
    href: "/mypage/notification",
    icon: Alert,
  },
  // NOTE: 마이페이지에서 멤버십 신청 기능은 일단 HIDE
  // {
  //   id: "membership",
  //   label: "멤버십",
  //   href: "/mypage/membership",
  //   icon: Crown,
  // },
  {
    id: "author-apply",
    label: "작가 회원 신청",
    href: "/mypage/author-apply",
    icon: Pen,
  },
  { id: "history", label: "나의 기록", href: "/mypage/history", icon: Script },
  { id: "cart", label: "장바구니", href: "/mypage/cart", icon: Cart },
  {
    id: "purchases",
    label: "구매목록",
    href: "/mypage/purchases",
    icon: Purchases,
  },
];

export default function MypageSubHeader({
  activeTab = "mypage",
  className,
}: MypageSubHeaderProps) {
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
  };

  useEffect(() => {
    const tab = pathname.split("/")[2];
    setCurrentTab(tab || "mypage");
  }, [pathname]);

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
        "relative flex items-center gap-3 px-2.5 py-2 transition-colors duration-200",
        "whitespace-nowrap"
      )}
    >
      <item.icon
        size={item.id === "mypage" ? 26 : 24}
        color={isActive ? "#911A00" : "#6D6D6D"}
      />
      <span
        className={cn(
          "font-pretendard text-base font-normal leading-6 tracking-[-0.32px]",
          isActive ? "text-primary" : "text-gray-3"
        )}
      >
        {item.label}
      </span>
    </Link>
  );

  return (
    <>
      <div className="full-bleed mt-11 flex justify-center border-b border-primary lg:mt-20">
        <span className="mb-5 font-serif text-xl font-bold text-primary lg:text-[28px]">
          마이페이지
        </span>
      </div>
      <div className={cn("w-full border-b border-primary", className)}>
        <div className="mx-auto max-w-[1440px]">
          {/* Desktop Navigation */}
          <div className="hidden px-[20px] py-3 md:flex lg:px-[120px]">
            <div className="flex h-10 w-full items-center justify-between">
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
          <div className="block px-[20px] py-3 md:hidden lg:px-[120px]">
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
    </>
  );
}

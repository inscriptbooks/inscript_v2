"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

interface MypageNavSubBarProps {
  activeTab?: string;
  className?: string;
}

const navigationItems: NavItem[] = [
  { id: "history", label: "내가 등록한", href: "/mypage/history" },
  { id: "written", label: "내가 작성한", href: "/mypage/history/written" },
  { id: "likes", label: "좋아요", href: "/mypage/history/likes" },
  { id: "scraps", label: "스크랩", href: "/mypage/history/scraps" },
];

export default function MypageNavSubBar({
  activeTab,
  className,
}: MypageNavSubBarProps) {
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
  };

  useEffect(() => {
    const tab = pathname.split("/")[3];
    setCurrentTab(tab || "history");
  }, [pathname]);

  const NavPill = ({
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
        "flex items-center justify-center gap-2.5 rounded-full px-5 py-2 transition-colors duration-200",
        "whitespace-nowrap",
        isActive
          ? "bg-primary text-white"
          : "bg-red-3 text-orange-2 hover:bg-red-3/80"
      )}
    >
      <span
        className={cn(
          "font-pretendard text-base leading-6 tracking-[-0.32px]",
          isActive ? "font-bold" : "font-normal"
        )}
      >
        {item.label}
      </span>
    </Link>
  );

  return (
    <div
      className={cn("flex w-full justify-center px-[120px] pb-6", className)}
    >
      <div className="flex items-center gap-3">
        {navigationItems.map((item) => (
          <NavPill
            key={item.id}
            item={item}
            isActive={currentTab === item.id}
          />
        ))}
      </div>
    </div>
  );
}

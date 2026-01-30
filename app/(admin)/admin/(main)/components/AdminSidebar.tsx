"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MenuItem {
  title: string;
  subItems?: string[];
}

const menuItems: MenuItem[] = [
  {
    title: "대시보드",
  },
  {
    title: "회원 관리",
    subItems: ["회원 관리", "회원 제재 이력", "작가 신청 이력"],
  },
  {
    title: "희곡 작가 관리",
    subItems: ["희곡 관리", "작가 관리"],
  },
  {
    title: "프로그램 관리",
    subItems: ["프로그램 목록", "프로그램 예약"],
    // subItems: ['프로그램 목록'],
  },
  {
    title: "멤버십 관리",
    subItems: ["멤버십 페이지 관리"],
  },
  {
    title: "게시판 관리",
    subItems: ["커뮤니티 관리", "댓글 관리", "메모 관리", "신고 관리"],
  },
  {
    title: "알림 관리",
    // subItems: ["시스템 알림 발송", "알림 템플릿 관리"],
    subItems: ["시스템 알림 발송"],
  },
  {
    title: "회원별 참여 패턴",
  },
  {
    title: "사이트 설정",
    subItems: ["메인 구성 관리", "팝업 관리", "관리자 계정/권한"],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>([]);

  const routeMap: Record<string, string> = {
    대시보드: "/admin/dashboard",
    "회원 관리": "/admin/members",
    "회원 제재 이력": "/admin/members/sanctions",
    "작가 신청 이력": "/admin/members/author-applications",
    // '멤버십 구독관리': '/admin/members/membership-subscriptions',
    "희곡 관리": "/admin/plays",
    "작가 관리": "/admin/writers",
    "프로그램 목록": "/admin/programs",
    "프로그램 예약": "/admin/program-reservations",
    "멤버십 페이지 관리": "/admin/membership-content",
    "커뮤니티 관리": "/admin/community2",
    "댓글 관리": "/admin/comments",
    "메모 관리": "/admin/memos",
    "신고 관리": "/admin/reports",
    "메인 구성 관리": "/admin/settings/main-config",
    "시스템 알림 발송": "/admin/notifications/send",
    // "알림 템플릿 관리": "/admin/notifications/template",
    "회원별 참여 패턴": "/admin/participation-patterns",
    "팝업 관리": "/admin/settings/popups",
    "관리자 계정/권한": "/admin/settings/admin-accounts-permissions",
  };

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title)
        ? prev.filter((section) => section !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="flex h-full w-[260px] flex-col gap-y-3 border-r border-gray-5 bg-white py-6">
      {menuItems.map((item) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isOpen = openSections.includes(item.title);

        if (!hasSubItems) {
          const href = routeMap[item.title] ?? "#";
          const isActive = pathname === href;
          return (
            <div
              key={item.title}
              className="flex items-center border-b border-gray-5 px-8 py-2.5"
            >
              <Link href={href} className="flex-1">
                <div
                  className={`text-lg font-semibold leading-6 ${
                    isActive ? "text-primary" : "text-gray-1"
                  }`}
                >
                  {item.title}
                </div>
              </Link>
            </div>
          );
        }

        return (
          <Collapsible
            key={item.title}
            open={isOpen}
            onOpenChange={() => toggleSection(item.title)}
          >
            <div className="flex flex-col">
              <CollapsibleTrigger className="flex items-center justify-between border-b border-gray-5 px-8 py-2.5 transition-colors hover:bg-gray-6/50">
                <div className="text-lg font-semibold leading-6 text-gray-1">
                  {item.title}
                </div>
                <ChevronDown
                  className={`h-6 w-6 text-gray-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col">
                  {item.subItems?.map((subItem) => {
                    const href = routeMap[subItem] ?? "#";
                    const isActive = pathname === href;
                    return (
                      <Link
                        href={href}
                        key={subItem}
                        className="flex cursor-pointer items-center gap-2.5 px-8 py-2.5 transition-colors hover:bg-gray-6/50"
                      >
                        <div
                          className={`text-base font-normal leading-6 tracking-[-0.32px] ${
                            isActive ? "text-primary" : "text-gray-3"
                          }`}
                        >
                          {subItem}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}

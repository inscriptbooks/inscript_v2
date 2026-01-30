"use client";

import { useState, MouseEvent } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown } from "../icons";

export default function ClientGlobalNavigationBar() {
  const [programDropdownOpen, setProgramDropdownOpen] = useState(false);
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false);

  return (
    <nav className="relative hidden h-full max-w-[627px] flex-shrink-0 items-center justify-around lg:flex lg:flex-1">
      {/* 희곡 */}
      <Link href="/play" className="group flex h-full w-fit items-center">
        <span className="font-semibold text-gray-3 transition-colors group-hover:text-primary">
          희곡
        </span>
      </Link>
      {/* 작가 */}
      <Link href="/author" className="group flex h-full w-fit items-center">
        <span className="font-semibold text-gray-3 transition-colors group-hover:text-primary">
          작가
        </span>
      </Link>
      {/* 멤버십 */}
      <Link href="/membership" className="group flex h-full w-fit items-center">
        <span className="font-semibold text-gray-3 transition-colors group-hover:text-primary">
          멤버십
        </span>
      </Link>
      {/* 프로그램 */}
      <Popover open={programDropdownOpen} onOpenChange={setProgramDropdownOpen}>
        <PopoverTrigger
          className="group flex h-full w-fit cursor-pointer items-center gap-2.5 outline-none"
          onMouseEnter={() => setProgramDropdownOpen(true)}
          onMouseLeave={() => setProgramDropdownOpen(false)}
        >
          <span
            className={cn(
              "font-semibold text-gray-3 transition-colors group-hover:text-primary",
              programDropdownOpen && "text-primary"
            )}
          >
            프로그램
          </span>
          <ChevronDown
            className={cn(
              "rotate-180 text-gray-3 outline-none transition-all group-hover:text-primary",
              programDropdownOpen && "rotate-0 text-primary"
            )}
          />
        </PopoverTrigger>

        <PopoverContent
          className="flex w-fit flex-col gap-2.5 p-5 shadow-[0_4px_10px_-5px_rgba(0,0,0,0.25)]"
          sideOffset={0}
          onMouseEnter={() => setProgramDropdownOpen(true)}
          onMouseLeave={() => setProgramDropdownOpen(false)}
        >
          <Link
            href="/program"
            className="font-medium transition-colors hover:text-primary"
          >
            지금 참여하기
          </Link>
          <Link
            href="/program?filter=closed"
            className="font-medium transition-colors hover:text-primary"
          >
            지난 프로그램
          </Link>
        </PopoverContent>
      </Popover>
      {/* 커뮤니티 */}
      <Popover
        open={communityDropdownOpen}
        onOpenChange={setCommunityDropdownOpen}
      >
        <PopoverTrigger
          className="group flex h-full w-fit cursor-pointer items-center gap-2.5 outline-none"
          onMouseEnter={() => setCommunityDropdownOpen(true)}
          onMouseLeave={() => setCommunityDropdownOpen(false)}
        >
          <span
            className={cn(
              "font-semibold text-gray-3 transition-colors group-hover:text-primary",
              communityDropdownOpen && "text-primary"
            )}
          >
            커뮤니티
          </span>
          <ChevronDown
            className={cn(
              "rotate-180 text-gray-3 outline-none transition-all group-hover:text-primary",
              communityDropdownOpen && "rotate-0 text-primary"
            )}
          />
        </PopoverTrigger>

        <PopoverContent
          className="flex w-fit flex-col gap-2.5 p-5 shadow-[0_4px_10px_-5px_rgba(0,0,0,0.25)]"
          sideOffset={0}
          onMouseEnter={() => setCommunityDropdownOpen(true)}
          onMouseLeave={() => setCommunityDropdownOpen(false)}
        >
          <Link
            href="/community"
            className="font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/community/news"
            className="font-medium transition-colors hover:text-primary"
          >
            인크소식
          </Link>
          <Link
            href="/community/recruit"
            className="font-medium transition-colors hover:text-primary"
          >
            함께하기
          </Link>
          <Link
            href="/community/market"
            className="font-medium transition-colors hover:text-primary"
          >
            사고팔기
          </Link>
          <Link
            href="/community/qna"
            className="font-medium transition-colors hover:text-primary"
          >
            홍보하기
          </Link>
          <Link
            href="/community/promotion"
            className="font-medium transition-colors hover:text-primary"
          >
            얘기하기
          </Link>
          <Link
            href="/community/author"
            className="font-medium transition-colors hover:text-primary"
          >
            작가 커뮤니티
          </Link>
        </PopoverContent>
      </Popover>
      {/* 인스크립트 */}
      <Link href="/about" className="group flex h-full w-fit items-center">
        <span className="font-semibold text-gray-3 transition-colors group-hover:text-primary">
          인스크립트
        </span>
      </Link>
      {/* 문의 */}
      <Link href="/contact" className="group flex h-full w-fit items-center">
        <span className="font-semibold text-gray-3 transition-colors group-hover:text-primary">
          문의
        </span>
      </Link>
      {/* SHOP */}
      <Link
        href="https://inscript.sixshop.site"
        target="_blank"
        rel="noreferrer noopener"
        aria-label="인스크립트 굿즈, 소품샵으로 이동"
        className="group flex h-full w-fit items-center"
      >
        <span className="font-semibold text-gray-3 transition-colors group-hover:text-primary">
          SHOP
        </span>
      </Link>
    </nav>
  );
}

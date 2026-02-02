"use client";

import { MouseEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, ChevronDown, Close, Mail, Profile } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLogout, useUser } from "@/hooks/auth";
import { HeaderLoginButton } from "@/components/common";

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClientSideNavigationBar({
  isOpen,
  onClose,
}: NavigationProps) {
  const [isProgramExpanded, setIsProgramExpanded] = useState(false);
  const [isCommunityExpanded, setIsCommunityExpanded] = useState(false);
  const programId = "mobile-nav-program";
  const communityId = "mobile-nav-community";
  const [profilePopoverOpen, setProfilePopoverOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const { logout, isLoading } = useLogout();

  const handleMobileMenuClose = () => {
    setIsProgramExpanded(false);
    setIsCommunityExpanded(false);
    setProfilePopoverOpen(false);
    onClose();
  };

  const handleMyPageClick = () => {
    setProfilePopoverOpen(false);
    handleMobileMenuClose();
    router.push("/mypage");
  };

  const handleLogoutClick = () => {
    setProfilePopoverOpen(false);
    handleMobileMenuClose();
    logout();
  };

  return (
    <div
      className={cn(
        "z-999 fixed inset-0 bg-primary transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full",
      )}
    >
      <div className="flex h-full w-full flex-col p-8">
        {/* Header */}
        <div className="mb-6 flex w-full items-center justify-between">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Alert Icon */}
              <Link
                href="/messages/notifications"
                className="relative h-6 w-6 flex-shrink-0"
              >
                <Alert
                  hasNotification
                  color="white"
                  circleColor="var(--gray-01)"
                />
              </Link>

              {/* Mail Icon */}
              <Link
                href="/messages/direct"
                className="relative h-6 w-6 flex-shrink-0"
              >
                <Mail
                  color="white"
                  circleColor="var(--gray-01)"
                  hasNotification
                />
              </Link>

              {/* Profile Icon */}
              <Popover
                open={profilePopoverOpen}
                onOpenChange={setProfilePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <button type="button" className="h-6 w-6 flex-shrink-0">
                    <Profile color="white" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-40 bg-white p-2" align="center">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={handleMyPageClick}
                      className="w-full rounded px-3 py-2 text-left text-sm font-medium text-gray-1 transition-colors hover:bg-orange-4"
                    >
                      마이페이지
                    </button>
                    <button
                      type="button"
                      onClick={handleLogoutClick}
                      disabled={isLoading}
                      className="w-full rounded px-3 py-2 text-left text-sm font-medium text-gray-1 transition-colors hover:bg-orange-4 disabled:opacity-50"
                    >
                      로그아웃
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <HeaderLoginButton />
          )}

          <button
            onClick={handleMobileMenuClose}
            className="flex h-8 w-8 items-center justify-center"
          >
            <Close color="white" size={32} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-1 flex-col gap-0.5">
          {/* 희곡 */}
          <Link href="/play" className="w-fit py-2.5" onClick={onClose}>
            <span className="text-2xl font-semibold leading-8 text-white">
              희곡
            </span>
          </Link>

          {/* 작가 */}
          <Link href="/author" className="w-fit py-2.5" onClick={onClose}>
            <span className="text-2xl font-semibold leading-8 text-white">
              작가
            </span>
          </Link>

          {/* 멤버십 */}
          <Link
            href="/membership"
            className="w-fit py-2.5 hidden"
            onClick={onClose}
          >
            <span className="text-2xl font-semibold leading-8 text-white">
              멤버십
            </span>
          </Link>

          {/* 프로그램 */}
          {/* FIXME: 프로그램 하위 네비게이션 구체화 필요 */}
          <Collapsible
            className="flex flex-col"
            open={isProgramExpanded}
            onOpenChange={setIsProgramExpanded}
          >
            <CollapsibleTrigger asChild>
              <div className="flex w-fit cursor-pointer items-center gap-2.5 py-2.5">
                <span className="text-2xl font-semibold leading-8 text-white">
                  프로그램
                </span>
                <ChevronDown
                  className={cn(
                    "rotate-180 text-white transition-transform",
                    isProgramExpanded && "rotate-0",
                  )}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent id={programId}>
              <div className="flex flex-col">
                <Link
                  href="/program"
                  className="flex w-fit items-center py-2 pl-[14px]"
                  onClick={onClose}
                >
                  <span className="text-lg font-medium leading-5 text-white">
                    지금 참여하기
                  </span>
                </Link>
                <Link
                  href="/program?filter=closed"
                  className="flex w-fit items-center py-2 pl-[14px]"
                  onClick={onClose}
                >
                  <span className="text-lg font-medium leading-5 text-white">
                    지난 프로그램
                  </span>
                </Link>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* 커뮤니티 */}
          {/* FIXME: 커뮤니티 하위 네비게이션 구체화 필요 */}
          <Collapsible
            className="flex flex-col"
            open={isCommunityExpanded}
            onOpenChange={setIsCommunityExpanded}
          >
            <CollapsibleTrigger asChild>
              <div className="flex w-fit cursor-pointer items-center gap-2.5 py-2.5">
                <span className="text-2xl font-semibold leading-8 text-white">
                  커뮤니티
                </span>
                <ChevronDown
                  className={cn(
                    "rotate-180 text-white transition-transform",
                    isCommunityExpanded && "rotate-0",
                  )}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent id={communityId}>
              <div className="flex flex-col">
                <Link
                  href="/community"
                  className="flex w-fit items-center py-2 pl-[14px]"
                  onClick={onClose}
                >
                  <span className="text-lg font-medium leading-5 text-white">
                    Home
                  </span>
                </Link>
                <Link
                  href="/community/news"
                  className="flex w-fit items-center py-2 pl-[14px]"
                  onClick={onClose}
                >
                  <span className="text-lg font-medium leading-5 text-white">
                    인크소식
                  </span>
                </Link>
                <Link
                  href="/community/recruit"
                  className="flex w-fit items-center py-2 pl-[14px]"
                  onClick={onClose}
                >
                  <span className="text-lg font-medium leading-5 text-white">
                    함께하기
                  </span>
                </Link>
                <Link
                  href="/community/market"
                  className="flex w-fit items-center py-2 pl-[14px]"
                  onClick={onClose}
                >
                  <span className="text-lg font-medium leading-5 text-white">
                    사고팔기
                  </span>
                </Link>
                <Link
                  href="/community/qna"
                  className="flex w-fit items-center py-2 pl-[14px]"
                  onClick={onClose}
                >
                  <span className="text-lg font-medium leading-5 text-white">
                    홍보하기
                  </span>
                </Link>
                <Link
                  href="/community/promotion"
                  className="flex w-fit items-center py-2 pl-[14px]"
                  onClick={onClose}
                >
                  <span className="text-lg font-medium leading-5 text-white">
                    얘기하기
                  </span>
                </Link>
                <Link
                  href="/community/author"
                  className="flex w-fit items-center py-2 pl-[14px]"
                  onClick={onClose}
                >
                  <span className="text-lg font-medium leading-5 text-white">
                    작가 커뮤니티
                  </span>
                </Link>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* 인스크립트 */}
          <Link href="/about" className="w-fit py-2.5" onClick={onClose}>
            <span className="text-2xl font-semibold leading-8 text-white">
              인스크립트
            </span>
          </Link>

          {/* 문의 */}
          <Link href="/contact" className="w-fit py-2.5" onClick={onClose}>
            <span className="text-2xl font-semibold leading-8 text-white">
              문의
            </span>
          </Link>

          {/* SHOP */}
          <Link
            href="https://smartstore.naver.com/inscript"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="인스크립트 굿즈, 소품샵으로 이동"
            className="w-fit py-2.5"
            onClick={onClose}
          >
            <span className="text-2xl font-semibold leading-8 text-white">
              SHOP
            </span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

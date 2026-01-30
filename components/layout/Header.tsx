"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Hamburger, Alert, Mail, Profile } from "@/components/icons";
import {
  ClientGlobalNavigationBar,
  ClientSideNavigationBar,
} from "@/components/layout";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLogout, useUser } from "@/hooks/auth";
import { useUnreadNotifications } from "@/hooks/notifications";
import { HeaderLoginButton } from "@/components/common";

export default function Header() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [profilePopoverOpen, setProfilePopoverOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const { logout, isLoading } = useLogout();
  const { hasUnread } = useUnreadNotifications();

  const handleSideMenuOpen = () => {
    setSideMenuOpen(true);
  };

  const handleSideMenuClose = () => {
    setSideMenuOpen(false);
  };

  const handleMyPageClick = () => {
    setProfilePopoverOpen(false);
    router.push("/mypage");
  };

  const handleLogoutClick = () => {
    setProfilePopoverOpen(false);
    logout();
  };

  return (
    <header className="sticky left-0 top-0 z-50 w-full bg-background">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-[20px] lg:h-[84px] lg:px-[120px]">
        {/* Logo */}
        <Link
          href="/"
          className="h-[22px] w-[97px] flex-shrink-0 lg:h-[36px] lg:w-[160px]"
        >
          <Image
            src="/images/header-logo.webp"
            alt="header-logo"
            width={97}
            height={22}
            className="h-full w-full object-contain"
          />
        </Link>

        {/* PC Navigation */}
        <ClientGlobalNavigationBar />

        {/* Right Side Icons */}
        {isAuthenticated ? (
          <div className="hidden flex-shrink-0 items-center justify-end gap-3 lg:flex">
            <Link
              href="/messages/notifications"
              className="relative h-6 w-6 flex-shrink-0"
            >
              {hasUnread ? (
                <Alert hasNotification={true} size={24} />
              ) : (
                <Image
                  src="/images/alert_no_dot.svg"
                  alt="알림"
                  width={24}
                  height={24}
                />
              )}
            </Link>

            <Link
              href="/messages/direct"
              className="relative h-6 w-6 flex-shrink-0"
            >
              <Mail />
            </Link>

            <Popover
              open={profilePopoverOpen}
              onOpenChange={setProfilePopoverOpen}
            >
              <PopoverTrigger asChild>
                <button type="button" className="h-6 w-6 flex-shrink-0">
                  <Profile />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-40 rounded border p-2"
                align="center"
              >
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
          <div className="hidden flex-shrink-0 lg:flex">
            <HeaderLoginButton />
          </div>
        )}

        <button
          type="button"
          className="lg:hidden"
          onClick={handleSideMenuOpen}
        >
          <Hamburger />
        </button>

        {/* Mobile Navigation */}
        <ClientSideNavigationBar
          isOpen={sideMenuOpen}
          onClose={handleSideMenuClose}
        />
      </div>
    </header>
  );
}

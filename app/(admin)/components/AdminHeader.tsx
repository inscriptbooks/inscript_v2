"use client";
import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthSession } from "@/hooks/auth";
import { createClient } from "@/lib/supabase/client";
import PasswordChangeModal from "../admin/(auth)/login/components/PasswordChangeModal";

function AdminHeader() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter();
  const { authUser, isLoading } = useAuthSession();
  const supabase = createClient();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      setIsOpen(false);

      // 클라이언트 측에서 직접 signOut 호출
      await supabase.auth.signOut();

      // 서버 측 로그아웃도 호출 (쿠키 정리)
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/admin");
    } catch (error) {
      // Error silently handled
    }
  };

  // 로그인하지 않은 경우 프로필 표시하지 않음
  if (isLoading) {
    return (
      <div
        className="absolute left-1/2 top-0 z-50 flex h-[80px] w-full -translate-x-1/2 transform items-center justify-between bg-white px-10 py-6"
        style={{ boxShadow: "0 4px 12px 0 rgba(83, 46, 14, 0.12)" }}
        data-component-name="header"
      >
        <div
          className="flex flex-1 items-center gap-1"
          data-layer-name="inscript2025_newlogotype"
        >
          <Image
            src="/images/inscript_logo_basic_red-1.webp"
            alt="Frame 1707482462"
            width={160.72}
            height={32.28}
            className="flex items-center gap-1"
          />
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div
        className="absolute left-1/2 top-0 z-50 flex h-[80px] w-full -translate-x-1/2 transform items-center justify-between bg-white px-10 py-6"
        style={{ boxShadow: "0 4px 12px 0 rgba(83, 46, 14, 0.12)" }}
        data-component-name="header"
      >
        <div
          className="flex flex-1 items-center gap-1"
          data-layer-name="inscript2025_newlogotype"
        >
          <Image
            src="/images/inscript_logo_basic_red-1.webp"
            alt="Frame 1707482462"
            width={160.72}
            height={32.28}
            className="flex items-center gap-1"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute left-1/2 top-0 z-50 flex h-[80px] w-full -translate-x-1/2 transform items-center justify-between bg-white px-10 py-6"
      style={{ boxShadow: "0 4px 12px 0 rgba(83, 46, 14, 0.12)" }}
      data-component-name="header"
    >
      <div
        className="flex flex-1 items-center gap-1"
        data-layer-name="inscript2025_newlogotype"
      >
        <Image
          src="/images/inscript_logo_basic_red-1.webp"
          alt="Frame 1707482462"
          width={160.72}
          height={32.28}
          className="flex items-center gap-1"
        />
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="profile-wrapper flex cursor-pointer items-center gap-2">
            <Image
              src="/images_jj/profile.webp"
              alt="search"
              width={24}
              height={24}
            />
            <span className="text-[16px] text-gray-3">
              {authUser.user_metadata?.name ||
                authUser.email?.split("@")[0] ||
                "사용자"}
              님
            </span>
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={30}
          alignOffset={-20}
          className="h-[201px] w-[183px] rounded-lg border-0 bg-white p-0 shadow-[0_0_10px_0_rgba(0,0,0,0.12)]"
        >
          <div className="flex flex-col items-end gap-2 p-4 pb-5">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-5 w-5 items-center justify-center"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.16797 15.8327L10.0013 9.99935M10.0013 9.99935L15.8346 4.16602M10.0013 9.99935L4.16797 4.16602M10.0013 9.99935L15.8346 15.8327"
                  stroke="#6D6D6D"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="flex w-[143px] flex-col items-center gap-[19px]">
              {/* 프로필 정보 */}
              <div className="flex w-full flex-col items-start gap-[6px] rounded bg-gray-7 p-3">
                <div className="font-pretendard text-base font-medium leading-5 text-gray-1">
                  {authUser.user_metadata?.name ||
                    authUser.email?.split("@")[0] ||
                    "사용자"}
                </div>
                <div className="w-full truncate font-pretendard text-xs font-normal leading-4 text-gray-4">
                  {authUser.email}
                </div>
              </div>

              {/* 메뉴 아이템들 */}
              <div className="flex w-full flex-col">
                {/* 비밀번호 변경 */}
                <button
                  onClick={() => {
                    setIsPasswordModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-end gap-2 p-[6px_8px] transition-colors hover:bg-gray-50"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.00012 11.625C8.30393 11.625 7.63625 11.3484 7.14397 10.8562C6.65169 10.3639 6.37512 9.69619 6.37512 9C6.37512 8.30381 6.65169 7.63613 7.14397 7.14385C7.63625 6.65156 8.30393 6.375 9.00012 6.375C9.69632 6.375 10.364 6.65156 10.8563 7.14385C11.3486 7.63613 11.6251 8.30381 11.6251 9C11.6251 9.69619 11.3486 10.3639 10.8563 10.8562C10.364 11.3484 9.69632 11.625 9.00012 11.625ZM14.5726 9.7275C14.6026 9.4875 14.6251 9.2475 14.6251 9C14.6251 8.7525 14.6026 8.505 14.5726 8.25L16.1551 7.0275C16.2976 6.915 16.3351 6.7125 16.2451 6.5475L14.7451 3.9525C14.6551 3.7875 14.4526 3.72 14.2876 3.7875L12.4201 4.5375C12.0301 4.245 11.6251 3.99 11.1526 3.8025L10.8751 1.815C10.8599 1.72666 10.8139 1.64657 10.7452 1.58891C10.6766 1.53126 10.5898 1.49976 10.5001 1.5H7.50012C7.31262 1.5 7.15512 1.635 7.12512 1.815L6.84762 3.8025C6.37512 3.99 5.97012 4.245 5.58012 4.5375L3.71262 3.7875C3.54762 3.72 3.34512 3.7875 3.25512 3.9525L1.75512 6.5475C1.65762 6.7125 1.70262 6.915 1.84512 7.0275L3.42762 8.25C3.39762 8.505 3.37512 8.7525 3.37512 9C3.37512 9.2475 3.39762 9.4875 3.42762 9.7275L1.84512 10.9725C1.70262 11.085 1.65762 11.2875 1.75512 11.4525L3.25512 14.0475C3.34512 14.2125 3.54762 14.2725 3.71262 14.2125L5.58012 13.455C5.97012 13.755 6.37512 14.01 6.84762 14.1975L7.12512 16.185C7.15512 16.365 7.31262 16.5 7.50012 16.5H10.5001C10.6876 16.5 10.8451 16.365 10.8751 16.185L11.1526 14.1975C11.6251 14.0025 12.0301 13.755 12.4201 13.455L14.2876 14.2125C14.4526 14.2725 14.6551 14.2125 14.7451 14.0475L16.2451 11.4525C16.3351 11.2875 16.2976 11.085 16.1551 10.9725L14.5726 9.7275Z"
                      fill="#6D6D6D"
                    />
                  </svg>
                  <span className="font-pretendard text-sm font-medium leading-4 text-gray-3">
                    비밀번호 변경
                  </span>
                </button>

                {/* 로그아웃 */}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 p-[6px_8px] transition-colors hover:bg-gray-50"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.75 15.75C3.3375 15.75 2.9845 15.6033 2.691 15.3098C2.3975 15.0163 2.2505 14.663 2.25 14.25V3.75C2.25 3.3375 2.397 2.9845 2.691 2.691C2.985 2.3975 3.338 2.2505 3.75 2.25H9V3.75H3.75V14.25H9V15.75H3.75ZM12 12.75L10.9688 11.6625L12.8812 9.75H6.75V8.25H12.8812L10.9688 6.3375L12 5.25L15.75 9L12 12.75Z"
                      fill="#6D6D6D"
                    />
                  </svg>
                  <span className="font-pretendard text-sm font-medium leading-4 text-gray-3">
                    로그아웃
                  </span>
                </button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Portal을 사용하여 모달을 body에 렌더링 */}
      {isMounted &&
        isPasswordModalOpen &&
        createPortal(
          <PasswordChangeModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
          />,
          document.body,
        )}
    </div>
  );
}

export default AdminHeader;

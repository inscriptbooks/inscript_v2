"use client";

import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { formatDate } from "@/lib/utils";
import NoteSendModal from "@/components/common/Modal/NoteSendModal";
import { useLoginRequired } from "@/hooks/common";
import { useCreateNote } from "@/hooks/notes";
import { showErrorToast } from "./toast";

interface UserInfoPopoverProps {
  userId: string;
  userName: string;
  userCreatedAt: string;
  children: React.ReactNode;
  onReport?: () => void;
  isAnonymous?: boolean;
}

export function UserInfoPopover({
  userId,
  userName,
  userCreatedAt,
  children,
  onReport,
  isAnonymous = false,
}: UserInfoPopoverProps) {
  const [isMessageModalOpen, setIsMessageModalOpen] = React.useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const { requireAuth } = useLoginRequired();
  const { mutate: createNote, isPending } = useCreateNote();
  const [mounted, setMounted] = React.useState(false);
  const closeTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSendMessageClick = () => {
    requireAuth(() => {
      setIsPopoverOpen(false);
      setIsMessageModalOpen(true);
    });
  };

  const handleMessageSend = async (message: string) => {
    return new Promise<void>((resolve, reject) => {
      createNote(
        {
          receiver_id: userId,
          message,
        },
        {
          onSuccess: () => {
            resolve();
          },
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.error ||
              error?.message ||
              "쪽지 전송에 실패했습니다. 다시 시도해주세요.";
            showErrorToast(errorMessage);
            reject(error);
          },
        }
      );
    });
  };

  const handleReportClick = () => {
    requireAuth(() => {
      setIsPopoverOpen(false);
      if (onReport) {
        onReport();
      }
    });
  };

  const isLargeHoverable = () => {
    if (typeof window === "undefined") {
      return false;
    }
    const mqWidth = window.matchMedia("(min-width: 1024px)");
    const mqHover = window.matchMedia("(hover: hover)");
    return mqWidth.matches && mqHover.matches;
  };

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    if (!isLargeHoverable()) {
      return;
    }
    clearCloseTimer();
    setIsPopoverOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isLargeHoverable()) {
      return;
    }
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setIsPopoverOpen(false);
    }, 120);
  };

  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <span
            className="inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {children}
          </span>
        </PopoverTrigger>
        <PopoverContent
          className="w-[233px] h-[113px] p-4 rounded-[8px] bg-white"
          align="start"
          sideOffset={8}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex h-full flex-col justify-between">
            {/* 아이디와 가입일자 */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-2">
                {userName}
              </span>
              <span className="text-xs font-medium text-gray-4">
                {formatDate(userCreatedAt)}
              </span>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex flex-col gap-2">
              {!isAnonymous && (
                <button
                  type="button"
                  onClick={handleSendMessageClick}
                  className="text-left text-sm font-medium text-gray-3 hover:text-primary transition-colors"
                >
                  쪽지 보내기
                </button>
              )}
              {onReport && (
                <button
                  type="button"
                  onClick={handleReportClick}
                  className="text-left text-sm font-medium text-gray-3 hover:text-primary transition-colors"
                >
                  신고하기
                </button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* 쪽지 보내기 모달 */}
      <NoteSendModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        onSend={handleMessageSend}
        recipientName={userName}
        isLoading={isPending}
      />
    </>
  );
}

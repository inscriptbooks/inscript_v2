"use client";

import { Modal } from "@/components/ui/modal";
import { useClipboard } from "@/hooks/common";
import { X as CloseIcon } from "lucide-react";
import { X, Facebook, Thread } from "@/components/icons";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export default function ShareModal({ isOpen, onClose, url }: ShareModalProps) {
  const { copyToClipboard } = useClipboard({
    successMessage: "링크가 복사되었습니다.",
  });

  const handleCopyUrl = () => {
    copyToClipboard(url);
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, "_blank");
  };

  const handleShareThreads = () => {
    const threadsUrl = `https://www.threads.net/intent/post?text=${encodeURIComponent(url)}`;
    window.open(threadsUrl, "_blank");
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="flex w-full md:w-[464px] flex-col gap-6 rounded-xl bg-background px-10 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-center font-pretendard text-lg font-semibold leading-5 text-gray-1">
            콘텐츠 공유하기
          </h2>
          <button onClick={onClose} className="h-6 w-6">
            <CloseIcon className="h-6 w-6 text-gray-2" />
          </button>
        </div>

        <div className="flex items-start gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={url}
              readOnly
              className="w-full rounded border border-red-3 bg-orange-4 px-3 py-2 font-pretendard text-base leading-6 text-orange-3 tracking-[-0.32px] outline-none"
            />
          </div>
          <button
            onClick={handleCopyUrl}
            className="flex h-10 w-[116px] items-center justify-center rounded bg-primary  p-[10px] font-pretendard text-sm leading-5 text-white tracking-[-0.28px]"
          >
            URL 복사
          </button>
        </div>

        <div className="flex justify-center items-end gap-5">
          <button
            onClick={handleShareTwitter}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#161616]">
              <X className="size-[14px]" />
            </div>
            <span className="font-pretendard text-sm font-semibold leading-4 text-gray-4 tracking-[-0.28px]">
              X
            </span>
          </button>

          <button
            onClick={handleShareFacebook}
            className="flex flex-col items-center gap-3"
          >
            <div className="h-6 w-6">
              <Facebook className="size-6" />
            </div>
            <span className="font-pretendard text-sm font-semibold leading-4 text-gray-4 tracking-[-0.28px]">
              페이스북
            </span>
          </button>

          <button
            onClick={handleShareThreads}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#161616]">
              <Thread className="size-[14px]" />
            </div>
            <span className="font-pretendard text-sm font-semibold leading-4 text-gray-4 tracking-[-0.28px]">
              쓰레드
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

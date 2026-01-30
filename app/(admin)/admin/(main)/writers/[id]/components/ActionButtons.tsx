"use client";

import Hamburger from "@/components/icons/Hamburger";
import { useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { useState } from "react";

interface ActionButtonsProps {
  authorId: string;
}

export default function ActionButtons({ authorId }: ActionButtonsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleListClick = () => {
    router.push("/admin/writers");
  };

  const handleDelete = async () => {
    

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/writers/${authorId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        showSuccessToast("작가가 삭제되었습니다.");
        setTimeout(() => {
          router.push("/admin/writers");
        }, 1000);
      } else {
        showErrorToast(data.message || "작가 삭제에 실패했습니다.");
        setIsDeleting(false);
      }
    } catch (error) {
      showErrorToast("작가 삭제 중 오류가 발생했습니다.");
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/writers/edit?author_id=${authorId}`);
  };

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={handleListClick}
        className="flex h-9 w-[94px] items-center justify-center gap-1.5 rounded border border-gray-4 bg-white hover:bg-gray-6"
      >
        <Hamburger size={16} color="#555555" />
        <span className="font-pretendard text-sm font-bold text-gray-2">
          목록으로
        </span>
      </button>
      <div className="flex items-center gap-2.5">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="h-9 w-12 rounded border border-primary bg-white hover:bg-gray-6 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="font-pretendard text-sm font-bold text-primary">
            {isDeleting ? "..." : "삭제"}
          </span>
        </button>
        <button
          onClick={handleEdit}
          disabled={isDeleting}
          className="h-9 w-12 rounded bg-primary hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="font-pretendard text-sm font-bold text-white">
            수정
          </span>
        </button>
      </div>
    </div>
  );
}

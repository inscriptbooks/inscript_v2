"use client";

import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";

interface ActionButtonsProps {
  playId: string;
}

export default function ActionButtons({ playId }: ActionButtonsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/plays/${playId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        showErrorToast(data.error || "삭제에 실패했습니다.");
        return;
      }

      showSuccessToast("희곡이 삭제되었습니다.");
      
      setTimeout(() => {
        router.push("/admin/plays");
      }, 1000);
    } catch (error) {
      showErrorToast("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleList = () => {
    router.push("/admin/plays");
  };

  const handleEdit = () => {
    router.push(`/admin/plays/edit?play_id=${playId}`);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <button
        onClick={handleList}
        className="flex items-center gap-1.5 rounded border border-gray-4 bg-white px-3 py-2.5 text-sm font-semibold leading-4 text-gray-2"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        목록으로
      </button>

      <div className="flex items-center gap-2.5">
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-1.5 rounded border border-primary bg-white px-3 py-2.5 text-sm font-semibold leading-4 text-primary"
        >
          삭제
        </button>
        <button 
          onClick={handleEdit}
          className="flex items-center justify-center gap-1.5 rounded bg-primary px-3 py-2.5 text-sm font-semibold leading-4 text-white"
        >
          수정
        </button>
      </div>
    </div>
  );
}

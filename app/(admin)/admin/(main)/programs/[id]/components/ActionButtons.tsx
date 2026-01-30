"use client";

import { useRouter } from "next/navigation";
import { showSuccessToast,showErrorToast } from "@/components/ui/toast";
interface ActionButtonsProps {
  programId: string;
}

export default function ActionButtons({ programId }: ActionButtonsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    

    try {
      const response = await fetch(`/admin/programs/${programId}/api/delete`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("삭제에 실패했습니다.");
      }

      showSuccessToast("프로그램이 삭제되었습니다.");
      setTimeout(() => {
        router.push("/admin/programs");
      }, 1000);
    } catch (error) {
      showErrorToast("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = () => {
    router.push(`/admin/programs/edit?program_id=${programId}`);
  };

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={handleDelete}
        className="flex h-9 w-12 items-center justify-center gap-1.5 rounded border border-primary bg-white"
      >
        <span className="text-sm font-bold leading-4 tracking-[-0.28px] text-primary">
          삭제
        </span>
      </button>
      <button
        onClick={handleEdit}
        className="flex h-9 w-12 items-center justify-center gap-1.5 rounded bg-primary"
      >
        <span className="text-sm font-bold leading-4 tracking-[-0.28px] text-white">
          수정
        </span>
      </button>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import ProgramAddForm from "@/components/forms/ProgramAddForm";

interface ProgramEditWrapperProps {
  initialData?: {
    id: string;
    title: string;
    eventDateTime: string;
    applicationStartAt: string;
    applicationEndAt: string;
    location: string;
    capacity: number | null;
    notes: string;
    keyword: string[];
    description: string;
    smartstoreUrl: string;
    thumbnailUrl: string;
    isVisible: boolean;
  };
}

export default function ProgramEditWrapper({
  initialData,
}: ProgramEditWrapperProps) {
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/admin/programs");
  };

  const handleCancel = () => {
    router.push("/admin/programs");
  };

  const handlePreview = () => {
    // 미리보기 로직 구현
  };

  return (
    <div className="flex w-full justify-center p-8">
      <div className="flex w-full flex-col items-center justify-center gap-20 rounded-md bg-white px-11 py-11">
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="font-pretendard text-2xl font-bold text-gray-1">
              프로그램 등록 및 수정
            </h1>
          </div>

          <ProgramAddForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onPreview={handlePreview}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
}

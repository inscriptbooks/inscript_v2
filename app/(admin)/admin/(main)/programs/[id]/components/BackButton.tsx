"use client";

import { useRouter } from "next/navigation";
import Hamburger from "@/components/icons/Hamburger";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/admin/programs")}
      className="flex items-center gap-1.5 rounded border border-gray-4 bg-white px-3 py-2.5"
    >
      <Hamburger size={16} color="#555555" />
      <span className="text-sm font-bold leading-4 tracking-[-0.28px] text-gray-2">
        목록으로
      </span>
    </button>
  );
}

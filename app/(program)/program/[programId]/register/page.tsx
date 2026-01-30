"use client";

import { useGetProgram } from "@/hooks/programs";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLoader } from "@/hooks/common";

export default function ProgramRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params.programId as string;
  const { showLoader, hideLoader } = useLoader();

  const { data: program, isLoading } = useGetProgram(programId);

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  useEffect(() => {
    if (program?.smartstoreUrl) {
      // 스마트스토어 URL로 리다이렉트
      window.location.href = program.smartstoreUrl;
    } else if (program) {
      // smartstoreUrl이 없으면 프로그램 상세 페이지로 이동
      router.push(`/program/${programId}`);
    }
  }, [program, programId, router]);

  return null;
}

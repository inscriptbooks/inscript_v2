"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Hamburger from "@/components/icons/Hamburger";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import {
  ReportDetail,
  ReportStatus,
  ProcessingMethod,
  AdminActionForm,
} from "../types";
import ReportManagement from "./ReportManagement";
import ReportInfo from "./ReportInfo";
import ReportComments from "./ReportComments";
import AdminAction from "./AdminAction";

interface ReportDetailClientProps {
  reportDetail: ReportDetail;
}

export default function ReportDetailClient({
  reportDetail,
}: ReportDetailClientProps) {
  const router = useRouter();

  const [adminAction, setAdminAction] = useState<AdminActionForm>({
    status: reportDetail.status || "submitted",
    processingMethod: reportDetail.processingMethod || "visible",
  });

  const handleStatusChange = (value: string) => {
    setAdminAction((prev) => ({
      ...prev,
      status: value as ReportStatus,
    }));
  };

  const handleProcessingMethodChange = (value: string) => {
    setAdminAction((prev) => ({
      ...prev,
      processingMethod: value as ProcessingMethod,
    }));
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/reports/${reportDetail.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          status: adminAction.status,
          processingMethod: adminAction.processingMethod
        }),
      });
      
      if (!response.ok) {
        showErrorToast("저장에 실패했습니다.");
        return;
      }

      const result = await response.json();
      if (result.success) {
        showSuccessToast("저장되었습니다.");
        router.push("/admin/reports");
      } else {
        showErrorToast("저장에 실패했습니다.");
      }
    } catch (e) {
      showErrorToast("저장 중 오류가 발생했습니다.");
    }
  };

  const handleGoToList = () => {
    router.push("/admin/reports");
  };

  return (
    <div className="flex w-full justify-center p-8">
      <div className="flex w-full flex-col items-center gap-20 rounded-[5px] bg-white p-11">
        <div className="flex w-full flex-col items-start gap-10">
          {/* 신고 관리 섹션 */}
          <ReportManagement reportDetail={reportDetail} />

          {/* 신고정보 섹션 */}
          <ReportInfo reportDetail={reportDetail} />

          {/* 댓글 섹션 */}
          <ReportComments comments={reportDetail.comments} />

          {/* 운영자 조치 섹션 */}
          <AdminAction
            status={adminAction.status}
            processingMethod={adminAction.processingMethod}
            onStatusChange={handleStatusChange}
            onProcessingMethodChange={handleProcessingMethodChange}
          />

          {/* 버튼 섹션 */}
          <div className="flex w-full items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoToList}
              className="flex h-9 w-[94px] items-center gap-1.5 rounded border border-gray-4 bg-white px-3 py-2.5"
            >
              <Hamburger size={16} color="#555555" />
              <span className="font-pretendard text-sm font-semibold leading-4 tracking-[-0.28px] text-gray-2">
                목록으로
              </span>
            </Button>
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="flex h-9 w-12 items-center gap-1.5 rounded border border-primary bg-white"
              >
                <span className="font-pretendard text-sm font-semibold leading-4 tracking-[-0.28px] text-primary">
                  취소
                </span>
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="flex h-9 w-12 items-center gap-1.5 rounded bg-primary"
              >
                <span className="font-pretendard text-sm font-semibold leading-4 tracking-[-0.28px] text-white">
                  저장
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

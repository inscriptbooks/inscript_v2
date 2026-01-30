"use client";

import CustomRadio from "@/components/ui/CustomRadio";
import { ReportStatus, ProcessingMethod } from "../types";
import { showSuccessToast,showErrorToast } from "@/components/ui/toast";
interface AdminActionProps {
  status: ReportStatus;
  processingMethod: ProcessingMethod;
  onStatusChange: (value: string) => void;
  onProcessingMethodChange: (value: string) => void;
}

export default function AdminAction({
  status,
  processingMethod,
  onStatusChange,
  onProcessingMethodChange,
}: AdminActionProps) {
  return (
    <div className="flex w-full flex-col items-end gap-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="font-pretendard text-xl font-semibold leading-6 text-gray-1">
          운영자 조치
        </h2>
      </div>

      {/* 상태 변경 */}
      <div className="flex w-full items-center">
        <div className="flex h-14 w-40 items-center gap-1">
          <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
            상태 변경
          </span>
          <span className="font-pretendard text-xl font-semibold leading-6 text-red">
            *
          </span>
        </div>
        <div className="flex items-center">
          <CustomRadio
            value="submitted"
            checked={status === "submitted"}
            onChange={onStatusChange}
            label="접수"
          />
          <CustomRadio
            value="approved"
            checked={status === "approved"}
            onChange={onStatusChange}
            label="조치완료"
          />
          <CustomRadio
            value="rejected"
            checked={status === "rejected"}
            onChange={onStatusChange}
            label="무효"
          />
        </div>
      </div>

      {/* 처리방식 */}
      <div className="flex w-full items-center">
        <div className="flex h-14 w-40 items-center gap-1">
          <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
            처리방식
          </span>
          <span className="font-pretendard text-xl font-semibold leading-6 text-red">
            *
          </span>
        </div>
        <div className="flex items-center">
          <CustomRadio
            value="visible"
            checked={processingMethod === "visible"}
            onChange={onProcessingMethodChange}
            label="노출중"
          />
          <CustomRadio
            value="hidden"
            checked={processingMethod === "hidden"}
            onChange={onProcessingMethodChange}
            label="비공개"
          />
        </div>
      </div>
    </div>
  );
}

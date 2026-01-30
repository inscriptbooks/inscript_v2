"use client";

import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import ModalDropdown from "@/components/ui/modal-dropdown";
import { TemplateFormData } from "../types";

interface TemplateRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: TemplateFormData;
  setFormData: React.Dispatch<React.SetStateAction<TemplateFormData>>;
  onSubmit: () => void;
}

export default function TemplateRegistrationModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
}: TemplateRegistrationModalProps) {
  const insertVariable = (variable: string) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content + variable,
    }));
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent>
        <div className="flex w-full flex-col items-start gap-6">
          <ModalHeader onClose={onClose}>알림 템플릿</ModalHeader>

          <ModalBody>
            {/* 제목 */}
            <div className="flex w-full flex-col items-start">
              <div className="mb-3 flex h-11 w-40 items-center gap-1">
                <span className="font-pretendard text-base font-bold leading-6 text-gray-1">
                  제목
                </span>
              </div>
              <div className="w-full">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="제목을 입력해주세요"
                  className="flex w-full items-center justify-between rounded border border-red-3 bg-orange-4 px-5 py-4 text-base font-normal leading-6 tracking-[-0.32px] text-gray-2 placeholder:text-orange-3"
                />
              </div>
            </div>

            {/* 알림 유형 */}
            <div className="flex w-full flex-col items-start">
              <div className="mb-3 flex h-11 w-40 items-center gap-1">
                <span className="font-pretendard text-base font-bold leading-6 text-gray-1">
                  알림 유형
                </span>
              </div>
              <ModalDropdown
                value={formData.type}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
                options={[
                  "프로그램",
                  "희곡",
                  "작가",
                  "공지",
                  "커뮤니티",
                  "기타",
                ]}
                placeholder="선택"
              />
            </div>

            {/* 알림내용 입력 */}
            <div className="flex w-full flex-col items-start gap-3">
              <span className="font-pretendard text-base font-bold leading-6 text-gray-1">
                알림내용 입력
              </span>
              <div className="relative flex w-full flex-col items-end gap-[84px] rounded-lg border border-gray-6 bg-[#FAF8F6] p-5">
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="w-full resize-none border-none bg-transparent text-base font-normal leading-6 tracking-[-0.32px] text-gray-2 outline-none placeholder:text-gray-2"
                  placeholder="새로운 프로그램 <{프로그램명}> 이 등록되었습니다.  
   신청을 원하시면 확인해 주세요."
                  rows={4}
                />
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 7 7"
                  fill="none"
                  className="rotate-[135deg] fill-[#E0E2E7]"
                >
                  <path d="M6.67466 5.74715C6.71829 6.35472 6.21319 6.85982 5.60562 6.8162L1.02376 6.48723C0.169203 6.42588 -0.217554 5.38851 0.388262 4.7827L4.64116 0.529803C5.24698 -0.0760114 6.28435 0.310745 6.3457 1.1653L6.67466 5.74715Z" />
                </svg>
              </div>

              {/* 변수 버튼들 */}
              <div className="flex flex-wrap items-start gap-3">
                {["{프로그램명}", "{희곡명}", "{반려사유}", "{게시글제목}"].map(
                  (variable) => (
                    <button
                      key={variable}
                      onClick={() => insertVariable(variable)}
                      className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded border border-primary bg-white px-3 py-2 font-pretendard text-sm font-bold leading-4 tracking-[-0.28px] text-primary"
                    >
                      {variable}
                    </button>
                  ),
                )}
                <button
                  onClick={() => insertVariable("+")}
                  className="flex w-9 items-center justify-center gap-1.5 whitespace-nowrap rounded border border-primary bg-white px-3 py-2.5 font-pretendard text-sm font-bold leading-4 tracking-[-0.28px] text-primary"
                >
                  +
                </button>
              </div>

              {/* 안내 메시지 */}
              <div className="flex items-start gap-2">
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                  <path
                    d="M7.33203 6.14323H8.66536V4.8099H7.33203M7.9987 13.4766C5.0587 13.4766 2.66536 11.0832 2.66536 8.14323C2.66536 5.20323 5.0587 2.8099 7.9987 2.8099C10.9387 2.8099 13.332 5.20323 13.332 8.14323C13.332 11.0832 10.9387 13.4766 7.9987 13.4766ZM7.9987 1.47656C7.12322 1.47656 6.25631 1.649 5.44747 1.98403C4.63864 2.31906 3.90371 2.81013 3.28465 3.42918C2.03441 4.67943 1.33203 6.37512 1.33203 8.14323C1.33203 9.91134 2.03441 11.607 3.28465 12.8573C3.90371 13.4763 4.63864 13.9674 5.44747 14.3024C6.25631 14.6375 7.12322 14.8099 7.9987 14.8099C9.76681 14.8099 11.4625 14.1075 12.7127 12.8573C13.963 11.607 14.6654 9.91134 14.6654 8.14323C14.6654 7.26775 14.4929 6.40084 14.1579 5.59201C13.8229 4.78317 13.3318 4.04824 12.7127 3.42918C12.0937 2.81013 11.3588 2.31906 10.5499 1.98403C9.74108 1.649 8.87418 1.47656 7.9987 1.47656ZM7.33203 11.4766H8.66536V7.47656H7.33203V11.4766Z"
                    fill="#A0A0A0"
                  />
                </svg>
                <span className="font-pretendard text-sm font-medium leading-4 text-gray-4">
                  변수 버튼 클릭 시, 커서 위치에 삽입됩니다.
                </span>
              </div>
            </div>

            {/* 미리보기 */}
            <div className="flex w-full flex-col items-start gap-3">
              <span className="font-pretendard text-base font-bold leading-6 text-gray-1">
                미리보기
              </span>
              <div className="relative flex w-full flex-col items-end gap-[84px] rounded-lg border border-gray-6 bg-[#FAF8F6] p-5">
                <div className="w-full text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  {formData.content ||
                    '"새로운 프로그램 <{프로그램명}> 이 등록되었습니다.  \n   신청을 원하시면 확인해 주세요."'}
                </div>
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 7 7"
                  fill="none"
                  className="rotate-[135deg] fill-[#E0E2E7]"
                >
                  <path d="M6.67466 5.88973C6.71829 6.4973 6.21319 7.0024 5.60562 6.95877L1.02376 6.62981C0.169203 6.56846 -0.217554 5.53109 0.388262 4.92527L4.64116 0.672382C5.24698 0.0665667 6.28435 0.453323 6.3457 1.30787L6.67466 5.88973Z" />
                </svg>
              </div>
            </div>

            {/* 활성화 여부 */}
            <div className="flex w-full flex-col items-start gap-3">
              <span className="font-pretendard text-base font-bold leading-6 text-gray-1">
                활성화 여부
              </span>
              <div className="flex items-center">
                <label className="flex cursor-pointer items-center gap-2.5 p-2">
                  <div className="relative">
                    <input
                      type="radio"
                      name="isActive"
                      checked={formData.isActive === true}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, isActive: true }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`h-6 w-6 rounded-full border-[1.6px] ${formData.isActive ? "border-primary" : "border-gray-3"}`}
                    >
                      {formData.isActive && (
                        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`font-pretendard text-base font-bold leading-6 tracking-[-0.32px] ${formData.isActive ? "text-primary" : "text-gray-3"}`}
                  >
                    사용
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 p-2">
                  <div className="relative">
                    <input
                      type="radio"
                      name="isActive"
                      checked={formData.isActive === false}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, isActive: false }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`h-6 w-6 rounded-full border-[1.6px] ${!formData.isActive ? "border-primary" : "border-gray-3"}`}
                    >
                      {!formData.isActive && (
                        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`font-pretendard text-base font-normal leading-6 tracking-[-0.32px] ${!formData.isActive ? "text-primary" : "text-gray-3"}`}
                  >
                    미사용
                  </span>
                </label>
              </div>
            </div>

            {/* 저장 버튼 */}
            <Button
              onClick={onSubmit}
              className="flex w-full items-center justify-center gap-2.5 rounded bg-primary px-[55px] py-5 font-pretendard text-lg font-bold leading-6 text-white"
            >
              저장
            </Button>
          </ModalBody>
        </div>
      </ModalContent>
    </Modal>
  );
}

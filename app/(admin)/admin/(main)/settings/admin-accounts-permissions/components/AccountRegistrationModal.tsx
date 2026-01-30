"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminAccountRegisterFormData,
  AdminAccountRegisterFormSchema,
} from "@/components/forms/schema";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { useState } from "react";

interface AccountRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AccountRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
}: AccountRegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminAccountRegisterFormData>({
    resolver: zodResolver(AdminAccountRegisterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const handleSubmit = async (data: AdminAccountRegisterFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        showErrorToast(result.error || "계정 등록에 실패했습니다.");
        return;
      }

      showSuccessToast("관리자 계정이 성공적으로 등록되었습니다.");
      form.reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      showErrorToast("계정 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid },
  } = form;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent className="h-full w-[520px] gap-6">
        <ModalHeader onClose={onClose}>계정등록/상세</ModalHeader>

        <form className="flex w-full flex-col items-start gap-8" onSubmit={handleFormSubmit(handleSubmit)}>
          <ModalBody className="gap-4">
            {/* 이름 필드 */}
            <div className="flex w-full flex-col items-start">
              <div className="flex h-11 w-40 items-start gap-1 px-0 py-4">
                <div className="font-pretendard text-sm font-medium leading-4 text-gray-3">
                  이름
                </div>
              </div>
              <div className="flex h-12 w-full items-start justify-between rounded border border-red-3 bg-orange-4 px-4 py-3">
                <input
                  type="text"
                  {...register("name")}
                  placeholder="이름을 입력해주세요"
                  className="flex-1 bg-transparent font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-black outline-none placeholder:text-orange-3"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* ID 필드 */}
            <div className="flex w-full flex-col items-start">
              <div className="flex h-11 w-40 items-start gap-1 px-0 py-4">
                <div className="font-pretendard text-sm font-medium leading-4 text-gray-3">
                  ID
                </div>
              </div>
              <div className="flex h-12 w-full items-start justify-between rounded border border-red-3 bg-orange-4 px-4 py-3">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="이메일을 입력해주세요"
                  className="flex-1 bg-transparent font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-black outline-none placeholder:text-orange-3"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* 비밀번호 필드 */}
            <div className="flex w-full flex-col items-start">
              <div className="flex h-11 w-40 items-start gap-1 px-0 py-4">
                <div className="font-pretendard text-sm font-medium leading-4 text-gray-3">
                  비밀번호
                </div>
              </div>
              <div className="flex h-12 w-full items-start justify-between rounded border border-red-3 bg-orange-4 px-4 py-3">
                <input
                  type="password"
                  {...register("password")}
                  placeholder="비밀번호를 입력해주세요"
                  className="flex-1 bg-transparent font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-black outline-none placeholder:text-orange-3"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* 비밀번호 확인 필드 */}
            <div className="flex w-full flex-col items-start">
              <div className="flex h-11 w-40 items-start gap-1 px-0 py-4">
                <div className="font-pretendard text-sm font-medium leading-4 text-gray-3">
                  비밀번호 확인
                </div>
              </div>
              <div className="flex h-12 w-full items-start justify-between rounded border border-red-3 bg-orange-4 px-4 py-3">
                <input
                  type="password"
                  {...register("passwordConfirm")}
                  placeholder="비밀번호를 다시 한 번 입력해주세요"
                  className="flex-1 bg-transparent font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-black outline-none placeholder:text-orange-3"
                />
              </div>
              {errors.passwordConfirm && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.passwordConfirm.message}
                </p>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex w-full items-center justify-center gap-2.5 rounded bg-primary px-[55px] py-5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="font-pretendard text-lg font-bold leading-6 text-white">
                {isSubmitting ? "등록 중..." : "등록"}
              </span>
            </button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

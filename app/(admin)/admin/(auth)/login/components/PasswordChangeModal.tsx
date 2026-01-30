"use client";

import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .max(16, "비밀번호는 최대 16자까지 가능합니다")
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "영문과 숫자를 혼용해야 합니다"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function PasswordChangeModal({
  isOpen,
  onClose,
}: PasswordChangeModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  const newPassword = watch("newPassword") || "";

  // 검증 상태 계산
  const isLengthValid = newPassword.length >= 8 && newPassword.length <= 16;
  const hasLetterAndNumber = /^(?=.*[A-Za-z])(?=.*\d)/.test(newPassword);

  // 모달이 닫힐 때 상태 초기화
  React.useEffect(() => {
    if (!isOpen) {
      setError(null);
      setSuccess(false);
      setIsLoading(false);
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: PasswordFormData) => {
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: data.newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "비밀번호 변경에 실패했습니다");
        return;
      }

      setSuccess(true);

      // 2초 후 모달 닫기
      setTimeout(() => {
        onClose();
        reset();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError("서버 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent className="gap-3 max-md:w-[90%] max-md:max-w-[480px] max-md:px-5 max-sm:w-[95%] max-sm:max-w-[400px] max-sm:px-4">
        <ModalHeader onClose={onClose} className="max-sm:text-lg">
          비밀번호 변경
        </ModalHeader>

        <ModalBody className="gap-0">
          {/* 설명 */}
          <div className="text-base leading-6 tracking-tight text-zinc-500 max-sm:text-sm">
            새로운 비밀번호를 입력해주세요.
            <br />
            8~16자 영문, 숫자를 혼용하여 입력해주세요.
          </div>

          {/* Success Message */}
          {success && (
            <div className="mt-4 flex w-full items-center gap-2 rounded bg-green-50 px-4 py-3 text-sm text-green-600">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path
                  d="M9 12l2 2 4-4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              비밀번호가 성공적으로 변경되었습니다
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex w-full items-center gap-2 rounded bg-red-50 px-4 py-3 text-sm text-red-600">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <line
                  x1="12"
                  y1="8"
                  x2="12"
                  y2="12"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="12"
                  y1="16"
                  x2="12.01"
                  y2="16"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {error}
            </div>
          )}

          {/* 폼 */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 w-full">
            <div className="w-full">
              {/* 새 비밀번호 */}
              <div className="w-full">
                <div className="flex min-h-11 w-40 max-w-full items-start gap-1 py-3.5 text-sm font-medium leading-none text-neutral-500">
                  <div className="text-neutral-500">새 비밀번호</div>
                </div>
                <div className="flex min-h-12 w-full items-start justify-between rounded border border-solid border-stone-200 bg-orange-4 text-base tracking-tight">
                  <Input
                    type="password"
                    {...register("newPassword")}
                    placeholder="새 비밀번호를 입력해주세요"
                    className="flex-1 shrink basis-0 border-none bg-transparent text-stone-800 outline-none placeholder:text-stone-300 h-12"
                  />
                </div>
              </div>

              {/* 검증 메시지 */}
              <div className="mt-3 flex w-full items-center gap-1.5 px-3 text-xs font-medium leading-6">
                <Image
                  src="/images_jj/check.webp"
                  alt="check"
                  width={16}
                  height={16}
                />
                <div
                  className={`my-auto self-stretch ${
                    isLengthValid && hasLetterAndNumber
                      ? "text-green-500"
                      : "text-neutral-400"
                  }`}
                >
                  8~16자 영문, 숫자 혼용
                </div>
              </div>

              {/* 비밀번호 확인 */}
              <div className="mt-3 w-full">
                <div className="flex min-h-11 w-40 max-w-full items-start gap-1 py-3.5 text-sm font-medium leading-none text-neutral-500">
                  <div className="text-neutral-500">비밀번호 확인</div>
                </div>
                <div className="flex min-h-12 w-full items-start justify-between rounded border border-solid border-stone-200 bg-orange-4 text-base tracking-tight">
                  <Input
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="새 비밀번호를 다시 한 번 입력해주세요"
                    className="flex-1 shrink basis-0 border-none bg-transparent text-stone-800 outline-none placeholder:text-stone-300 h-12"
                  />
                </div>
              </div>
            </div>

            {/* 저장 버튼 */}
            <Button
              type="submit"
              disabled={!isValid || isLoading || success}
              className={`mt-8 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded px-14 py-5 text-lg font-semibold leading-none text-white transition-colors max-md:px-5 ${
                isValid && !isLoading && !success ? "" : "cursor-not-allowed bg-gray-300"
              }`}
            >
              {isLoading ? (
                <Loader size="sm" />
              ) : (
                <div className="my-auto self-stretch whitespace-nowrap text-white">
                  저장하기
                </div>
              )}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

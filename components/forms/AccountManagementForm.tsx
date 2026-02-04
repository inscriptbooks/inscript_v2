"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import {
  AccountManagementFormData,
  AccountManagementFormSchema,
} from "./schema";
import { FormInput } from "@/components/common/Input";
import { useState } from "react";
import { Loader } from "@/components/common";
import {
  PasswordChangeSuccessModal,
  EntryDeleteModal,
} from "@/components/common/Modal";
import { showErrorToast } from "../ui/toast";

interface AccountManagementFormProps {
  onSubmit?: (data: AccountManagementFormData) => void;
  defaultValues?: Partial<AccountManagementFormData>;
  isLocalUser?: boolean;
}

export default function AccountManagementForm({
  onSubmit,
  defaultValues,
  isLocalUser = true,
}: AccountManagementFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const form = useForm<AccountManagementFormData>({
    resolver: zodResolver(AccountManagementFormSchema),
    mode: "onChange",
    defaultValues: {
      userId: "",
      password: "",
      passwordConfirm: "",
      ...defaultValues,
    },
  });

  const handleSubmit = async (data: AccountManagementFormData) => {
    if (onSubmit) {
      onSubmit(data);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        showErrorToast(result.error || "비밀번호 변경에 실패했습니다");
        return;
      }

      setIsSuccessModalOpen(true);
      form.reset({
        userId: data.userId,
        password: "",
        passwordConfirm: "",
      });
    } catch (error) {
      showErrorToast("서버 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) {
        showErrorToast(result.error || "회원 탈퇴에 실패했습니다");
        return;
      }
      setIsDeleteModalOpen(false);
      window.location.href = "/";
    } catch (_error) {
      showErrorToast("서버 오류가 발생했습니다");
    } finally {
      setIsDeleting(false);
    }
  };

  const watchedValues = form.watch();
  const { isValid } = form.formState;

  return (
    <>
      <PasswordChangeSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
      <EntryDeleteModal
        isOpen={isDeleteModalOpen}
        title="회원 탈퇴"
        description={
          <>
            <p>탈퇴 시 계정 및 작성한 데이터가 삭제되며,</p>
            <br />
            <p>구매한 전자책 및 다운로드한</p>
            <p>디지털 콘텐츠에 대한 이용 권한이 소멸되어</p>
            <p>재다운로드 및 복구가 불가능합니다.</p>
            <br />
            <p>계속하시겠습니까?</p>
          </>
        }
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteAccount}
        isLoading={isDeleting}
      />

      <div className="flex w-full max-w-[600px] flex-col items-start gap-7">
        <h1 className="w-full text-center font-pretendard text-xl font-bold leading-6 text-gray-1">
          계정 관리
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex w-full flex-col items-end gap-8"
          >
            <div className="flex w-full flex-col items-start gap-[21px]">
              <FormField
                control={form.control}
                name="userId"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <FormInput
                        {...field}
                        label="아이디"
                        required
                        placeholder="아이디를 입력해주세요"
                        error={fieldState.error?.message}
                        labelClassName="w-[110px] font-bold"
                        disabled
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {isLocalUser && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <FormInput
                            {...field}
                            type="password"
                            label="비밀번호"
                            required
                            placeholder="비밀번호를 입력해주세요"
                            error={fieldState.error?.message}
                            labelClassName="w-[110px] font-bold"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field, fieldState }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <FormInput
                            {...field}
                            type="password"
                            label="비밀번호 확인"
                            required
                            placeholder="비밀번호를 한번 더 입력해주세요"
                            error={fieldState.error?.message}
                            labelClassName="w-[110px] font-bold"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            {isLocalUser && (
              <Button
                type="submit"
                variant={
                  isValid &&
                  watchedValues.password &&
                  watchedValues.passwordConfirm
                    ? "default"
                    : "disabled"
                }
                disabled={
                  !isValid ||
                  !watchedValues.password ||
                  !watchedValues.passwordConfirm ||
                  isLoading
                }
                className="w-full max-w-[440px] text-lg"
              >
                {isLoading ? <Loader size="sm" /> : "변경 사항 저장하기"}
              </Button>
            )}

            <div className="flex w-full max-w-[440px] justify-end">
              <span
                className="cursor-pointer underline text-gray-3 text-sm font-medium"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                회원 탈퇴
              </span>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

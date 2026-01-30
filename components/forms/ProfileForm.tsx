"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { ProfileFormData, ProfileFormSchema } from "./schema";
import { FormInput } from "@/components/common/Input";
import { useState, useEffect } from "react";
import { Loader } from "@/components/common";
import { showErrorToast } from "../ui/toast";

interface ProfileFormProps {
  onSubmit?: (data: ProfileFormData) => void;
  onSuccess?: () => void;
  defaultValues?: Partial<ProfileFormData>;
}

export default function ProfileForm({
  onSubmit,
  onSuccess,
  defaultValues,
}: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: "",
      ...defaultValues,
    },
  });

  // defaultValues가 변경되면 폼 값 업데이트
  useEffect(() => {
    if (defaultValues?.name) {
      form.reset({ name: defaultValues.name });
    }
  }, [defaultValues, form]);

  // 이름 변경 시 중복확인 상태 초기화
  const watchedName = form.watch("name");
  useEffect(() => {
    setNicknameChecked(false);
    setNicknameAvailable(false);
  }, [watchedName]);

  const handleSubmit = async (data: ProfileFormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/users/update-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: data.name }),
      });

      const result = await response.json();

      if (!response.ok) {
        showErrorToast(result.error || "닉네임 변경에 실패했습니다");
        return;
      }

      onSubmit?.(data);
      onSuccess?.();
    } catch (error) {
      showErrorToast("닉네임 변경 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkNicknameAvailability = async () => {
    const name = form.getValues("name");
    if (!name) return;

    setCheckingNickname(true);
    // 이전 에러/상태 초기화
    setNicknameChecked(false);
    setNicknameAvailable(false);
    form.clearErrors("name");
    try {
      const res = await fetch(
        `/api/users/nickname/${encodeURIComponent(name)}`
      );
      const json = await res.json();
      if (res.ok && json && json.available) {
        setNicknameAvailable(true);
        setNicknameChecked(true);
      } else {
        setNicknameAvailable(false);
        setNicknameChecked(true);
        form.setError("name", {
          type: "manual",
          message: json?.error || "이미 사용 중인 닉네임입니다.",
        });
      }
    } catch (_e) {
      form.setError("name", {
        type: "manual",
        message: "중복 확인 중 오류가 발생했습니다.",
      });
      setNicknameAvailable(false);
      setNicknameChecked(false);
    } finally {
      setCheckingNickname(false);
    }
  };

  const { isValid, isDirty } = form.formState;
  const canSave =
    isValid && !isSubmitting && isDirty && nicknameChecked && nicknameAvailable;

  return (
    <div className="flex w-full max-w-[600px] flex-col items-start gap-7">
      <h1 className="w-full text-center font-pretendard text-xl font-bold leading-6 text-gray-1">
        프로필
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex w-full flex-col items-end gap-8"
        >
          <div className="flex w-full flex-col items-start gap-[21px]">
            <div className="relative flex w-full flex-col gap-4 lg:flex-row">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full flex-1">
                    <FormControl>
                      <FormInput
                        {...field}
                        label="닉네임"
                        required
                        placeholder="닉네임을 입력해주세요"
                        error={fieldState.error?.message}
                        labelClassName="w-[80px] lg:w-[160px] font-bold"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {(!nicknameChecked || !nicknameAvailable) && (
                <div className="flex gap-2 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:translate-x-[calc(100%+16px)]">
                  <Button
                    type="button"
                    size="sm"
                    variant={watchedName ? "default" : "disabled"}
                    onClick={checkNicknameAvailability}
                    disabled={!watchedName || checkingNickname}
                    className="w-[184px] h-[56px]"
                  >
                    {checkingNickname ? <Loader size="sm" /> : "중복확인"}
                  </Button>
                </div>
              )}

              {nicknameChecked && nicknameAvailable && (
                <div className="flex items-center gap-2 lg:absolute lg:right-0 lg:h-full lg:translate-x-[calc(100%+16px)]">
                  <span className="text-sm font-medium text-green-600">
                    사용 가능한 닉네임입니다
                  </span>
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            variant={canSave ? "default" : "disabled"}
            disabled={!canSave}
            className="w-full text-lg lg:w-[440px]"
          >
            {isSubmitting ? "저장 중..." : "변경 사항 저장하기"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

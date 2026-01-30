"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthorRequestFormData, AuthorRequestFormSchema } from "./schema";
import { cn } from "@/lib/utils";
import { Form, FormField, FormItem, FormControl } from "../ui/form";
import { Button } from "../ui/button";
import { showErrorToast } from "../ui/toast";
import { FormInput } from "../common/Input";
import { useState } from "react";
import { AuthorApplicationSuccessModal } from "../common/Modal";
import axios from "axios";

interface AuthorRequestFormProps {
  className?: string;
  onSubmit?: (data: AuthorRequestFormData) => void;
}

export default function AuthorRequestForm({
  onSubmit,
  className,
}: AuthorRequestFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AuthorRequestFormData>({
    resolver: zodResolver(AuthorRequestFormSchema),
    defaultValues: {
      authorName: "",
      representativeWork: "",
    },
  });

  const handleSubmit = async (data: AuthorRequestFormData) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/author-applications", {
        authorName: data.authorName,
        representativeWork: data.representativeWork,
      });

      if (response.status === 201) {
        setIsModalOpen(true);
        form.reset();
        onSubmit?.(data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showErrorToast(
          error.response?.data?.error || "신청 중 오류가 발생했습니다."
        );
      } else {
        showErrorToast("신청 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const { isValid } = form.formState;

  return (
    <div
      className={cn(
        "flex w-full max-w-[600px] flex-col items-start gap-[26px]",
        className
      )}
    >
      {/* 제목 */}
      <h1 className="w-full text-center font-pretendard text-xl font-bold leading-6 text-gray-1">
        작가 회원 신청
      </h1>

      {/* 설명 텍스트 */}
      <div className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
        <p>
          극작가이신가요? 출판 혹은 공연된 희곡 작품이 1개 이상 있고,
          <br />
          현재 활동 중이라면 작가 회원으로 등록 신청 할 수 있습니다.
          <br />
          신청 후, 관리자가 승인할 때까지 최대 일주일 소요될 수 있습니다.
        </p>
        <p className="mt-4">
          인증자료는{" "}
          <a
            href="https://forms.gle/SnYYQosbbpEjp7m29"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary underline hover:text-primary/80"
          >
            구글 폼
          </a>
          을 통해 제출해주세요.
        </p>
      </div>

      {/* 폼 */}
      <Form {...form}>
        <form
          className="flex w-full flex-col items-end gap-8"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="flex w-full flex-col items-end gap-4">
            {/* 작가명 */}
            <FormField
              control={form.control}
              name="authorName"
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <FormInput
                      label="작가명"
                      type="text"
                      placeholder="작가명을 입력해주세요"
                      required
                      error={fieldState.error?.message}
                      labelClassName="w-28"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 대표작 제목 */}
            <FormField
              control={form.control}
              name="representativeWork"
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <FormInput
                      label="대표작 제목"
                      type="text"
                      placeholder="제목을 입력해주세요"
                      required
                      error={fieldState.error?.message}
                      labelClassName="w-28"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 안내 텍스트 */}

            <p className="text-right text-sm font-medium leading-4 text-gray-4">
              * 작가명은 운영진 검토 후 작가 상세페이지에 공개됩니다.
            </p>
          </div>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            className="w-full text-lg font-bold lg:w-[440px]"
            disabled={!isValid || isSubmitting}
          >
            작가 회원 신청하기
          </Button>
        </form>
      </Form>

      {/* 신청 완료 모달 */}
      <AuthorApplicationSuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

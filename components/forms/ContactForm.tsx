"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormData, ContactFormSchema } from "./schema";
import { Form, FormField, FormItem, FormControl } from "../ui/form";
import { FormInput, FormTextareaInput, FormSelectInput } from "../common/Input";
import { Button } from "../ui/button";
import Plus from "../icons/Plus";
import CheckBox from "../icons/CheckBox";
import { Loader } from "../common";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { showErrorToast } from "../ui/toast";

const contactCategories = ["일반문의"];

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  onSuccess?: () => void;
}

export default function ContactForm({ onSubmit, onSuccess }: ContactFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      category: "",
      email: "",
      name: "",
      contact: "",
      title: "",
      content: "",
      agreePrivacy: false,
    },
  });

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append("category", data.category);
      formData.append("email", data.email);
      formData.append("name", data.name);
      formData.append("phone", data.contact);
      formData.append("subject", data.title);
      formData.append("message", data.content);
      formData.append("consent", String(data.agreePrivacy));

      if (file) {
        formData.append("file", file);
      }

      // API 호출
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "문의 전송에 실패했습니다.");
        return;
      }

      // 성공 시
      if (result.success) {
        form.reset();
        setFile(null);
        onSuccess?.();
        onSubmit?.(data);
      } else {
        setError("문의 전송에 실패했습니다.");
      }
    } catch (err) {
      setError("문의 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size <= 10 * 1024 * 1024) {
        // 10MB
        setFile(selectedFile);
      } else {
        showErrorToast("10MB 이하의 파일만 첨부 가능합니다.");
      }
    }
  };

  const { isValid } = form.formState;
  const watchedPrivacy = form.watch("agreePrivacy");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full max-w-[1200px] flex-col gap-[18px] px-[20px] py-8 lg:px-[120px]"
      >
        {/* Error Message */}
        {error && (
          <div className="flex w-full items-center gap-2 rounded bg-red-50 px-4 py-3 text-sm text-red-600">
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

        {/* Form Fields */}
        <div className="flex w-full flex-col gap-4">
          {/* Top Row - Category and Email */}
          <div className="flex flex-1 flex-col justify-between gap-3 lg:flex-row lg:gap-10">
            {/* Category Field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field, fieldState }) => (
                <FormSelectInput
                  label="분류"
                  options={contactCategories}
                  placeholder="문의 유형을 선택해주세요"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  labelClassName="shrink-0 font-bold"
                />
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormInput
                  {...field}
                  label="이메일"
                  placeholder="example@example.com"
                  error={fieldState.error?.message}
                  labelClassName="shrink-0 font-bold"
                />
              )}
            />
          </div>

          {/* Second Row - Name and Contact */}
          <div className="flex flex-1 flex-col justify-between gap-3 lg:flex-row lg:gap-10">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormInput
                  {...field}
                  label="이름"
                  placeholder="이름을 입력해주세요"
                  error={fieldState.error?.message}
                  labelClassName="shrink-0 font-bold"
                />
              )}
            />

            {/* Contact Field */}
            <FormField
              control={form.control}
              name="contact"
              render={({ field, fieldState }) => (
                <FormInput
                  {...field}
                  label="연락처"
                  placeholder="연락처를 입력해주세요"
                  error={fieldState.error?.message}
                  labelClassName="shrink-0 font-bold"
                />
              )}
            />
          </div>

          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <FormInput
                {...field}
                label="제목"
                placeholder="제목을 입력해주세요"
                error={fieldState.error?.message}
                labelClassName="shrink-0 font-bold"
              />
            )}
          />

          {/* Content Field */}
          <FormField
            control={form.control}
            name="content"
            render={({ field, fieldState }) => (
              <FormTextareaInput
                {...field}
                label="내용"
                placeholder="문의 내용을 입력하세요"
                error={fieldState.error?.message}
                labelClassName="shrink-0 font-bold"
                className="h-[200px]"
              />
            )}
          />
        </div>

        {/* File Attachment Section */}
        <div className="flex w-full flex-col gap-4 pl-[65px] lg:flex-row lg:items-center lg:pl-40">
          <label className="flex w-[155px] shrink-0 cursor-pointer items-center gap-2 rounded bg-red-2 px-[18px] py-2.5">
            <Plus size={24} className="text-primary" />
            <span className="text-base font-medium text-primary">
              파일 첨부하기
            </span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="*/*"
            />
          </label>
          <span className="text-sm font-medium leading-4 text-primary">
            10MB 이하의 파일만 첨부 가능합니다.
          </span>
          {file && (
            <span className="text-sm text-gray-3">
              선택된 파일: {file.name}
            </span>
          )}
        </div>

        {/* Privacy Consent and Submit */}
        <div className="flex flex-col gap-5 pl-[65px] lg:pl-40">
          {/* Privacy Consent */}
          <div className="flex flex-col gap-px rounded bg-gray-7 p-6">
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="agreePrivacy"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CheckBox
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <span className="text-base font-medium leading-5 text-orange-2">
                개인정보 수집 동의
              </span>
            </div>
            <div className="flex items-center justify-center gap-2.5 py-2.5 pl-8">
              <p className="flex-1 text-sm font-normal leading-5 tracking-[-0.28px] text-orange-2">
                {`수집하는 개인정보 항목: 이메일 주소, 연락처, 이름, 개인정보는 문의 접수, 고객 불편 사항 확인 및 처리 결과 회신에 이용되며 전자상거래법 등 관련 법령에 따라 1년간 보관됩니다. 이용자는 본 동의를 거부할 수 있으나, 미동의 시 문의 접수가 불가능합니다.`}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isValid || !watchedPrivacy || isSubmitting}
            className="w-full text-lg lg:w-[184px]"
          >
            {isSubmitting ? <Loader size="sm" /> : "메일 발송하기"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

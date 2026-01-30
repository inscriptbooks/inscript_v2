"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { FindPasswordFormData, FindPasswordFormSchema } from "./schema";
import { useState } from "react";
import { Loader } from "@/components/common";
import { EmailSentModal } from "@/components/common/Modal";

export default function FindPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<FindPasswordFormData>({
    resolver: zodResolver(FindPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: FindPasswordFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: result.error || "비밀번호 재설정 메일 전송에 실패했습니다.",
        });
        return;
      }

      // 성공 시 모달 표시
      setIsModalOpen(true);
      form.reset();
    } catch (error) {
      setMessage({
        type: "error",
        text: "오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <EmailSentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="메일이 전송되었습니다."
        description="비밀번호 재설정 링크가 이메일로 전송되었습니다. 메일함을 확인해주세요."
      />
      <div className="flex w-full max-w-[387px] flex-col items-center gap-[55px] pt-12 lg:pt-20">
        <Form {...form}>
        <form
          className="flex w-full flex-col items-center gap-3"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {/* Message */}
          {message && (
            <div
              className={`flex w-full items-center gap-2 rounded px-4 py-3 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                {message.type === "success" ? (
                  <>
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path
                      d="M9 12l2 2 4-4"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </svg>
              {message.text}
            </div>
          )}

          <div className="flex w-full flex-col items-center gap-8">
            {/* Email Input */}
            <div className="flex w-full flex-col gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="이메일을 입력해주세요"
                        className="h-14 rounded border border-red-3 bg-orange-4 px-5 py-4 text-base placeholder:text-orange-3"
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex w-full flex-col gap-2.5">
              <Button
                type="submit"
                className="text-lg font-bold text-white"
                disabled={isLoading}
              >
                {isLoading ? <Loader size="sm" /> : "메일 보내기"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      </div>
    </>
  );
}

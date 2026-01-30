"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { ResetPasswordFormData, ResetPasswordFormSchema } from "./schema";
import { useState } from "react";
import { Loader } from "@/components/common";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: result.error || "비밀번호 변경에 실패했습니다.",
        });
        return;
      }

      setMessage({
        type: "success",
        text: "비밀번호가 성공적으로 변경되었습니다.",
      });

      // 성공 시 2초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push("/auth");
      }, 2000);
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
            {/* Password Input */}
            <div className="flex w-full flex-col gap-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="신규 비밀번호를 입력해주세요"
                        className="h-14 rounded border border-red-3 bg-orange-4 px-5 py-4 text-base placeholder:text-orange-3"
                        disabled={isLoading}
                      />
                    </FormControl>
                    {form.formState.errors.password && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="신규 비밀번호를 다시 입력해주세요"
                        className="h-14 rounded border border-red-3 bg-orange-4 px-5 py-4 text-base placeholder:text-orange-3"
                        disabled={isLoading}
                      />
                    </FormControl>
                    {form.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.confirmPassword.message}
                      </p>
                    )}
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
                {isLoading ? <Loader size="sm" /> : "비밀번호 변경"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

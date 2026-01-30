"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { CheckBox } from "@/components/icons";
import { Loader } from "@/components/common";
import { useLogin } from "@/hooks/auth";
import PasswordResetModal from "./components/PasswordResetModal";
import PasswordChangeModal from "./components/PasswordChangeModal";
import { AdminLoginFormData, AdminLoginFormSchema } from "./types";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
    useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);
  const { loginWithEmail, isLoading: isLoginLoading } = useLogin();

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(AdminLoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberPassword: false,
    },
  });

  const handleSubmit = async (data: AdminLoginFormData) => {
    setError(null);

    loginWithEmail(
      {
        email: data.username,
        password: data.password,
        rememberMe: data.rememberPassword,
      },
      {
        onSuccess: () => {
          router.push("/admin");
        },
        onError: (err: Error) => {
          let errorMessage = "로그인에 실패했습니다.";

          if (err.message.includes("Invalid login credentials")) {
            errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
          } else if (err.message.includes("Email not confirmed")) {
            errorMessage = "이메일 인증이 필요합니다.";
          }

          setError(errorMessage);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-[51.84px] bg-background">
      <div className="flex w-[520px] flex-col items-end gap-12 rounded-[12px] bg-[#FFFFFF] px-16 pb-14 pt-20 shadow-sm max-md:w-[90%] max-md:max-w-[480px] max-md:gap-9 max-md:px-10 max-md:pb-10 max-md:pt-16 max-sm:w-[95%] max-sm:max-w-[360px] max-sm:gap-7 max-sm:px-6 max-sm:pb-8 max-sm:pt-10">
        <div className="flex flex-col items-start gap-6 self-stretch">
          <div className="text-xl font-bold leading-6 text-neutral-800 max-md:text-lg max-md:leading-6 max-sm:text-base max-sm:leading-5">
            로그인
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex w-full flex-col items-center gap-3"
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

              <div className="flex w-full flex-col items-center gap-8">
                {/* Input Fields */}
                <div className="flex w-full flex-col gap-3">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex h-11 w-40 items-start gap-1 px-0 py-4 max-md:h-auto max-md:w-full max-md:px-0 max-md:py-3 max-sm:px-0 max-sm:py-2">
                          <div className="text-sm leading-4 text-neutral-500 max-sm:text-sm max-sm:leading-4">
                            아이디
                          </div>
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="아이디를 입력해주세요"
                            className="h-14 rounded border border-red-3 bg-orange-4 px-5 py-4 text-base placeholder:text-orange-3"
                            disabled={isLoginLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex h-11 w-40 items-start gap-1 px-0 py-4 max-md:h-auto max-md:w-full max-md:px-0 max-md:py-3 max-sm:px-0 max-sm:py-2">
                          <div className="text-sm leading-4 text-neutral-500 max-sm:text-sm max-sm:leading-4">
                            비밀번호
                          </div>
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="비밀번호를 입력해주세요"
                            className="h-14 rounded border border-red-3 bg-orange-4 px-5 py-4 text-base placeholder:text-orange-3"
                            disabled={isLoginLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Options */}
                <div className="flex w-full items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-3">
                  <div className="flex items-center gap-1 justify-center">
                    <FormField
                      control={form.control}
                      name="rememberPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <CheckBox
                              checked={field.value}
                              onChange={(checked) => field.onChange(checked)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-sm font-medium text-[#6D6D6D]">
                      비밀번호 저장
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPasswordResetModalOpen(true)}
                      className="text-sm leading-4 text-neutral-500 hover:text-neutral-700 max-sm:text-sm max-sm:leading-4"
                    >
                      비밀번호를 잊어버리셨나요?
                    </button>
                    {/* <button
                      type="button"
                      onClick={() => setIsPasswordChangeModalOpen(true)}
                      className="text-sm leading-4 text-neutral-500 hover:text-neutral-700 max-sm:text-sm max-sm:leading-4"
                    >
                      비밀번호 변경
                    </button> */}
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full text-lg font-bold text-white"
                  disabled={isLoginLoading}
                >
                  {isLoginLoading ? <Loader size="sm" /> : "로그인"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Logo */}
        <div className="h-[17px] w-[76px] max-md:h-[15px] max-md:w-[68px] max-sm:h-[13px] max-sm:w-[60px]">
          <Image
            src="/images_jj/logo2.webp"
            alt="logo"
            width={76}
            height={17}
          />
        </div>
      </div>

      {/* Modals */}
      <PasswordResetModal
        isOpen={isPasswordResetModalOpen}
        onClose={() => setIsPasswordResetModalOpen(false)}
      />
      <PasswordChangeModal
        isOpen={isPasswordChangeModalOpen}
        onClose={() => setIsPasswordChangeModalOpen(false)}
      />

      <div className="flex flex-col items-center gap-5 text-orange-2">
        <div>관리자 계정 생성을 위해서는 시스템 관리자에게 연락바랍니다.</div>
        <div>홍길동 과장 | 02-1234-1234 | admin@000.com</div>
      </div>
    </div>
  );
}

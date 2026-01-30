"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { LoginFormData, LoginFormSchema } from "./schema";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckBox, OAuthGoogle, OAuthKakao } from "@/components/icons";
import { useLogin } from "@/hooks/auth";
import { Loader } from "@/components/common";
import { useState } from "react";

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void;
  onSignUpClick?: () => void;
  onFindIdClick?: () => void;
  onFindPasswordClick?: () => void;
}

export default function LoginForm({
  onSubmit,
  onSignUpClick,
  onFindIdClick,
  onFindPasswordClick,
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [error, setError] = useState<string | null>(null);
  const {
    loginWithEmail,
    loginWithGoogle,
    loginWithKakao,
    isLoading: isLoginLoading,
  } = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
      autoLogin: false,
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    setError(null);

    loginWithEmail(
      {
        email: data.username,
        password: data.password,
        rememberMe: data.autoLogin,
      },
      {
        onSuccess: () => {
          onSubmit?.(data);
          router.push(redirect);
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

  const handleSignUpClick = () => {
    router.push("/auth/signup");
    onSignUpClick?.();
  };

  const handleFindIdClick = () => {
    router.push("/auth/find-id");
    onFindIdClick?.();
  };

  const handleFindPasswordClick = () => {
    router.push("/auth/find-password");
    onFindPasswordClick?.();
  };

  return (
    <div className="flex w-full max-w-[387px] flex-col items-center gap-[55px] pt-12 lg:pt-20 px-5 md:px-0">
      <Form {...form}>
        <form
          className="flex w-full flex-col items-center gap-3"
          onSubmit={form.handleSubmit(handleSubmit)}
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
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="이메일을 입력해주세요"
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

            {/* Buttons */}
            <div className="flex w-full flex-col gap-2.5">
              <Button
                type="submit"
                className="text-lg font-bold text-white"
                disabled={isLoginLoading}
              >
                {isLoginLoading ? <Loader size="sm" /> : "로그인"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSignUpClick}
                className="text-lg font-bold text-primary"
              >
                회원가입
              </Button>
            </div>
          </div>

          {/* Footer Options */}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1">
              <FormField
                control={form.control}
                name="autoLogin"
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
              <span className="text-sm font-medium text-primary">
                로그인 유지
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleFindIdClick}
                className="text-sm font-medium text-gray-3 hover:underline"
              >
                아이디 찾기
              </button>
              <span className="text-sm font-medium text-gray-3">|</span>
              <button
                type="button"
                onClick={handleFindPasswordClick}
                className="text-sm font-medium text-gray-3 hover:underline"
              >
                비밀번호 찾기
              </button>
            </div>
          </div>
        </form>
      </Form>

      {/* Social Login Section */}
      <div className="flex w-full max-w-[207.5px] flex-col items-center gap-6">
        <h3 className="w-full text-center text-lg font-bold text-primary">
          SNS로 간편 로그인
        </h3>
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => loginWithGoogle(redirect)}
            disabled={isLoginLoading}
            className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-gray-6 p-1 hover:bg-gray-5 disabled:opacity-50"
          >
            <OAuthGoogle />
          </button>
          <button
            type="button"
            onClick={() => loginWithKakao(redirect)}
            disabled={isLoginLoading}
            className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#FEE500] px-[15px] py-4 hover:bg-[#FEE500]/90 disabled:opacity-50"
          >
            <OAuthKakao />
          </button>
        </div>
      </div>
    </div>
  );
}

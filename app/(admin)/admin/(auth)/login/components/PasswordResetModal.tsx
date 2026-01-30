"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emailDomains = [
  "직접입력",
  "gmail.com",
  "naver.com",
  "daum.net",
  "hanmail.net",
  "nate.com",
  "yahoo.com",
];

const passwordResetSchema = z
  .object({
    localPart: z.string().min(1, "이메일을 입력해주세요"),
    domain: z.string().min(1, "도메인을 선택해주세요"),
    customDomain: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.domain === "직접입력") {
        return data.customDomain && data.customDomain.length > 0;
      }
      return true;
    },
    {
      message: "도메인을 입력해주세요",
      path: ["customDomain"],
    }
  );

type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

export default function PasswordResetModal({
  isOpen,
  onClose,
}: PasswordResetModalProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      localPart: "",
      domain: "",
      customDomain: "",
    },
  });

  const watchDomain = form.watch("domain");

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // 모달이 닫힐 때 상태 초기화
  React.useEffect(() => {
    if (!isOpen) {
      setError(null);
      setSuccess(false);
      setIsLoading(false);
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = async (data: PasswordResetFormValues) => {
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const email =
      data.domain === "직접입력"
        ? `${data.localPart}@${data.customDomain}`
        : `${data.localPart}@${data.domain}`;

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "비밀번호 재설정 메일 전송에 실패했습니다");
        return;
      }

      setSuccess(true);
      
      // 3초 후 모달 닫기
      setTimeout(() => {
        onClose();
        form.reset();
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError("서버 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent className="w-[520px] gap-[46px] p-[44px]">
        <div className="flex w-full flex-col items-start gap-6">
          <div className="flex w-full flex-col items-start gap-3">
            <ModalHeader onClose={onClose}>비밀번호 찾기</ModalHeader>

            <div className="text-base font-normal leading-6 tracking-[-0.32px] text-[#72777A]">
              가입 시 입력한 이메일 주소를 입력해주세요.
              <br />
              임시 비밀번호를 발송해드립니다.
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col items-center gap-3"
            >
              {/* Success Message */}
              {success && (
                <div className="flex w-full items-center gap-2 rounded bg-green-50 px-4 py-3 text-sm text-green-600">
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
                  비밀번호 재설정 링크가 이메일로 전송되었습니다
                </div>
              )}

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
                <div className="flex w-full flex-col items-start">
                  <div className="flex h-11 w-40 items-start gap-1 px-0 py-4">
                    <div className="text-sm font-normal leading-4 text-gray-3">
                      아이디{" "}
                      <span className="text-sm leading-4 text-[#D65856]">
                        *
                      </span>
                    </div>
                  </div>

                  <div className="flex h-12 w-full items-center">
                    <div className="flex w-[200px] flex-col items-start gap-2.5 pr-3">
                      <FormField
                        control={form.control}
                        name="localPart"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <div className="flex w-[188px] h-12 flex-1 items-start justify-between self-stretch rounded border border-solid border-[#EBE1DF] bg-[#F4EFEA] px-4 py-3">
                                <input
                                  {...field}
                                  type="text"
                                  placeholder="email"
                                  className="flex-1 border-none bg-transparent text-base leading-6 tracking-[-0.32px] text-black outline-none placeholder:text-[#CCBCAB]"
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-1 items-center gap-3 self-stretch">
                      <div className="text-sm font-medium leading-4 text-gray-3">
                        @
                      </div>

                      <FormField
                        control={form.control}
                        name="domain"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <div
                                ref={dropdownRef}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="relative flex h-12 cursor-pointer items-start justify-between self-stretch rounded border border-solid border-[#EBE1DF] bg-[#F4EFEA] px-4 py-3"
                              >
                                <div className="flex-1 text-base leading-6 tracking-[-0.32px] text-[#CCBCAB]">
                                  {field.value || "직접입력"}
                                </div>
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.1717 17.0344C11.5683 17.6206 12.4317 17.6206 12.8283 17.0344L19.9904 6.44816C20.4396 5.78408 19.9639 4.88781 19.1621 4.88781H4.8379C4.03611 4.88781 3.56036 5.78408 4.00964 6.44816L11.1717 17.0344Z"
                                    fill="#911A00"
                                  />
                                </svg>

                                {isDropdownOpen && (
                                  <div className="absolute left-0 top-full z-10 mt-1 w-full overflow-hidden rounded border border-[#EBE1DF] bg-white shadow-md">
                                    {emailDomains.map((option) => (
                                      <div
                                        key={option}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          field.onChange(option);
                                          setIsDropdownOpen(false);
                                        }}
                                        className="cursor-pointer px-4 py-2 text-base hover:bg-orange-4"
                                      >
                                        {option}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || success}
                  className="flex h-auto w-full items-center justify-center gap-2.5 self-stretch rounded bg-[#911A00] px-[55px] py-5 hover:bg-[#911A00]/90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader size="sm" />
                  ) : (
                    <span className="text-lg font-bold leading-6 text-white">
                      비밀번호 찾기
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </ModalContent>
    </Modal>
  );
}

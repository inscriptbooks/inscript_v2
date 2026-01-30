"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Loader } from "@/components/common";
import { useState } from "react";
import { z } from "zod";
import FindIdResultModal from "./FindIdResultModal";
import axiosInstance from "@/lib/axios/client";

const FindIdFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z.string().min(1, "전화번호를 입력해주세요"),
});

type FindIdFormData = z.infer<typeof FindIdFormSchema>;

interface FindIdFormProps {
  onSubmit?: (data: FindIdFormData) => void;
}

export default function FindIdForm({ onSubmit }: FindIdFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foundEmail, setFoundEmail] = useState<string | null>(null);

  const form = useForm<FindIdFormData>({
    resolver: zodResolver(FindIdFormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const handleSubmit = async (data: FindIdFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/find-id", {
        name: data.name,
        phone: data.phone,
      });

      if (response.data.email) {
        setFoundEmail(response.data.email);
        setIsModalOpen(true);
      }

      onSubmit?.(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "아이디를 찾을 수 없습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFoundEmail(null);
    form.reset();
  };

  return (
    <div className="flex w-full max-w-[387px] flex-col items-center gap-[55px] pt-12 lg:pt-20">
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="이름을 입력해주세요"
                        className="h-14 rounded border border-red-3 bg-orange-4 px-5 py-4 text-base placeholder:text-orange-3"
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="전화번호를 입력해주세요"
                        className="h-14 rounded border border-red-3 bg-orange-4 px-5 py-4 text-base placeholder:text-orange-3"
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Button */}
            <div className="flex w-full flex-col gap-2.5">
              <Button
                type="submit"
                className="text-lg font-bold text-white"
                disabled={isLoading}
              >
                {isLoading ? <Loader size="sm" /> : "아이디 찾기"}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {/* Find ID Result Modal */}
      <FindIdResultModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        email={foundEmail}
      />
    </div>
  );
}

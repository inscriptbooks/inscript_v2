"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WriterEditFormData,
  WriterEditFormSchema,
} from "@/components/forms/schema/WriterEditFormSchema";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Close } from "@/components/icons";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface WriterEditFormProps {
  authorId?: string;
}

export default function WriterEditForm({ authorId }: WriterEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");

  const form = useForm<WriterEditFormData>({
    resolver: zodResolver(WriterEditFormSchema),
    defaultValues: {
      koreanName: "",
      englishName: "",
      featuredWork: "",
      keywords: [],
      introduction: "",
      visibility: "노출",
    },
  });

  // 수정 모드일 경우 기존 데이터 로드
  useEffect(() => {
    if (authorId) {
      const fetchAuthorData = async () => {
        try {
          const response = await fetch(`/api/admin/writers/${authorId}`);
          const result = await response.json();

          if (result.success && result.data) {
            const data = result.data;
            form.reset({
              koreanName: data.author_name || "",
              englishName: data.author_name_en || "",
              featuredWork: data.featured_work || "",
              keywords: Array.isArray(data.keyword) ? data.keyword : [],
              introduction: data.description || "",
              visibility: data.is_visible ? "노출" : "미노출",
            });
          }
        } catch (error) {
          showErrorToast("작가 정보를 불러오는데 실패했습니다.");
        }
      };

      fetchAuthorData();
    }
  }, [authorId, form]);

  const handleSubmit = async (data: WriterEditFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        koreanName: data.koreanName,
        englishName: data.englishName,
        featuredWork: data.featuredWork,
        keywords: data.keywords,
        introduction: data.introduction,
        visibility: data.visibility,
      };

      let response;
      if (authorId) {
        // 수정 모드
        response = await fetch(`/api/admin/writers/${authorId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // 신규 등록 모드
        response = await fetch("/api/admin/writers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await response.json();

      if (result.success) {
        showSuccessToast(result.message || "작가 정보가 저장되었습니다.");
        setTimeout(() => {
          router.push("/admin/writers");
        }, 1000);
      } else {
        // 상세한 에러 메시지 표시
        const errorMessage = result.error
          ? `${result.message} (${result.error})`
          : result.message || "저장에 실패했습니다.";
        showErrorToast(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `저장 중 오류가 발생했습니다: ${error.message}`
          : "저장 중 오류가 발생했습니다.";
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/writers");
  };

  const handlePreview = () => {
    // 미리보기 기능 구현 필요 시 추가
  };

  const { isValid } = form.formState;

  return (
    <div className="flex w-full items-start gap-2.5 p-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-20 rounded-[5px] bg-white p-11">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex w-full flex-col items-start gap-4"
          >
            {/* 헤더 */}
            <div className="flex w-full items-center justify-between">
              <h1 className="font-pretendard text-2xl font-semibold leading-8 text-gray-1">
                작가 관리
              </h1>
            </div>

            {/* 작가명 필드들 */}
            <div className="flex w-full items-start gap-4">
              {/* 작가(한) */}
              <FormField
                control={form.control}
                name="koreanName"
                render={({ field, fieldState }) => (
                  <FormItem className="flex flex-1 items-start">
                    <div className="flex w-40 items-start gap-1 px-0 py-4">
                      <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                        작가(한)
                      </span>
                      <span className="font-pretendard text-xl font-semibold leading-6 text-red">
                        *
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="작가명을 입력해주세요"
                        className="flex-1 bg-orange-4 placeholder:text-orange-3"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* 작가(영) */}
              <FormField
                control={form.control}
                name="englishName"
                render={({ field, fieldState }) => (
                  <FormItem className="flex flex-1 items-start">
                    <div className="flex w-40 items-start gap-1 px-0 py-4">
                      <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                        작가(영)
                      </span>
                      <span className="font-pretendard text-xl font-semibold leading-6 text-red">
                        *
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="작가명(영문)을 입력해주세요"
                        className="flex-1 bg-orange-4 placeholder:text-orange-3"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* 대표작 필드 */}
            <FormField
              control={form.control}
              name="featuredWork"
              render={({ field }) => (
                <FormItem className="flex h-14 w-full items-start">
                  <div className="flex h-14 w-40 items-start gap-1 px-0 py-4">
                    <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                      대표작
                    </span>
                  </div>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="대표작을 입력해주세요"
                      className="flex-1 bg-orange-4 placeholder:text-orange-3"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 키워드 필드 */}
            <FormField
              control={form.control}
              name="keywords"
              render={({ field, fieldState }) => (
                <FormItem className="flex w-full items-start">
                  <div className="flex w-40 items-start gap-1 px-0 py-4">
                    <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                      키워드
                    </span>
                    <span className="font-pretendard text-xl font-semibold leading-6 text-red">
                      *
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="키워드를 입력해주세요, 쉼표 (,)로 구분합니다."
                        className="bg-orange-4 placeholder:text-orange-3"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            // 한글 조합 중일 때는 무시
                            if (e.nativeEvent.isComposing) {
                              return;
                            }
                            const trimmedValue = keywordInput.trim();
                            if (
                              trimmedValue &&
                              !field.value.includes(trimmedValue) &&
                              field.value.length < 5
                            ) {
                              field.onChange([...field.value, trimmedValue]);
                              setKeywordInput("");
                            }
                          }
                        }}
                        onBlur={() => {
                          const trimmedValue = keywordInput.trim();
                          if (
                            trimmedValue &&
                            !field.value.includes(trimmedValue) &&
                            field.value.length < 5
                          ) {
                            field.onChange([...field.value, trimmedValue]);
                            setKeywordInput("");
                          }
                        }}
                      />
                    </FormControl>
                    {field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            size="md"
                            className="flex cursor-pointer items-center gap-1.5 rounded-full"
                            onClick={() => {
                              const newTags = field.value.filter(
                                (_: string, i: number) => i !== index
                              );
                              field.onChange(newTags);
                            }}
                          >
                            <span className="text-sm font-medium">{tag}</span>
                            <Close className="text-primary" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </FormItem>
              )}
            />

            {/* 작가 소개 필드 */}
            <FormField
              control={form.control}
              name="introduction"
              render={({ field, fieldState }) => (
                <FormItem className="flex h-[181px] w-full items-start">
                  <div className="flex h-14 w-40 items-start gap-1 px-0 py-4">
                    <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                      작가 소개
                    </span>
                    <span className="font-pretendard text-xl font-semibold leading-6 text-red">
                      *
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="작가 소개를 입력해주세요"
                      className="flex-1 bg-orange-4 placeholder:text-orange-3 h-[181px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 노출 여부 필드 */}
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem className="flex w-[590px] items-center">
                  <div className="flex h-14 w-40 items-center gap-1">
                    <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                      노출 여부
                    </span>
                    <span className="font-pretendard text-xl font-semibold leading-6 text-red">
                      *
                    </span>
                  </div>
                  <div className="flex items-center">
                    {/* 노출 라디오 */}
                    <div className="flex items-center gap-2.5 p-2">
                      <FormControl>
                        <div
                          className="flex h-6 w-6 cursor-pointer items-center justify-center"
                          onClick={() => field.onChange("노출")}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="0.8"
                              y="0.8"
                              width="22.4"
                              height="22.4"
                              rx="11.2"
                              stroke="#911A00"
                              strokeWidth="1.6"
                            />
                            {field.value === "노출" && (
                              <circle cx="12" cy="12" r="6" fill="#911A00" />
                            )}
                          </svg>
                        </div>
                      </FormControl>
                      <span className="font-pretendard text-base font-bold leading-6 tracking-[-0.32px] text-primary">
                        노출
                      </span>
                    </div>

                    {/* 미노출 라디오 */}
                    <div className="flex items-center gap-2.5 p-2">
                      <div
                        className="flex h-6 w-6 cursor-pointer items-center justify-center"
                        onClick={() => field.onChange("미노출")}
                      >
                        <div
                          className="h-6 w-6 rounded-full border-[1.6px] border-gray-3"
                          style={{
                            borderColor:
                              field.value === "미노출" ? "#911A00" : "#6D6D6D",
                          }}
                        >
                          {field.value === "미노출" && (
                            <div className="flex h-full w-full items-center justify-center rounded-full">
                              <div className="h-3 w-3 rounded-full bg-primary"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className={`font-pretendard text-base leading-6 tracking-[-0.32px] ${
                          field.value === "미노출"
                            ? "font-bold text-primary"
                            : "font-normal text-gray-3"
                        }`}
                      >
                        미노출
                      </span>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* 하단 버튼 영역 */}
            <div className="flex w-full items-center justify-end">
              {/* 미리보기 버튼 */}

              {/* 우측 버튼들 */}
              <div className="flex items-center gap-2.5">
                {/* 취소 버튼 */}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-1.5 rounded border border-primary bg-white px-3 py-2.5"
                >
                  <span className="font-pretendard text-sm font-semibold leading-4 tracking-[-0.28px] text-primary">
                    취소
                  </span>
                </button>

                {/* 저장 버튼 */}
                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="flex items-center justify-center gap-1.5 rounded bg-primary px-3 py-2.5 disabled:opacity-50"
                >
                  <span className="font-pretendard text-sm font-semibold leading-4 tracking-[-0.28px] text-white">
                    {isLoading ? "저장 중..." : "저장"}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

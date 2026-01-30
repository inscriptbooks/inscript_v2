"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgramAddFormData, ProgramAddFormSchema } from "./schema";
import { cn } from "@/lib/utils";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { FormInput, FormTextareaInput } from "../common/Input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Calendar, Plus, Search } from "@/components/icons";
import DateEdit from "@/components/ui/date-edit";
import { useState, useRef } from "react";
import { showSuccessToast, showErrorToast } from "../ui/toast";

interface ProgramAddFormProps {
  className?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  onPreview?: () => void;
  initialData?: {
    id: string;
    title: string;
    eventDateTime: string;
    applicationStartAt: string;
    applicationEndAt: string;
    location: string;
    capacity: number | null;
    notes: string;
    keyword: string[];
    description: string;
    smartstoreUrl: string;
    thumbnailUrl: string;
    isVisible: boolean;
  };
}

export default function ProgramAddForm({
  onSubmit,
  onCancel,
  onPreview,
  className,
  initialData,
}: ProgramAddFormProps) {
  const [showEventDatePicker, setShowEventDatePicker] = useState(false);
  const [showApplicationStartDatePicker, setShowApplicationStartDatePicker] =
    useState(false);
  const [showApplicationEndDatePicker, setShowApplicationEndDatePicker] =
    useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(
    initialData?.thumbnailUrl || null
  );
  const eventDateRef = useRef<HTMLDivElement>(null);
  const applicationStartDateRef = useRef<HTMLDivElement>(null);
  const applicationEndDateRef = useRef<HTMLDivElement>(null);

  const isEditMode = !!initialData;

  const form = useForm<ProgramAddFormData>({
    resolver: zodResolver(ProgramAddFormSchema),
    defaultValues: {
      programName: initialData?.title || "",
      eventDateTime: initialData?.eventDateTime
        ? new Date(initialData.eventDateTime)
        : undefined,
      applicationStartDate: initialData?.applicationStartAt
        ? new Date(initialData.applicationStartAt)
        : undefined,
      applicationEndDate: initialData?.applicationEndAt
        ? new Date(initialData.applicationEndAt)
        : undefined,
      location: initialData?.location || "",
      capacity: initialData?.capacity?.toString() || "",
      guidelines: initialData?.notes || "",
      keywords: initialData?.keyword?.join(", ") || "",
      description: initialData?.description || "",
      smartstoreUrl: initialData?.smartstoreUrl || "",
      image: undefined,
      visibility: initialData?.isVisible !== false ? "visible" : "hidden",
    },
  });

  const handleSubmit = async (data: ProgramAddFormData) => {
    try {
      // 등록 모드일 때 이미지 필수 체크
      if (!isEditMode && !data.image) {
        showErrorToast("대표 이미지를 첨부해주세요");
        return;
      }

      const formData = new FormData();
      formData.append("title", data.programName);
      formData.append("eventDateTime", data.eventDateTime.toISOString());
      formData.append(
        "applicationStartDate",
        data.applicationStartDate.toISOString()
      );
      formData.append(
        "applicationEndDate",
        data.applicationEndDate.toISOString()
      );
      if (data.location) {
        formData.append("location", data.location);
      }
      if (data.capacity) {
        formData.append("capacity", data.capacity);
      }
      if (data.guidelines) {
        formData.append("notes", data.guidelines);
      }
      if (data.keywords) {
        formData.append("keywords", data.keywords);
      }
      if (data.description) {
        formData.append("description", data.description);
      }
      formData.append("smartstoreUrl", data.smartstoreUrl);

      // 수정 모드일 때는 새 이미지가 있을 때만 추가
      if (isEditMode) {
        if (data.image) {
          formData.append("image", data.image);
        } else {
          // 빈 파일을 보내서 이미지 업데이트 안 함을 표시
          formData.append("image", new File([], ""));
        }
      } else {
        // 등록 모드일 때는 필수
        if (data.image) {
          formData.append("image", data.image);
        }
      }

      formData.append(
        "isVisible",
        data.visibility === "visible" ? "true" : "false"
      );

      const url = isEditMode
        ? `/api/programs/${initialData?.id}`
        : "/api/programs";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details ||
            errorData.error ||
            `프로그램 ${isEditMode ? "수정" : "등록"}에 실패했습니다.`
        );
      }

      showSuccessToast(
        `프로그램 ${isEditMode ? "수정" : "등록"}이 완료되었습니다.`
      );

      if (!isEditMode) {
        form.reset();
        setSelectedFile(null);
      }

      onSubmit?.();
    } catch (error) {
      showErrorToast(
        error instanceof Error
          ? error.message
          : `프로그램 ${isEditMode ? "수정" : "등록"}에 실패했습니다.`
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        showErrorToast("10MB 이하의 파일만 첨부 가능합니다.");
        return;
      }
      setSelectedFile(file);
      form.setValue("image", file, { shouldValidate: true });
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const { isValid } = form.formState;

  return (
    <Form {...form}>
      <form
        className={cn("flex w-full flex-col gap-4", className)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {/* 프로그램명 */}
        <FormField
          control={form.control}
          name="programName"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FormInput
                  label="프로그램명"
                  type="text"
                  placeholder="프로그램명을 입력해주세요"
                  required
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 행사일시 */}
        <FormField
          control={form.control}
          name="eventDateTime"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex w-full flex-col">
                <div className="flex items-center">
                  <FormLabel
                    className={cn(
                      "relative w-[65px] shrink-0 gap-1 font-semibold leading-6 text-gray-3 lg:w-40 lg:text-xl",
                      fieldState.error && "-top-2.5"
                    )}
                  >
                    행사일시
                    <span className="text-red">*</span>
                  </FormLabel>
                  <div className="flex w-full flex-col gap-1">
                    <div className="relative" ref={eventDateRef}>
                      <div
                        className={cn(
                          "flex h-12 items-center justify-between rounded border border-red-3 bg-orange-4 px-5 lg:h-14",
                          fieldState.error && "border-destructive"
                        )}
                      >
                        <input
                          type="text"
                          placeholder="프로그램 날짜를 선택해주세요"
                          value={formatDate(field.value)}
                          readOnly
                          className="flex-1 cursor-pointer bg-transparent text-sm placeholder:text-orange-3 focus:outline-none lg:text-base"
                          onClick={() =>
                            setShowEventDatePicker(!showEventDatePicker)
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowEventDatePicker(!showEventDatePicker)
                          }
                        >
                          <Calendar size={24} color="#911A00" />
                        </button>
                      </div>
                      {showEventDatePicker && (
                        <div className="absolute top-full z-50 mt-2">
                          <DateEdit
                            value={field.value}
                            onConfirm={(date) => {
                              const applicationStartDate = form.getValues(
                                "applicationStartDate"
                              );
                              if (
                                applicationStartDate &&
                                date < applicationStartDate
                              ) {
                                showErrorToast(
                                  "행사일시는 신청시작일 이후여야 합니다"
                                );
                                return;
                              }
                              field.onChange(date);
                              setShowEventDatePicker(false);
                            }}
                            onCancel={() => setShowEventDatePicker(false)}
                          />
                        </div>
                      )}
                    </div>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </div>
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* 신청시작일 & 신청종료일 */}
        <div className="flex w-full gap-4">
          {/* 신청시작일 */}
          <FormField
            control={form.control}
            name="applicationStartDate"
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <div className="flex w-full flex-col">
                  <div className="flex items-center">
                    <FormLabel
                      className={cn(
                        "relative w-[65px] shrink-0 gap-1 font-semibold leading-6 text-gray-3 lg:w-40 lg:text-xl",
                        fieldState.error && "-top-2.5"
                      )}
                    >
                      신청시작일
                      <span className="text-red">*</span>
                    </FormLabel>
                    <div className="flex w-full flex-col gap-1">
                      <div className="relative" ref={applicationStartDateRef}>
                        <div
                          className={cn(
                            "flex h-12 items-center justify-between rounded border border-red-3 bg-orange-4 px-5 lg:h-14",
                            fieldState.error && "border-destructive"
                          )}
                        >
                          <input
                            type="text"
                            placeholder="신청 시작 날짜를 선택해주세요"
                            value={formatDate(field.value)}
                            readOnly
                            className="flex-1 cursor-pointer bg-transparent text-sm placeholder:text-orange-3 focus:outline-none lg:text-base"
                            onClick={() =>
                              setShowApplicationStartDatePicker(
                                !showApplicationStartDatePicker
                              )
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowApplicationStartDatePicker(
                                !showApplicationStartDatePicker
                              )
                            }
                          >
                            <Calendar size={24} color="#911A00" />
                          </button>
                        </div>
                        {showApplicationStartDatePicker && (
                          <div className="absolute top-full z-50 mt-2">
                            <DateEdit
                              value={field.value}
                              onConfirm={(date) => {
                                field.onChange(date);
                                setShowApplicationStartDatePicker(false);
                              }}
                              onCancel={() =>
                                setShowApplicationStartDatePicker(false)
                              }
                            />
                          </div>
                        )}
                      </div>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </div>
                  </div>
                </div>
              </FormItem>
            )}
          />

          {/* 신청종료일 */}
          <FormField
            control={form.control}
            name="applicationEndDate"
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <div className="flex w-full flex-col">
                  <div className="flex items-center">
                    <FormLabel
                      className={cn(
                        "relative w-[65px] shrink-0 gap-1 font-semibold leading-6 text-gray-3 lg:w-40 lg:text-xl",
                        fieldState.error && "-top-2.5"
                      )}
                    >
                      신청종료일
                      <span className="text-red">*</span>
                    </FormLabel>
                    <div className="flex w-full flex-col gap-1">
                      <div className="relative" ref={applicationEndDateRef}>
                        <div
                          className={cn(
                            "flex h-12 items-center justify-between rounded border border-red-3 bg-orange-4 px-5 lg:h-14",
                            fieldState.error && "border-destructive"
                          )}
                        >
                          <input
                            type="text"
                            placeholder="신청 종료 날짜를 선택해주세요"
                            value={formatDate(field.value)}
                            readOnly
                            className="flex-1 cursor-pointer bg-transparent text-sm placeholder:text-orange-3 focus:outline-none lg:text-base"
                            onClick={() =>
                              setShowApplicationEndDatePicker(
                                !showApplicationEndDatePicker
                              )
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowApplicationEndDatePicker(
                                !showApplicationEndDatePicker
                              )
                            }
                          >
                            <Calendar size={24} color="#911A00" />
                          </button>
                        </div>
                        {showApplicationEndDatePicker && (
                          <div className="absolute top-full z-50 mt-2">
                            <DateEdit
                              value={field.value}
                              onConfirm={(date) => {
                                const applicationStartDate = form.getValues(
                                  "applicationStartDate"
                                );
                                if (
                                  applicationStartDate &&
                                  date <= applicationStartDate
                                ) {
                                  showErrorToast(
                                    "신청종료일은 신청시작일보다 이후여야 합니다"
                                  );
                                  return;
                                }
                                field.onChange(date);
                                setShowApplicationEndDatePicker(false);
                              }}
                              onCancel={() =>
                                setShowApplicationEndDatePicker(false)
                              }
                            />
                          </div>
                        )}
                      </div>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </div>
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* 장소 & 인원 */}
        <div className="flex w-full gap-4">
          {/* 장소 */}
          <FormField
            control={form.control}
            name="location"
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <FormInput
                    label="장소"
                    type="text"
                    placeholder="프로그램 진행 장소를 입력해주세요"
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* 인원 */}
          <FormField
            control={form.control}
            name="capacity"
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <FormInput
                    label="인원"
                    type="text"
                    placeholder="신청 가능한 인원수를 입력해주세요"
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* 안내사항 */}
        <FormField
          control={form.control}
          name="guidelines"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FormTextareaInput
                  label="안내사항"
                  placeholder="기타 안내사항을 입력해주세요"
                  className="h-[181px]"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 키워드 */}
        <FormField
          control={form.control}
          name="keywords"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FormInput
                  label="키워드"
                  type="text"
                  placeholder="키워드를 입력해주세요, 쉼표 (,)로 구분합니다."
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 프로그램 소개 */}
        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FormTextareaInput
                  label="프로그램 소개"
                  placeholder="프로그램에 대한 설명을 입력해주세요"
                  className="h-[181px]"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 스마트스토어 URL */}
        <FormField
          control={form.control}
          name="smartstoreUrl"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FormInput
                  label="스마트스토어"
                  type="text"
                  placeholder="신청 페이지 URL을 입력해주세요"
                  required
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 대표 이미지 */}
        <FormField
          control={form.control}
          name="image"
          render={({ fieldState }) => (
            <FormItem>
              <div className="flex w-full flex-col">
                <div className="flex items-center">
                  <FormLabel
                    className={cn(
                      "relative w-[65px] shrink-0 gap-1 font-semibold leading-6 text-gray-3 lg:w-40 lg:text-xl",
                      fieldState.error && "-top-2.5"
                    )}
                  >
                    대표 이미지
                    {!isEditMode && <span className="text-red">*</span>}
                  </FormLabel>
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center gap-4">
                      <label className="flex cursor-pointer items-center gap-2 rounded bg-red-2 px-[18px] py-[10px]">
                        <Plus size={24} color="#911A00" />
                        <span className="font-pretendard text-base text-primary">
                          파일 첨부하기
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <div className="flex flex-col gap-1">
                        <span className="font-pretendard text-sm text-primary">
                          10MB 이하의 파일만 첨부 가능합니다.
                        </span>
                        {selectedFile && (
                          <span className="font-pretendard text-sm text-gray-3">
                            선택된 파일: {selectedFile.name}
                          </span>
                        )}
                        {!selectedFile && existingImageUrl && (
                          <div className="flex items-center gap-2">
                            <span className="font-pretendard text-sm text-gray-3">
                              현재 이미지:
                            </span>
                            <img
                              src={existingImageUrl}
                              alt="현재 대표 이미지"
                              className="h-20 w-20 rounded object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </div>
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* 노출 여부 */}
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem className="flex h-12 items-center justify-between lg:h-14">
              <FormLabel className="w-[65px] shrink-0 leading-6 text-gray-3 lg:w-40 lg:text-xl">
                노출 여부
                <span className="text-red">*</span>
              </FormLabel>
              <FormControl>
                <FormItem className="flex w-full items-center">
                  <RadioGroup
                    className="flex w-full items-center gap-3"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <RadioGroupItem value="visible" />
                      </FormControl>
                      <FormLabel
                        className={cn(
                          "shrink-0 text-gray-3",
                          field.value === "visible" && "font-bold text-primary"
                        )}
                      >
                        노출
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <RadioGroupItem value="hidden" />
                      </FormControl>
                      <FormLabel
                        className={cn(
                          "shrink-0 text-gray-3",
                          field.value === "hidden" && "font-bold text-primary"
                        )}
                      >
                        미노출
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormItem>
              </FormControl>
            </FormItem>
          )}
        />

        {/* 하단 버튼 */}
        <div className="flex w-full items-center justify-end">
          {/* <Button
            type="button"
            onClick={onPreview}
            variant="outline"
            className="flex h-9 w-[94px] items-center justify-center gap-1.5 border-gray-4 bg-white hover:bg-gray-50"
          >
            <Search size={16} color="#555555" />
            <span className="font-pretendard text-sm font-bold text-gray-2">
              미리보기
            </span>
          </Button> */}

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="h-9 w-12 border-primary text-primary hover:bg-white/90"
            >
              <span className="font-pretendard text-sm font-bold">취소</span>
            </Button>
            <Button
              type="submit"
              className="h-9 w-12  bg-primary hover:bg-primary/90"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              <span className="font-pretendard text-sm font-bold text-white">
                저장
              </span>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

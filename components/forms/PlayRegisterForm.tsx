"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlayRegisterFormData, PlayRegisterFormSchema } from "./schema";
import { cn } from "@/lib/utils";
import { Form, FormField, FormItem, FormControl, FormLabel } from "../ui/form";
import { Button } from "../ui/button";
import { FormInput, FormTagInput, FormFileInput } from "../common/Input";
import FormTextareaInput from "../common/Input/FormTextareaInput";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { PublicStatus } from "@/models/play";
import { AuthorSelect } from "./components";
import { useCreatePlay } from "@/hooks/plays";
import { showSuccessToast, showErrorToast } from "../ui/toast";
import { useRouter } from "next/navigation";

interface PlayRegisterFormProps {
  className?: string;
  onSubmit?: () => void;
}

export default function PlayRegisterForm({
  onSubmit,
  className,
}: PlayRegisterFormProps) {
  const createPlay = useCreatePlay();
  const router = useRouter();

  const form = useForm<PlayRegisterFormData>({
    resolver: zodResolver(PlayRegisterFormSchema),
    defaultValues: {
      title: "",
      author: "",
      line1: "",
      line2: "",
      line3: "",
      year: "",
      country: "",
      keyword: [],
      plot: "",
      femaleCharacterCount: "",
      maleCharacterCount: "",
      characterList: [],
      publicStatus: PublicStatus.PUBLISHED,
      publicHistory: "",
      salesStatus: undefined,
      price: "",
      attachmentFile: undefined,
    },
  });

  const handleSubmit = async (data: PlayRegisterFormData) => {
    try {
      const { attachmentFile, ...rest } = data as any;
      let attachmentUrl: string | null = null;
      let attachmentName: string | null = null;

      // 파일이 있으면 먼저 업로드
      if (attachmentFile && attachmentFile.length > 0) {
        const file = attachmentFile[0];
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch("/api/plays/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          showErrorToast(errorData.error || "파일 업로드에 실패했습니다.");
          return;
        }

        const uploadedData = await uploadResponse.json();
        attachmentUrl = uploadedData.url;
        attachmentName = uploadedData.name;
      }

      // 파일 업로드 완료 후 희곡 등록
      await createPlay.mutateAsync({
        ...rest,
        attachmentUrl,
        attachmentName,
      });
      showSuccessToast("희곡 등록이 완료되었습니다.");
      form.reset();
      onSubmit?.();
      router.push("/play");
    } catch (error) {
      showErrorToast("희곡 등록에 실패했습니다.");
    }
  };

  const { isValid } = form.formState;
  const salesStatus = form.watch("salesStatus");
  const isSelling = salesStatus === "판매함";

  return (
    <Form {...form}>
      <form
        className={cn("flex w-full max-w-[590px] flex-col gap-4", className)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {/* 제목 - Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FormInput
                  label="제목"
                  type="text"
                  placeholder="제목을 입력해주세요"
                  required
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 작가 - Author */}
        <FormField
          control={form.control}
          name="author"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <AuthorSelect
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 대사1 - Line 1 */}
        <FormField
          control={form.control}
          name="line1"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FormTextareaInput
                  label="대사1"
                  placeholder="이 작품을 대표하는 대사를 찾아 입력해주세요"
                  className="h-[72px] lg:h-14"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 대사2 - Line 2 */}
        <FormField
          control={form.control}
          name="line2"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FormTextareaInput
                  label="대사2"
                  placeholder="이 작품을 대표하는 대사를 찾아 입력해주세요"
                  className="h-[72px] lg:h-14"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 대사3 - Line 3 */}
        <FormField
          control={form.control}
          name="line3"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FormTextareaInput
                  label="대사3"
                  placeholder="이 작품을 대표하는 대사를 찾아 입력해주세요"
                  className="h-[72px] lg:h-14"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 연도 - Year */}
        <FormField
          control={form.control}
          name="year"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FormInput
                  label="연도"
                  placeholder="작품이 발표된 연도를 입력해주세요"
                  error={fieldState.error?.message}
                  maxLength={4}
                  numericOnly
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 나라 - Country */}
        <FormField
          control={form.control}
          name="country"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FormInput
                  label="나라"
                  placeholder="작품이 발표된 나라를 입력해주세요"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 키워드 - Keyword */}
        <FormField
          control={form.control}
          name="keyword"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FormTagInput
                  label="키워드"
                  placeholder="대표 키워드 입력 후 엔터를 눌러주세요"
                  error={fieldState.error?.message}
                  value={field.value}
                  onChange={field.onChange}
                  required
                  maxLength={5}
                  onLengthExceed={() =>
                    showErrorToast("키워드는 5글자까지 입력 가능합니다.")
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 줄거리 - Plot */}
        <FormField
          control={form.control}
          name="plot"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FormTextareaInput
                  label="줄거리"
                  placeholder="작품의 요약 줄거리를 입력해주세요"
                  className="h-[185px] lg:h-[230px]"
                  error={fieldState.error?.message}
                  required
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 등장인물 수 - Character Count */}
        <div className="flex items-center justify-between">
          <Label className="w-[65px] shrink-0 leading-6 text-gray-3 lg:w-40 lg:text-xl">
            등장인물 수
          </Label>
          <div className="flex w-full items-center gap-3">
            <FormField
              control={form.control}
              name="femaleCharacterCount"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <FormInput
                      label="여"
                      placeholder="숫자입력"
                      labelClassName="w-7 lg:w-10"
                      error={fieldState.error?.message}
                      numericOnly
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maleCharacterCount"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <FormInput
                      label="남"
                      placeholder="숫자입력"
                      labelClassName="w-7 lg:w-10"
                      error={fieldState.error?.message}
                      numericOnly
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 등장인물 목록 - Character List */}
        <FormField
          control={form.control}
          name="characterList"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FormTagInput
                  label="등장인물 목록"
                  placeholder="작품을 대표하는 키워드를 입력해주세요"
                  error={fieldState.error?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 출간 여부 - Publication Status */}
        <FormField
          control={form.control}
          name="publicStatus"
          render={({ field }) => (
            <FormItem className="flex h-12 items-center justify-between">
              <FormLabel className="w-[65px] shrink-0 leading-6 text-gray-3 lg:w-40 lg:text-xl">
                출간 여부
              </FormLabel>
              <FormControl>
                <FormItem className="flex w-full items-center">
                  <RadioGroup
                    className="flex w-full items-center gap-3"
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <RadioGroupItem value={PublicStatus.PUBLISHED} />
                      </FormControl>
                      <FormLabel
                        className={cn(
                          "shrink-0 text-gray-3",
                          field.value === PublicStatus.PUBLISHED &&
                            "font-bold text-primary",
                        )}
                      >
                        출간
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <RadioGroupItem value={PublicStatus.UNPUBLISHED} />
                      </FormControl>
                      <FormLabel
                        className={cn(
                          "shrink-0 text-gray-3",
                          field.value === PublicStatus.UNPUBLISHED &&
                            "font-bold text-primary",
                        )}
                      >
                        미출간
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <RadioGroupItem value={PublicStatus.OUT_OF_PRINT} />
                      </FormControl>
                      <FormLabel
                        className={cn(
                          "shrink-0 text-gray-3",
                          field.value === PublicStatus.OUT_OF_PRINT &&
                            "font-bold text-primary",
                        )}
                      >
                        절판
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormItem>
              </FormControl>
            </FormItem>
          )}
        />

        {/* 출간 내역 - Publication History */}
        <FormField
          control={form.control}
          name="publicHistory"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FormInput
                  label="출간 내역"
                  type="text"
                  placeholder="출간 내역이 있는 경우 입력해주세요"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 구매 여부 - Sales Status */}
        <FormField
          control={form.control}
          name="salesStatus"
          render={({ field }) => (
            <FormItem className="flex h-12 items-center justify-between">
              <FormLabel className="w-[65px] shrink-0 leading-6 text-gray-3 lg:w-40 lg:text-xl">
                구매 여부 <span className="text-red">*</span>
              </FormLabel>
              <FormControl>
                <FormItem className="flex w-full items-center">
                  <RadioGroup
                    className="flex w-full items-center gap-3"
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <RadioGroupItem value="판매함" />
                      </FormControl>
                      <FormLabel
                        className={cn(
                          "shrink-0 text-gray-3",
                          field.value === "판매함" && "font-bold text-primary",
                        )}
                      >
                        판매함
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <RadioGroupItem value="판매 안 함" />
                      </FormControl>
                      <FormLabel
                        className={cn(
                          "shrink-0 text-gray-3",
                          field.value === "판매 안 함" &&
                            "font-bold text-primary",
                        )}
                      >
                        판매 안 함
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormItem>
              </FormControl>
            </FormItem>
          )}
        />

        {/* 판매 관련 필드 - 조건부 렌더링 */}
        {isSelling && (
          <>
            {/* 가격 - Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field, fieldState }) => {
                const formattedPrice = field.value
                  ? field.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : "";

                return (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        label="가격"
                        type="text"
                        inputMode="numeric"
                        placeholder="가격을 입력해주세요"
                        required={isSelling}
                        error={fieldState.error?.message}
                        value={formattedPrice}
                        onChange={(event) => {
                          const digitsOnly = event.target.value.replace(
                            /[^0-9]/g,
                            "",
                          );
                          field.onChange(digitsOnly);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            {/* 파일 첨부 - File Attachment */}
            <FormField
              control={form.control}
              name="attachmentFile"
              render={({ field: { onChange, ...field }, fieldState }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <FormFileInput
                      label="파일 첨부하기"
                      placeholder="PDF 파일을 업로드 해주세요"
                      required={isSelling}
                      error={fieldState.error?.message}
                      labelClassName="w-28"
                      accept=".pdf"
                      onChange={(e) => {
                        const files = e.target.files;
                        const f = files?.[0];
                        if (f && f.size > 10 * 1024 * 1024) {
                          showErrorToast("10MB 이하의 파일만 첨부 가능합니다.");
                          (e.currentTarget as HTMLInputElement).value = "";
                          return;
                        }
                        onChange(files);
                      }}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        <Button
          type="submit"
          className={cn(
            "mx-auto mt-1 w-full max-w-[335px] text-lg font-semibold disabled:bg-cancle disabled:text-cancle-foreground lg:max-w-[470px]",
          )}
          disabled={
            !isValid || form.formState.isSubmitting || createPlay.isPending
          }
        >
          {createPlay.isPending ? "등록 중..." : "희곡 등록 신청하기"}
        </Button>
      </form>
    </Form>
  );
}

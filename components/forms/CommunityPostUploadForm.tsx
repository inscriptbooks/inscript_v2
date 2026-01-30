"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState, Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import {
  Loader,
  RichTextEditor,
  FormInput,
  PostFormSelectInput,
} from "@/components/common";
import { Button } from "../ui/button";
import { showErrorToast } from "@/components/ui/toast";
import Plus from "@/components/icons/Plus";
import {
  CommunityPostUploadFormData,
  CommunityPostUploadFormSchema,
} from "./schema";
import { useCreatePost } from "@/hooks/posts";
import { useRouter, useSearchParams } from "next/navigation";
import {
  publicPostTypeOptionsMap,
  categoryOptionsMap,
  postTypeOptionsMap,
} from "@/models/post";
import { useUser } from "@/hooks/auth";

function CommunityPostUploadFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTypeParam = searchParams.get("type");
  const typeParam =
    rawTypeParam && rawTypeParam in postTypeOptionsMap ? rawTypeParam : "";
  const [file, setFile] = useState<File | null>(null);
  const { user } = useUser();
  const form = useForm<CommunityPostUploadFormData>({
    resolver: zodResolver(CommunityPostUploadFormSchema),
    defaultValues: {
      type: typeParam,
      category: "",
      title: "",
      content: "",
    },
  });

  // URL 파라미터가 변경되면 폼 값도 업데이트
  useEffect(() => {
    form.setValue("type", typeParam);
  }, [typeParam, form]);

  const selectedType = form.watch("type");
  const { mutate: createPost, isPending: isSubmitting } = useCreatePost();

  // 사용자 권한에 따라 게시판 옵션 결정
  const postTypeOptions =
    user?.role === "author"
      ? Object.values({
          ...publicPostTypeOptionsMap,
          author: postTypeOptionsMap.author,
        })
      : Object.values(publicPostTypeOptionsMap);

  // 카테고리 옵션
  const categoryOptions =
    selectedType && selectedType in categoryOptionsMap
      ? categoryOptionsMap[selectedType as keyof typeof categoryOptionsMap] ||
        []
      : [];

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

  const handleSubmit = (data: CommunityPostUploadFormData) => {
    createPost(
      { ...data, file },
      {
        onSuccess: (newPost) => {
          router.push(`/community/${newPost.type}/${newPost.id}`);
        },
        onError: (error) => {
          const msg =
            (error as any)?.response?.data?.error ||
            "업로드 중 오류가 발생했습니다. 10MB 이하의 파일만 첨부 가능합니다.";
          showErrorToast(msg);
        },
      }
    );
  };

  // 게시판이 변경될 때마다 말머리 값을 초기화
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "type" && value.type) {
        form.setValue("category", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mx-auto flex w-full max-w-[800px] flex-col gap-3"
      >
        {/* Board and Category Selects */}
        <div className="flex w-full flex-col gap-3 lg:flex-row">
          {/* Board Select */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <PostFormSelectInput
                    value={
                      field.value
                        ? postTypeOptionsMap[
                            field.value as keyof typeof postTypeOptionsMap
                          ]
                        : ""
                    }
                    onChange={(value) => {
                      // 한글 라벨을 영어 키로 변환
                      const englishKey =
                        (
                          Object.keys(postTypeOptionsMap) as Array<
                            keyof typeof postTypeOptionsMap
                          >
                        ).find((key) => postTypeOptionsMap[key] === value) ||
                        "";
                      field.onChange(englishKey);
                    }}
                    options={postTypeOptions}
                    placeholder="게시판을 선택해주세요"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Category Select */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <PostFormSelectInput
                    value={field.value}
                    onChange={field.onChange}
                    options={categoryOptions as string[]}
                    placeholder="말머리를 선택해주세요"
                    disabled={!form.watch("type")}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Title Input */}
        <FormField
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <FormItem className="flex w-full items-start">
              <FormControl>
                <FormInput
                  {...field}
                  label="제목"
                  placeholder="제목을 입력해주세요"
                  error={fieldState.error?.message}
                  labelClassName="shrink-0 font-bold"
                  required
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Rich Text Editor */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full">
              <FormControl>
                <RichTextEditor
                  placeholder="내용을 입력해주세요"
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* File Attachment Section */}
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
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

        {/* Submit Button */}
        <div className="flex w-full justify-end">
          <Button
            type="submit"
            variant={
              form.formState.isValid && !isSubmitting ? "default" : "disabled"
            }
            size="sm"
            disabled={!form.formState.isValid || isSubmitting}
          >
            {isSubmitting ? <Loader size="sm" /> : "업로드"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function CommunityPostUploadForm() {
  return (
    <Suspense
      fallback={
        <div className="flex w-full justify-center py-10">
          <Loader />
        </div>
      }
    >
      <CommunityPostUploadFormContent />
    </Suspense>
  );
}

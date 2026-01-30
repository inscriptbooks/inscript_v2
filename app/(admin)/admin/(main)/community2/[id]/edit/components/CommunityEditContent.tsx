"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ModalDropdown from "@/components/ui/modal-dropdown";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import {
  CommunityPostEditFormSchema,
  CommunityPostEditFormData,
} from "@/components/forms/schema";
import { useUpdatePost } from "@/hooks/posts";
import {
  PostType,
  postTypeOptionsMap,
  categoryOptionsMap,
} from "@/models/post";
import axiosInstance from "@/lib/axios/client";
import { Post } from "@/models/post";
import { Loader } from "@/components/common";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";

export default function CommunityEditContent() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [postData, setPostData] = useState<Post | null>(null);

  const form = useForm<CommunityPostEditFormData>({
    resolver: zodResolver(CommunityPostEditFormSchema),
    defaultValues: {
      type: "",
      category: "",
      title: "",
      content: "",
      isVisible: true,
    },
  });

  const { mutate: updatePost, isPending: isSubmitting } = useUpdatePost();

  // 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get<Post>(`/posts/${postId}`);
        const post = response.data;
        setPostData(post);

        // 폼 데이터 설정
        form.reset({
          type: post.type,
          category: post.category,
          title: post.title,
          content: post.content,
          isVisible: true, // 기본값, 필요시 post에서 가져올 수 있음
        });
      } catch (error) {
        showErrorToast("게시글을 불러오는데 실패했습니다.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, form, router]);

  const selectedType = form.watch("type") as PostType;

  // 게시판 옵션 (한글)
  const boardOptions = Object.values(postTypeOptionsMap);

  // 카테고리 옵션
  const categoryOptions = selectedType ? categoryOptionsMap[selectedType] : [];

  // 게시판이 변경될 때마다 카테고리 값을 초기화
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "type" && value.type) {
        form.setValue("category", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSave = (data: CommunityPostEditFormData) => {
    updatePost(
      {
        id: postId,
        type: data.type,
        category: data.category,
        title: data.title,
        content: data.content,
        isVisible: data.isVisible,
      },
      {
        onSuccess: () => {
          showSuccessToast("게시글이 수정되었습니다.");
          router.push("/admin/community2");
        },
        onError: (error) => {
          showErrorToast("게시글 수정에 실패했습니다.");
        },
      }
    );
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center p-8">
      <div className="flex w-full flex-col items-center gap-20 rounded-[5px] bg-white p-11">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSave)}
            className="flex w-full flex-col gap-4"
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-1">
                커뮤니티 등록 및 수정
              </h1>
            </div>

            {/* 게시판 선택 드롭다운 */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex h-[52px] w-full">
                  <FormControl>
                    <ModalDropdown
                      value={
                        field.value
                          ? postTypeOptionsMap[field.value as PostType]
                          : ""
                      }
                      onChange={(value) => {
                        // 한글 라벨을 영어 키로 변환
                        const englishKey =
                          Object.keys(postTypeOptionsMap).find(
                            (key) =>
                              postTypeOptionsMap[key as PostType] === value
                          ) || "";
                        field.onChange(englishKey);
                      }}
                      options={boardOptions}
                      placeholder="게시판을 선택해주세요"
                      className="h-[56px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 카테고리 선택 */}
            {selectedType && categoryOptions.length > 0 && (
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex h-[52px] w-full">
                    <FormControl>
                      <ModalDropdown
                        value={field.value}
                        onChange={field.onChange}
                        options={categoryOptions as string[]}
                        placeholder="말머리를 선택해주세요"
                        className="h-[56px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* 제목 입력 */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex h-14 w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="제목을 입력해주세요"
                      className="h-14 rounded-[4px] border border-red-3 bg-orange-4 px-5 py-4 text-base placeholder:text-orange-3"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 리치 텍스트 에디터 */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex w-full">
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="내용을 입력해주세요"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 노출 여부 */}
            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex w-[590px] items-center">
                  <div className="flex w-40 items-center gap-1">
                    <span className="text-xl font-bold text-gray-3">
                      노출 여부
                    </span>
                    <span className="text-xl font-bold text-red">*</span>
                  </div>
                  <FormControl>
                    <RadioGroup
                      value={field.value ? "show" : "hide"}
                      onValueChange={(value) =>
                        field.onChange(value === "show")
                      }
                      className="flex items-center"
                    >
                      <div className="flex items-center gap-2.5 px-2 py-2">
                        <RadioGroupItem value="show" className="text-primary">
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
                            <circle cx="12" cy="12" r="6" fill="#911A00" />
                          </svg>
                        </RadioGroupItem>
                        <span className="text-base font-bold leading-6 text-primary">
                          노출
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 px-2 py-2">
                        <RadioGroupItem value="hide" className="text-gray-3">
                          <div className="h-6 w-6 rounded-full border-[1.6px] border-gray-3"></div>
                        </RadioGroupItem>
                        <span className="text-base leading-6 text-gray-3">
                          미노출
                        </span>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 버튼 */}
            <div className="flex w-full justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="h-[36px] w-[48px] rounded-[4px] border border-primary bg-white px-3 py-2.5 text-sm font-bold text-primary hover:bg-white"
              >
                취소
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!form.formState.isValid || isSubmitting}
                className="h-[36px] w-[48px] rounded-[4px] bg-primary px-3 py-2.5 text-sm font-bold text-white hover:bg-primary/90"
              >
                {isSubmitting ? <Loader size="sm" /> : "저장"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

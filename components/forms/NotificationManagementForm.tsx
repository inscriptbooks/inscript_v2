"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import Toggle from "@/components/ui/toggle";
import {
  NotificationManagementFormData,
  NotificationManagementFormSchema,
} from "./schema";
import { useEffect } from "react";

interface NotificationManagementFormProps {
  onSubmit?: (data: NotificationManagementFormData) => void;
  defaultValues?: Partial<NotificationManagementFormData>;
}

interface NotificationItemProps {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function NotificationItem({
  title,
  description,
  checked,
  onCheckedChange,
}: NotificationItemProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 flex-col justify-between">
        <div className="font-pretendard text-base font-bold leading-6 text-gray-1">
          {title}
        </div>
        <div className="font-pretendard text-sm font-normal leading-5 tracking-[-0.28px] text-gray-2">
          {description}
        </div>
      </div>
      <Toggle checked={checked} onChange={onCheckedChange} />
    </div>
  );
}

export default function NotificationManagementForm({
  onSubmit,
  defaultValues,
}: NotificationManagementFormProps) {
  const form = useForm<NotificationManagementFormData>({
    resolver: zodResolver(NotificationManagementFormSchema),
    defaultValues: {
      memoComments: false,
      memoLikes: false,
      newPosts: false,
      postComments: false,
      postLikes: false,
      newPrograms: false,
      programMemoReminder: false,
      ...defaultValues,
    },
  });

  // defaultValues가 변경되면 폼 리셋
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        memoComments: defaultValues.memoComments ?? false,
        memoLikes: defaultValues.memoLikes ?? false,
        newPosts: defaultValues.newPosts ?? false,
        postComments: defaultValues.postComments ?? false,
        postLikes: defaultValues.postLikes ?? false,
        newPrograms: defaultValues.newPrograms ?? false,
        programMemoReminder: defaultValues.programMemoReminder ?? false,
      });
    }
  }, [defaultValues, form]);

  const handleSubmit = (data: NotificationManagementFormData) => {
    onSubmit?.(data);
  };

  return (
    <div className="flex w-full max-w-[692px] flex-col items-center gap-[26px]">
      {/* 제목 */}
      <div className="text-center text-xl font-bold leading-6 text-gray-1">
        알림
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex w-full flex-1 flex-col items-center gap-[60px]"
        >
          <div className="flex w-full flex-1 flex-col items-start gap-[69px]">
            {/* 메모 섹션 */}
            <div className="flex w-full flex-col items-start gap-5">
              <div className="font-pretendard text-xl font-bold leading-6 text-primary">
                메모
              </div>

              <FormField
                control={form.control}
                name="memoComments"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <NotificationItem
                        title="메모 댓글"
                        description="내 메모에 새 댓글이 등록됐을 때 알림을 받아요."
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="memoLikes"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <NotificationItem
                        title="메모 좋아요"
                        description="내 메모를 누군가 좋아했을 때 알림을 받아요."
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* 커뮤니티 섹션 */}
            <div className="flex w-full flex-col items-start gap-5">
              <div className="font-pretendard text-xl font-bold leading-6 text-primary">
                커뮤니티
              </div>

              <FormField
                control={form.control}
                name="newPosts"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <NotificationItem
                        title="새 게시글"
                        description="커뮤니티에 새 글이 게시되면 알림을 받아요."
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postComments"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <NotificationItem
                        title="게시물 댓글"
                        description="내 게시글에 새 댓글이 등록됐을 때 알림을 받아요."
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postLikes"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <NotificationItem
                        title="게시글 좋아요"
                        description="내 게시글을 누군가 좋아했을 때 알림을 받아요."
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* 프로그램 섹션 */}
            <div className="flex w-full flex-col items-start gap-5">
              <div className="font-pretendard text-xl font-bold leading-6 text-primary">
                프로그램
              </div>

              <FormField
                control={form.control}
                name="newPrograms"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <NotificationItem
                        title="새 프로그램"
                        description="새 프로그램이 등록되면 알림을 받아요."
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="programMemoReminder"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <NotificationItem
                        title="프로그램 종료 후 메모 작성"
                        description="참여한 프로그램에 후기 메모를 작성할 수 있도록 알림을 받아요."
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* 저장 버튼 */}
          <Button
            type="submit"
            className="w-full text-lg font-bold lg:w-[440px]"
          >
            변경 사항 저장하기
          </Button>
        </form>
      </Form>
    </div>
  );
}

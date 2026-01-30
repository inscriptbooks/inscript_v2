"use client";

import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "../ui/form";
import { EntryFormData, EntryFormSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/common";
import { useUser } from "@/hooks/auth";

interface EntryFormProps {
  username?: string;
  submitButtonText?: string;
  onSubmit?: (data: EntryFormData, resetForm: () => void) => void;
  isSubmitting?: boolean;
}

/**
 * 메모, 댓글 작성 공용 폼
 */
export default function EntryForm({
  submitButtonText,
  onSubmit,
  isSubmitting = false,
}: EntryFormProps) {
  const form = useForm<EntryFormData>({
    resolver: zodResolver(EntryFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = (data: EntryFormData) => {
    onSubmit?.(data, () => form.reset());
  };

  const { isValid } = form.formState;

  const currentContent = form.watch("content");
  const currentLength = currentContent?.length || 0;
  const { user } = useUser();

  return (
    <Form {...form}>
      <form
        className="flex min-h-[250px] flex-col gap-3 rounded-[4px] border border-red-3 bg-orange-4 px-6 py-5 lg:min-h-[300px]"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex w-full flex-1 flex-col gap-1.5">
          {user && (
            <span className="cursor-default text-sm font-medium text-gray-2">
              {user.name}
            </span>
          )}

          <FormField
            control={form.control}
            name="content"
            render={({ field: { onChange, ...fieldProps } }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    {...fieldProps}
                    maxLength={300}
                    className="border-none px-0 py-0 text-gray-3 placeholder:text-orange-3 focus-visible:ring-0 lg:px-0 lg:py-0"
                    placeholder={
                      "남기고 싶은 내용을 입력해주세요.\n최대 300자까지 입력할 수 있습니다."
                    }
                    onChange={(e) => {
                      const { value } = e.target;
                      if (value.length <= 300) {
                        onChange(value);
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex w-full justify-end border-t border-gray-5 pt-1">
            <span
              className={cn("items-end text-sm", {
                "text-destructive": currentLength === 300,
                "text-gray-1": currentLength < 300,
              })}
            >
              {currentLength} / 300
            </span>
          </div>
        </div>

        <Button
          type="submit"
          className="flex h-[52px] py-2.5 disabled:opacity-50 md:w-[184px]"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? <Loader size="sm" /> : submitButtonText}
        </Button>
      </form>
    </Form>
  );
}

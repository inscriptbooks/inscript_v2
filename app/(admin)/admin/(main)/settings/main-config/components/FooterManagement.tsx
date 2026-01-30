"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import {
  FooterManagementFormData,
  FooterManagementFormSchema,
} from "@/components/forms/schema";
import { useFooter, useSaveFooter } from "@/hooks/footer";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { FormInput } from "@/components/common/Input";
import { useLoader } from "@/hooks/common";

export default function FooterManagement() {
  const { data: footerData, isLoading } = useFooter();
  const saveFooter = useSaveFooter();
  const { showLoader, hideLoader } = useLoader();

  const form = useForm<FooterManagementFormData>({
    resolver: zodResolver(FooterManagementFormSchema),
    defaultValues: {
      companyName: "",
      businessNumber: "",
      address: "",
      email: "",
      mailOrderNumber: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  useEffect(() => {
    if (footerData) {
      form.reset({
        companyName: footerData.company_name || "",
        businessNumber: footerData.business_number || "",
        address: footerData.address || "",
        email: footerData.email || "",
        mailOrderNumber: footerData.mail_order_number || "",
        phone: footerData.phone || "",
      });
    }
  }, [footerData, form]);

  const handleSave = async (data: FooterManagementFormData) => {
    showLoader();
    try {
      await saveFooter.mutateAsync(data);
      showSuccessToast("저장되었습니다.");
    } catch (error) {
      showErrorToast("저장에 실패했습니다.");
    } finally {
      hideLoader();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSave)}
        className="flex flex-col items-center justify-center gap-10 self-stretch rounded-md bg-white p-11"
      >
        <div className="flex flex-col items-start gap-4 self-stretch">
          <div className="flex items-center justify-between self-stretch">
            <h2 className="font-pretendard text-xl font-bold text-gray-1">
              푸터 관리
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 self-stretch">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field, fieldState }) => (
                <FormItem className="flex items-start self-stretch">
                  <FormControl>
                    <FormInput
                      label="회사명"
                      placeholder="회사명을 입력해주세요"
                      labelClassName="w-40"
                      error={fieldState.error?.message}
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessNumber"
              render={({ field, fieldState }) => (
                <FormItem className="flex items-start self-stretch">
                  <FormControl>
                    <FormInput
                      label="사업자등록번호"
                      placeholder="사업자등록번호를 입력해주세요"
                      labelClassName="w-40"
                      error={fieldState.error?.message}
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <FormItem className="flex items-start self-stretch">
                  <FormControl>
                    <FormInput
                      label="주소"
                      placeholder="주소를 입력해주세요"
                      labelClassName="w-40"
                      error={fieldState.error?.message}
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem className="flex items-start self-stretch">
                  <FormControl>
                    <FormInput
                      label="이메일"
                      type="email"
                      placeholder="이메일을 입력해주세요"
                      labelClassName="w-40"
                      error={fieldState.error?.message}
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem className="flex items-start self-stretch">
                  <FormControl>
                    <FormInput
                      label="연락처"
                      placeholder="연락처를 입력해주세요"
                      labelClassName="w-40"
                      error={fieldState.error?.message}
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mailOrderNumber"
              render={({ field, fieldState }) => (
                <FormItem className="flex items-start self-stretch">
                  <FormControl>
                    <FormInput
                      label="통신판매업신고"
                      placeholder="통신판매업신고번호를 입력해주세요"
                      labelClassName="w-40"
                      error={fieldState.error?.message}
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-end self-stretch">
          <Button
            type="submit"
            size="sm"
            className="h-9 w-12 bg-primary"
            disabled={form.formState.isSubmitting || saveFooter.isPending}
          >
            저장
          </Button>
        </div>
      </form>
    </Form>
  );
}

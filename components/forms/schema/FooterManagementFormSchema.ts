import { z } from "zod";

export const FooterManagementFormSchema = z.object({
  companyName: z.string().min(1, "회사명을 입력해주세요"),
  businessNumber: z.string().min(1, "사업자등록번호를 입력해주세요"),
  address: z.string().min(1, "주소를 입력해주세요"),
  email: z.string().email("올바른 이메일 형식을 입력해주세요"),
  phone: z.string().min(1, "연락처를 입력해주세요"),
  mailOrderNumber: z.string().min(1, "통신판매업신고번호를 입력해주세요"),
});

export type FooterManagementFormData = z.infer<
  typeof FooterManagementFormSchema
>;

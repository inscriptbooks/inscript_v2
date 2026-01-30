import { z } from "zod";

export type ContactFormData = z.infer<typeof ContactFormSchema>;

export const ContactFormSchema = z.object({
  category: z.string().min(1, { message: "문의 유형을 선택해주세요." }),
  email: z.string().email({ message: "올바른 이메일 주소를 입력해주세요." }),
  name: z.string().min(1, { message: "이름을 입력해주세요." }),
  contact: z.string().min(1, { message: "연락처를 입력해주세요." }),
  title: z.string().min(1, { message: "제목을 입력해주세요." }),
  content: z.string().min(1, { message: "문의 내용을 입력해주세요." }),
  agreePrivacy: z.boolean().refine((val) => val === true, {
    message: "개인정보 수집 동의가 필요합니다.",
  }),
});

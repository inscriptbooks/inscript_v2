import { z } from "zod";

export type ProgramRegisterFormData = z.infer<typeof ProgramRegisterFormSchema>;

export const ProgramRegisterFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  email: z.string().email("올바른 이메일 형식을 입력해주세요"),
  phone: z.string().min(1, "휴대전화 번호를 입력해주세요"),
  agreeAll: z.boolean(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "이용약관 동의는 필수입니다",
  }),
  agreePrivacy: z.boolean().refine((val) => val === true, {
    message: "개인정보 수집 및 이용 동의는 필수입니다",
  }),
  agreeMarketing: z.boolean(),
});

import { z } from "zod";

export type SignUpFormData = z.infer<typeof SignUpFormSchema>;

export const SignUpFormSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "이메일을 입력해주세요." })
      .email({ message: "올바른 이메일 형식을 입력해주세요." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상 입력해주세요." })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
        message: "비밀번호는 영문과 숫자를 포함해야 합니다.",
      }),
    passwordConfirm: z
      .string()
      .min(1, { message: "비밀번호를 다시 입력해주세요." }),
    nickname: z
      .string()
      .min(2, { message: "닉네임은 2자 이상 입력해주세요." })
      .max(20, { message: "닉네임은 20자 이하로 입력해주세요." }),
    phone: z
      .string()
      .min(10, { message: "휴대전화번호를 입력해주세요." })
      .regex(/^[0-9]{10,11}$/, {
        message: "올바른 휴대전화번호 형식을 입력해주세요.",
      }),
    verificationCode: z
      .string()
      .min(1, { message: "인증번호를 입력해주세요." }),
    agreeAll: z.boolean(),
    agreeTerms: z.boolean().refine((value) => value === true, {
      message: "이용약관에 동의해주세요.",
    }),
    agreePrivacy: z.boolean().refine((value) => value === true, {
      message: "개인정보 수집 및 이용에 동의해주세요.",
    }),
    agreeMarketing: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

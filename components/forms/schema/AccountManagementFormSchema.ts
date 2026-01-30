import { z } from "zod";

export const AccountManagementFormSchema = z
  .object({
    userId: z.string().min(1, { message: "아이디를 입력해주세요." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상 입력해주세요." }),
    passwordConfirm: z
      .string()
      .min(1, { message: "비밀번호를 다시 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export type AccountManagementFormData = z.infer<
  typeof AccountManagementFormSchema
>;

import { z } from "zod";

export type AdminAccountRegisterFormData = z.infer<typeof AdminAccountRegisterFormSchema>;

export const AdminAccountRegisterFormSchema = z.object({
  name: z.string().min(1, { message: "이름을 입력해주세요." }),
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
  password: z.string().min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." }),
  passwordConfirm: z.string().min(1, { message: "비밀번호 확인을 입력해주세요." }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["passwordConfirm"],
});

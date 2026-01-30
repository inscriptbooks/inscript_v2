import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z.string().email("올바른 이메일 형식을 입력해주세요").min(1, "이메일을 입력해주세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
  autoLogin: z.boolean(),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;

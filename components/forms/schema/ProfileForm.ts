import { z } from "zod";

export const ProfileFormSchema = z.object({
  name: z.string().min(1, { message: "닉네임을 입력해주세요." }),
});

export type ProfileFormData = z.infer<typeof ProfileFormSchema>;

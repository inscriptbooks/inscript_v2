import { z } from "zod";

export type AuthorRequestFormData = z.infer<typeof AuthorRequestFormSchema>;

export const AuthorRequestFormSchema = z.object({
  authorName: z.string().min(1, { message: "작가명을 입력해주세요." }),
  representativeWork: z
    .string()
    .min(1, { message: "대표작 제목을 입력해주세요." }),
});

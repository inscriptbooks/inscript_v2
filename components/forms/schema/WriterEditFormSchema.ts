import { z } from "zod";

export type WriterEditFormData = z.infer<typeof WriterEditFormSchema>;

export const WriterEditFormSchema = z.object({
  koreanName: z.string().min(1, { message: "작가명(한)을 입력해주세요." }),
  englishName: z.string().min(1, { message: "작가명(영)을 입력해주세요." }),
  featuredWork: z.string().optional(),
  keywords: z.array(z.string()).min(1, { message: "키워드를 입력해주세요." }),
  introduction: z.string().min(1, { message: "작가 소개를 입력해주세요." }),
  visibility: z.enum(["노출", "미노출"]),
});

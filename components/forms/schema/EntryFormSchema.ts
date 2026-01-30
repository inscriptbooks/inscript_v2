import { z } from "zod";

export type EntryFormData = z.infer<typeof EntryFormSchema>;

export const EntryFormSchema = z.object({
  content: z.string().min(1, { message: "내용을 입력해주세요." }),
});

import { z } from "zod";

export const CommunityPostUploadFormSchema = z.object({
  type: z.string().min(1, "게시판을 선택해주세요"),
  category: z.string().min(1, "말머리를 선택해주세요"),
  title: z.string().min(1, "제목을 입력해주세요"),
  content: z.string().min(1, "내용을 입력해주세요"),
});

export type CommunityPostUploadFormData = z.infer<
  typeof CommunityPostUploadFormSchema
>;

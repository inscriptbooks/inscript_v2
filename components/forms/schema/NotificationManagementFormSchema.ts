import { z } from "zod";

export const NotificationManagementFormSchema = z.object({
  // 메모 관련 알림
  memoComments: z.boolean(),
  memoLikes: z.boolean(),

  // 커뮤니티 관련 알림
  newPosts: z.boolean(),
  postComments: z.boolean(),
  postLikes: z.boolean(),

  // 프로그램 관련 알림
  newPrograms: z.boolean(),
  programMemoReminder: z.boolean(),
});

export type NotificationManagementFormData = z.infer<
  typeof NotificationManagementFormSchema
>;

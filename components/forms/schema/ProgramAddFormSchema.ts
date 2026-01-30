import { z } from "zod";

export type ProgramAddFormData = z.infer<typeof ProgramAddFormSchema>;

export const ProgramAddFormSchema = z
  .object({
    programName: z.string().min(1, "프로그램명을 입력해주세요"),
    eventDateTime: z.date({
      message: "행사일시를 선택해주세요",
    }),
    applicationStartDate: z.date({
      message: "신청시작일을 선택해주세요",
    }),
    applicationEndDate: z.date({
      message: "신청종료일을 선택해주세요",
    }),
    location: z.string().optional(),
    capacity: z.string().optional(),
    guidelines: z.string().optional(),
    keywords: z.string().optional(),
    description: z.string().optional(),
    smartstoreUrl: z
      .string()
      .min(1, "스마트스토어 URL을 입력해주세요")
      .url("올바른 URL 형식을 입력해주세요"),
    image: z.instanceof(File).optional(),
    visibility: z.enum(["visible", "hidden"]),
  })
  .refine((data) => data.applicationEndDate > data.applicationStartDate, {
    message: "신청종료일은 신청시작일보다 이후여야 합니다",
    path: ["applicationEndDate"],
  })
  .refine((data) => data.eventDateTime >= data.applicationStartDate, {
    message: "행사일시는 신청시작일 이후여야 합니다",
    path: ["eventDateTime"],
  });

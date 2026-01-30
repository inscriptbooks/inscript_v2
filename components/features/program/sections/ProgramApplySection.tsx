// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
// import { FormInput } from "@/components/common/Input";
// import { CheckCircle } from "@/components/icons";
// import {
//   ProgramRegisterFormData,
//   ProgramRegisterFormSchema,
// } from "@/components/forms/schema";
// import { useCreateProgramApplication } from "@/hooks/programApplications";
// import { toast } from "sonner";
// import { showSuccessToast } from "@/components/ui/toast";
// import { useLoginRequired } from "@/hooks/common/useLoginRequired";
// import { Loader } from "@/components/common";

// interface ProgramApplySectionProps {
//   programId: string;
//   className?: string;
//   onSuccess?: () => void;
// }

// export default function ProgramApplySection({
//   programId,
//   className,
//   onSuccess,
// }: ProgramApplySectionProps) {
//   const { requireAuth } = useLoginRequired();

//   const form = useForm<ProgramRegisterFormData>({
//     resolver: zodResolver(ProgramRegisterFormSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       phone: "",
//       agreeAll: false,
//       agreeTerms: false,
//       agreePrivacy: false,
//       agreeMarketing: false,
//     },
//   });

//   const { mutate: createApplication, isPending } =
//     useCreateProgramApplication();

//   const handleSubmit = (data: ProgramRegisterFormData) => {
//     requireAuth(() => {
//       createApplication(
//         {
//           programId,
//           name: data.name,
//           email: data.email,
//           phone: data.phone,
//           agreeTerms: data.agreeTerms,
//           agreePrivacy: data.agreePrivacy,
//           agreeMarketing: data.agreeMarketing,
//         },
//         {
//           onSuccess: () => {
//             showSuccessToast("프로그램 신청이 완료되었습니다.");
//             form.reset();
//             onSuccess?.();
//           },
//           onError: (error: Error) => {
//             toast.error(error.message);
//           },
//         }
//       );
//     });
//   };

//   const watchedValues = form.watch();

//   // Handle "전체 동의" logic
//   const handleAgreeAllChange = (checked: boolean) => {
//     form.setValue("agreeAll", checked, { shouldValidate: true });
//     form.setValue("agreeTerms", checked, { shouldValidate: true });
//     form.setValue("agreePrivacy", checked, { shouldValidate: true });
//     form.setValue("agreeMarketing", checked, { shouldValidate: true });
//   };

//   // Update "전체 동의" when individual checkboxes change
//   const handleIndividualChange = (
//     field: keyof ProgramRegisterFormData,
//     checked: boolean
//   ) => {
//     form.setValue(field, checked, { shouldValidate: true });

//     const allChecked =
//       (field === "agreeTerms" ? checked : watchedValues.agreeTerms) &&
//       (field === "agreePrivacy" ? checked : watchedValues.agreePrivacy) &&
//       (field === "agreeMarketing" ? checked : watchedValues.agreeMarketing);

//     form.setValue("agreeAll", allChecked, { shouldValidate: true });
//   };

//   // Check if form is valid for submission
//   const isFormValid =
//     watchedValues.name &&
//     watchedValues.email &&
//     watchedValues.phone &&
//     watchedValues.agreeTerms &&
//     watchedValues.agreePrivacy;

//   return (
//     <Form {...form}>
//       <form
//         className={cn(
//           "flex w-full flex-col gap-5 px-[20px] py-11 lg:gap-11 lg:px-[120px]",
//           className
//         )}
//         onSubmit={form.handleSubmit(handleSubmit)}
//       >
//         {/* Title */}
//         <h1 className="w-full font-serif text-2xl font-bold leading-8 text-gray-1 lg:text-[28px] lg:leading-8">
//           프로그램 신청하기
//         </h1>

//         <div className="flex w-full flex-col justify-between gap-11 lg:flex-row">
//           {/* Form Section */}
//           <div className="flex w-full basis-[60%] flex-col justify-between">
//             <div className="flex w-full flex-col gap-4">
//               {/* Name Input */}
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field, fieldState }) => (
//                   <FormItem>
//                     <FormControl>
//                       <FormInput
//                         labelClassName="text-gray-2 font-bold w-[80px] shrink-0"
//                         label="이름"
//                         type="text"
//                         placeholder="이름을 입력해주세요"
//                         error={fieldState.error?.message}
//                         required
//                         {...field}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               {/* Email Input */}
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field, fieldState }) => (
//                   <FormItem>
//                     <FormControl>
//                       <FormInput
//                         labelClassName="text-gray-2 font-bold w-[80px] shrink-0"
//                         label="이메일"
//                         type="email"
//                         placeholder="example@example.com"
//                         error={fieldState.error?.message}
//                         required
//                         {...field}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               {/* Phone Input */}
//               <FormField
//                 control={form.control}
//                 name="phone"
//                 render={({ field, fieldState }) => (
//                   <FormItem>
//                     <FormControl>
//                       <FormInput
//                         labelClassName="font-bold text-gray-2 w-[80px] shrink-0"
//                         label="휴대전화"
//                         type="tel"
//                         placeholder="01012341234"
//                         error={fieldState.error?.message}
//                         required
//                         {...field}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               {/* Terms Agreement Section */}
//               <div className="flex w-full flex-col">
//                 <div className="flex flex-col gap-4 lg:flex-row lg:gap-0">
//                   <div className="flex w-[160px] shrink-0 gap-1">
//                     <span className="font-bold leading-6 text-gray-2 lg:text-xl">
//                       이용약관동의
//                     </span>
//                     <span className="font-bold leading-6 text-red lg:text-xl">
//                       *
//                     </span>
//                   </div>

//                   <div className="flex flex-1 flex-col gap-2">
//                     {/* 전체 동의 */}
//                     <div className="flex items-center gap-2 py-2">
//                       <CheckCircle
//                         checked={watchedValues.agreeAll}
//                         onChange={handleAgreeAllChange}
//                       />
//                       <span className="text-base font-normal text-gray-1">
//                         전체 동의합니다.
//                       </span>
//                     </div>

//                     {/* 이용약관 동의 */}
//                     <div className="flex items-center gap-2 py-2">
//                       <CheckCircle
//                         checked={watchedValues.agreeTerms}
//                         onChange={(checked) =>
//                           handleIndividualChange("agreeTerms", checked)
//                         }
//                       />
//                       <div className="flex flex-1 items-center justify-between">
//                         <span
//                           className={cn(
//                             "text-base font-normal",
//                             watchedValues.agreeTerms
//                               ? "text-primary"
//                               : "text-gray-1"
//                           )}
//                         >
//                           [필수] 이용약관동의
//                         </span>
//                         <button
//                           type="button"
//                           className="text-sm font-bold leading-4 text-orange-2"
//                         >
//                           약관보기
//                         </button>
//                       </div>
//                     </div>

//                     {/* 개인정보 수집 및 이용 동의 */}
//                     <div className="flex items-center gap-2 py-2">
//                       <CheckCircle
//                         checked={watchedValues.agreePrivacy}
//                         onChange={(checked) =>
//                           handleIndividualChange("agreePrivacy", checked)
//                         }
//                       />
//                       <div className="flex flex-1 items-center justify-between">
//                         <span
//                           className={cn(
//                             "text-base font-normal",
//                             watchedValues.agreePrivacy
//                               ? "text-primary"
//                               : "text-gray-1"
//                           )}
//                         >
//                           [필수] 개인정보 수집 및 이용 동의
//                         </span>
//                         <button
//                           type="button"
//                           className="text-sm font-bold leading-4 text-orange-2"
//                         >
//                           약관보기
//                         </button>
//                       </div>
//                     </div>

//                     {/* 이벤트 정보 수신 동의 */}
//                     <div className="flex items-center gap-2 py-2">
//                       <CheckCircle
//                         checked={watchedValues.agreeMarketing}
//                         onChange={(checked) =>
//                           handleIndividualChange("agreeMarketing", checked)
//                         }
//                       />
//                       <div className="flex flex-1 items-center justify-between">
//                         <span
//                           className={cn(
//                             "text-base font-normal",
//                             watchedValues.agreeMarketing
//                               ? "text-primary"
//                               : "text-gray-1"
//                           )}
//                         >
//                           [선택] 이벤트 등 정보 수신 동의
//                         </span>
//                         <button
//                           type="button"
//                           className="text-sm font-bold leading-4 text-orange-2"
//                         >
//                           약관보기
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Program Information Section */}
//           <div className="flex w-full basis-[40%] flex-col justify-between">
//             <div className="flex flex-col gap-[31px]">
//               {/* Date */}
//               <div className="flex flex-col gap-2.5">
//                 <h3 className="text-lg font-bold leading-6 text-gray-1 lg:text-xl">
//                   날짜
//                 </h3>
//                 <p className="text-base font-normal leading-6 text-gray-2">
//                   2025.09.04 18:00
//                 </p>
//               </div>

//               {/* Location */}
//               <div className="flex flex-col gap-2.5">
//                 <h3 className="text-lg font-bold leading-6 text-gray-1 lg:text-xl">
//                   장소
//                 </h3>
//                 <p className="text-base font-normal leading-6 text-gray-2">
//                   인스크립트
//                 </p>
//               </div>

//               {/* Additional Information */}
//               <div className="flex flex-col gap-2.5">
//                 <h3 className="text-lg font-bold leading-6 text-gray-1 lg:text-xl">
//                   기타 안내사항
//                 </h3>
//                 <p className="text-base font-normal leading-6 text-gray-2">
//                   인원 수 등 기타 안내사항을 적을 수 있는 텍스트 칸입니다.
//                 </p>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <Button
//               type="submit"
//               className="mt-8 h-16 w-full rounded-[4px] bg-primary px-[55px] py-5 text-lg font-bold text-white hover:bg-primary/90 disabled:bg-cancle disabled:text-cancle-foreground"
//               disabled={!isFormValid || isPending}
//             >
//               {isPending ? <Loader size="sm" /> : "신청하기"}
//             </Button>
//           </div>
//         </div>
//       </form>
//     </Form>
//   );
// }

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "../ui/form";
import { SignUpFormData, SignUpFormSchema } from "./schema";
import FormInput from "@/components/common/Input/FormInput";
import { cn } from "@/lib/utils";
import { CheckCircle } from "@/components/icons";
import { useSignUp } from "@/hooks/auth/mutations";
import { Loader } from "@/components/common";
import SignUpSuccessModal from "./SignUpSuccessModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import TermsContent from "./TermsContent";
import PrivacyContent from "./PrivacyContent";
import MarketingContent from "./MarketingContent";

interface SignUpFormProps {
  onSubmit?: (data: SignUpFormData) => void;
}

export default function SignUpForm({ onSubmit }: SignUpFormProps) {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showMarketingModal, setShowMarketingModal] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const { signUp, isLoading: isSigningUp } = useSignUp();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      nickname: "",
      phone: "",
      verificationCode: "",
      agreeAll: false,
      agreeTerms: false,
      agreePrivacy: false,
      agreeMarketing: false,
    },
  });

  const handleSubmit = (data: SignUpFormData) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      signUp(
        {
          email: data.email,
          password: data.password,
          nickname: data.nickname,
          phone: data.phone,
          agreeMarketing: data.agreeMarketing,
        },
        {
          onSuccess: () => {
            setShowSuccessModal(true);
          },
        }
      );
    }
  };

  const checkEmailAvailability = async () => {
    const email = form.getValues("email");
    if (!email) return;

    setCheckingEmail(true);
    setEmailChecked(false);
    setEmailAvailable(false);
    form.clearErrors("email");
    try {
      const res = await axios.get(
        `/api/users/email/${encodeURIComponent(email)}`
      );
      if (res.data && res.data.available) {
        setEmailAvailable(true);
        setEmailChecked(true);
      } else {
        setEmailAvailable(false);
        setEmailChecked(true);
        form.setError("email", {
          type: "manual",
          message: "이미 사용 중인 아이디입니다.",
        });
      }
    } catch (_e) {
      form.setError("email", {
        type: "manual",
        message: "중복 확인 중 오류가 발생했습니다.",
      });
      setEmailAvailable(false);
      setEmailChecked(false);
    } finally {
      setCheckingEmail(false);
    }
  };

  const checkNicknameAvailability = async () => {
    const nickname = form.getValues("nickname");
    if (!nickname) return;

    setCheckingNickname(true);
    // 이전 에러/상태 초기화
    setNicknameChecked(false);
    setNicknameAvailable(false);
    form.clearErrors("nickname");
    try {
      const res = await axios.get(
        `/api/users/nickname/${encodeURIComponent(nickname)}`
      );
      if (res.data && res.data.available) {
        setNicknameAvailable(true);
        setNicknameChecked(true);
      } else {
        setNicknameAvailable(false);
        setNicknameChecked(true);
        form.setError("nickname", {
          type: "manual",
          message: "이미 사용 중인 닉네임입니다.",
        });
      }
    } catch (_e) {
      form.setError("nickname", {
        type: "manual",
        message: "중복 확인 중 오류가 발생했습니다.",
      });
      setNicknameAvailable(false);
      setNicknameChecked(false);
    } finally {
      setCheckingNickname(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push("/auth");
  };

  const watchedValues = form.watch();
  const { isValid, errors } = form.formState;
  const watchedPhone = form.watch("phone");
  const watchedNickname = form.watch("nickname");
  const watchedEmail = form.watch("email");

  // 가입하기 버튼 활성화 조건
  const isFormValid =
    watchedValues.email &&
    watchedValues.password &&
    watchedValues.passwordConfirm &&
    watchedValues.nickname &&
    watchedValues.phone &&
    watchedValues.verificationCode &&
    watchedValues.agreeTerms &&
    watchedValues.agreePrivacy &&
    codeVerified &&
    emailChecked &&
    emailAvailable &&
    nicknameChecked &&
    nicknameAvailable &&
    !errors.email &&
    !errors.password &&
    !errors.passwordConfirm &&
    !errors.nickname &&
    !errors.phone &&
    !errors.verificationCode;

  useEffect(() => {
    setCodeVerified(false);
    setCodeSent(false);
    setTimeLeft(0);
  }, [watchedPhone]);

  // 이메일 변경 시 중복확인 초기화
  useEffect(() => {
    setEmailChecked(false);
    setEmailAvailable(false);
  }, [watchedEmail]);

  // 닉네임 변경 시 중복확인 초기화
  useEffect(() => {
    setNicknameChecked(false);
    setNicknameAvailable(false);
  }, [watchedNickname]);

  // 인증 완료 시 폼 재검증 트리거
  useEffect(() => {
    if (codeVerified) {
      form.trigger();
    }
  }, [codeVerified, form]);

  // Handle "전체 동의" checkbox
  const handleAgreeAllChange = (checked: boolean) => {
    form.setValue("agreeAll", checked);
    form.setValue("agreeTerms", checked);
    form.setValue("agreePrivacy", checked);
    form.setValue("agreeMarketing", checked);
  };

  // Update "전체 동의" when individual checkboxes change
  const handleIndividualChange = (
    field: keyof SignUpFormData,
    checked: boolean
  ) => {
    form.setValue(field, checked);

    const allChecked =
      (field === "agreeTerms" ? checked : watchedValues.agreeTerms) &&
      (field === "agreePrivacy" ? checked : watchedValues.agreePrivacy) &&
      (field === "agreeMarketing" ? checked : watchedValues.agreeMarketing);

    form.setValue("agreeAll", allChecked);
  };

  const sendVerificationCode = async () => {
    const phone = form.getValues("phone");
    if (!phone) return;

    setCodeVerified(false);
    setIsSendingCode(true);
    try {
      const response = await axios.post("/api/sms/send", {
        phone_number: phone,
      });

      if (response.data.success) {
        setCodeSent(true);
        setTimeLeft(180);

        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setCodeSent(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      // 에러 처리
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyCode = async () => {
    const phone = form.getValues("phone");
    const code = form.getValues("verificationCode");

    if (!phone || !code) return;

    setIsVerifyingCode(true);
    try {
      const response = await axios.post("/api/sms/verify", {
        phone_number: phone,
        code: code,
      });

      if (response.data.success) {
        setCodeVerified(true);
      }
    } catch (error) {
      // 에러 처리
    } finally {
      setIsVerifyingCode(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full max-w-[760px] flex-col gap-[52px] px-[20px] pt-12 lg:px-[120px] lg:pt-20"
      >
        {/* Form Fields */}
        <div className="flex flex-col gap-11">
          <div className="flex flex-col gap-4">
            <div className="relative flex flex-col gap-4 lg:flex-row">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <FormInput
                        {...field}
                        labelClassName="w-[80px]"
                        type="email"
                        label="아이디"
                        required
                        placeholder="example@example.com"
                        error={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!emailChecked || !emailAvailable ? (
                <div className="flex gap-2 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:translate-x-[calc(100%+16px)]">
                  <Button
                    type="button"
                    size="sm"
                    variant={watchedValues.email ? "default" : "disabled"}
                    onClick={checkEmailAvailability}
                    disabled={!watchedValues.email || checkingEmail}
                    className="w-[184px] h-[56px]"
                  >
                    {checkingEmail ? <Loader size="sm" /> : "중복확인"}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 lg:absolute lg:right-0 lg:h-full lg:translate-x-[calc(100%+16px)]">
                  <span className="text-sm font-medium text-green-600">
                    사용 가능한 아이디입니다
                  </span>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <FormInput
                      {...field}
                      labelClassName="w-[80px]"
                      type="password"
                      label="비밀번호"
                      required
                      placeholder="비밀번호를 입력해주세요"
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <FormInput
                      {...field}
                      labelClassName="w-[80px]"
                      type="password"
                      label="비밀번호 확인"
                      required
                      placeholder="비밀번호를 한번 더 입력해주세요"
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="relative flex flex-col gap-4 lg:flex-row">
              <FormField
                control={form.control}
                name="nickname"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <FormInput
                        {...field}
                        labelClassName="w-[80px]"
                        label="닉네임"
                        required
                        placeholder="닉네임을 입력해주세요"
                        error={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!nicknameChecked || !nicknameAvailable ? (
                <div className="flex gap-2 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:translate-x-[calc(100%+16px)]">
                  <Button
                    type="button"
                    size="sm"
                    variant={watchedValues.nickname ? "default" : "disabled"}
                    onClick={checkNicknameAvailability}
                    disabled={!watchedValues.nickname || checkingNickname}
                    className="w-[184px] h-[56px]"
                  >
                    {checkingNickname ? <Loader size="sm" /> : "중복확인"}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 lg:absolute lg:right-0 lg:h-full lg:translate-x-[calc(100%+16px)]">
                  <span className="text-sm font-medium text-green-600">
                    사용 가능한 닉네임입니다
                  </span>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <FormInput
                      {...field}
                      labelClassName="w-[80px]"
                      label="휴대전화"
                      required
                      placeholder="숫자만 입력해주세요"
                      numericOnly
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Verification Code with Button */}

            <div className="relative flex flex-col gap-4 lg:flex-row">
              <FormField
                control={form.control}
                name="verificationCode"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <FormInput
                        {...field}
                        labelClassName="w-[80px]"
                        label="인증번호"
                        placeholder="인증번호를 입력해주세요"
                        error={fieldState.error?.message}
                        disabled={codeVerified}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!codeVerified && (
                <div className="flex gap-2 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:translate-x-[calc(100%+16px)]">
                  <Button
                    type="button"
                    size="sm"
                    variant={
                      watchedValues.phone && !codeSent ? "default" : "disabled"
                    }
                    onClick={sendVerificationCode}
                    disabled={!watchedValues.phone || isSendingCode || codeSent}
                    className="w-[184px] h-[56px]"
                  >
                    {isSendingCode ? <Loader size="sm" /> : "인증번호 발송"}
                  </Button>
                  {codeSent && (
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        watchedValues.verificationCode ? "default" : "disabled"
                      }
                      onClick={verifyCode}
                      disabled={
                        !watchedValues.verificationCode || isVerifyingCode
                      }
                      className="w-[184px] h-[56px]"
                    >
                      {isVerifyingCode ? <Loader size="sm" /> : "검증"}
                    </Button>
                  )}
                </div>
              )}
              {codeVerified && (
                <div className="flex items-center gap-2 lg:absolute lg:right-0 lg:h-full lg:translate-x-[calc(100%+16px)]">
                  {/* <CheckCircle checked={true} onChange={() => {}} /> */}
                  <span className="text-sm font-medium text-green-600">
                    인증되었습니다
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Author Member Info */}
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-xl font-bold text-primary">
              작가 회원이신가요?
            </h3>
            <p className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-3">
              작가 회원 신청은 회원가입 후, 마이페이지에서 신청할 수 있습니다.
              작가 회원이 되면, 작가 페이지 생성, 전용 커뮤니티, 멤버십 구독료
              50%할인 등 다양한 혜택을 누리실 수 있습니다.
            </p>
          </div>

          {/* Terms Agreement */}
          <div className="flex flex-col gap-1 rounded bg-gray-7 px-6 py-5">
            <div className="flex h-14 items-center gap-1">
              <span className="text-xl font-bold text-gray-3">
                이용약관동의
              </span>
              <span className="text-xl font-bold text-red">*</span>
            </div>

            <div className="flex w-full flex-col">
              {/* 전체 동의 */}
              <div className="flex w-full items-center gap-2 py-2">
                <CheckCircle
                  checked={watchedValues.agreeAll}
                  onChange={handleAgreeAllChange}
                />
                <span className="text-sm font-medium text-gray-3 lg:text-base">
                  전체 동의합니다.
                </span>
              </div>

              {/* 개별 동의 항목들 */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <CheckCircle
                    checked={watchedValues.agreeTerms}
                    onChange={(checked) =>
                      handleIndividualChange("agreeTerms", checked)
                    }
                  />
                  <span
                    className={cn(
                      "text-sm font-medium leading-5 lg:text-base",
                      watchedValues.agreeTerms ? "text-primary" : "text-gray-3"
                    )}
                  >
                    [필수] 이용약관동의
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="shrink-0 text-sm font-medium leading-4 tracking-[-0.28px] text-orange-2"
                >
                  약관보기
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <CheckCircle
                    checked={watchedValues.agreePrivacy}
                    onChange={(checked) =>
                      handleIndividualChange("agreePrivacy", checked)
                    }
                  />
                  <span
                    className={cn(
                      "text-sm font-medium lg:text-base",
                      watchedValues.agreePrivacy
                        ? "text-primary"
                        : "text-gray-3"
                    )}
                  >
                    [필수] 개인정보 수집 및 이용 동의
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="shrink-0 text-sm font-medium leading-4 tracking-[-0.28px] text-orange-2"
                >
                  약관보기
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <CheckCircle
                    checked={watchedValues.agreeMarketing}
                    onChange={(checked) =>
                      handleIndividualChange("agreeMarketing", checked)
                    }
                  />
                  <span
                    className={cn(
                      "text-sm font-medium lg:text-base",
                      watchedValues.agreeMarketing
                        ? "text-primary"
                        : "text-gray-3"
                    )}
                  >
                    [선택] 이벤트 등 정보 수신 동의
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMarketingModal(true)}
                  className="shrink-0 text-sm font-medium leading-4 tracking-[-0.28px] text-orange-2"
                >
                  약관보기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant={isFormValid ? "default" : "disabled"}
          className="h-16 w-full rounded px-6 py-5 text-lg font-semibold"
          disabled={!isFormValid || isSigningUp}
        >
          {isSigningUp ? <Loader size="sm" /> : "가입하기"}
        </Button>
      </form>
      <SignUpSuccessModal open={showSuccessModal} onClose={handleModalClose} />

      {/* 이용약관동의 모달 */}
      <Modal open={showTermsModal} onClose={() => setShowTermsModal(false)}>
        <ModalContent className="max-h-[80vh] w-[90vw] max-w-[600px]">
          <ModalHeader onClose={() => setShowTermsModal(false)}>
            이용약관동의
          </ModalHeader>
          <ModalBody className="max-h-[50vh] overflow-y-auto">
            <TermsContent />
          </ModalBody>
          <ModalFooter className="justify-end gap-3">
            <Button
              type="button"
              variant="default"
              onClick={() => setShowTermsModal(false)}
              className="w-12 h-10"
            >
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 개인정보 수집 및 이용 동의 모달 */}
      <Modal open={showPrivacyModal} onClose={() => setShowPrivacyModal(false)}>
        <ModalContent className="max-h-[80vh] w-[90vw] max-w-[600px]">
          <ModalHeader onClose={() => setShowPrivacyModal(false)}>
            개인정보 수집 및 이용 동의
          </ModalHeader>
          <ModalBody className="max-h-[50vh] overflow-y-auto">
            <PrivacyContent />
          </ModalBody>
          <ModalFooter className="justify-end gap-3">
            <Button
              type="button"
              variant="default"
              onClick={() => setShowPrivacyModal(false)}
              className="w-12 h-10"
            >
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 이벤트 등 정보 수신 동의 모달 */}
      <Modal
        open={showMarketingModal}
        onClose={() => setShowMarketingModal(false)}
      >
        <ModalContent className="max-h-[80vh] w-[90vw] max-w-[600px]">
          <ModalHeader onClose={() => setShowMarketingModal(false)}>
            이벤트 등 정보 수신 동의
          </ModalHeader>
          <ModalBody className="max-h-[50vh] overflow-y-auto">
            <MarketingContent />
          </ModalBody>
          <ModalFooter className="justify-end gap-3">
            <Button
              type="button"
              variant="default"
              onClick={() => setShowMarketingModal(false)}
              className="w-12 h-10"
            >
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Form>
  );
}

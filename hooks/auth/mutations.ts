import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  loginWithGoogle,
  loginWithKakao,
  loginWithEmail,
  logout,
  signUp,
} from "./apis";
import { showErrorToast } from "@/components/ui/toast";

/**
 * Google 로그인 훅
 *
 * @example
 * const { loginWithGoogle, isLoading } = useLoginWithGoogle();
 *
 * <button onClick={() => loginWithGoogle('/mypage')} disabled={isLoading}>
 *   Google 로그인
 * </button>
 */
export const useLoginWithGoogle = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: (redirectPath?: string) => loginWithGoogle(redirectPath),
    onError: (error) => {
      showErrorToast("Google 로그인에 실패했습니다. 다시 시도해주세요.");
    },
  });

  return {
    loginWithGoogle: mutate,
    isLoading: isPending,
    error,
  };
};

/**
 * Kakao 로그인 훅
 *
 * @example
 * const { loginWithKakao, isLoading } = useLoginWithKakao();
 *
 * <button onClick={() => loginWithKakao('/mypage')} disabled={isLoading}>
 *   Kakao 로그인
 * </button>
 */
export const useLoginWithKakao = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: (redirectPath?: string) => loginWithKakao(redirectPath),
    onError: (error) => {
      showErrorToast("Kakao 로그인에 실패했습니다. 다시 시도해주세요.");
    },
  });

  return {
    loginWithKakao: mutate,
    isLoading: isPending,
    error,
  };
};

/**
 * 이메일/비밀번호 로그인 훅
 *
 * @example
 * const { loginWithEmail, isLoading } = useLoginWithEmail();
 *
 * <button onClick={() => loginWithEmail({ email: 'user@example.com', password: 'password123', rememberMe: true, redirectPath: '/mypage' })} disabled={isLoading}>
 *   로그인
 * </button>
 */
export const useLoginWithEmail = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({
      email,
      password,
      rememberMe,
    }: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => loginWithEmail(email, password, rememberMe),
    onSuccess: (data, variables) => {
      // 로그인 성공 시 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error: Error) => {
      // 에러 메시지 처리
      let errorMessage = "로그인에 실패했습니다.";

      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "이메일 인증이 필요합니다.";
      }
    },
  });

  return {
    loginWithEmail: mutate,
    isLoading: isPending,
    error,
  };
};

/**
 * 통합 로그인 훅 (Email + Google + Kakao)
 *
 * @example
 * const { loginWithEmail, loginWithGoogle, loginWithKakao, isLoading } = useLogin();
 *
 * <button onClick={() => loginWithEmail({ email, password, rememberMe })}>로그인</button>
 * <button onClick={() => loginWithGoogle('/mypage')}>Google</button>
 * <button onClick={() => loginWithKakao('/mypage')}>Kakao</button>
 */
export const useLogin = () => {
  const email = useLoginWithEmail();
  const google = useLoginWithGoogle();
  const kakao = useLoginWithKakao();

  return {
    loginWithEmail: email.loginWithEmail,
    loginWithGoogle: google.loginWithGoogle,
    loginWithKakao: kakao.loginWithKakao,
    isLoading: email.isLoading || google.isLoading || kakao.isLoading,
  };
};

/**
 * 로그아웃 훅
 *
 * @example
 * const { logout, isLoading } = useLogout();
 *
 * <button onClick={logout} disabled={isLoading}>
 *   로그아웃
 * </button>
 */
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 모든 쿼리 캐시 무효화
      queryClient.clear();
      // 로그인 페이지로 리디렉트
      router.push("/auth");
    },
    onError: (error) => {
      showErrorToast("로그아웃 중 오류가 발생했습니다.");
    },
  });

  return {
    logout: mutate,
    isLoading: isPending,
  };
};

/**
 * 회원가입 훅
 *
 * @example
 * const { signUp, isLoading } = useSignUp();
 *
 * <button onClick={() => signUp({ email, password, nickname, phone, agreeMarketing })} disabled={isLoading}>
 *   회원가입
 * </button>
 */
export const useSignUp = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      nickname: string;
      phone: string;
      agreeMarketing: boolean;
    }) => signUp(data),
    onError: (error: Error) => {
      let errorMessage = "회원가입에 실패했습니다.";

      if (error.message.includes("already registered")) {
        errorMessage = "이미 가입된 이메일입니다.";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "올바른 이메일 형식을 입력해주세요.";
      }

      showErrorToast(errorMessage);
    },
  });

  return {
    signUp: mutate,
    isLoading: isPending,
    error,
  };
};

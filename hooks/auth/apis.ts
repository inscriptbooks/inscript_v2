import { createClient } from "@/lib/supabase/client";
import { User } from "@/models/user";
import axiosInstance from "@/lib/axios/client";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

/**
 * Supabase Auth 세션 가져오기
 */
export const getAuthSession = async (): Promise<{
  session: Session | null;
  user: SupabaseUser | null;
}> => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    session,
    user: session?.user ?? null,
  };
};

/**
 * 현재 로그인한 사용자의 데이터베이스 정보 가져오기
 */
export const getCurrentUser = async (userId: string): Promise<User> => {
  const response = await axiosInstance.get<User>(`/users/${userId}`);
  return response.data;
};

/**
 * Google 로그인
 */
export const loginWithGoogle = async (
  redirectPath: string = "/",
): Promise<void> => {
  const supabase = createClient();

  const getAppUrl = () => {
    // prod url setting
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
    if (vercelUrl) {
      return `https://${vercelUrl}`;
    }

    return "http://localhost:3000";
  };

  const appUrl = getAppUrl();
  const redirectTo = `${appUrl}${redirectPath}`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    throw error;
  }
};

/**
 * Kakao 로그인
 * FIXME: 연동 필요
 */
export const loginWithKakao = async (
  redirectPath: string = "/",
): Promise<void> => {
  const supabase = createClient();

  // 환경변수에서 앱 URL 가져오기 (Vercel 우선, 그 다음 NEXT_PUBLIC_API_URL 활용)
  const getAppUrl = () => {
    // Vercel 환경변수 우선 확인
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
    if (vercelUrl) {
      return `https://${vercelUrl}`;
    }

    // NEXT_PUBLIC_API_URL이 설정되어 있으면 /api 부분 제거
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      return apiUrl.replace(/\/api$/, "");
    }

    // 기본값 (localhost)
    return "http://localhost:3000";
  };

  const appUrl = getAppUrl();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo: `${appUrl}${redirectPath}`,
    },
  });

  if (error) {
    throw error;
  }
};

/**
 * 이메일/비밀번호 로그인
 * @param email - 사용자 이메일
 * @param password - 사용자 비밀번호
 * @param rememberMe - true: localStorage 사용 (로그인 유지), false: sessionStorage 사용 (브라우저 닫으면 로그아웃)
 */
export const loginWithEmail = async (
  email: string,
  password: string,
  rememberMe: boolean = true,
): Promise<{ session: Session | null; user: SupabaseUser | null }> => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  // 로그인 유지 옵션 처리
  // rememberMe가 false면 세션을 sessionStorage로 이동하여 브라우저 탭 닫으면 로그아웃
  if (!rememberMe && data.session && typeof window !== "undefined") {
    // localStorage의 모든 Supabase 관련 키를 찾아서 sessionStorage로 이동
    const keys = Object.keys(localStorage);
    const supabaseKeys = keys.filter((key) => key.startsWith("sb-"));

    supabaseKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value) {
        sessionStorage.setItem(key, value);
        localStorage.removeItem(key);
      }
    });
  }

  // last_login 업데이트
  try {
    await axiosInstance.post("/auth/update-last-login");
  } catch (updateError) {
    // last_login 업데이트 실패해도 로그인은 성공으로 처리
  }

  return {
    session: data.session,
    user: data.user,
  };
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};

/**
 * 회원가입
 */
export const signUp = async (data: {
  email: string;
  password: string;
  nickname: string;
  phone: string;
  agreeMarketing: boolean;
}): Promise<{ message: string; user: { id: string; email: string } }> => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
};

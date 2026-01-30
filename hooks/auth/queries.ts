import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getAuthSession, getCurrentUser } from "./apis";
import { authKeys } from "./keys";

/**
 * Supabase Auth 세션 정보를 가져오는 훅
 * 실시간으로 로그인/로그아웃 상태를 감지합니다.
 */
export const useAuthSession = () => {
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // 초기 세션 가져오기
    const initializeSession = async () => {
      try {
        const { session, user } = await getAuthSession();
        setSession(session);
        setAuthUser(user);
      } catch (error) {
        // Error silently handled
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // 빈 의존성 배열로 한 번만 실행

  return {
    authUser,
    session,
    isLoading,
    isAuthenticated: !!authUser,
  };
};

/**
 * 현재 로그인한 사용자의 데이터베이스 정보를 가져오는 훅
 * useAuthSession + DB 사용자 정보를 결합합니다.
 *
 * @example
 * const { user, isLoading, isAuthenticated } = useUser();
 *
 * if (isLoading) return <Loading />;
 * if (!isAuthenticated) return <LoginRequired />;
 *
 * return <div>{user?.name}</div>;
 */
export const useUser = () => {
  const {
    authUser,
    isLoading: authLoading,
    isAuthenticated,
  } = useAuthSession();

  const {
    data: user,
    isLoading: userLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: authKeys.currentUser(authUser?.id),
    queryFn: () => getCurrentUser(authUser!.id),
    enabled: !!authUser?.id,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 1,
  });

  return {
    user,
    authUser,
    isLoading: authLoading || userLoading,
    isAuthenticated,
    isError,
    error: error as Error | null,
    refetch,
  };
};

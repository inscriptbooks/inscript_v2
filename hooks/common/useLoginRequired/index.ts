import { useLoginRequiredContext } from "@/lib/providers";

/**
 * 로그인이 필요한 기능을 보호하는 훅
 *
 * @example
 * const { requireAuth, isAuthenticated } = useLoginRequired();
 *
 * const handleProtectedAction = () => {
 *   requireAuth(() => {
 *     // 로그인된 사용자만 실행되는 코드
 *   });
 * };
 */
export const useLoginRequired = () => {
  return useLoginRequiredContext();
};

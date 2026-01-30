"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/auth";
import LoginRequiredModal from "@/components/common/Modal/LoginRequiredModal";

interface LoginRequiredContextType {
  requireAuth: (callback: () => void) => void;
  isAuthenticated: boolean;
}

const LoginRequiredContext = createContext<
  LoginRequiredContextType | undefined
>(undefined);

interface LoginRequiredProviderProps {
  children: ReactNode;
  redirectUrl?: string;
}

export function LoginRequiredProvider({
  children,
  redirectUrl = "/auth",
}: LoginRequiredProviderProps) {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const requireAuth = useCallback(
    (callback: () => void) => {
      if (isAuthenticated) {
        callback();
      } else {
        setIsModalOpen(true);
      }
    },
    [isAuthenticated],
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    setIsModalOpen(false);
    router.push(redirectUrl);
  }, [router, redirectUrl]);

  return (
    <LoginRequiredContext.Provider value={{ requireAuth, isAuthenticated }}>
      {children}
      <LoginRequiredModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />
    </LoginRequiredContext.Provider>
  );
}

export function useLoginRequiredContext() {
  const context = useContext(LoginRequiredContext);
  if (context === undefined) {
    throw new Error(
      "useLoginRequiredContext must be used within a LoginRequiredProvider",
    );
  }
  return context;
}

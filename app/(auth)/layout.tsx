import { ReactNode } from "react";
import { Header, Footer } from "@/components/layout";
import { metadata } from "../layout";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  metadata.title = "인스크립트 | 로그인";
  metadata.description = "인스크립트 | 로그인";
  return (
    <section className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-[1440px] flex-1 flex-col ">
        {children}
      </div>
      <Footer />
    </section>
  );
}

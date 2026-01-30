import { ReactNode, Suspense } from "react";
import { MypageSubHeader, Header, Footer } from "@/components/layout";

interface MyPageLayoutProps {
  children: ReactNode;
}

export default function MyPageLayout({ children }: MyPageLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Suspense
        fallback={<div className="h-[88px] w-full border-b border-primary" />}
      >
        <MypageSubHeader />
      </Suspense>
      <div className="mx-auto w-full max-w-[1440px] flex-1 px-[20px] py-[60px] lg:px-[120px]">
        {children}
      </div>
      <Footer />
    </main>
  );
}

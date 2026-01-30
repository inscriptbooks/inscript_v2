import { ReactNode } from "react";
import { Header, Footer } from "@/components/layout";

interface CommunityLayoutProps {
  children: ReactNode;
}

export default function CommunityLayout({ children }: CommunityLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-[1440px] flex-1 px-[20px] lg:px-[120px]">
        {children}
      </div>
      <Footer />
    </main>
  );
}

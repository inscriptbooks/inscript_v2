import { Footer, Header } from "@/components/layout";
import { ReactNode } from "react";

interface AuthorLayoutProps {
  children: ReactNode;
}

export default function AuthorLayout({ children }: AuthorLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-[1440px] flex-1 flex-col">
        {children}
      </div>
      <Footer />
    </main>
  );
}

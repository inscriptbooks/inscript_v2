import { ReactNode } from "react";
import { Header, Footer } from "@/components/layout";

interface ProgramLayoutProps {
  children: ReactNode;
}

export default function ProgramLayout({ children }: ProgramLayoutProps) {
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

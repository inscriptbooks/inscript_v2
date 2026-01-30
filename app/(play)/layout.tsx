import { ReactNode } from "react";
import { Header, Footer } from "@/components/layout";

interface PlayLayoutProps {
  children: ReactNode;
}

export default function PlayLayout({ children }: PlayLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-[1440px] flex-1">{children}</div>
      <Footer />
    </main>
  );
}

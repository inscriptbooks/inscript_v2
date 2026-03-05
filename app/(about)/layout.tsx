import { ReactNode } from "react";
import { Header, Footer } from "@/components/layout";

interface AboutLayoutProps {
  children: ReactNode;
}

export default function AboutLayout({ children }: AboutLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="w-full">{children}</div>
      <Footer />
    </main>
  );
}

import { ReactNode } from "react";
import { Header, Footer } from "@/components/layout";

interface ContactLayoutProps {
  children: ReactNode;
}

export default function ContactLayout({ children }: ContactLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-[1440px]">{children}</div>
      <Footer />
    </main>
  );
}

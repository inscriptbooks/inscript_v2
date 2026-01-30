import { ReactNode } from "react";
import { Header, Footer } from "@/components/layout";

interface MessagesLayoutProps {
  children: ReactNode;
}

export default function MessagesLayout({ children }: MessagesLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-[1440px]">{children}</div>
      <Footer />
    </main>
  );
}

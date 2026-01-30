import { ReactNode } from "react";
import AdminHeader from "@/app/(admin)/components/AdminHeader";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex flex-1 flex-col items-center pt-20 ">
        {children}
      </main>
    </div>
  );
}

import React, { Suspense } from "react";
import AdminSidebar from "./components/AdminSidebar";

interface AdminMainLayoutProps {
  children: React.ReactNode;
}

export default function AdminMainLayout({ children }: AdminMainLayoutProps) {
  return (
    <div className="flex w-full">
      <div className="flex-shrink-0">
        <Suspense
          fallback={
            <div className="flex h-full w-[260px] border-r border-gray-5 bg-white" />
          }
        >
          <AdminSidebar />
        </Suspense>
      </div>
      <main className="min-h-screen min-w-0 flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}

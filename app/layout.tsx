import { ReactNode } from "react";
import type { Metadata } from "next";
import {
  QueryProvider,
  LoaderProvider,
  LoginRequiredProvider,
} from "@/lib/providers";
import { GlobalLoader, GoogleAnalytics } from "@/components/common";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: "Play Platform",
  description: "Play Platform",
  icons: {
    icon: "/images/play.webp",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LoaderProvider>
          <QueryProvider>
            <LoginRequiredProvider>{children}</LoginRequiredProvider>
          </QueryProvider>
          <GlobalLoader />
          <Toaster position="top-center" richColors />
        </LoaderProvider>
      </body>
    </html>
  );
}

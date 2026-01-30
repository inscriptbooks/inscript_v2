"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useLoader } from "@/hooks/common";
import Loader from "./index";

export default function GlobalLoader() {
  const { isLoading, message } = useLoader();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isLoading) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(250,248,246,0.8)]">
      <Loader message={message} />
    </div>,
    document.body
  );
}

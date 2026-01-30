"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthSession } from "@/hooks/auth";
import LoginRequiredModal from "@/components/common/Modal/LoginRequiredModal";

export default function PlayHeroSection() {
  const router = useRouter();
  const { isAuthenticated } = useAuthSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    router.push("/play/register");
  };

  return (
    <section className="full-bleed relative -mx-[8vw] flex aspect-[375/262] max-h-[318px] w-screen items-center justify-center py-[60px] md:aspect-[1440/318] md:py-[80px]">
      <Image
        src="/images/play-hero.webp"
        alt="Play Hero"
        fill
        className="object-cover"
      />

      <div className="z-10 flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center gap-2.5">
          <h1 className="font-serif text-xl font-bold text-white md:text-[28px]">
            희곡 등록하기
          </h1>
          <p className="text-xs font-semibold text-white md:text-xl">
            희곡에 새로운 작품을 등록하고 싶다면?
          </p>
        </div>

        <Button
          size="sm"
          className="text-lg font-semibold"
          onClick={handleRegisterClick}
        >
          희곡 등록하기
        </Button>
      </div>

      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onConfirm={() => router.push("/auth")}
      />
    </section>
  );
}

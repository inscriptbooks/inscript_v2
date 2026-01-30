"use client";

import { PlayDetailHeader } from "@/components/features/play";
import { useGetPlay } from "@/hooks/plays";
import { useParams } from "next/navigation";
import { useLoader } from "@/hooks/common";
import { useEffect } from "react";

interface PlayDetailLayoutProps {
  children: React.ReactNode;
}

export default function PlayDetailLayout({ children }: PlayDetailLayoutProps) {
  const params = useParams();
  const playId = params.playId as string;
  const { data: play, isLoading } = useGetPlay(playId);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  if (!play) {
    return;
  }

  return (
    <section className="flex w-full flex-1 flex-col pb-[60px] pt-11 lg:pt-[80px]">
      <PlayDetailHeader play={play} />
      {children}
    </section>
  );
}

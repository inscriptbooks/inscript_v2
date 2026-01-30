"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AlbumView, TextView } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";

interface PlayViewToggleProps {
  view?: string;
}

export default function PlayViewToggle({ view }: PlayViewToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [currentView, setCurrentView] = useState(view);

  const handleViewChange = useCallback(
    (newView: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newView === "text") {
        params.set("view", "text");
      } else {
        params.set("view", "album");
      }

      setCurrentView(newView);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const handleAlbumViewClick = () => {
    if (currentView !== "album") {
      handleViewChange("album");
    }
  };

  const handleTextViewClick = () => {
    if (currentView !== "text") {
      handleViewChange("text");
    }
  };

  useEffect(() => {
    if (!view) {
      handleViewChange("album");
    }
  }, [view, handleViewChange]);

  return (
    <div className="flex items-center gap-2.5">
      <button onClick={handleAlbumViewClick} className="cursor-pointer">
        <AlbumView
          className={cn(
            currentView === "album" ? "text-primary" : "text-orange-2",
          )}
        />
      </button>
      <button onClick={handleTextViewClick} className="cursor-pointer">
        <TextView
          className={cn(
            currentView === "text" ? "text-primary" : "text-orange-2",
          )}
        />
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl" | "base";

const breakpoints: Record<Breakpoint, number> = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("base");

  const getBreakpoint = (width: number): Breakpoint => {
    if (width >= breakpoints["2xl"]) return "2xl";
    if (width >= breakpoints["xl"]) return "xl";
    if (width >= breakpoints["lg"]) return "lg";
    if (width >= breakpoints["md"]) return "md";
    if (width >= breakpoints["sm"]) return "sm";
    return "base";
  };

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isAbove = (target: Breakpoint): boolean => {
    return breakpoints[breakpoint] >= breakpoints[target];
  };

  return { breakpoint, isAbove };
}

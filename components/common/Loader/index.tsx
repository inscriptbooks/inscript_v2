import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "xs" | "sm" | "md" | "lg";
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function Loader({
  size = "md",
  message,
  fullScreen = false,
  className,
}: LoaderProps) {
  const sizeClasses = {
    // NOTE:
    // xs/sm: 버튼·인라인용으로 기존 CSS 스피너 사용.
    // md/lg(기본 md): 풀스크린 용도로 GIF 인디케이터 사용.
    xs: "h-6 w-6 border-2",
    sm: "h-8 w-8 border-2",
    // md: "h-12 w-12 border-4",
    // lg: "h-16 w-16 border-4",
    // 기존 로더 사이즈의 4배로 확대
    md: "h-48 w-48",
    lg: "h-64 w-64",
  };

  const isSmall = size === "xs" || size === "sm";

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div
        className={cn(
          `${sizeClasses[size]} animate-spin rounded-full border-solid border-gray-4 border-t-primary`,
          className
        )}
        role="status"
        aria-label="로딩 중"
      />
    </div>
  );

  // NOTE: GIF 로더 LOADING...
  const indicator = (
    <div className="flex flex-col items-center gap-4">
      {/* <div
        className={cn(
          `${sizeClasses[size]} animate-spin rounded-full border-solid border-gray-4 border-t-primary`,
          className,
        )}
        role="status"
        aria-label="로딩 중"
      /> */}
      {/* NOTE: GIF는 next/image의 최적화 대상이 아님(next/image는 GIF를 webp로 변환하려고 해서 오히려 움직임 깨지거나 용량 낭비됨.) */}
      <img
        src="/images/inscript_logo.gif"
        alt="로딩 중"
        className={cn(`${sizeClasses[size]}`)}
      />
      {message && <p className="text-sm text-white">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      // <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(250,248,246,0.8)]">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {indicator}
      </div>
    );
  }

  return isSmall ? spinner : indicator;
}

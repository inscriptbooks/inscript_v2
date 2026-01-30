import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { cn } from "@/lib/utils";

interface ViewMoreLinkButtonProps {
  href: string;
  variant?: "primary" | "gray";
}

export default function ViewMoreLinkButton({
  href,
  variant = "primary",
}: ViewMoreLinkButtonProps) {
  return (
    <Link href={href} className="flex items-center gap-1">
      <span
        className={cn(
          "text-sm font-medium lg:text-base",
          variant === "primary" ? "text-primary" : "text-gray-4",
        )}
      >
        더보기
      </span>
      <ArrowRight
        className={cn(variant === "primary" ? "text-primary" : "text-gray-4")}
      />
    </Link>
  );
}

import { cn } from "@/lib/utils";

interface DividerProps {
  type?: "horizontal" | "vertical";
  className?: string;
}

export function Divider({ type = "horizontal", className }: DividerProps) {
  return (
    <div
      className={cn(
        "bg-gray-5",
        type === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
    />
  );
}

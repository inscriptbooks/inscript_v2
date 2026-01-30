import { IconProps } from "./types";

export default function Plus({ className, size = 32, color }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <path
        d="M8 16H24M16 24V8"
        stroke={color || "currentColor"}
        strokeWidth="1.6"
      />
    </svg>
  );
}

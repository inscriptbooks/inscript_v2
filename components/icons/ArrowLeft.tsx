import { IconProps } from "./types";

export default function ArrowLeft({ className, size = 24, color }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 25"
      fill="none"
      className={className}
    >
      <path
        d="M18.8789 12.4234H5.11954M5.11954 12.4234L11.428 6.36328M5.11954 12.4234L11.428 18.4586"
        stroke={color || "currentColor"}
        strokeWidth="1.6"
      />
    </svg>
  );
}

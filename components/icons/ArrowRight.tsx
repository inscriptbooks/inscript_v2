import { IconProps } from "./types";

export default function ArrowRight({ className, size = 24, color }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M5.12109 12.0122H18.8805M18.8805 12.0122L12.572 5.95215M18.8805 12.0122L12.572 18.0475"
        stroke={color || "currentColor"}
        strokeWidth="1.6"
      />
    </svg>
  );
}

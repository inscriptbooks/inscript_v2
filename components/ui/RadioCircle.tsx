import { IconProps } from "@/components/icons/types";

export default function RadioCircle({
  className,
  size = 24,
  color,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 25"
      fill="none"
      className={className}
    >
      <rect
        x="0.8"
        y="1.3"
        width="22.4"
        height="22.4"
        rx="11.2"
        stroke={color || "currentColor"}
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12.5" r="6" fill={color || "currentColor"} />
    </svg>
  );
}

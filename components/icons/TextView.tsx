import { IconProps } from "./types";

export default function TextView({ className, size = 16, color }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <rect y="1" width="16" height="2" fill={color || "currentColor"} />
      <rect y="7" width="16" height="2" fill={color || "currentColor"} />
      <rect y="13" width="16" height="2" fill={color || "currentColor"} />
    </svg>
  );
}

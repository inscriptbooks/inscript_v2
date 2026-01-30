import { IconProps } from "./types";

export default function ChevronDown({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.5 15.1382L11.5 9.13818L5.5 15.1382"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

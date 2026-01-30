import { IconProps } from "./types";

export default function Send({ className, size = 24, color }: IconProps) {
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
        d="M19.6001 3.94336L14.0001 19.9434L10.8001 12.7434L3.6001 9.54336L19.6001 3.94336Z"
        stroke={color || "currentColor"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M19.6001 3.94336L10.8001 12.7434"
        stroke={color || "currentColor"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import { IconProps } from "./types";

export default function Crown({
  className,
  size = 24,
  color = "#6D6D6D",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.5 6L16.5 12L21.5 8L19.5 18H5.5L3.5 8L8.5 12L12.5 6Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import { IconProps } from "./types";

export default function ChevronRight({
  className,
  size = 24,
  color = "#911A00",
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
      <path
        d="M9.17485 18.8318L14.8252 12.8222L9.17485 6.83189"
        stroke={color}
        strokeWidth="1.2"
      />
    </svg>
  );
}

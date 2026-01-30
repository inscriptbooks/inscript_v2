import { IconProps } from "./types";

export default function ChevronLeft({
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
        d="M14.8252 18.8318L9.17485 12.8222L14.8252 6.83189"
        stroke={color}
        strokeWidth="1.2"
      />
    </svg>
  );
}

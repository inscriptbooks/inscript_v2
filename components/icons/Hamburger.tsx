import { IconProps } from "./types";

export default function Hamburger({
  className,
  size = 44,
  color = "#6D6D6D",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      className={className}
    >
      <path
        d="M5.5 11H38.5V14.6667H5.5V11ZM5.5 20.1667H38.5V23.8333H5.5V20.1667ZM5.5 29.3333H38.5V33H5.5V29.3333Z"
        fill={color}
      />
    </svg>
  );
}

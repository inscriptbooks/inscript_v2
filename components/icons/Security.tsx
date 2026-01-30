import { IconProps } from "./types";

export default function Security({
  className,
  size = 24,
  color = "#6D6D6D",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 27 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4.55909 6.98633L13.45 3.02539L22.4485 6.98633C22.8616 11.7638 21.6403 21.6581 13.45 23.016C5.195 20.8175 4.08315 11.4135 4.55909 6.98633Z"
        stroke={color}
        strokeWidth="1.6"
      />
      <path
        d="M9.53894 13.9082L12.1158 16.5176L17.3674 10.1579"
        stroke={color}
        strokeWidth="1.6"
      />
    </svg>
  );
}

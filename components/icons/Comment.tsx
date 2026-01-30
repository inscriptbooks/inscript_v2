import { IconProps } from "./types";

export default function Comment({ className, size = 24, color }: IconProps) {
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
        d="M3.81104 21.3513V6.27832C3.81104 5.72604 4.25875 5.27832 4.81104 5.27832H20.811C21.3633 5.27832 21.811 5.72604 21.811 6.27832V18.2783C21.811 18.8306 21.3633 19.2783 20.811 19.2783H7.17309C6.93915 19.2783 6.71262 19.3603 6.5329 19.5101L4.13907 21.505C4.00881 21.6135 3.81104 21.5209 3.81104 21.3513Z"
        stroke={color || "currentColor"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.81104 10.2783H16.811"
        stroke={color || "currentColor"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.81104 14.2783H16.811"
        stroke={color || "currentColor"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

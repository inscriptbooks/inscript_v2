import { IconProps } from "./types";

export default function SelectChevronDown({
  className,
  size = 24,
  color,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.17175 13.0344C8.56834 13.6206 9.43166 13.6206 9.82825 13.0344L16.9904 2.44818C17.4396 1.7841 16.9639 0.887821 16.1621 0.887821H1.8379C1.03611 0.887821 0.560361 1.7841 1.00964 2.44817L8.17175 13.0344Z"
        fill={color || "currentColor"}
      />
    </svg>
  );
}

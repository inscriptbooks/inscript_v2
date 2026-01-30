import { IconProps } from "./types";

export default function X({ className, size = 24 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect width="24" height="24" rx="4" fill="#161616" />
      <path
        d="M16.025 5.65625H18.1722L13.4823 11.0305L19 18.3438H14.6801L11.2965 13.9075L7.42462 18.3438H5.2765L10.2929 12.595L5 5.65625H9.43013L12.4882 9.71012L16.025 5.65625ZM15.2725 17.0557H16.4625L8.78262 6.87687H7.50688L15.2725 17.0557Z"
        fill="white"
      />
    </svg>
  );
}

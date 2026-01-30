import { IconProps } from "./types";

export default function Pen({
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
      <g clipPath="url(#clip0_pen)">
        <path
          d="M17.2848 2.39924L22.0856 7.20009M5.32172 19.2073C8.80069 18.083 14.1588 17.207 17.1961 16.7356C17.5444 16.6815 17.8385 16.4486 17.9707 16.1219L20.2831 10.4045C20.4336 10.0324 20.347 9.60628 20.0632 9.32244L15.2471 4.50638C14.9667 4.22597 14.5471 4.13775 14.1775 4.28152L8.42013 6.52113C8.07078 6.65702 7.82782 6.97529 7.78179 7.34731C7.4256 10.2261 6.41542 15.7941 5.32172 19.2073ZM5.32172 19.2073L12.6525 11.8765"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle
          cx="12.576"
          cy="12"
          r="1.5"
          transform="rotate(45 12.576 12)"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_pen">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

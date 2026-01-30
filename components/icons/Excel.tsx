import { IconProps } from "./types";

export default function Excel({ className, size = 24, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2.66602 5.47282V2.47282C2.66602 2.29601 2.73625 2.12644 2.86128 2.00141C2.9863 1.87639 3.15587 1.80615 3.33268 1.80615H12.666C12.8428 1.80615 13.0124 1.87639 13.1374 2.00141C13.2624 2.12644 13.3327 2.29601 13.3327 2.47282V14.4728C13.3327 14.6496 13.2624 14.8192 13.1374 14.9442C13.0124 15.0692 12.8428 15.1395 12.666 15.1395H3.33268C3.15587 15.1395 2.9863 15.0692 2.86128 14.9442C2.73625 14.8192 2.66602 14.6496 2.66602 14.4728V11.4728"
        stroke={color || "#4CA452"}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.333 5.47266H11.333M9.33301 8.13932H11.333M9.33301 10.806H11.333"
        stroke={color || "#4CA452"}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M3.33301 7.47266L5.33301 9.47266M5.33301 7.47266L3.33301 9.47266M1.33301 5.47266H7.33301V11.4727H1.33301V5.47266Z"
        stroke={color || "#4CA452"}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

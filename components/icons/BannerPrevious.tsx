import { IconProps } from "./types";

export default function BannerPrevious({
  className,
  size = 24,
  color,
}: IconProps) {
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
        d="M10.993 0.139648C10.993 1.18487 10.0704 2.74565 9.13651 4.0557C7.93576 5.74608 6.5009 7.22094 4.85585 8.34646C3.62237 9.19024 2.1271 10.0002 0.923829 10.0002M0.923829 10.0002C2.1271 10.0002 3.62363 10.8102 4.85585 11.654C6.5009 12.7809 7.93576 14.2558 9.13651 15.9433C10.0704 17.2548 10.993 18.8184 10.993 19.8608M0.923829 10.0002L22.3635 10.0002"
        stroke={color || "currentColor"}
      />
    </svg>
  );
}

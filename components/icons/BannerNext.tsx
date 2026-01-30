import { IconProps } from "./types";

export default function BannerNext({ className, size = 24, color }: IconProps) {
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
        d="M12.2946 0.139648C12.2946 1.18487 13.2172 2.74565 14.1511 4.0557C15.3518 5.74608 16.7867 7.22094 18.4318 8.34646C19.6652 9.19024 21.1605 10.0002 22.3638 10.0002M22.3638 10.0002C21.1605 10.0002 19.664 10.8102 18.4318 11.654C16.7867 12.7809 15.3518 14.2558 14.1511 15.9433C13.2172 17.2548 12.2946 18.8184 12.2946 19.8608M22.3638 10.0002L0.924133 10.0002"
        stroke={color || "currentColor"}
      />
    </svg>
  );
}

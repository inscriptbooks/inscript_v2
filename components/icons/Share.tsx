import { IconProps } from "./types";

export default function Share({ className, size = 20 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M5.13867 10.5555V14.1564C5.13867 14.3952 5.23179 14.6241 5.39755 14.793C5.5633 14.9618 5.78812 15.0566 6.02253 15.0566H13.9773C14.2117 15.0566 14.4365 14.9618 14.6023 14.793C14.768 14.6241 14.8611 14.3952 14.8611 14.1564V10.5555M9.9999 11.9058V4.47896M12.6515 6.95459L9.9999 4.25391L7.34832 6.95459"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import Image from "next/image";
import { NotificationIconProps } from "./types";

export default function Alert({
  className,
  size = 24,
  color = "#6D6D6D",
  circleColor = "#911A00",
  hasNotification = false,
}: NotificationIconProps) {
  const scaleFactor = size / 24;
  const circleRadius = Math.max(3, 3 * scaleFactor);

  // hasNotification이 false일 때 이미지 사용
  if (!hasNotification) {
    return (
      <Image
        src="/images/alert_no_dot.svg"
        alt="알림"
        width={size}
        height={size}
        className={className}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 3.83133C10.2098 3.83133 8.4929 4.54248 7.22703 5.80835C5.96116 7.07423 5.25 8.79111 5.25 10.5813V14.1836L3.80325 17.8031C3.75778 17.9169 3.7409 18.0401 3.75407 18.162C3.76725 18.2838 3.81009 18.4006 3.87884 18.502C3.94759 18.6035 4.04016 18.6866 4.14845 18.744C4.25673 18.8014 4.37744 18.8314 4.5 18.8313H9C9 20.4941 10.3373 21.8313 12 21.8313C13.6628 21.8313 15 20.4941 15 18.8313H19.5C19.6226 18.8314 19.7433 18.8014 19.8516 18.744C19.9598 18.6866 20.0524 18.6035 20.1212 18.502C20.1899 18.4006 20.2328 18.2838 20.2459 18.162C20.2591 18.0401 20.2422 17.9169 20.1968 17.8031L18.75 14.1836V10.5813C18.75 8.79111 18.0388 7.07423 16.773 5.80835C15.5071 4.54248 13.7902 3.83133 12 3.83133ZM13.5 18.8313C13.5 19.6653 12.834 20.3313 12 20.3313C11.166 20.3313 10.5 19.6653 10.5 18.8313H13.5ZM6.75 10.5813C6.75 9.18894 7.30312 7.85358 8.28769 6.86902C9.27226 5.88445 10.6076 5.33133 12 5.33133C13.3924 5.33133 14.7277 5.88445 15.7123 6.86902C16.6969 7.85358 17.25 9.18894 17.25 10.5813V14.3276C17.2499 14.4229 17.268 14.5173 17.3033 14.6058L18.3923 17.3313H5.60775L6.69675 14.6058C6.73192 14.5175 6.74999 14.4234 6.75 14.3283V10.5813Z"
        fill={color}
      />
      <circle cx="17.2503" cy="6.58635" r={circleRadius} fill={circleColor} />
    </svg>
  );
}

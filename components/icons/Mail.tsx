import { NotificationIconProps } from "./types";

export default function Mail({
  className,
  size = 24,
  color = "#6D6D6D",
  circleColor = "#911A00",
  hasNotification = false,
}: NotificationIconProps) {
  const scaleFactor = size / 24;
  const circleRadius = Math.max(3, 3 * scaleFactor);

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
        d="M2.85596 19.5H20.856V6H2.85596V19.5Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M2.85596 6L11.856 12.75L20.856 6"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.85596 12.75V6H11.856H20.856V12.75"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {hasNotification && (
        <circle cx="20.856" cy="5.60952" r={circleRadius} fill={circleColor} />
      )}
    </svg>
  );
}

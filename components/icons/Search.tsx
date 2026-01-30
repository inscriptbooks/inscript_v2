import { IconProps } from "./types";

/**
 * Search Icon Component
 * A magnifying glass icon used for search functionality
 *
 * @param className - Optional CSS classes
 * @param size - Icon size in pixels (default: 24)
 * @param color - Icon color
 */
export default function Search({ className, size = 24, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="11.5"
        cy="11.5"
        r="9.5"
        stroke={color || "currentColor"}
        strokeWidth="2"
      />
      <path
        d="M18.5 18.5L22 22"
        stroke={color || "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

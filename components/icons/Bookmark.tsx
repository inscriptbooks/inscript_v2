import { IconProps } from "./types";

interface BookmarkProps extends IconProps {
  filled?: boolean;
}

export default function Bookmark({
  className,
  size = 24,
  filled = false,
}: BookmarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 25"
      fill={filled ? "currentColor" : "none"}
      className={className}
    >
      <path
        d="M5 19.8565V5.41848C5 4.86295 5.45278 4.41391 6.00828 4.41851L18.0083 4.51794C18.5573 4.52249 19 4.96886 19 5.51791V19.95C19 20.6529 18.2939 21.1365 17.6386 20.8824L12.3537 18.8337C12.1258 18.7454 11.8735 18.7436 11.6444 18.8286L6.3479 20.794C5.69468 21.0364 5 20.5532 5 19.8565Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

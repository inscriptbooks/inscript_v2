import { IconProps } from "./types";

export default function Attachment({
  size = 24,
  className = "",
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88583 21.3658 3.76 20.24C2.63417 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63417 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42944 14.0991 2.00551 15.16 2.00551C16.2209 2.00551 17.2394 2.42944 17.99 3.18C18.7406 3.93056 19.1645 4.94908 19.1645 6.01C19.1645 7.07092 18.7406 8.08944 17.99 8.84L9.41 17.41C9.03472 17.7853 8.52784 17.9973 8 17.9973C7.47216 17.9973 6.96528 17.7853 6.59 17.41C6.21472 17.0347 6.00275 16.5278 6.00275 16C6.00275 15.4722 6.21472 14.9653 6.59 14.59L14.83 6.34"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

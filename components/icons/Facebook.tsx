import { IconProps } from "./types";

export default function Facebook({ className, size = 24 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect width="24" height="24" rx="4" fill="#1877F2" />
      <path
        d="M14.5413 13.2573L14.9041 10.9223H12.6347V9.40714C12.6347 8.76824 12.9517 8.14563 13.9682 8.14563H15V6.15777C15 6.15777 14.0636 6 13.1683 6C11.2993 6 10.0776 7.11825 10.0776 9.14272V10.9223H8V13.2573H10.0776V18.9019C10.5006 18.9673 10.9281 19.0001 11.3562 19C11.7843 19.0001 12.2118 18.9673 12.6347 18.9019V13.2573H14.5413Z"
        fill="white"
      />
    </svg>
  );
}

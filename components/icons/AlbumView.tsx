import { IconProps } from "./types";

export default function AlbumView({ className, size = 16, color }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <rect
        y="0.662659"
        width="7.42857"
        height="7.42857"
        fill={color || "currentColor"}
      />
      <rect
        x="8.57129"
        y="0.662659"
        width="7.42857"
        height="7.42857"
        fill={color || "currentColor"}
      />
      <rect
        y="9.23407"
        width="7.42857"
        height="7.42857"
        fill={color || "currentColor"}
      />
      <rect
        x="8.57129"
        y="9.23407"
        width="7.42857"
        height="7.42857"
        fill={color || "currentColor"}
      />
    </svg>
  );
}
